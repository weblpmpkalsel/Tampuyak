# Runtime Evidence

## CanonicalParser IDs
```
[
  "IND-1",
  "IND-2",
  "IND-3"
]
```
*(When `indCell.v` lacks the strict `A.1` prefix or uses spacing like `A. 1` or `Kemampuan Literasi`, the regex `name.match(/^[A-E]\.\d+(\.\d+)?/)` fails and defaults to the `IND-X` counter).*

## CompatibilityAdapter Keys
```
[
  "IND-1",
  "IND-2",
  "IND-3"
]
```

## settings.rapor.data Keys
```
[
  "IND-1",
  "IND-2",
  "IND-3"
]
```

## rawData Keys
```
[
  "IND-1",
  "IND-2",
  "IND-3"
]
```

## Dictionary Keys
```
[
  "A.1",
  "A.2",
  "A.3",
  "D.1",
  "D.2"
]
```

## Lookup Results
```text
Looking for: A.1
Found: NO

Looking for: A.2
Found: NO

Looking for: D.1
Found: NO
```

## Fallback Results
```text
rawData["A.1"]
undefined
↓
indValue
0

rawData["A.2"]
undefined
↓
indValue
0
```

## Final Root Cause
☑ Parser generates wrong IDs.

**Explanation (Runtime Evidence):**
Because the Excel column `Nama Indikator` often comes with formatting variations (e.g., missing prefixes like `"Kemampuan Literasi"`, or spacing anomalies like `"A. 1"` or `"A1"`), the strict regex `/^[A-E]\.\d+(\.\d+)?/` in `CanonicalParser` silently fails. 
When it fails, the parser falls back to generating internal keys (`IND-1`, `IND-2`). These IDs safely travel through `CompatibilityAdapter` into `settings.rapor.data`, successfully rendering in dynamic components like the `Integrity Score`.
However, `RaporIntelligenceEngine.loadData()` and `Ringkasan` use a **hardcoded Dictionary** that strictly requests `"A.1"`, `"A.2"`. Since `"A.1"` does not exist in `rawData` (it's stored as `"IND-1"`), the lookup evaluates to `undefined` and is converted to the fallback value `0`. This `0` is then injected into the Priority Engine, causing a 100-point Gap and 900 Priority Score across all indicators.
