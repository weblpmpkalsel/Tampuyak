# PARSER ASSIGNMENT REPORT

## Worksheet Index and Assignment
During workbook initialization, the parser engine scans all available sheet names and routes them explicitly:

### Assignments:
- **Sheet**: `2. LAPORAN RAPOR` (or similar)
  - **Type**: Rapor Performance Table
  - **Assigned Parser**: `parseLaporanRapor()`
- **Sheet**: `2.2 REKOMENDASI PRIORITAS` (or similar)
  - **Type**: Recommendation Blocks
  - **Assigned Parser**: `parseRekomendasiPrioritas()`
- **Sheet**: `3. LEMBAR KERJA RKT` (or similar)
  - **Type**: RKT Planning Matrix
  - **Assigned Parser**: `parseRKT()`
- **Sheet**: `4. LEMBAR KERJA ARKAS` (or similar)
  - **Type**: ARKAS Budget Matrix
  - **Assigned Parser**: `parseARKAS()`

## Rule Enforcement
- The parser no longer attempts to guess the structure from data rows.
- The assignment is strict and based entirely on worksheet identity mapping (by name conventions used in official Kemendikdasmen workbooks).
