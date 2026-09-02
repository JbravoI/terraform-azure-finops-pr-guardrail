# GitHub Actions Setup

## Use the reusable workflow

Reference `.github/workflows/terraform-finops-guardrail.yml` from a caller repository and pass the Terraform directory and policy path. The caller must grant `contents: read` and `pull-requests: write`; nested reusable workflows can only retain or reduce caller permissions.

The workflow performs `terraform init -backend=false`, creates a local binary plan in the runner temporary directory, converts it with `terraform show -json`, and evaluates that JSON. The binary plan and generated JSON are not uploaded as artifacts.

## Pull-request comments

The composite action stores a marker in its Markdown output and updates that comment on subsequent runs. For fork and Dependabot pull requests, GitHub commonly supplies a read-only token. The evaluator still runs, but GitHub can deny comment publication. Do not switch to `pull_request_target` merely to obtain a writable token.

## Required checks and approvals

- Configure the guardrail job as a required GitHub status check to block `fail` outcomes.
- Configure additional human-review requirements in branch protection or repository rulesets. The action reports `review` findings but does not impersonate or create approvals.
- Keep workflow permissions restricted to the two scopes documented above.

## Troubleshooting

| Symptom | Likely cause | Correction |
|---|---|---|
| No PR comment on fork | Token is read-only for the fork event. | Read workflow logs; do not expose a write token or secrets to untrusted code. |
| Terraform initialization fails | Provider, module, or configuration issue. | Run the same init and plan commands locally with redacted output. |
| Policy result is `FAIL` | Missing tags, configured threshold breach, or fail-on-unknown policy. | Use the finding ID in the comment to correct the Terraform or reviewed policy. |
| Action cannot find plan or policy | Incorrect input path. | Use paths relative to the checked-out repository or the documented runner temporary plan path. |
