# FinOps Policy Enforcement

## Configuration

The evaluator receives a policy file with required tags, a monthly threshold, and policy outcomes. See `../../policies/default-policy.yml` for the baseline.

| Setting | Valid values | Effect |
|---|---|---|
| `required_tags` | List of non-empty tag names | Missing values produce a blocking `TAG_MISSING` finding. |
| `monthly_cost_increase_threshold` | Non-negative number | Monthly increase above this value triggers `COST_THRESHOLD_EXCEEDED`. |
| `unknown_cost_policy` | `review`, `fail` | Controls whether unpriced resources produce a review or a blocking result. |
| `cost_threshold_policy` | `review`, `fail` | Controls whether a threshold breach produces a review or a blocking result. |

## Enforcement outcomes

| Outcome | Evaluator result | Command exit code | Intended GitHub use |
|---|---|---:|---|
| `pass` | `PASS` | 0 | Allow the workflow to continue. |
| `review` | `REVIEW` | 0 | Display the finding and require normal reviewer judgement. |
| `fail` | `FAIL` | 1 | Use as a required status check to block merge until corrected or policy changes. |

## Actionable findings

Every policy finding has a stable ID, resource address when applicable, and correction guidance in the generated comment:

- `TAG_MISSING`: add the listed tag keys to the affected resource.
- `COST_UNKNOWN`: supply resolvable pricing inputs, confirm the resource manually, or set a consciously reviewed policy outcome.
- `COST_THRESHOLD_EXCEEDED`: reduce the estimated increase, adjust the reviewed threshold, or obtain the approval required by repository governance.
