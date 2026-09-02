# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added

- Phase 5 release-readiness documentation and evidence templates.

## [0.1.0] - 2026-09-02

### Added

- Terraform JSON-plan input contract and four sanitised fixtures.
- Deterministic fixture cost estimator and Markdown PR-comment renderer.
- Required-tag, unknown-cost, and cost-threshold policy controls.
- Composite GitHub Action and reusable GitHub Actions workflow.
- Documentation, traceability, contribution guidance, and MIT licence.

### Limitations

- Fixture prices are not Azure prices and are used only for deterministic tests.
- Infracost selection is documented, but live provider authentication and integration are not implemented.
- Workflows are untested on GitHub-hosted runners until the repository is initialised, pushed, and a pull request is opened.
