## A. Current architecture

The Intrakurikuler module currently uses a **Subject-based architecture**. All subjects are stored in a single, flat, one-dimensional array regardless of their phase, class, or education level.

**Interface/Schema:**
```typescript
export interface SubjectKnowledge {
  readonly id: string;
  readonly subjectName: string;
  readonly educationLevel: string;
  readonly phase: string;
  readonly weeklyLearningHours: number;
  readonly annualLearningHours: number;
  readonly learningApproach: string;
  readonly profilLulusanDimensions: ReadonlyArray<string>;
  readonly tujuhKebiasaan: ReadonlyArray<string>;
  readonly deepLearningIndicators: ReadonlyArray<string>;
  readonly notes: string;
}

export class IntracurricularKnowledge {
  public readonly payload: {
    readonly subjects: ReadonlyArray<SubjectKnowledge>;
  };
  // ...
}
```

## B. Problems found

1. **Validation Error Opacity:** The validation error "Subject at index 4 requires a name" is confusing. If a user deletes or reorders subjects, the index shifts, making it impossible to identify which row is failing in the UI.
2. **Data Duplication & Inconsistency:** Users must manually input `educationLevel` and `phase` for *every single subject*. This invites typos (e.g., "Fase A" vs "fase a") and creates disjointed data.
3. **Document Formatting Mismatch:** `KspBab3Structure.ts` renders a single massive table with a "Phase" column, which violates the official Kemendikbudristek formatting guidelines (which require separate tables per Phase/Class).
4. **Difficult Aggregation:** Validating that a phase meets the minimum required total learning hours is computationally difficult with a flat list.

## C. Root Cause

The fundamental root cause is an **inverted data hierarchy**. 

Instead of modeling the domain as `Phase -> Subjects` (which mirrors the physical reality of a school and the official regulations), the system models it as `Subject -> Phase`. 

Because of this flat array (`SubjectKnowledge[]`), the validation engine inside `src/enterprise/knowledge/models/curriculum/IntracurricularKnowledge.ts` (Lines 37-53) iterates via standard array `.forEach((subject, index) => ...)` and relies entirely on the array index to report issues. The array index is a fragile, internal memory pointer rather than a stable, user-facing entity identifier.

## D. Recommended architecture

The architecture should be migrated to **Phase-based (or Class-based)** to align with Kemendikbudristek regulations (e.g., Permendikbudristek No. 12 Tahun 2024).

```typescript
export interface PhaseKnowledge {
  readonly id: string;
  readonly phaseName: string; // e.g., "Fase A (Kelas I dan II)"
  readonly educationLevel: string;
  readonly subjects: ReadonlyArray<SubjectKnowledge>;
}

export class IntracurricularKnowledge {
  public readonly payload: {
    readonly phases: ReadonlyArray<PhaseKnowledge>;
  };
}
```

*Why this is better:*
- **Alignment:** Matches official KSP templates perfectly (one table per phase).
- **UX:** Eliminates repetitive data entry for the user.
- **Validation:** Allows the validation engine to easily compute and validate total mandatory hours per phase.
- **Clarity:** Allows validation errors to be contextual (e.g., "Mata pelajaran di Fase A baris ke-2 membutuhkan nama").

## E. Files that WOULD need modification

1. `src/enterprise/knowledge/models/curriculum/IntracurricularKnowledge.ts` (Data Model and Validation logic)
2. `src/enterprise/workspace/modules/CurriculumHubModule.tsx` (UI for Intrakurikuler - convert flat list to Phase groups)
3. `src/enterprise/document/ksp/bab3/KspBab3Structure.ts` (Document generation - emit one table per Phase instead of one global table)

## F. Risk assessment

- **High Risk (Data Migration):** Existing KSP documents saved in Firebase or LocalStorage will have the old flat payload structure. A data migration adapter is strictly required to group existing flat `subjects` into `phases` upon hydration to avoid crashing the application.
- **Medium Risk (UI Refactor):** The UI in `CurriculumHubModule.tsx` is complex. Shifting from a flat list to a nested structure (Phase -> Subjects) requires careful React state management updates to prevent re-rendering performance issues.

## G. Migration strategy

1. **Model:** Update `IntracurricularKnowledge.ts` to support the new `PhaseKnowledge` hierarchy.
2. **Adapter:** Write a backwards-compatibility layer in the constructor of `IntracurricularKnowledge` to detect old flat payloads and automatically group them by the `phase` string into the new hierarchy.
3. **UI:** Refactor `CurriculumHubModule.tsx` to display an "Add Phase" button, and within each phase, an "Add Subject" button.
4. **Document:** Refactor `KspBab3Structure.ts` to map over `phases` and generate a `TABLE` block for each phase independently.
