# Sample Pull Request Evidence

**Status:** Placeholder. A real pull-request URL must be added after the repository is published and the workflow has run.

## Required evidence

| Evidence | Required record |
|---|---|
| Initial comment | URL to a pull request where the guardrail posts the marker-based comment. |
| Updated comment | URL to the same PR after a new commit updates the existing comment. |
| Blocking policy | URL to a run showing `TAG_MISSING` or `COST_THRESHOLD_EXCEEDED` and exit code 1. |
| Fork behaviour | URL or redacted run record showing read-only-token handling without secret exposure. |
| Reusable consumer | URL to a consumer-repository run against the tagged release. |

Do not fabricate URLs or copy private plan values into this record. A public example should use the sanitised fixtures or a disposable Terraform configuration.
