# BLOCK PARSER REPORT

## Block Detection Engine
The Block Detection Engine groups logical content that spans across multiple rows due to wrapped text, multiline cells, or Excel cell merging.

### Logic Flow
1. **Header Discovery**: The engine dynamically determines columns by searching for keywords.
2. **Block Boundary Detection**: A block begins when the primary key cell (e.g., `Indicator ID`, `Masalah`, or `Kegiatan`) has content.
3. **Appending**: As long as subsequent rows do not declare a new primary key, their content is aggregated to the current active block's fields (e.g., appending text to `akarPenyebab`, `benahi`, `uraian`).
4. **Completion**: When the parser encounters an empty span larger than 5 rows, it concludes the table processing.

## Benefits
This resolves the problem of truncated cells or single blocks producing multiple broken entries in the imported data state.
