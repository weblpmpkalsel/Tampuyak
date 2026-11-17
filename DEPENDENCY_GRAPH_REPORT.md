# DEPENDENCY GRAPH REPORT

## 1. AUDIT OBJECTIVE
Map and validate the complete dependency graph from the Education Report to the downstream planning documents.

## 2. ACTUAL SYSTEM DEPENDENCY GRAPH
### Foundation (Valid)
`Rapor Pendidikan (JSON)` 
↓
`RaporIntelligenceEngine (RPIE)` 
↓
`Priority Engine` / `SWOT Matrix` / `IRB Formulator`
↓
`WorkspaceAnalisisView (UI Display)`

### Document Engine (Invalid / Detached)
`GWE.ts (Hardcoded Templates)` 
↓
`NarrativeEditor (UI Component)` 
↓
`KSP` / `RKJM` / `RKT` / `RKAS`

`settings.relationalPlanning (Mock Data)`
↓
`Tables in RKJM, RKT, RKAS`

## 3. DEPENDENCY VIOLATIONS
1. **Broken Chain:** `RPIE` does not connect to the Document Generation Engine (`DocumentChapters.tsx`).
2. **Bypass Detected:** Documents bypass the certified foundation and instead pull from static templates (`GWE.ts`).
3. **Invalid Origin:** Tabular data originates from mock state variables rather than validated `IRBAction` objects.

## 4. CONCLUSION
**FAIL.** The required dependency graph (Education Report -> RPIE -> Document Engine) is broken. The application utilizes a dual-track system where the analytical engine and the document engine are completely isolated from each other.
