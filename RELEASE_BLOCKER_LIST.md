# SUPERVISION MODULE RELEASE BLOCKERS

The following items MUST be resolved before the Academic Supervision module can be deployed to the production environment or have its feature flag enabled.

## 1. HARDCODED MOCK REPOSITORIES
**Severity:** Critical
**Description:** The UI components instantiate mock database classes directly (e.g., `const repo = new MockScheduleRepository()`).
**Remediation:** 
- Implement a `SupervisionRepositoryFactory` or integrate repositories into `SupervisionContext`.
- Replace direct class instantiations in all `*.tsx` files with context-provided hooks or dependency-injected instances.
- Implement the actual Firestore-backed repositories (`FirestoreSupervisionRepository`, etc.) that conform to the repository interfaces.

## 2. STATIC DEMO DATA (MOCK_TEACHERS)
**Severity:** Critical
**Description:** `SupervisionTeacherAssignment.tsx` imports a static array of mock teachers from `MockTeacherData.ts`.
**Remediation:**
- Remove the `MOCK_TEACHERS` import.
- Fetch available teachers from the Tampuyak OS core `UserService`, filtering by the school's organization ID and the `TEACHER` role.

## 3. FEATURE FLAG LEAK
**Severity:** High
**Description:** The route rendering for `SupervisionAcademicView` in `Tampuyak.tsx` does not check `VITE_ENABLE_SUPERVISION_MODULE`.
**Remediation:**
- Wrap the rendering line in `Tampuyak.tsx` with the feature flag check:
  `{import.meta.env.VITE_ENABLE_SUPERVISION_MODULE === 'true' && currentView === "supervisiAkademik" && ...}`
