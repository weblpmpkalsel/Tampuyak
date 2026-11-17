# SSOT Report

## Verification
- Is there a Single Source of Truth? **NO.**
- Priority Analysis is maintained in two places:
  1. `settings.analisis.data.prioritas` (State, persisted, user-editable)
  2. `RaporIntelligenceEngine` runtime calculation (Derived, non-persisted, overrides user input)
- School Data has duplicate states (e.g., `settings.school.name` vs `settings.identitas.namaSekolah` depending on old vs new schemas).
