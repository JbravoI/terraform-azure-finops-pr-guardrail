# ADR 0002: Use repository policy configuration with explicit enforcement outcomes

**Status:** Accepted  
**Date:** 2 September 2026

## Context

The guardrail must validate FinOps metadata and respond consistently when planned costs are unknown or exceed the review threshold. Repository users need to review policy changes in pull requests without editing action code.

## Decision

Use a small version-controlled YAML policy file. The baseline file is `policies/default-policy.yml` and defines:

- `required_tags`: tag keys required on managed resource changes.
- `monthly_cost_increase_threshold`: non-negative monthly USD increase that triggers the threshold policy.
- `unknown_cost_policy`: `review` or `fail`.
- `cost_threshold_policy`: `review` or `fail`.

Missing required tags always create a blocking `TAG_MISSING` finding. Unknown prices create `COST_UNKNOWN`; threshold breaches create `COST_THRESHOLD_EXCEEDED`. The configured `review` outcome preserves a non-blocking review finding, while `fail` produces a blocking result and non-zero command exit code.

## Consequences

- Teams can apply repository-specific thresholds without forking the evaluator.
- A required GitHub status check can block merges for `fail` outcomes.
- A `review` result is visible but does not prove an additional GitHub approval occurred. Repository rulesets or protected-branch configuration remain responsible for human approvals.
- Policy-file validation fails early with a clear correction message for unsupported outcomes or invalid thresholds.
