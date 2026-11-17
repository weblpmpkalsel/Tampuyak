# WORKSHEET MAPPING REPORT

## Mapping Summary
The engine guarantees that every worksheet is processed accurately:

1. **Workbook Scan**: Retrieves `rawSheetNames`.
2. **Identification**: Sanitizes and validates names against Kemendikdasmen patterns.
3. **Execution**: Invokes the corresponding isolated parser methods.
4. **Aggregation**: Injects all results from the separate methods into a unified state (`parsedData`, `recommendations`, `rkt`, `rkas`, `schoolData`) stored within a single `ParseResult` response.

## Missing Worksheets
If a required worksheet is missing, the master loop continues gracefully without throwing critical errors, successfully extracting data from the sheets that were found.
