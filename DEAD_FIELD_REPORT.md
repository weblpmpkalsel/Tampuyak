# Dead Field Report

The following fields are collected from the user but fail to propagate to generated documents due to architectural bypasses:

1. **Priority (Prioritas):** Collected and approved in `settings.analisis.data.prioritas`, but ignored by DOE.
2. **Analysis (SWOT/Root Cause):** Collected in `settings.analisis.data`, but DOE generates its own SWOT via `rpie.getSWOT()`.
3. **Logo:** Collected in `settings.school.logoYayasanUrl`, but often hardcoded or bypassed in Print Engine.
