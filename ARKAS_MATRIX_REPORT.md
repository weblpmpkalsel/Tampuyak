# ARKAS MATRIX REPORT

## ARKAS Extraction Engine
- **Primary Column**: `Kegiatan` (Activity). A new block starts when a valid activity string is found.
- **Aggregation Strategy**: `Uraian` (Description) often contains multi-line budget justifications. These are aggregated to the current block.
- **Numeric Retention**: Fields like `Jumlah`, `Satuan`, `Harga`, and `Total` are evaluated on the primary row and preserved.
- **Result**: Complete budgeting tables are parsed exactly, allowing 1:1 mirroring into the applet's RKAS planner without dropping any line items.
