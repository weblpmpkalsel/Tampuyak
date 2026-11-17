# Reasoning Execution Report

## Execution Workflow
When the TIE processes a school's data, it performs the following deterministic execution path:

1. **Indicator Analysis:** Scans the Rapor Pendidikan for gaps.
2. **Root Cause Generation:** For every gap, identifies probable root causes from the `MasterRapor` database.
3. **Intervention Mapping:** Maps the root causes to suggested programs and `MasterRKAS` codes.
4. **Scoring & Ranking:** The Priority Engine assigns scores to interventions based on impact, urgency, and cost, generating Alternatives (A, B, C).
5. **JSON Structuring:** Packages the entire reasoning tree into the structured JSON schema.

## Explainable Output Example
When suggesting RKAS Code `04.06.05` (Pelatihan Literasi):
- **Why?** Skor Literasi A.1 berada di bawah target nasional.
- **Evidence?** Rapor Pendidikan 2024 menunjukkan skor 55.
- **Regulation?** Sesuai dengan Permendikbudristek No. 63 Tahun 2022.
- **Related SNP?** Standar Proses (SNP-3) dan Standar PTK (SNP-5).
- **Expected Impact?** Peningkatan kompetensi pedagogik guru dalam mengajar literasi.

## Final Certification
**PASS** - The reasoning execution is fully deterministic, explainable, and operates without LLM intervention.
