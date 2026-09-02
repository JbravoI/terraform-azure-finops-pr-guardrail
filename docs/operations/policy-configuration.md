# Policy Configuration

Start with `../../policies/default-policy.yml` and copy its content into the policy file used by the workflow. Values are repository decisions and should be changed through code review.

```yaml
required_tags:
  - owner
  - environment
  - cost_center
  - product
  - expiry
monthly_cost_increase_threshold: 200
unknown_cost_policy: review
cost_threshold_policy: fail
```

## Recommended baseline

- Keep all five mandatory tags for resources that support tagging.
- Use `review` for unknown costs while the team establishes an unsupported-resource process.
- Use `fail` for a cost increase threshold once the threshold is agreed with budget owners.
- Enforce the generated failing status as a required GitHub check. Human approval rules are configured in GitHub, not asserted by the local evaluator.

## Validation failures

The evaluator rejects negative thresholds and any policy outcome other than `review` or `fail`. Correct the policy file rather than relying on a default that might weaken the intended control.
