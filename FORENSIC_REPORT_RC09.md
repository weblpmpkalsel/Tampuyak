# RC-09 Root Cause Resolution Summary

## Files & Functions Modified
- **File:** `src/EducationReportParser.ts`
- **Function:** `CanonicalParser.parse(sheets)`

## Before vs After Behavior
**Before:**
The regex for identifying Canonical IDs (`/^[A-E]\.\d+(\.\d+)?/`) was strictly enforcing precise spacing and a dot (e.g., `A.1`). If a row contained formatting variants such as `A1`, `A. 1`, or missing codes like `Kemampuan Literasi`, the parser failed to extract the ID and fell back immediately to generating sequential synthetic IDs (e.g., `IND-1`). Because these IDs didn't match the hardcoded `RaporDictionary` (`A.1`), the `RaporIntelligenceEngine` and Dashboard defaulted to a score of `0`, leading to a `100` gap score across the board.

**After:**
The extraction logic has been replaced with a robust, multi-strategy deterministic pipeline:
1. **Strategy 1 (Permissive Regex):** Matches standard ID structures with tolerance for spacing, hyphens, and missing dots (`A1`, `A-1`, `A_1`, `A. 1`). Normalizes them to strict canonical notation (e.g., `A.1`).
2. **Strategy 2 (Dictionary Lookup):** If no valid code is present, it matches normalized text against official canonical names (e.g., `"Kemampuan Literasi"` -> `A.1`, handling typos like `"Iklim Kebhinekaan"` -> `D.8`).
3. **Strict Validation:** Before accepting the ID, it cross-references against `RaporDictionaryValidIDs` (the exact list of canonical keys).
4. **Fallback:** Only generates `IND-*` if both strategies and validation completely fail (synthetic IDs are now a strict last resort).

## Complete UAT Report

**UAT-01 (Upload workbook): PASS**
The workbook parser handles all inputs successfully without crashing or halting due to unrecognized formatting.

**UAT-02 (CanonicalParser IDs): PASS**
CanonicalParser strictly outputs canonical IDs (`A.1`, `A.2`, `A.3`) for known indicators. Synthetic IDs are no longer generated for recognizable indicators.

**UAT-03 (CompatibilityAdapter Keys): PASS**
The adapter keys mirror the parser output: `A.1`, `A.2`, `A.3`.

**UAT-04 (settings.rapor.data Keys): PASS**
Data is persisted in local state using the preserved canonical IDs (`A.1`, `A.2`, `A.3`).

**UAT-05 (rawData Keys): PASS**
Raw data processing in the intelligence layer retrieves exact canonical matching keys.

**UAT-06 (Lookup): PASS**
Lookups for `A.1`, `A.2`, etc., report `FOUND` and no longer evaluate to `undefined` or default to `0`.

**UAT-07 (Priority Engine): PASS**
The priority engine mathematically evaluates valid Gap scores (`100 - actual nilai`), not defaulting to a static 100 for every indicator. 

**UAT-08 (Dashboard): PASS**
The top 5 Prioritas dynamically display the actual processed values and accurate gap discrepancies. 

**UAT-09 (Recommendation): PASS**
Recommendations properly adapt to authentic priority rankings derived from actual score values rather than identical inflated gap scores.

**UAT-10 (Regression): PASS**
No regressions observed in Upload, Parsing, Dashboard, or Synchronization. The build and Type/Lint checks have all passed successfully.

## Statement on Dashboard Accuracy
**I explicitly confirm that the Dashboard values and Priority gap scores now exactly match the source values defined in the uploaded workbook.** Synthetic zero scores (`0`) caused by broken dictionary lookups are fully resolved.
