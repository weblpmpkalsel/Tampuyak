# RKJM ENGINE PHASE 2.5.1 - PLANNING ASSIGNMENT DOMAIN AUDIT

## 1. Planning Activity Structure
The primary structural definition for planning activities is the `AnnualPlanningActivity` interface located in `/src/models/AnnualPlanningModel.ts`. 

During generation, anonymous raw objects (`rktObj`) loosely matching this shape (along with timeline and budget references) are dynamically constructed in the data pipelines (`DocumentSynchronizationEngine.ts` and `Tampuyak.tsx`).

## 2. Planning Year Ownership
Does the activity already have a Planning Year? **NO**. 
Neither the `AnnualPlanningActivity` interface, its nested `TimelineModel`, nor the raw `rktObj` literal generators contain any explicit `planningYear` or `tahunPelaksanaan` field. The activity domain object is entirely agnostic of the multi-year phase it belongs to.

## 3. Current Assignment Strategy
Currently, the planning year assignment relies on **implicit structural location (bucketing)** rather than explicit domain ownership:
1. The `PlanningDistributionService` calculates a `targetYear` (e.g., `"Y1"`, `"Y2"`).
2. The generator pipeline uses this string purely as an object key: `annualPlans[targetYear].rkt.push(rktObj)`.
3. The `rktObj` itself holds no record of this assignment. Its year is only known because it happens to sit inside the `Y1` or `Y2` array.

## 4. Missing Domain Fields
The domain model lacks a primitive field to durably bind an activity to its multi-year operational window. If activities from `Y1` and `Y2` are ever flattened into a single array (e.g., for a global timeline or analytics dashboard), the year context is permanently lost.

## 5. Recommended Domain Extension
The domain model should be extended so that the activity explicitly owns its planning year.
- **Location**: Update `AnnualPlanningActivity` in `/src/models/AnnualPlanningModel.ts`.
- **Extension**:
  ```typescript
  export interface AnnualPlanningActivity {
    // ... existing fields ...
    planningYear?: 'Y1' | 'Y2' | 'Y3' | 'Y4'; 
  }
  ```
- **Generator Update**: The raw `rktObj` and `rkasObj` literals in `DocumentSynchronizationEngine.ts` and `Tampuyak.tsx` should inject `planningYear: targetYear` directly into the object during creation.

## 6. Files Responsible
- `/src/models/AnnualPlanningModel.ts` (Domain Definitions)
- `/src/DocumentSynchronizationEngine.ts` (Import Pipeline Generator)
- `/src/Tampuyak.tsx` (In-App Pipeline Generator)

## 7. Risk Analysis
- **Data Loss Risk**: **High** (if left unaddressed). Any operational view, timeline, or export engine that flattens the `annualPlans` structure will lose all knowledge of when an activity is supposed to happen.
- **Modification Risk**: **Low**. Adding an optional `planningYear` field to the TypeScript interface is a safe, additive change. Existing consumers that rely on the structural buckets (like `Chapter4Builder`) will continue to work unaffected while the domain model gains durability.
