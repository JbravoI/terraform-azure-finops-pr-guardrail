# Phase 1 Fixture Matrix

These fixtures are intentionally small JSON plans using fictitious resource names and IDs. They establish the parser and policy-input contract before any cost provider is selected.

| Fixture | Change shape | Expected result | Contract exercised |
|---|---|---|---|
| `cost-delta` | Tagged managed resource creation | `pass` | Required plan fields, managed create, tags from `after`. |
| `missing-tags` | Managed resource creation with incomplete tags | `fail` | Mandatory-tag extraction and actionable findings. |
| `threshold-exceeded` | Tagged managed resource replacement | `review` | Replacement action normalisation and future threshold configuration. |
| `unknown-cost` | Tagged managed resource with pricing-relevant unknown value | `review` | `after_unknown` preservation and unknown-cost path. |

No fixture contains a provider-derived monetary value yet. Phase 2 will add deterministic cost-provider responses or a provider adapter mock, then assert estimated deltas and drivers.
