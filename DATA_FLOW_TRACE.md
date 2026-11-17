# Data Flow Trace
## Education Report -> RKAS

### Stage 1: Education Report
- Object Name: Rapor Data
- State Path: `settings.rapor.data`
- Type: Object (Key-Value map)
- Length: N/A (Dynamic based on keys)
- Status: Tracked via `settings.rapor.isLocked`
- Approval Flag: `isLocked` (boolean)
- Timestamp: `settings.rapor.lockDate`

### Stage 2: Priority Analysis
- Object Name: Analisis Data
- State Path: `settings.analisis.data.prioritas`
- Type: Array
- Length: Dynamic
- Status: `settings.analisis.status` (Belum Dimulai | Sedang Diproses | Selesai | Draft | Ditinjau | Disetujui)
- Approval Flag: `status === "Disetujui"`
- Timestamp: `settings.analisis.lastUpdated`

### Stage 3: Approval
- Object Name: Analisis Approval
- State Path: `settings.analisis.status`
- Type: String
- Approval Flag: "Disetujui"

### Stage 4: DOE
- Object Name: Document Orchestration Engine
- State Path: N/A (Runtime Class Instance)
- Input Source: Reads directly from `settings.rapor.data`, ignoring `settings.analisis.data.prioritas`
- Expected Approval Flag: NONE. DOE doesn't check `settings.analisis.status`.

### Stage 5: RKJM
- Object Name: RKJM Document
- State Path: `settings.documents` (filtered by `type === "rkjm"`)
- Input Source: Generated from DOE via `doe.generateContext`
- Status: `status` ("Draft", "Disetujui", etc.)

### Stage 6: RKT
- Object Name: RKT Document
- State Path: `settings.documents` (filtered by `type === "rkt"`)
- Input Source: Generated from DOE via `doe.generateContext`
- Status: `status`

### Stage 7: RKAS
- Object Name: RKAS Document
- State Path: `settings.documents` (filtered by `type === "rkas"`)
- Input Source: Generated from DOE via `doe.generateContext`
- Status: `status`

## Mismatch Report
**CRITICAL:** The approved Priority Analysis is stored in `settings.analisis.data.prioritas` upon approval (`status === "Disetujui"`). However, the `DocumentOrchestrationEngine` (DOE) reads directly from `settings.rapor.data` via `RaporIntelligenceEngine` and dynamically recalculates priorities on the fly using `rpie.getTopPriorities(10)`. 
DOE **bypasses** the approved `settings.analisis` object completely.
