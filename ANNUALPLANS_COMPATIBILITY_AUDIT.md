# RKJM ENGINE PHASE 2.5.4A - ANNUALPLANS COMPATIBILITY AUDIT

## 1. annualPlans Structure
The current `annualPlans` object partitions the timeline into explicit structural buckets:
- `annualPlans.Y1`
- `annualPlans.Y2`
- `annualPlans.Y3`
- `annualPlans.Y4`

For **every** planning year, the bucket contains:
- `rkt`: Array of strategic activities assigned to this year.
- `rkas`: Array of budget allocations corresponding to this year's activities.
- `operationalActivities`: Array of `OperationalPlanningActivity` instances.

**Relationship:**
The `operationalActivities` arrays act as the formal record of the `PlanningAssignment` decision. The strategic details (`rkt`) and budgets (`rkas`) reside in the same bucket alongside them. Downstream processes can either structurally trust that items in `Y2.rkt` occur in Year 2, or they can use the `operationalActivities` reference to formally query the exact scheduling metadata.

## 2. Compatibility Matrix
| Component | Expectation | Actual Data Location | Status |
| :--- | :--- | :--- | :--- |
| **Chapter4Builder** (Peta Jalan) | Reads `Y1.rkt` | Distributed across `Y1`-`Y4` | **Incompatible** (Misses Y2-Y4) |
| **Chapter4Builder** (RKT) | Reads `Y1.rkt` | Distributed across `Y1`-`Y4` | **Incompatible** (Misses Y2-Y4) |
| **Chapter4Builder** (Proyeksi) | Reads `Y1.rkas` | Distributed across `Y1`-`Y4` | **Incompatible** (Misses Y2-Y4) |

## 3. Builder Dependency Map
- `Chapter4Builder` initiates its dependency extraction on line 38:
  ```typescript
  const rktItems = rp?.annualPlans?.Y1?.rkt || settings?.planningResult?.rkt || [];
  const rkasItems = rp?.annualPlans?.Y1?.rkas || settings?.planningResult?.rkas || [];
  ```
- Due to the above hardcoded extraction, `Chapter4Builder` is structurally blind to `Y2`, `Y3`, and `Y4`.
- For the "Peta Jalan Implementasi" table, it currently hardcodes a checkmark (`'✓'`) for all 4 years rather than resolving it from the actual multi-year distribution.
- For the RKT table, it relies on a string parser (`formatTahunPelaksanaan`) parsing `rkt.schedule` to guess the year, rather than honoring the actual `annualPlans.Yx` bucket or the `operationalActivities.planningYear` assignment.

## 4. Required Minimal Changes
To make `Chapter4Builder` compatible without breaking existing logic:
1. **Aggregate Sources**: Change lines 38-39 to aggregate `rkt` and `rkas` from all four years (`Y1`, `Y2`, `Y3`, `Y4`). During aggregation, inject a transient `_assignedYear` property (e.g. "Y1", "Y2") into the items based on their bucket.
2. **Dynamic Peta Jalan Ticks**: In the roadmap generation loop, instead of statically setting `'✓'` for all years, conditionally set the ticks based on which `_assignedYear` buckets the program's activities were found in.
3. **Dynamic Tahun Pelaksanaan**: Replace the string-parsing `formatTahunPelaksanaan(rkt.schedule)` with a direct read of `_assignedYear` to accurately reflect the Operational Planning decision.

## 5. Files Affected
- `/src/DocumentCompositionEngine/builders/Chapter4Builder.ts` (Requires modification)

## 6. Risk Analysis
- **Data Loss Risk in Document**: **High**. If this audit is not actioned, the final exported RKJM Chapter IV document will silently drop 75% of the generated activities (everything distributed to Y2, Y3, and Y4).
- **Modification Risk**: **Low**. Refactoring `Chapter4Builder` to aggregate the buckets is a safe read-only UI composition change. It does not alter the underlying planning domain or the operational SSOT.
