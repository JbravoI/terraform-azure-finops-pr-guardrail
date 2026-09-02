# Terraform Azure FinOps Pull-Request Guardrail

A reusable GitHub Actions workflow for reviewing Azure Terraform changes before they are merged. It turns a Terraform plan into practical pull-request feedback: estimated monthly cost movement, key cost drivers, unpriced resources, mandatory-tag compliance, budget-impact guidance, and any additional approval required by a configured cost threshold.

## Project goals

- Make the cost implications of Terraform changes visible during pull-request review.
- Block changes with missing required FinOps tags: `owner`, `environment`, `cost_center`, `product`, and `expiry`.
- Require additional review when a planned monthly cost increase exceeds a configurable threshold.
- Treat resources without a reliable estimate as review items, rather than silently treating them as zero cost.
- Provide fixtures and automated tests for passing, failing, and unknown-cost scenarios.

## Intended workflow

```text
Terraform pull request
        |
        v
Format / validate / create plan
        |
        v
Parse planned Azure resource changes
        |
        +--> Estimate monthly cost change
        +--> Validate required tags
        +--> Identify unknown or unpriced resources
        +--> Evaluate approval threshold
        |
        v
Clear PR comment and pass/fail status
```

The workflow reports estimates to support decisions; it does not produce an invoice. Azure pricing, usage, region, reservations, discounts, and service-specific billing rules can cause actual costs to differ. Unknown estimates always need a human review.

## Planned repository structure

```text
.
├── .github/workflows/       # Reusable workflow and sample PR workflow
├── action/                  # Composite action or action implementation
├── docs/                    # Product, architecture, decisions, operations and test docs
├── fixtures/                # Terraform plans and expected review results
├── policies/                # Tag and cost-threshold policy definitions
├── scripts/                 # Plan parsing and comment generation helpers
├── tests/                   # Automated unit and fixture tests
├── README.md                # Project entry point
└── strategy.md              # Local delivery strategy; intentionally not tracked
```

## Documentation

`strategy.md` defines the delivery sequence and the documentation system to establish as implementation begins. It is deliberately Git-ignored so that it can remain a workspace planning document. The project documentation itself will live in `docs/` and be versioned with the code.

Start with [`docs/README.md`](docs/README.md) for the versioned documentation index and [`implementation/CURRENT_STATUS.md`](implementation/CURRENT_STATUS.md) for the accurate delivery status.

## Initial definition of done

- A sample Terraform pull request produces an understandable cost-and-policy comment.
- Missing mandatory tags and unapproved cost increases fail with actionable messages.
- Test fixtures cover successful, rejected, and unknown-cost plans.
- The versioned documentation explains configuration, limitations, security boundaries, testing, and release use.

## Status

Phase 2 fixture estimation and pull-request feedback baseline is complete. Live Infracost and GitHub integration have not been implemented yet.
