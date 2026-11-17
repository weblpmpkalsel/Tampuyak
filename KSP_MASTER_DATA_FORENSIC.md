# KSP Master Data Forensic Audit

## Objective
To identify the breakdown in the Enterprise Data Pipeline that prevents the generation of Table 1.2 (Jumlah Murid SD Tahun Ajaran) in BAB I of the KSP document.

## 1. Component Identification
- **Builder**: `src/enterprise/document/ksp/bab1/KspBab1Structure.ts` (Responsible for building BAB I, but missing Table 1.2 logic).
- **Renderer**: `src/enterprise/workspace/preview/CanonicalRenderer.tsx` (Dynamic block renderer, does not contain hardcoded placeholders).
- **Template**: N/A (The document is built dynamically via AST blocks).
- **Projection**: `src/enterprise/knowledge/builders/SchoolContextBuilder.ts` -> `StudentCharacteristicDomain` (Does not contain fields for class aggregates).

## 2. Pipeline Trace
1. **Enterprise Master Data**: Stored in `WorkspaceState` (specifically `settings.rombel` and `settings.pesertaDidik`) within `src/Tampuyak.tsx`.
2. **School / Classes / Students**: Entered by the user via the `SettingsTabs.Rombel` UI component.
3. **Data Mapping**: Passed to `src/ksp/KspMetadataAdapter.ts`. **[PIPELINE BREAKS HERE]**
   - The adapter extracts `settings.pesertaDidik` (totals) but completely ignores `settings.rombel`.
4. **Projection**: `SchoolContextBuilder.ts` only projects `totalStudents` and `genderDistribution`. It does not project class-level aggregations.
5. **KSP Builder**: `KspBab1Structure.ts` receives the limited `StudentCharacteristicDomain` payload and renders a single `PARAGRAPH` block summarizing demographics instead of a table.
6. **Renderer**: `CanonicalRenderer.tsx` faithfully renders the paragraph block. Table 1.2 is never drawn because it is not in the AST.

## 3. Builder Data Requests
Currently, the Builder (`KspDocumentAssembler.ts` -> `SchoolContextBuilder.ts`) requests:
- **School Profile**: Yes.
- **Students**: Yes, but only high-level totals (`totalStudents`, `genderDistribution`).
- **Classes / Rombel**: **No**. The data is dropped before reaching the builder.

## 4. Projection Verification
**No Projection exists** that aggregates Class → Male Students → Female Students → Total Students. The current `StudentCharacteristicDomain` interface only supports school-wide totals.

## 5. Builder Expectation
The KSP Builder architecture relies on Pre-computed Projections (Knowledge Payloads). To generate Table 1.2, it would expect **Aggregated Class Statistics** provided by a Knowledge Builder, rather than querying raw student records directly.

## 6. Renderer Placeholder Verification
The Renderer (`CanonicalRenderer.tsx`) **does not** contain a placeholder for Table 1.2. It is a pure Canonical Document AST renderer. The table must be explicitly constructed as a `TableBlock` by the Builder to be rendered.

## 7. Repository Injection Verification
**No repositories** (`StudentRepository`, `ClassRepository`, `SchoolRepository`) are injected into the Builder. The pipeline relies on a state object (`settings`) mapped into a `KspMetadata` payload, which is then transformed into Canonical Knowledge.
