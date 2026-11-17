# TABLE DISCOVERY REPORT

## Independent Table Logic
The generic parser was prone to failure on files with multiple tables per worksheet, or when introductory paragraphs were falsely identified as data.

The mapper now strictly scopes table boundaries:
- `!ref` parameter from the XLSX structure is decoded to accurately limit horizontal and vertical boundaries.
- Empty regions (spanning more than 5 rows) that exceed these boundaries are strictly trimmed.
- Tables are mapped distinctly based on the dedicated parsers (`parseLaporanRapor`, `parseRekomendasiPrioritas`, `parseRKT`, `parseARKAS`).
