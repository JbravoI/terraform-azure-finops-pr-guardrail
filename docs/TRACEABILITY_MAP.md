# Traceability Map

This map links each project requirement to its future policy, fixture, automated test, implementation surface, and documentation. Entries begin as planned and are updated when delivery work is completed.

| ID | Requirement | Policy / rule | Fixture and automated test | Implementation surface | Documentation | Status |
|---|---|---|---|---|---|---|
| FIN-001 | Show estimated monthly change for a Terraform plan. | Cost-estimation contract | `fixtures/cost-delta/`; `tests/evaluate-plan.test.mjs` | `scripts/evaluate-plan.mjs` | `docs/architecture/`, `docs/features/` | Fixture estimator implemented; production provider pending |
| FIN-002 | Identify unsupported or unpriced resources for human review. | Unknown-cost handling | `fixtures/unknown-cost/`; `tests/evaluate-plan.test.mjs` | `scripts/evaluate-plan.mjs` | `docs/testing/`, `docs/features/` | Fixture estimator implemented; production provider pending |
| FIN-003 | Require `owner`, `environment`, `cost_center`, `product`, and `expiry` tags. | Mandatory-tags policy | `fixtures/missing-tags/`; `tests/evaluate-plan.test.mjs` | `policies/default-policy.yml`, `scripts/evaluate-plan.mjs` | `docs/features/02-finops-policy-enforcement.md` | Implemented locally; workflow integration pending |
| FIN-004 | Require additional approval above a configurable threshold. | Cost-threshold policy | `fixtures/threshold-exceeded/`; `tests/evaluate-plan.test.mjs` | `policies/default-policy.yml`, `scripts/evaluate-plan.mjs` | `docs/features/02-finops-policy-enforcement.md`, `docs/operations/policy-configuration.md` | Blocking threshold policy implemented; GitHub approval rules pending |
| FIN-005 | Generate a readable, safe PR comment. | Comment rendering and redaction rules | `tests/evaluate-plan.test.mjs`; fixture workflow | `scripts/evaluate-plan.mjs`, `action/action.yml` | `docs/architecture/02-github-actions-integration.md` | Implemented; GitHub run pending |
| FIN-006 | Offer reusable workflow configuration with least privilege. | Workflow-permissions policy | Fixture workflow review | `action/action.yml`, `.github/workflows/terraform-finops-guardrail.yml` | `docs/architecture/02-github-actions-integration.md`, `docs/operations/github-actions-setup.md` | Implemented; GitHub run pending |
