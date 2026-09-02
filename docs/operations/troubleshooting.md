# Troubleshooting

## Local evaluator failures

| Finding or symptom | Cause | Correction |
|---|---|---|
| `TAG_MISSING` | A managed create, update, or replacement lacks one or more required tags. | Add the keys listed in the comment, or make a reviewed change to the policy file. |
| `COST_UNKNOWN` | Pricing-relevant values are unresolved or the resource is unsupported by the active estimator. | Review the resource manually, supply resolvable Terraform inputs, or choose the approved policy outcome. |
| `COST_THRESHOLD_EXCEEDED` | Estimated monthly increase exceeds the policy threshold. | Reduce the change, obtain the required review, or update the threshold through normal policy review. |
| Invalid configuration | A policy outcome is not `review` or `fail`, or threshold is negative. | Correct the YAML file; the evaluator does not silently weaken an invalid policy. |
| Invalid plan | Input is not JSON from `terraform show -json`, or required fields are missing. | Recreate the plan JSON from a saved Terraform plan. |

## GitHub Actions failures

| Symptom | Cause | Correction |
|---|---|---|
| No comment on a fork pull request | GitHub provides a read-only token to the normal pull-request event. | Review the job output. Do not move the workflow to `pull_request_target` only to write a comment. |
| Comment appears repeatedly | Marker was altered or a previous comment was written by a non-bot account. | Preserve the action marker and let the action update its bot-authored comment. |
| Terraform init fails | Provider, module, backend, or Terraform-version issue. | Reproduce with `terraform init -backend=false` in a redacted local environment. |
| Workflow cannot locate policy | Caller passes a path not present after checkout. | Use a repository-relative policy path and confirm it is versioned. |

## Incident handling

If a workflow accidentally exposes a secret or sensitive plan value, revoke the secret immediately, remove it from logs and artifacts using the hosting provider's incident process, and open a security incident record. Do not paste the exposed value into a pull request, issue, or troubleshooting request.
