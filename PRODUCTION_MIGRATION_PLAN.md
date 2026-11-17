# PRODUCTION MIGRATION PLAN
## ACADEMIC SUPERVISION MODULE

### 1. OVERVIEW
This document outlines the systematic, zero-downtime approach to migrate the Academic Supervision module from its isolated Safe Implementation (Mock) state to full Production Readiness.

### 2. DEPENDENCY INJECTION STRATEGY
**Objective:** Eliminate hardcoded `new MockXRepository()` calls inside React components.
- **Action 1:** Define clear TypeScript Interfaces for all repositories (e.g., `ISupervisionRepository`, `IScheduleRepository`).
- **Action 2:** Create a central `SupervisionDependencyContainer` or expand `SupervisionContext` to hold the initialized repository instances.
- **Action 3:** Refactor all `*.tsx` components and the `SupervisionPublishingService` to consume repositories exclusively via the Context (e.g., `const { repositories } = useSupervision();`).

### 3. FEATURE FLAG CLOSURE (SECURITY)
**Objective:** Ensure complete isolation of the module until it is fully tested in production.
- **Action 1:** Protect the Route in `Tampuyak.tsx`:
  ```tsx
  {import.meta.env.VITE_ENABLE_SUPERVISION_MODULE === 'true' && 
   currentView === "supervisiAkademik" && (
      <SupervisionProvider><SupervisionAcademicView /></SupervisionProvider>
  )}
  ```
- **Action 2:** Verify that no URL routing or deep linking allows bypassing the feature flag.
- **Action 3:** Ensure that any shared components (if exported to other modules) are feature-flagged.

### 4. MIGRATION PHASES

#### Phase 1: Dependency Injection Refactoring (Current State: Mocks)
- **Goal:** Shift to DI without changing the underlying mock data.
- **Tasks:** Introduce interfaces, set up Context providers, and refactor UI components to use the injected mocks.
- **Validation:** The application must function exactly as it does now, with no UI changes.

#### Phase 2: Hybrid Integration (Enterprise Projections)
- **Goal:** Connect to real Master Data while keeping transactional data mocked.
- **Tasks:** Replace `MOCK_TEACHERS` with actual queries to `userService`. Integrate real Academic Year and Organization Context.
- **Validation:** Teacher assignments show real users.

#### Phase 3: Production Repository Rollout
- **Goal:** Swap mock transactional data for real Firestore persistence.
- **Tasks:** Build `FirestoreSupervisionRepository` and peers. Inject them into the Context instead of the mock versions.
- **Validation:** E2E testing of the complete flow (Plan -> Assignment -> Schedule -> Observation -> RTL) using Firestore.

#### Phase 4: Feature Flag Enabling
- **Goal:** General Availability.
- **Tasks:** Flip `VITE_ENABLE_SUPERVISION_MODULE` to `true` in the production environment.
- **Validation:** Monitor production analytics and error logs.
