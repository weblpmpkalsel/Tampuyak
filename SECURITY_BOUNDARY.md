# SECURITY BOUNDARY DEFINITION
## SUPERVISION MODULE

### 1. The UX Bifurcation Boundary
The most critical security boundary is the total separation of the user experience between Evaluators (Headmaster/Assessor) and Subjects (Teachers).
- **Enforcement:** The router must never allow a user with the `TEACHER` role to mount `SupervisionAcademicView`.
- **Implementation:** The entry point logic must forcefully branch:
  ```tsx
  {currentView === 'supervisiAkademik' && userRole === 'TEACHER' && <SupervisionTeacherView />}
  {currentView === 'supervisiAkademik' && userRole !== 'TEACHER' && <SupervisionAcademicView />}
  ```
- **Result:** Teachers physically cannot access the Program Wizard, Executive Dashboard, or Publishing mechanisms because those React components are never rendered into the Virtual DOM for their role.

### 2. The Assessment Integrity Boundary
During an active observation, the integrity of the evaluation data must be preserved.
- **Enforcement:** `OPERATOR` and `TEACHER` roles must be strictly barred from mounting the `SupervisionObservationSession` and `SupervisionPostObservationSession` components.
- **Implementation:** 
  ```tsx
  <RoleGuard allowedRoles={['HEADMASTER', 'SUPERVISOR', 'ASSESSOR']}>
    <button onClick={startObservation}>Mulai Observasi</button>
  </RoleGuard>
  ```
- **Result:** Operators can see the schedule and print reports, but they cannot initiate or alter an active assessment. Teachers can only view the final published score.

### 3. The Cross-School Isolation Boundary
Supervisors (Pengawas) operate across multiple schools, whereas Headmasters and Teachers are bound to a single institution.
- **Enforcement:** Data fetching logic must enforce a strict `schoolId` boundary.
- **Implementation:** 
  - `HEADMASTER`, `TEACHER`, `OPERATOR`, `ASSESSOR`: Queries are strictly filtered by `schoolId === currentSession.schoolId`.
  - `SUPERVISOR`: Queries are filtered by a whitelist of assigned `schoolIds`.
- **Result:** A Headmaster can never view supervision data from a neighboring school.

### 4. API & State Tampering Prevention
Frontend RoleGuards only hide UI elements; they do not prevent a malicious user from dispatching state actions directly via browser dev tools.
- **Enforcement:** The `SupervisionReducer` and Backend Services (Firestore Rules / API Endpoints) must validate the user role on every mutation.
- **Implementation:** 
  - Firestore Security Rules must explicitly block `write` access to `supervision_programs` for the `TEACHER` role.
  - `updateScore` actions must verify that the `userId` matches the designated `assessorId` for that specific schedule.
- **Result:** Even if a Teacher forces the Observation UI to render by manipulating the DOM, the backend will reject any submitted scores with a `403 Forbidden` / `Missing or insufficient permissions` error.
