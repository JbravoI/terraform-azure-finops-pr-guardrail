# Fixture Contract

Fixtures provide deterministic, sanitised Terraform-plan inputs and expected guardrail outcomes. They are the primary evidence for plan parsing, policy evaluation, and pull-request comment rendering.

## Layout

Each scenario lives under `fixtures/<scenario>/` and will contain:

```text
fixtures/<scenario>/
├── plan.json          # Sanitised Terraform show -json output or minimal equivalent
├── config.yml         # Guardrail configuration used by the scenario
└── expected.json      # Expected status, findings, and comment summary
```

## Required baseline scenarios

| Scenario | Expected outcome |
|---|---|
| `cost-delta` | Pass; reports a positive, negative, or neutral monthly estimate. |
| `missing-tags` | Fail; identifies each missing mandatory tag and affected resource. |
| `threshold-exceeded` | Requires the configured additional approval or fails according to the selected enforcement design. |
| `unknown-cost` | Reports unknown resources prominently and applies the documented policy. |

## Safety requirements

- Use fictitious subscription IDs, resource names, addresses, tags, and values.
- Remove credentials, tokens, private endpoints, IP addresses, state backends, and sensitive Terraform values.
- Keep fixtures minimal: include only fields necessary to exercise the behaviour.
- Every new policy behaviour needs a fixture that passes and a fixture that fails or produces the intended warning.

## Expected output contract

`expected.json` will define the overall result (`pass`, `fail`, or `review`), findings by severity, the estimated monthly delta when known, unknown resource addresses, and stable comment sections. Tests should assert behaviour and key content rather than volatile timestamps or provider response wording.
