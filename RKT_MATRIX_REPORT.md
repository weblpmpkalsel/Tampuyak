# RKT MATRIX REPORT

## RKT Extraction Engine
- **Primary Column**: `Masalah` (Problem). When a problem is populated, it signals a new RKT entry.
- **Aggregation Strategy**: The parser groups subsequent empty-problem rows under the active `currentRkt`.
- **Field Captures**: 
  - `Masalah`
  - `Akar Masalah`
  - `Program`
  - `Kegiatan`
  - `Deskripsi`
- **Result**: The matrix accurately mirrors the complete multi-row layout of the official RKT worksheet, preventing premature truncation when merging produces empty identifier cells.
