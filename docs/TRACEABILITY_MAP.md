# Traceability Map

This map links each project requirement to its future policy, fixture, automated test, implementation surface, and documentation. Entries begin as planned and are updated when delivery work is completed.

| ID | Requirement | Policy / rule | Fixture and automated test | Implementation surface | Documentation | Status |
|---|---|---|---|---|---|---|
| FIN-001 | Show estimated monthly change for a Terraform plan. | Cost-estimation contract | `fixtures/cost-delta/`; `tests/evaluate-plan.test.mjs` | `scripts/evaluate-plan.mjs` | `docs/architecture/`, `docs/features/` | Fixture estimator implemented; production provider pending |
| FIN-002 | Identify unsupported or unpriced resources for human review. | Unknown-cost handling | `fixtures/unknown-cost/`; `tests/evaluate-plan.test.mjs` | `scripts/evaluate-plan.mjs` | `docs/testing/`, `docs/features/` | Fixture estimator implemented; production provider pending |
| FIN-003 | Require `owner`, `environment`, `cost_center`, `product`, and `expiry` tags. | Mandatory-tags policy | `fixtures/missing-tags/`; tag-policy tests | `policies/`, `scripts/` | `docs/features/`, `docs/operations/` | Input fixture defined; enforcement planned |
| FIN-004 | Require additional approval above a configurable threshold. | Cost-threshold policy | `fixtures/threshold-exceeded/`; threshold tests | `.github/workflows/`, `policies/` | `docs/features/`, `docs/operations/` | Input fixture defined; enforcement planned |
| FIN-005 | Generate a readable, safe PR comment. | Comment rendering and redaction rules | `tests/evaluate-plan.test.mjs` | `scripts/evaluate-plan.mjs` | `docs/features/` | Fixture renderer implemented; GitHub publication pending |
| FIN-006 | Offer reusable workflow configuration with least privilege. | Workflow-permissions policy | Sample-consumer workflow test | `.github/workflows/` | `docs/operations/` | Planned |
