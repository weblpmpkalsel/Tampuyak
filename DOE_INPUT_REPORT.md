# DOE Input Report

## Single Source of Truth Violation
There is a clear duplication and bypass of the SSOT for Priority Analysis.

1. **User sees and approves:** `settings.analisis.data.prioritas`
2. **DOE reads and generates from:** `settings.rapor.data` -> `RaporIntelligenceEngine.getTopPriorities()`

**Mismatch:** The objects do not point to the same state. Any manual modifications or approvals applied to the Priority Analysis in the UI are **completely ignored** by the Document Orchestration Engine.

**Conclusion:** Propagation stops at the Analisis tab. The downstream documents (RKJM, RKT, RKAS) are generated from a parallel, hardcoded logic chain (RPIE) instead of the actual user-approved state.
