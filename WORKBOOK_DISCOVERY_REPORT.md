# WORKBOOK DISCOVERY REPORT

## Discovery Engine
The discovery engine uses semantic keyword matching across `workbook.SheetNames`:
- Looks for "LAPORAN RAPOR", "REKOMENDASI PRIORITAS", "LEMBAR KERJA RKT", etc.
- Ignores numbering prefixes or trailing spaces.
- Scans each matching worksheet for structural start markers (e.g., `Indikator Prioritas`).
- Does not depend on fixed row indexes (Row 1).

## Fallback
If the workbook does not contain the official sheets, it shifts to `Compatibility Mode`, doing a brute-force sweep of all cells to find known indicator IDs.
