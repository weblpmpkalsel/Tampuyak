# RC5.7_LOCATION_TRACE.md

## Current Value
The Workspace UI legacy form stores `["Pedesaan"]` in `rawSettings.karakteristik.lokasi`. 
However, the `KspMetadataAdapter` receives `["Perkotaan"]` because it is overwritten by `EnterpriseAdapter`.

## Expected Value
`["Pedesaan"]` (The latest selection made by the user in the UI).

## Broken Mapping
There are two distinct mapping bugs:
1. **State Overwrite (The "Perkotaan" Bug)**: In `EnterpriseAdapter.normalize`, the spread operator `karakteristik: { ...rawSettings?.karakteristik, ...profileNormalized.karakteristik }` causes the modular state (`enterpriseProfile.characteristics.lokasi`) to silently overwrite the legacy state (`rawSettings.karakteristik.lokasi`). If the user previously had "Perkotaan" saved in the new profile module, any new selection of "Pedesaan" in the old module is overwritten.
2. **Double Array Wrapping**: In `SchoolContextBuilder.buildCulturalDomain`, `raw.lokasi` is already an array of strings. The logic `prevailingRegionalCharacteristics: raw.lokasi ? [raw.lokasi] : undefined` wraps it again, producing `[["Pedesaan"]]`. 

## Fallback Detection
There is NO hardcoded "Perkotaan" fallback in the rendering pipeline or builders. "Perkotaan" only exists as a valid array option in the UI and as a data point in the knowledge pack. Its appearance in the preview is strictly due to the `EnterpriseAdapter` state overwrite prioritizing stale modular data over fresh legacy data.

## Root Cause
The root cause is a **State Divergence and Overwrite**. The system maintains two separate truth sources for the same data (`settings.karakteristik` vs `settings.enterpriseProfile.characteristics`). `EnterpriseAdapter` prioritizes `enterpriseProfile`, meaning if stale data ("Perkotaan") exists there, it will persistently overwrite any updates made to the legacy form ("Pedesaan").

## GO / NO GO
GO. The trace is complete and the exact mechanism causing the overwrite has been identified.
