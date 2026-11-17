# DOE Behavior Report

## Architectural Role
The Document Orchestration Engine (`DOE.ts`) has been successfully refactored from an "active analytical agent" into a "passive structural compiler".

## Responsibilities Enforced:
1. **Read Approved State:** DOE reads `settings.analisis.data` and `canonicalSchoolIdentity` (merged from `school`, `identitas`, `karakteristik`).
2. **Assemble Context:** DOE maps the raw approved data (e.g., `prioritas`, `program`, `kekuatan`, `kelemahan`) into the `DocumentContext` schema expected by the Government Writing Engine (GWE).
3. **Approval Gate:** DOE actively checks `settings.analisis?.status`. If it is not approved, DOE explicitly returns a context with `narrativeIntent: "[BLOCKED: Perencanaan belum disetujui. Silakan selesaikan Analisis Sekolah.]"`, preventing unauthorized planning generation.
4. **Compile Narrative & Populate Tables:** GWE consumes the exact strings and identifiers approved by the user, weaving them into the final administrative documents.

## Behaviors Eradicated:
- **No Recalculation:** DOE no longer instantiates `RaporIntelligenceEngine` to bypass the user's saved analysis.
- **No Duplication:** Priorities and SWOT are not regenerated; they are passed directly from `settings.analisis`.
