## A. Compatibility Adapter Design (Presentation Layer)

It is possible to build a **View-Model Adapter** inside the React layer (`CurriculumHubModule.tsx`) that projects the flat `Subject[]` array into a nested Phase UI, bridging the gap between the legacy storage format and the new UX.

### How it works:
1. **Derivation (Read):** 
   Using a React `useMemo` hook, the flat `intracurricular.payload.subjects` array is reduced into a grouped dictionary (`Map<string, SubjectKnowledge[]>`). The UI then maps over these keys to render Phase containers.
2. **Mutation (Write):** 
   - **Add Subject in Phase:** When a user clicks "Add Subject" inside the "Fase A" container, the UI generates a new subject, automatically injects `phase: "Fase A"`, and pushes it to the global flat array.
   - **Edit Subject:** The UI updates the specific subject in the flat array using its unique `id`.
   - **Delete Phase:** The UI runs an array filter to remove all subjects where `subject.phase === "Fase A"`.
   - **Rename Phase:** The UI maps over the global flat array and mutates the `phase` string for all subjects matching the old phase name.

---

## B. The Limitation (Why it is partially IMPOSSIBLE)

While we can fake a Phase-based UI for *existing* data, it is **IMPOSSIBLE** to fully implement a Phase-based architecture without changing the data model due to the **"Empty Phase Persistence Problem"**.

### The Problem:
Because the Phase name only exists as an attribute on a `Subject` object, **a Phase cannot exist independently of its subjects.**

If a user clicks "Add Phase", names it "Fase B", but does not add any subjects to it yet:
1. The UI can hold "Fase B" in local component state.
2. However, when the user saves the document, there is no place to persist "Fase B" in the `IntracurricularKnowledge` model because the `subjects` array is empty for that phase.
3. Upon refreshing the page, "Fase B" will completely vanish.

### Unacceptable Workarounds:
To persist an empty phase without changing the data model, we would have to inject a "Ghost Subject" (e.g., a subject named `___EMPTY_PHASE_HOLDER___`). 
This is an anti-pattern that would:
- Trigger false-positive validation errors (because the ghost subject lacks hours and valid names).
- Leak into the final KSP Document Generation (`KspBab3Structure.ts`), causing broken tables to be printed.
- Corrupt the database with UI-specific implementation details.

## C. Conclusion

A **Read-Only or Auto-Grouped** Phase UI is possible with an adapter. 
A **Fully Interactive** Phase UI (where users can freely create, reorder, and persist empty phases) is **IMPOSSIBLE** without promoting `Phase` to a first-class entity in the data model.
