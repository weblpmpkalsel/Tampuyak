# Duplicate State Report

1. **School Data:** 
   - `settings.school`
   - `settings.identitas`
   - `settings.karakteristik`
   *Logically, these should be merged into a single `settings.school` object.*

2. **Priority Analysis:**
   - `settings.analisis.data.prioritas`
   - `RaporIntelligenceEngine` derived state
   *Logically, DOE should read from `settings.analisis.data` once approved, rather than recalculating.*
