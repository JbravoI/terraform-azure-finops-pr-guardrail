import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const fixturePrices = {
  azurerm_storage_account: (values) => values.account_tier === 'Standard' && values.account_replication_type === 'LRS' ? 5 : 10,
  azurerm_linux_web_app: () => 73,
  azurerm_kubernetes_cluster: (values) => values.sku_tier === 'Standard' ? 120 : 40
};

function hasUnknown(value) {
  if (value === true) return true;
  if (Array.isArray(value)) return value.some(hasUnknown);
  return value && typeof value === 'object' && Object.values(value).some(hasUnknown);
}

function parseConfig(text) {
  const config = {
    required_tags: [],
    monthly_cost_increase_threshold: 0,
    unknown_cost_policy: 'review',
    cost_threshold_policy: 'review'
  };
  let key = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('- ') && key === 'required_tags') {
      config.required_tags.push(line.slice(2).trim());
      continue;
    }
    const match = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!match) throw new Error(`Unsupported configuration line: ${rawLine}`);
    [, key] = match;
    const value = match[2].trim();
    if (key === 'required_tags') continue;
    config[key] = /^\d+(\.\d+)?$/.test(value) ? Number(value) : value;
  }

  if (!['review', 'fail'].includes(config.unknown_cost_policy)) {
    throw new Error('unknown_cost_policy must be either review or fail.');
  }
  if (!['review', 'fail'].includes(config.cost_threshold_policy)) {
    throw new Error('cost_threshold_policy must be either review or fail.');
  }
  if (!Number.isFinite(config.monthly_cost_increase_threshold) || config.monthly_cost_increase_threshold < 0) {
    throw new Error('monthly_cost_increase_threshold must be a non-negative number.');
  }

  return config;
}

function validatePlan(plan) {
  if (!plan || typeof plan !== 'object') throw new Error('Plan root must be a JSON object.');
  for (const field of ['format_version', 'terraform_version', 'resource_changes']) {
    if (!(field in plan)) throw new Error(`Plan is missing required field: ${field}.`);
  }
  if (!Array.isArray(plan.resource_changes)) throw new Error('Plan field resource_changes must be an array.');
}

function normaliseChange(resource) {
  for (const field of ['address', 'mode', 'type', 'name', 'change']) {
    if (!(field in resource)) throw new Error(`Resource change is missing required field: ${field}.`);
  }
  if (!resource.change || !Array.isArray(resource.change.actions)) {
    throw new Error(`Resource ${resource.address} has an invalid change.actions value.`);
  }
  if (resource.mode !== 'managed') return null;

  const actions = resource.change.actions;
  const values = actions.includes('delete') && !actions.includes('create')
    ? resource.change.before
    : resource.change.after;
  const tags = values?.tags && typeof values.tags === 'object' && !Array.isArray(values.tags) ? values.tags : {};

  return {
    address: resource.address,
    type: resource.type,
    actions,
    before: resource.change.before ?? null,
    after: resource.change.after ?? null,
    afterUnknown: resource.change.after_unknown ?? {},
    tags
  };
}

function estimateResource(resource) {
  if (hasUnknown(resource.afterUnknown)) return { status: 'unknown', monthlyCost: null, reason: 'Pricing-relevant plan values are unknown until apply.' };
  const price = fixturePrices[resource.type];
  if (!price) return { status: 'unknown', monthlyCost: null, reason: 'Resource type is not in the fixture price catalog.' };

  const beforeCost = resource.before ? price(resource.before) : 0;
  const afterCost = resource.after ? price(resource.after) : 0;
  return { status: 'estimated', monthlyCost: afterCost - beforeCost };
}

