# Dependency Graph

## School Name Trace
`User Input (UI)` 
↓ 
`settings.school.name` (Expected SSOT)
↓ 
`DOE (schoolIdentity)`
↓ 
`KSP Cover, RKJM Cover, RKT Cover, RKAS Cover`
↓ 
`Print`

*(Note: There is a potential overlap with `settings.identitas`, which is sometimes used as fallback in DOE: `this.settings.identitas || this.settings.karakteristik || {}`)*

## Priority Analysis Trace
`Education Report (Rapor)`
↓
`settings.rapor.data` 
↓
`RaporIntelligenceEngine.getTopPriorities()` (Bypasses UI/Approval)
↓
`DOE.priorityIndicators`
↓
`RKJM, RKT, RKAS`
