# Terraform Plan Input Contract

## Purpose

The guardrail consumes a saved Terraform plan rendered as JSON with:

```text
terraform show -json <saved-plan>
```

The JSON document is an input only. The action must not run `terraform apply`, modify state, or use plan content as executable input.

## Supported input

The initial parser accepts a valid Terraform JSON plan with these top-level fields:

| Field | Required | Use |
|---|---:|---|
| `format_version` | Yes | Reject an incompatible plan format with an actionable error. |
| `terraform_version` | Yes | Include in diagnostics only. |
| `resource_changes` | Yes | Determine changed resource addresses, types, actions, and before/after values. |

Each `resource_changes[]` item must contain `address`, `mode`, `type`, `name`, and `change.actions`. Managed resources (`mode: "managed"`) are in scope; data resources and output-only changes are ignored with an explicit diagnostic.

## Normalised change record

The parser will create one internal record per managed resource change:

```json
{
  "address": "azurerm_storage_account.example",
  "type": "azurerm_storage_account",
  "actions": ["create"],
  "before": null,
  "after": {},
  "after_unknown": {},
  "tags": {},
  "tag_source": "after",
  "estimation_status": "pending"
}
```

`tags` is read from `change.after.tags` when it is an object. For a delete-only action, it is read from `change.before.tags`. If tags are absent, null, unknown, or not an object, the record has an empty tag map and the tag-policy result must identify the resource clearly.

## Action handling

| Terraform actions | Meaning | Phase 1 handling |
|---|---|---|
| `create` | New resource | Include in tag checks and send to future estimator. |
| `update` | Existing resource changes | Include in tag checks and send to future estimator. |
| `delete` | Resource removal | Do not require new tags; retain for future negative-cost estimation. |
| `delete`, `create` | Replacement | Treat as one replacement record and use `after` tags for validation. |
| `read` or no managed change | Data/output activity | Ignore and report in diagnostics if present. |

## Unknown and sensitive values

Terraform represents values only known at apply time through `after_unknown`. The parser must preserve that signal and must never infer a value for it. A resource with pricing-relevant unknown attributes will become `unknown` in the cost-estimation phase.

The action must not log the full plan, `before`, `after`, or values marked sensitive. Diagnostics may use only resource address, resource type, actions, policy finding IDs, and a count of redacted values.

## Failure conditions

The guardrail must fail before policy evaluation when the input is invalid JSON, lacks required fields, has a non-array `resource_changes`, or contains an unusable managed-resource change record. The error must state the path to the invalid field and tell the user to supply JSON from `terraform show -json`.

## Phase boundary

This contract defines parsing and policy inputs only. It does not define resource prices, Azure API access, PR-comment publication, or GitHub approval enforcement; those belong to later phases.
