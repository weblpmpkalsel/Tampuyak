# WORKBOOK MAP REPORT

## Scanning Protocol
The parser now forces a comprehensive Workbook Forensic Map scan **before** any parsing begins.
The scanning phase collects macro data across the entire Excel workbook.

## Captured Metadata
- **Index**: Identifies the sequence.
- **Name**: Worksheet tab name.
- **Visibility**: Detects hidden vs visible worksheets.
- **Merged Cell Regions**: Counts total cell merges affecting layout.
- **Active Grid Boundaries**: 
  - First Used Row & Column.
  - Last Used Row & Column.
- **Detected Tables**: Estimates independent data blocks based on bounds.
- **Parser Assignment**: Strictly delegates the worksheet to a single, isolated logic handler without parsing immediately.

## Effect on Parsing
By generating this map first, the engine operates deterministically. Instead of guessing structure row-by-row on the fly, it already understands the dimensions and identities of the tables before the parsing loop executes.
