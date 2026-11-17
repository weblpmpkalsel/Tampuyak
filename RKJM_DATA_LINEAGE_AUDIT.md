# RKJM ENGINE PHASE 1.5B - DATA LINEAGE AUDIT

## 1. Trace Summary
A deep code trace was performed to understand the data lineage of `annualPlans` and its corresponding multi-year distribution buckets (`Y1`, `Y2`, `Y3`, `Y4`). 

**Trace Path:**
KnowledgeGraph -> Planning Intelligence -> DocumentSynchronizationEngine / Tampuyak UI -> Operational Planning (relationalPlanning) -> annualPlans -> Chapter4Builder

## 2. Component Analysis

### A. DocumentSynchronizationEngine (Import Pipeline)
- **Input**: `canonicalObjects` / `generatedAnalysis` (containing Programs and Activities).
- **Output**: `relationalPlanning.annualPlans`
- **Transformation**: 
  - The pipeline initializes the `annualPlans` structure with explicit empty arrays for all 4 years: `{ Y1: {...}, Y2: {...}, Y3: {...}, Y4: {...} }`.
  - However, during the mapping loop (`generatedAnalysis.kegiatan.forEach`), the engine explicitly instantiates objects named `rktY1` and `rkasY1`.
  - It then executes a hardcoded push exclusively to the `Y1` bucket: 
    ```typescript
    annualPlans["Y1"].rkt.push(rktY1);
    annualPlans["Y1"].rkas.push(rkasY1);
    ```
- **Responsible File**: `/src/DocumentSynchronizationEngine.ts`
- **Responsible Function**: `processApprovedImport` (around line 380-430)

### B. Tampuyak.tsx (In-App Generator Pipeline)
- **Input**: `newData` (containing `program` and `kegiatan`).
- **Output**: `settings.relationalPlanning.annualPlans`
- **Transformation**:
  - Exactly mirroring the import pipeline, the state generator initializes all four years but iterates over `newObjectives` to create `rktY1` and `rkasY1`.
  - It hardcodes the distribution to Year 1:
    ```typescript
    annualPlans["Y1"].rkt.push(rktY1);
    annualPlans["Y1"].rkas.push(rkasY1);
    annualPlans["Y1"].implementation.push(implY1);
    annualPlans["Y1"].monitoring.push(monY1);
    annualPlans["Y1"].evaluation.push(evY1);
    ```
- **Responsible File**: `/src/Tampuyak.tsx`
- **Responsible Function**: Global state generator (e.g. `handleGenerateAll` around line 7460)

## 3. Findings: Are Y2, Y3, Y4 populated?
**NO.** The `Y2`, `Y3`, and `Y4` buckets are structurally present in the initialization object but are completely bypassed by the extraction logic. They are semantically and physically empty.

## 4. Root Cause Tree
- **Symptom**: `Chapter4Builder` only renders "Tahun Ke-1" for all activities.
- **Immediate Cause**: `Chapter4Builder` only attempts to read from `annualPlans.Y1`.
- **Root Cause**: The upstream data pipelines (`DocumentSynchronizationEngine` and `Tampuyak.tsx`) do not distribute activities. They dump 100% of the generated planning data directly into the `Y1` bucket. There is no logic calculating or assigning multi-year distributions.

## 5. Recommended Fix Location
Because the upstream data for Y2, Y3, and Y4 is genuinely empty, modifying `Chapter4Builder` to read from them right now would yield zero changes in the output document. 

**STOP.** `Chapter4Builder` must **NOT** be modified yet.

**Next Steps**:
The fix must be applied at the **Planning Distribution Layer**. Specifically, the synchronization and state generation loops in:
1. `/src/DocumentSynchronizationEngine.ts`
2. `/src/Tampuyak.tsx`

These engines need logic to distribute the generated `rkt` and `rkas` items across `Y1`, `Y2`, `Y3`, and `Y4` (e.g., using a modulo operation on the index, or integrating with the newly created `OperationalPlanningEngine`) before `Chapter4Builder` can be safely updated to render them.

## 6. Risk Analysis
- **Data Integrity Risk**: High if we blindly modify `Chapter4Builder` now, as it would expose the empty arrays.
- **Corrective Action Risk**: Modifying the upstream pipelines directly alters the core application state (`settings.relationalPlanning`). The newly created `OperationalPlanningEngine` (Phase 2.5) should ideally handle this orchestration without modifying the raw annual planning generation.