function formatCurrency(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

export function evaluatePlan(plan, config) {
  validatePlan(plan);
  const normalised = plan.resource_changes.map(normaliseChange).filter(Boolean);
  const tagFindings = [];
  const estimates = [];

  for (const resource of normalised) {
    if (!resource.actions.includes('delete') || resource.actions.includes('create')) {
      const missingTags = config.required_tags.filter((tag) => !resource.tags[tag]);
      if (missingTags.length) tagFindings.push({ address: resource.address, missingTags });
    }
    estimates.push({ resource, ...estimateResource(resource) });
  }

  const unknown = estimates.filter((estimate) => estimate.status === 'unknown');
  const monthlyDelta = unknown.length ? null : estimates.reduce((total, estimate) => total + estimate.monthlyCost, 0);
  const thresholdExceeded = monthlyDelta !== null && monthlyDelta > config.monthly_cost_increase_threshold;
  const errors = [];
  const reviews = [];

  for (const finding of tagFindings) {
    errors.push({ id: 'TAG_MISSING', address: finding.address, message: `Missing required tags: ${finding.missingTags.join(', ')}` });
  }
  for (const estimate of unknown) {
    const finding = { id: 'COST_UNKNOWN', address: estimate.resource.address, message: estimate.reason };
    (config.unknown_cost_policy === 'fail' ? errors : reviews).push(finding);
  }
  if (thresholdExceeded) {
    const finding = {
      id: 'COST_THRESHOLD_EXCEEDED',
      message: `Estimated monthly increase of ${formatCurrency(monthlyDelta)} exceeds threshold ${formatCurrency(config.monthly_cost_increase_threshold)}.`
    };
    (config.cost_threshold_policy === 'fail' ? errors : reviews).push(finding);
  }

  const result = errors.length ? 'fail' : reviews.length ? 'review' : 'pass';
  return { result, normalised, tagFindings, estimates, unknown, monthlyDelta, thresholdExceeded, errors, reviews, config };
}

export function renderPullRequestComment(result) {
  const status = result.result.toUpperCase();
  const lines = [
    '<!-- terraform-azure-finops-pr-guardrail -->',
    '## Terraform Azure FinOps Guardrail',
    '',
    `**Result:** ${status}`,
    '',
    '### Cost estimate'
  ];

  if (result.monthlyDelta === null) lines.push('Monthly change: **Manual review required** because one or more resources cannot be estimated.');
  else lines.push(`Estimated monthly change: **${formatCurrency(result.monthlyDelta)}**`);

  const estimated = result.estimates.filter((estimate) => estimate.status === 'estimated');
  if (estimated.length) {
    lines.push('', '| Resource | Monthly change |', '|---|---:|');
    for (const estimate of estimated) lines.push(`| \`${estimate.resource.address}\` | ${formatCurrency(estimate.monthlyCost)} |`);
  }

  if (result.unknown.length) {
    lines.push('', '### Unknown costs');
    for (const estimate of result.unknown) lines.push(`- \`${estimate.resource.address}\`: ${estimate.reason}`);
  }

  if (result.tagFindings.length) {
    lines.push('', '### Required tag failures');
    for (const finding of result.tagFindings) lines.push(`- \`${finding.address}\`: missing ${finding.missingTags.map((tag) => `\`${tag}\``).join(', ')}`);
  }

  if (result.thresholdExceeded) {
    lines.push('', '### Cost threshold policy', `The estimated increase exceeds the configured threshold of ${formatCurrency(result.config.monthly_cost_increase_threshold)} per month. Configured outcome: **${result.config.cost_threshold_policy.toUpperCase()}**.`);
  }

  if (result.errors.length) {
    lines.push('', '### Blocking findings');
    for (const finding of result.errors) lines.push(`- **${finding.id}**${finding.address ? ` for \`${finding.address}\`` : ''}: ${finding.message}`);
  }

  if (result.reviews.length) {
    lines.push('', '### Review findings');
    for (const finding of result.reviews) lines.push(`- **${finding.id}**${finding.address ? ` for \`${finding.address}\`` : ''}: ${finding.message}`);
  }

  lines.push('', '> Estimate only. Actual Azure charges vary with usage, region, pricing, reservations, discounts, and service billing rules.');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const [planPath, configPath, outputPath] = process.argv.slice(2);
  if (!planPath || !configPath) {
    throw new Error('Usage: node scripts/evaluate-plan.mjs <plan.json> <config.yml> [comment.md]');
  }
  const [planText, configText] = await Promise.all([readFile(planPath, 'utf8'), readFile(configPath, 'utf8')]);
  const result = evaluatePlan(JSON.parse(planText), parseConfig(configText));
  const comment = renderPullRequestComment(result);
  if (outputPath) await writeFile(outputPath, comment, 'utf8');
  else process.stdout.write(comment);
  process.exitCode = result.result === 'fail' ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`Guardrail evaluation failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
