# Official Rapor Pendidikan Parser (ORPP)

## Contract-First Implementation
Tampuyak OS now utilizes the official Kemendikdasmen Excel workbook as its primary import contract.

### Parsing Strategy
1. **Official Structure Check:** Validates the presence of official worksheets (`LAPORAN RAPOR`, `REKOMENDASI PRIORITAS`, `LEMBAR KERJA RKT`, etc.).
2. **Indicator Identification:** Uses official IDs (A.1, D.1) as primary keys, scanning across rows flexibly without depending on hardcoded column indices.
3. **Metadata Extraction:** Successfully extracts trends (`Naik`, `Turun`, `Stabil`), district rankings, and national rankings directly from the cells.
4. **Recommendation Engine:** Scans `REKOMENDASI PRIORITAS` for the official root causes (`Akar Masalah`) and improvement actions (`Benahi`).
5. **Analysis Initialization:** Passes the official recommendations directly into `settings.analisis.data` as the initial baseline, overwriting heuristic algorithms when official data is present.
6. **Fallback Mode (Compatibility):** Seamlessly reverts to the heuristic matrix parser if the uploaded Excel file lacks the official Kemendikdasmen worksheet signatures.

### Validation Reporting
Upon every import, the user is presented with a detailed `Validation Report` tracking:
- Parser Mode (Official vs. Compatibility)
- Import Status
- Worksheet Audits (Found vs. Missing)
- Entity Counts (Indicators & Recommendations Imported)

### Conclusion
The Education Report Import Engine is now strictly aligned with the Ministry's canonical data structure. Downstream modules (DOE, GWE) will accurately reflect these official baselines once the user approves them in the Analisis Cerdas workspace.
