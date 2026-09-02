import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { evaluatePlan, renderPullRequestComment } from '../scripts/evaluate-plan.mjs';

async function loadScenario(name) {
  const root = new URL(`../fixtures/${name}/`, import.meta.url);
  const [planText, configText, expectedText] = await Promise.all([
    readFile(new URL('plan.json', root), 'utf8'),
    readFile(new URL('config.yml', root), 'utf8'),
    readFile(new URL('expected.json', root), 'utf8')
  ]);
  const config = {
    required_tags: [],
    monthly_cost_increase_threshold: 0,
    unknown_cost_policy: 'review',
    cost_threshold_policy: 'review'
  };
  let currentKey = null;
  for (const rawLine of configText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('- ') && currentKey === 'required_tags') config.required_tags.push(line.slice(2));
    else {
      const match = line.match(/^([a-z_]+):\s*(.*)$/);
      if (match) {
        currentKey = match[1];
        if (currentKey !== 'required_tags') config[currentKey] = Number.isNaN(Number(match[2])) ? match[2] : Number(match[2]);
      }
    }
  }
  return { plan: JSON.parse(planText), config, expected: JSON.parse(expectedText) };
}

for (const name of ['cost-delta', 'missing-tags', 'threshold-exceeded', 'unknown-cost']) {
  test(`evaluates ${name} fixture`, async () => {
    const { plan, config, expected } = await loadScenario(name);
    const actual = evaluatePlan(plan, config);
    assert.equal(actual.result, expected.result);
    assert.equal(actual.normalised.length, expected.normalised_resource_count);
    assert.equal(actual.monthlyDelta, expected.monthly_delta);
    assert.deepEqual(
      actual.tagFindings.map((finding) => ({ address: finding.address, missing_tags: finding.missingTags })),
      expected.required_tag_findings
    );
    if (expected.unknown_cost_resources) {
      assert.deepEqual(actual.unknown.map((estimate) => estimate.resource.address), expected.unknown_cost_resources);
    }
    if (expected.configured_monthly_cost_increase_threshold) {
      assert.equal(actual.config.monthly_cost_increase_threshold, expected.configured_monthly_cost_increase_threshold);
    }
    const comment = renderPullRequestComment(actual);
    assert.match(comment, /Terraform Azure FinOps Guardrail/);
    assert.ok(comment.includes(`**Result:** ${expected.result.toUpperCase()}`));
    if (name === 'missing-tags') assert.match(comment, /TAG_MISSING/);
    if (name === 'threshold-exceeded') assert.match(comment, /COST_THRESHOLD_EXCEEDED/);
    if (name === 'unknown-cost') assert.match(comment, /COST_UNKNOWN/);
  });
}
