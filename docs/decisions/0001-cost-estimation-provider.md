# ADR 0001: Use Infracost for production cost estimation

**Status:** Accepted  
**Date:** 2 September 2026

## Context

The guardrail needs an Azure Terraform cost estimate that can be shown in a pull request. It must consume the JSON representation of the Terraform plan defined in `../architecture/01-terraform-plan-contract.md`, show total and per-resource changes where available, and make unsupported or unresolved prices visible for review.

## Decision

Use Infracost as the production cost-estimation provider boundary. Infracost supports Terraform plan JSON as input and returns total costs and detailed breakdowns. Its GitHub integration supports pull-request reporting.

The project code exposes a deterministic fixture estimator for tests. Its price catalog is deliberately fictitious and exists only to prove parsing, result classification, and comment rendering. It must never be represented as Azure pricing or used for a production decision.

## Consequences

- Production execution will need an Infracost account and an API key or the approved CLI authentication method.
- The key is supplied at runtime through GitHub Actions secrets and must never be written to plans, logs, comments, fixtures, or repository files.
- Unknown or unsupported resources result in `review`, not a zero price.
- The provider adapter, authentication, and live GitHub comment publication are deferred to the reusable-workflow hardening phase.

## Alternatives considered

- Azure retail-price API directly: requires the project to maintain Azure SKU and usage mapping logic.
- A hand-maintained Azure price table: cannot stay accurate enough for pull-request controls.
- No estimate provider: fails the project objective of making cost impact visible before merge.
