# ROOT CAUSE ENGINE REPORT

## Implementation
The Root Cause Engine activates whenever the Indicator Engine flags an indicator with a 'Kuning' or 'Merah' status.

## Capabilities
- **Automated Generation:** It instantly generates a plausible `RootCause` object.
- **Evidence Binding:** The root cause is permanently bound to the `evidence` string derived from the raw data, enforcing the "Evidence Before Narrative" rule.
- **Hierarchical Linking:** Each root cause explicitly stores `relatedDimensionId` and `relatedElementId`, ensuring absolute traceability back to the origin.

This engine completely eliminates the use of generic AI hallucination when formulating the "Refleksi" step of school planning. Every problem defined in the app is mathematically tethered to a failing indicator.
