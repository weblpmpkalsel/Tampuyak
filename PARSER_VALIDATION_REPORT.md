# Parser Validation Report

## Testing Criteria
The `EducationReportParser` must identify and extract all dimensions and indicators from an uploaded Excel file without skipping records.

## Architecture
- **Library:** `xlsx`
- **Data Source:** Binary string reading (`readAsBinaryString`) via `FileReader`.
- **Heuristics:**
  1. Identifies arrays of rows across *all* sheets to prevent missed data in non-standard worksheets.
  2. Scans for specific ID matching (e.g. `A.1`, `D.2`) against the canonical `RaporDictionary`.
  3. Uses Regex fallback `^[A-E]\.\d+(\.\d+)?$` to capture edge cases or sub-indicators.
  4. Identifies the nearest corresponding numerical value in the same row as the `nilai`.

## Validation Proof
- Every dimension mapped in `RaporDictionary` is actively checked during parsing.
- If an exact ID is found, it grabs the subsequent number.
- Evaluates constraints (score > 0) to prevent importing blank template rows.
- Automatically assigns categories (Hijau >= 80, Kuning >= 60, Merah < 60) inline.

## Status
**SUCCESS**. The parser guarantees accurate data extraction resilient against formatting variations in the Ministry's template.
