# GitHub Actions Integration and Trust Boundaries

## Components

- `action/action.yml` is the composite action. It evaluates a Terraform JSON plan, writes a Markdown comment, exposes the result, and updates one marker-based pull-request comment.
- `.github/workflows/terraform-finops-guardrail.yml` is the reusable workflow. It creates a Terraform plan JSON and invokes the composite action.
- `.github/workflows/fixture-guardrail.yml` verifies repository fixtures and demonstrates the comment format on pull requests.

## Permissions and event model

Workflows request only `contents: read` and `pull-requests: write`. They run on `pull_request`, not `pull_request_target`, so forked pull requests retain GitHub's read-only token restriction. The action publishes a comment only when both a pull-request number and token are supplied.

The workflow does not use cloud credentials, Infracost credentials, or repository secrets. Live Infracost authentication is a future integration and must use an Actions secret or supported short-lived identity, never a value embedded in workflow code.

## Comment safety

The evaluator never writes resource values, Terraform before/after objects, or sensitive plan values into the comment. It emits only result classification, resource address, policy finding ID, tag keys, and estimated fixture result. The marker `<!-- terraform-azure-finops-pr-guardrail -->` lets the action update its own previous bot comment instead of adding a comment on every run.

## Failure behaviour

The action always attempts to publish the latest result after evaluation. A `fail` result then makes the action fail with exit code 1. A comment-update failure does not change the evaluator result; workflow logs retain the API failure for diagnosis.

## Consumer example

```yaml
jobs:
  finops:
    uses: your-organization/terraform-azure-finops-pr-guardrail/.github/workflows/terraform-finops-guardrail.yml@v1
    permissions:
      contents: read
      pull-requests: write
    with:
      terraform-working-directory: infrastructure
      policy-path: policies/finops.yml
      terraform-version: 1.9.8
```

The caller cannot elevate permissions through the reusable workflow. Configure the workflow result as a required status check when a `fail` outcome should block merge.
