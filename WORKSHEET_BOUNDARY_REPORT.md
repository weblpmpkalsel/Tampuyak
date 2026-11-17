# WORKSHEET BOUNDARY REPORT

## Table Boundary Tracing
- **Header Row**: Dynamically identified by matching key domain terminology (e.g., "Masalah", "Akar Penyebab", "Indikator").
- **First Data Row**: Commences immediately following the initial header row boundary. Dual-row headers are mitigated by secondary scans.
- **Last Data Row**: Safely calculated via the `emptyRowCount > 5` break boundary.
- **Validation**: Ensures we don't accidentally merge unrelated trailing artifacts into the valid data structure.
