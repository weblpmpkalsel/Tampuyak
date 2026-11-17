# SHEET LAYOUT REPORT

## Layout Diagnostics
Understanding the structural layout of official templates:
- **Laporan Rapor**: Single flat table extending horizontally.
- **Rekomendasi Prioritas**: Vertically grouped blocks, sometimes containing blank cells in primary keys (due to Excel cell merges).
- **RKT & ARKAS**: Variable length multi-line budget and planning matrices.

## Solution Strategy
The forensic mapper identifies the bounding box for these layouts. Because `scanWorkbook()` identifies the absolute bounds (e.g., `First Row 15, Last Row 146`), the downstream parsers no longer guess when the data ends, guaranteeing 100% block ingestion.
