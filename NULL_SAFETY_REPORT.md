# NULL SAFETY REPORT

## Overview
All explicit operations in `EducationReportParser.ts` are hardened against `null`.

## Modifications
1. `fileData` (ArrayBuffer from FileReader): Checked using optional chaining.
2. Regex match results: Evaluated via `if (match && match[0])` before accessing indices.
3. Fallback assignments: Missing array indices default to empty strings instead of leaving `null`/`undefined` in the mapped `rowStrings`.
4. Empty file reads: Checks `if (file)` before running `reader.readAsBinaryString(file)`.
