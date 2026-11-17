# RKJM ENGINE PHASE 1.5 - BAB IV RECONSTRUCTION AUDIT

## 1. Root Cause Analysis
In `/src/DocumentCompositionEngine/builders/Chapter4Builder.ts`, the RKJM Chapter IV generation hardcodes the extraction of activities (`rktItems`) and budgets (`rkasItems`) exclusively from the `Y1` (Year 1) bucket of the `annualPlans` object.

```typescript
const rktItems = rp?.annualPlans?.Y1?.rkt || settings?.planningResult?.rkt || [];
const rkasItems = rp?.annualPlans?.Y1?.rkas || settings?.planningResult?.rkas || [];
```
By solely reading from `Y1`, the builder completely ignores any activities or budget items distributed into `Y2`, `Y3`, or `Y4`. Because the items belong to the Year 1 plan, their execution year is inherently "Tahun Ke-1", and the formatting function (`formatTahunPelaksanaan`) correctly but redundantly defaults missing schedule strings to "Tahun Ke-1".

Furthermore, the Roadmap (Section 4.1) statically hardcodes checkmarks (`✓`) across all four years for every extracted program, rather than deriving the checks from the actual planning distribution.

## 2. Current Distribution Logic
1. **Data Source**: The builder retrieves overarching objectives from `rp?.objectives`.
2. **Extraction Limit**: It limits RKT and RKAS retrieval strictly to `annualPlans.Y1`. If missing, it falls back to a flat `settings?.planningResult?.rkt` list.
3. **Roadmap Generation (4.1)**: Iterates over the `Y1` programs and universally hardcodes `'Tahun Ke-1': '✓', 'Tahun Ke-2': '✓', 'Tahun Ke-3': '✓', 'Tahun Ke-4': '✓'` for every program row.
4. **Annual Plan (4.2)**: Evaluates only `Y1` activities. The `"Tahun Pelaksanaan"` is derived via `formatTahunPelaksanaan(rkt.schedule)`, which defaults to `"Tahun Ke-1"`.
5. **Budget Projection (4.3)**: Maps `Y1` RKT items to `Y1` RKAS items, meaning projected budgets only reflect the first year.

## 3. Problems Identified
- **Data Omission**: Multi-year planning distributions mapped to `Y2`, `Y3`, and `Y4` in `annualPlans` are entirely dropped from the generated document.
- **Misleading Roadmap**: The Peta Jalan (Roadmap) falsely indicates that every program is executed in every year, because the `✓` marks are statically hardcoded rather than dynamically derived from the distribution.
- **Year 1 Bias**: Because only `Y1` data is fed into the pipelines, all downstream tables (Rencana Kerja, Proyeksi Anggaran, Sumber Pendanaan) show exclusively Year 1 operations, masquerading as a multi-year plan.

## 4. Recommended Distribution Strategy
The `Chapter4Builder` must be reconstructed to aggregate data across all planning years before building the tables:
1. **Multi-Year Aggregation**: Iterate over the keys `['Y1', 'Y2', 'Y3', 'Y4']` of `rp?.annualPlans`. Concatenate `rktItems` and `rkasItems` from all available years into unified arrays.
2. **Distribution Tagging**: As items are aggregated, inject a transient tag (e.g., `_sourceYear: 'Tahun Ke-1'`) based on the bucket they were extracted from.
3. **Dynamic Roadmap (4.1)**: Group aggregated RKT items by program name. Check which `_sourceYear` tags exist for each program group, and apply the `✓` dynamically only to the years where the program is active.
4. **Accurate Execution Year (4.2 & 4.3)**: Instead of falling back on `formatTahunPelaksanaan(rkt.schedule)`, prioritize the `_sourceYear` tag to explicitly print "Tahun Ke-2", "Tahun Ke-3", etc. in the "Tahun Pelaksanaan" column.

## 5. Files Requiring Modification
- `/src/DocumentCompositionEngine/builders/Chapter4Builder.ts`
  *(Must be modified to implement the multi-year aggregation and dynamic table generation logic. No templates or core data structures will change.)*

## 6. Files That Must NOT Be Modified
- All Core Platform modules (e.g., `KnowledgeGraph`, `AnnualPlanningEngine`, `BusinessRulesEngine`, `ExecutionEngine`)
- `/src/models/*`
- `/src/events/*`
- `/src/intelligence/*`
- `/src/DocumentCompositionEngine/DocumentCompositionEngine.ts`
- Any Dashboard, Timeline, Monitoring, or RKAS UI views.

## 7. Risk Analysis
- **Data Integrity Risk**: Zero. The changes are strictly confined to the read-only output generation layer (`Chapter4Builder.ts`). The foundational data remains untouched.
- **Backward Compatibility Risk**: Low. If `annualPlans` is completely missing, the system will fall back to `settings?.planningResult?.rkt` as it currently does, defaulting to Year 1 behavior safely.
- **Presentation Risk**: Low-Medium. Aggregating 4 years of data may significantly increase the row count in the output tables. However, the existing CSS/Print Engine handles large tables (`page-break-inside: auto`) efficiently, so the layouts will adapt naturally.
