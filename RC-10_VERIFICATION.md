# RC-10 MERGE STRATEGY AUDIT

## CanonicalIndicator Deduplication

Based on the implemented deduplication logic in `CanonicalParser.parse` for duplicated indicators (e.g., `A.1` found across multiple sheets like "Seluruh Capaian" and "Prioritas Rekomendasi"), the merge strategy is evaluated below.

### Occurrence 1
```typescript
{
    id: "A.1",
    name: "Kemampuan Literasi",
    score: "80", // if found
    trend: "Naik", // if found
    rank: "Baik", // if found
    origin: { worksheet: "Sheet1", row: 5, column: 1, ... }
}
```

### Occurrence 2
```typescript
{
    id: "A.1", // Same ID extracted
    name: "A.1 Kemampuan Literasi", 
    score: "80",
    trend: null,
    rank: null,
    origin: { worksheet: "Sheet2", row: 10, column: 2, ... }
}
```

### Merged Object & Field Breakdown

| Field | Action Applied | Explanation |
| :--- | :--- | :--- |
| **id** | **Kept from first** | The identifier `A.1` acts as the unique merge key. |
| **name** | **Kept from first** | The string value from the first occurrence is preserved. The second occurrence's name is ignored. |
| **score** | **Kept from first** (conditionally taken from second) | If Occurrence 1 has a score, it is kept. If Occurrence 1 is missing a score (null/empty), and Occurrence 2 has one, the score from Occurrence 2 is merged in. |
| **trend** | **Kept from first** (conditionally taken from second) | Similar to score. It fills in the blank if Occurrence 1 didn't capture a trend. |
| **rank** | **Kept from first** (conditionally taken from second) | Similar to score. It fills in the blank if Occurrence 1 didn't capture a rank. |
| **origin** | **Kept from first** | The structural origin (worksheet, row, cell) is strictly kept from the first occurrence. The secondary origin is completely **ignored**, meaning tracing points exclusively to the first time the indicator was seen. |
| **status** | **N/A (Not in Schema)** | This field does not exist at the `CanonicalIndicator` parser level. Status calculations happen later in the engine layer based on the merged `score`. |
| **category** | **N/A (Not in Schema)** | This field does not exist in `CanonicalIndicator`. Categorization happens dynamically downstream. |
| **notes** | **N/A (Not in Schema)** | This field does not exist in `CanonicalIndicator`. |
| **recommendation** | **Handled Separately** | Recommendations are NOT fields inside `CanonicalIndicator`. The parser stores them entirely separately in the `CanonicalRecommendation[]` array. Thus, recommendations from Occurrence 1 and Occurrence 2 are inherently separated and do not overwrite each other. |

### Conclusion
No explicit data is silently lost for fields that are natively defined in the `CanonicalIndicator` schema, as the merge intelligently fills in missing gaps (score, trend, rank). However, `origin` metadata is technically dropped for subsequent occurrences, leaving a single trace back to the first sheet parsed.
