# SUPERVISION ARCHITECTURE ALIGNMENT
## TAMPUYAK OS (SINGLE SCHOOL WORKSPACE)

### 1. ARCHITECTURAL CORRECTION OVERVIEW
This document realigns the Supervision Module with the core architecture of Tampuyak OS. Tampuyak OS operates as a **Single School Workspace** (Administrative / Executive system). 

The previous assumption of a multi-tenant, multi-user portal with dedicated self-service Teacher accounts is incorrect. Teachers are **domain entities (supervision subjects)**, not active application users or administrators. All supervision operations are conducted centrally within the Headmaster/Administrative workspace.

### 2. REMOVED ASSUMPTIONS
To strictly adhere to the single-workspace architecture, the following paradigms are formally excised from the design:
- **No Teacher Login/Authentication:** Teachers do not have application accounts or credentials.
- **No Teacher Dashboard:** The `SupervisionTeacherView` component and any related self-service portals are obsolete.
- **No Teacher Routes/Navigation:** There is no sidebar or routing logic dedicated to routing a "logged-in teacher" to their personal tasks.
- **No Teacher-Driven Actions:** Teachers do not independently log in to upload modules, submit reflections, or update RTL progress.

### 3. REDESIGNED OWNERSHIP & RBAC MODEL
The Access Control Layer (`RoleGuard`, `PermissionGuard`, `OwnershipGuard`) applies **only to Administrative Users**:

- **System Roles:**
  - `HEADMASTER`: Supreme workspace owner. Full access to all plans, schedules, and evaluations.
  - `SUPERVISOR` / `ASSESSOR`: Delegated evaluators. They own specific scheduled observations. `<OwnershipGuard>` restricts them to modifying only the supervision cycles explicitly assigned to them.
  - `OPERATOR`: Administrative data entry. Read-only access or assistive data entry privileges, depending on exact matrix constraints.
- **The "Teacher" Role:**
  - `TEACHER` is completely removed from the `SupervisionRole` RBAC matrix.
  - Teachers are represented strictly as data payloads (e.g., `TeacherSnapshot`), acting as the *subject* of the `SupervisionSchedule`.

### 4. WORKFLOW REALIGNMENT (FACE-TO-FACE / ADMINISTRATIVE ENTRY)
Since teachers cannot log in to perform tasks, the Supervision Lifecycle becomes a tool for Assessors/Headmasters to record the outcomes of face-to-face or offline interactions:

1. **Pra-Observasi (Pre-Observation):**
   - *Old Model:* Teacher logs in to upload the Teaching Module and write a reflection.
   - *Aligned Model:* During the pre-observation meeting, the **Assessor** logs into the system, records the teacher's reflection, and attaches the link/document for the Teaching Module provided by the teacher.
2. **Observasi Kelas (Observation):**
   - Remains unchanged. The Assessor actively scores the instrument during the class session.
3. **Pasca-Observasi (Coaching):**
   - *Old Model:* Teacher logs in to respond to coaching feedback.
   - *Aligned Model:* During the post-observation meeting, the **Assessor** records the coaching notes, the agreed-upon feedback, and the teacher's verbal or written responses into the system.
4. **Rencana Tindak Lanjut (RTL):**
   - *Old Model:* Teacher manages a personal RTL Kanban/Dashboard.
   - *Aligned Model:* The **Headmaster or Assessor** tracks the RTL progress within the central dashboard, updating statuses as the teacher completes offline professional development milestones.

### 5. NEXT STEPS (IMPLEMENTATION IMPACT)
The following refactoring steps will be required in subsequent phases (Do not implement now):
- **Deprecate Components:** `SupervisionTeacherView.tsx` will be removed.
- **Refactor RTL:** `SupervisionTeacherRtlDashboard.tsx` will be repurposed as an Administrative RTL Tracking View for Headmasters/Assessors.
- **Update Guards:** Strip any `TEACHER` definitions from Auth Contexts and Permissions Matrices.
- **Adjust Actions:** Modify the Scheduling Engine and Session Views to allow the Assessor to input Pre-Observation and Coaching data on behalf of the teacher.
