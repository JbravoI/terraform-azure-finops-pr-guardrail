# Documentation Index

Start here for the versioned product, technical, testing, and operating documentation. For the delivery state, read [`../implementation/CURRENT_STATUS.md`](../implementation/CURRENT_STATUS.md).

## Documentation areas

- `product/`: intended users, capabilities, non-goals, and roadmap.
- `architecture/`: workflow components, data flow, integrations, and trust boundaries.
- `decisions/`: short architecture decision records (ADRs) for durable choices.
- `features/`: behaviour and acceptance criteria grouped by capability.
- `testing/`: fixture contract, test approach, and evidence.
- `operations/`: configuration, permissions, troubleshooting, releases, and support.
- `TRACEABILITY_MAP.md`: links requirements to policies, fixtures, tests, and implementation.

## Current baseline

- `architecture/01-terraform-plan-contract.md` defines the accepted Terraform JSON-plan input and safe parsing rules.
- `testing/phase-1-fixture-matrix.md` describes the baseline scenarios in `../fixtures/`.

## Documentation rules

- Treat this directory as the source of truth for the versioned project documentation.
- State whether a capability is implemented, simulated, or planned.
- Keep secrets, sensitive plan values, subscription identifiers, and customer details out of examples and fixtures.
- Update this index when a new documentation area becomes part of the project.
