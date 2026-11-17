# HARDCODE AUDIT REPORT

## 1. AUDIT OBJECTIVE
Detect the presence of hardcoded narratives, generic templates, static paragraphs, placeholder content, and legacy educational text within the planning modules.

## 2. AUDIT EXECUTION
- **Target Files:** `src/GWE.ts`, `src/DocumentChapters.tsx`, `src/DocumentBlueprints.ts`
- **Method:** String search and logic inspection.

## 3. AUDIT FINDINGS
**CRITICAL FAILURE DETECTED**
The entire narrative generation system relies on a heavily hardcoded file (`src/GWE.ts`). 

### Examples of Hardcoded Data:
- `ksp_bab1_background`: Contains static text ("Dalam kerangka regulasi Sistem Pendidikan Nasional...") with simple `{SCHOOL_NAME}` replacements.
- `rkjm_intro`: Contains static text ("Rencana Kerja Jangka Menengah (RKJM)... dirumuskan sebagai dokumen perencanaan strategis...").
- `GWE.generateNarrative`: Uses a modulo operator on a `seed` to randomly select from an array of static template strings.

### Document Impacts:
- **KSP:** 100% hardcoded narrative templates.
- **RKJM:** 100% hardcoded narrative templates.
- **RKT:** 100% hardcoded narrative templates.
- **RKAS:** 100% hardcoded narrative templates.

## 4. CONCLUSION
**FAIL.** The application violates the "ZERO TEMPLATE • ZERO HARDCODE" mandate. The `GWE` (Government Writing Engine) in its current state is a template replacer, not an intelligent evidence-driven narrative generator.
