# Test Matrix

This matrix records the evidence required before a release. Mark a row `Passed` only with a repeatable command, GitHub run, or linked review record.

| ID | Area | Evidence | Expected result | Current status |
|---|---|---|---|---|
| TST-001 | Plan normalisation | `node --test` with `fixtures/cost-delta` | Tagged managed resource normalises and estimates deterministically. | Passed locally |
| TST-002 | Required tags | `node --test` with `fixtures/missing-tags` | Missing tags produce `TAG_MISSING` and `FAIL`. | Passed locally |
| TST-003 | Cost threshold | Run evaluator with `fixtures/threshold-exceeded` | `COST_THRESHOLD_EXCEEDED` is actionable and exits 1 when policy is `fail`. | Passed locally |
| TST-004 | Unknown cost | `node --test` with `fixtures/unknown-cost` | Unknown pricing produces `COST_UNKNOWN` and the configured outcome. | Passed locally |
| TST-005 | PR comment rendering | Fixture evaluator output | Comment has marker, result, estimate or review, findings, and limitation note. | Passed locally |
| TST-006 | Action output contract | Evaluator writes comment and result JSON | Composite action can obtain `pass`, `review`, or `fail` without logging plan values. | Passed locally |
| TST-007 | Workflow syntax | GitHub Actions workflow run | Both workflow files load and start successfully. | Pending GitHub run |
| TST-008 | Comment update | Internal pull request with two commits | One marker-based bot comment is created then updated. | Pending GitHub PR |
| TST-009 | Fork protection | Pull request from a fork | Evaluation runs with read-only token; no secrets or write token are exposed. | Pending GitHub PR |
| TST-010 | Reusable workflow | Consumer repository test pull request | Plan is created and policy result is available as a required check. | Pending consumer test |
| TST-011 | Infracost integration | Sanitised disposable Terraform plan | Provider result is mapped to cost drivers and unknown resources safely. | Pending Phase 4 follow-up |

## Local verification command

Use the bundled Node runtime where Node is not already on the system path:

```powershell
& 'C:\Users\Ewuji O. John\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

## Evidence retention

Keep release evidence as short, redacted command output or GitHub run links. Do not retain binary plans, full plan JSON, credentials, subscription IDs, private endpoint values, or sensitive Terraform values.
