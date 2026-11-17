# ENTERPRISE ACCESS CONTROL ARCHITECTURE
## SUPERVISION MODULE

### 1. Architectural Overview
The Academic Supervision module handles highly sensitive educational data, including teacher evaluations, performance metrics, and compliance instruments. The Access Control Architecture is designed around a strictly enforced **Role-Based Access Control (RBAC)** model, ensuring zero data leakage or unauthorized administrative actions across user hierarchies.

### 2. Entry Point Protection (Root Guarding)
The primary entry point (`SupervisionAcademicView`) must be shielded by an overarching `RoleGuard`.
- **Current Vulnerability:** Missing root guard.
- **Proposed Architecture:** 
  The Sidebar navigation button and the router mount point must dynamically resolve the target component based on the authenticated user's role.
  - If `Role === 'TEACHER'`, load `SupervisionTeacherView` (Teacher Dashboard).
  - If `Role === 'HEADMASTER' | 'OPERATOR' | 'SUPERVISOR' | 'ASSESSOR'`, load `SupervisionAcademicView` (Administrative Dashboard).

### 3. Component-Level Authorization
For users within the Administrative Dashboard, granular `<RoleGuard>` wrappers must be applied to individual UI regions and action buttons:
- **Floating Buttons / Primary Actions:** The "Buat Program Supervisi" (Program Wizard) button must be restricted to `HEADMASTER` and `SUPERVISOR`.
- **Tab/View Routing:** Modules like `SupervisionPublishingView` must be restricted to `HEADMASTER` and `SUPERVISOR`.

### 4. Data Fetching Boundary (Client-Side)
The state selectors in `SupervisionSelectors.ts` must be extended to inherently filter data based on the user's role context:
- Teachers must only receive `Schedules` where `teacherId === currentUser.id`.
- Operators receive all schedules but UI mutations (Start Observation) are disabled.

### 5. Architectural Enforcement Strategy
1. **Navigation Layer:** Implement conditional rendering in `src/Tampuyak.tsx` to mount role-specific entry points.
2. **View Layer:** Wrap administrative action triggers (Create, Edit, Publish, Delete) in `<RoleGuard allowedRoles={['HEADMASTER', 'SUPERVISOR']}>`.
3. **API/Service Layer:** Pass the user's role token to backend services to ensure malicious manual API calls are rejected.
