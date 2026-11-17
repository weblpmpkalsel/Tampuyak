# FORENSIC AUDIT REPORT: DATA PIPELINE ANOMALY

## 1. SOURCE OF INDICATOR VALUES (AUDIT 1)
- **Original Value (Excel):** Extracted by `CanonicalParser` from `valCell.v` into the `score` property.
- **Normalized Value (Parser Output):** Converted by `CompatibilityAdapter.getIndicatorsMap()` into `indicatorsMap[ind.id] = { nilai: ind.score }`.
- **Dashboard Dataset:** The normalized `indicatorsMap` is saved into `pendingImport.parsedData`, then merged into `settings.rapor.data` via `DocumentSynchronizationEngine.sync()`.
- **Recommendation/Priority Value:** `RaporIntelligenceEngine.loadData()` accesses `settings.rapor.data[ind.id]?.nilai`. If missing, it defaults to `0`.
- **Rendered Value:** The Dashboard "Top 5 Prioritas" iterates over `rpie.getTopPriorities()`, rendering `ind.value` (which became `0`).

## 2. INTERFACE/TYPE REPRESENTATIONS (AUDIT 2)
1. `CanonicalIndicator` (in `EducationReportParser.ts`): `{ id, name, score, trend, rank, origin }`
2. `IndicatorData` (in `CompatibilityAdapter`): `{ nilai, kategori, catatan }`
3. `Indicator` (in `RaporIntelligenceEngine.ts`): `{ id, name, dimensionId, elementId, value, target, gap, priorityScore, status, ... }`

## 3. INDICATOR LOOKUP MISMATCH (AUDIT 3 & 4)
The root cause is a **Lookup ID Mismatch** between the parser's extraction logic and the engine's hardcoded dictionary.

- **Lookup (Engine):** `RaporIntelligenceEngine` explicitly iterates through `RaporDictionary` (defined in `Tampuyak.tsx`), looking for exact string keys like `"A.1"`, `"A.2"`, `"D.1"`.
- **Dataset (Parser):** `CanonicalParser` extracts the `id` from the Excel column using the regex: `/^[A-E]\.\d+(\.\d+)?/`. 
  - If the Excel file contains variations like `"A1"`, `"A_1"`, `"A-1"`, or `"a.1"`, the regex **FAILS** to match.
  - When the regex fails, the parser falls back to a generated ID like `"IND-1"`, `"IND-2"`, etc.
- **The Zero Transformation:**
  Inside `RaporIntelligenceEngine.ts` (line 148):
  `const indValue = rawData[ind.id]?.nilai ? parseFloat(...) : 0;`
  Because `ind.id` is `"A.1"`, but the `rawData` key is `"IND-1"` (due to the regex failure), `rawData["A.1"]` is `undefined`. The ternary operator evaluates to the fallback `0`.

## 4. PRIORITY ENGINE CASCADING EFFECT (AUDIT 4)
Once `indValue` becomes `0`, the following cascading logic occurs in `RaporIntelligenceEngine`:
1. `target` = 100
2. `gap` = 100 - 0 = 100
3. `urgency` = 3 (since gap > 40)
4. `impact` = 3 (for dimensions A and D)
5. `priorityScore` = 3 * 3 * 100 = 900
This matches the exact anomaly reported: `Nilai: 0, Selisih: 100, Prioritas: 900`.

## 5. DASHBOARD DATASET OWNERSHIP (AUDIT 7)
- **Ownership:** Both the Dashboard Summary (Ringkasan) and the Priority Engine (Recommendation Builder) use the **EXACT SAME DATASET**: `settings.rapor.data` (which is aliased as `raporData.data`). 
- **Proof:** `Tampuyak.tsx` passes `raporData.data` into `RaporIntelligenceEngine.loadData()`, and the same object is iterated over in the Ringkasan table. There is no diverging dataset; the data pipeline is singular. The failure is entirely due to the ID key mismatch during extraction.
