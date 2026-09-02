# Contributing

Thanks for contributing to Terraform Azure FinOps Pull-Request Guardrail.

## Before you contribute

- Read the [project README](README.md), [documentation index](docs/README.md), and [current status](implementation/CURRENT_STATUS.md).
- Keep pull requests small and focused on one behaviour, policy rule, fixture, or documentation change.
- Do not commit Azure credentials, subscription identifiers, production Terraform plans, customer data, or values that could reveal confidential infrastructure.

## Change expectations

- Update documentation when a change affects behaviour, configuration, permissions, policy semantics, or limitations.
- Add or update a fixture and automated test for every policy or plan-parsing behaviour.
- Mark unpriced or unsupported resources as unknown; never represent them as zero cost.
- Use clear failure messages that tell a pull-request author how to correct the issue.
- Record lasting architectural or policy choices in `docs/decisions/`.

## Documentation and status

The `docs/` directory is versioned and must reflect the implementation. `strategy.md` is intentionally local and Git-ignored. When completing a planned item, update `implementation/CURRENT_STATUS.md` and the relevant entry in `docs/TRACEABILITY_MAP.md`.

## Reporting issues

Use a minimal, redacted reproduction. Include the Terraform/provider versions, the expected and actual result, and a sanitised fixture where possible.
