# REPOSITORY MIGRATION MATRIX
## ACADEMIC SUPERVISION MODULE

### 1. OVERVIEW
This matrix defines the 1:1 mapping between the current Safe Implementation (Mock) repositories and the future Enterprise Production (Firestore) repositories. All production repositories must implement the same TypeScript interfaces currently fulfilled by the mocks.

### 2. MIGRATION MAPPING

| Domain Entity | Current Implementation (RC-02) | Target Production Implementation (RC-04) | Core Responsibility |
|---|---|---|---|
| **Supervision Plan** | `MockSupervisionRepository` | `FirestoreSupervisionRepository` | CRUD for `SupervisionPlan` documents. Scoped by Organization ID and Academic Year. |
| **Schedule** | `MockScheduleRepository` | `FirestoreScheduleRepository` | CRUD for `SupervisionSchedule`. Manages the state machine transitions (DRAFT -> COMPLETED). |
| **Observation** | `MockObservationRepository` | `FirestoreObservationRepository` | Stores immutable `Observation` records, scores, and assessor notes. |
| **Instrument** | `MockInstrumentRepository` | `FirestoreInstrumentRepository` | Retrieves standardized rubrics and evaluation instruments. |
| **Post-Observation** | `MockPostObservationRepository` | `FirestorePostObservationRepository` | Stores coaching notes and reflections generated after the observation. |
| **Follow-Up (RTL)** | `MockFollowUpRepository` | `FirestoreFollowUpRepository` | Tracks Action Plans (`ActionPlan`) and their evidence over time. |

### 3. INTERFACE CONTRACTS
All target Firestore repositories **MUST** adhere to interface definitions (e.g., `SupervisionRepository`, `ScheduleRepository`). This ensures the `SupervisionApplicationService` remains completely decoupled from the data layer technology.
