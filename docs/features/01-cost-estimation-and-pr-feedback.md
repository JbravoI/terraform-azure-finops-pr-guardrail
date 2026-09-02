# Cost Estimation and Pull-Request Feedback

## Behaviour

Given a valid Terraform plan JSON and guardrail configuration, the evaluator normalises managed resource changes, validates required tags, and produces a Markdown pull-request comment.

The comment must contain:

- Overall result: `PASS`, `FAIL`, or `REVIEW`.
- Estimated monthly change when every changed resource can be estimated.
- Per-resource estimated changes for known fixture prices.
- A visible manual-review section for unknown costs.
- Required-tag findings with the resource address and missing tag keys.
- A threshold-review section when the estimated monthly increase exceeds the configured threshold.
- A limitations note stating that an estimate is not an invoice.

## Result classification

| Condition | Result |
|---|---|
| One or more required tags are missing | `FAIL` |
| Tags pass, but a resource price is unknown | `REVIEW` |
| Tags pass, all costs are known, but the increase exceeds the threshold | `REVIEW` |
| Tags pass, all costs are known, and threshold is not exceeded | `PASS` |

## Phase 2 boundary

The local evaluator generates deterministic Markdown only. It does not call Infracost, publish a GitHub comment, or enforce GitHub approvals. These integration activities are introduced in later phases.
