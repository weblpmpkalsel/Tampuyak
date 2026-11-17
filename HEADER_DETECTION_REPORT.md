# HEADER DETECTION REPORT

## Dynamic Header Detection
- Extracts column indices dynamically on-the-fly (`nameCol`, `akarCol`, `benahiCol`, `kegiatanCol`, etc.).
- Fallback indexing correctly supports dual-row headers, where merged cells push standard definitions down by 1 row.
- Checks both the primary header row and the immediately adjacent `i + 1` row to construct a complete mapping of all required columns.
- Safely processes missing headers by falling back to indexed offsets if the structure represents data rows.
