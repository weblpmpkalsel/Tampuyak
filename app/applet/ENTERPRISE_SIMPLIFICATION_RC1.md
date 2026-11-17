# Enterprise Simplification RC1

## Overview
The platform has been refactored to align with the core principle that Tampuyak is a School Governance Platform. Global roles have been simplified, and the registration, approval, and routing flows have been streamlined for production readiness.

## Deliverables

### 1. Updated RBAC
- **Global Roles**: Reduced to `OWNER`, `SUPER_ADMIN`, and `SCHOOL_ADMIN`.
- **Removed Roles**: `VIEWER`, `TEACHER`, `OPERATOR`, `STAFF` are no longer used in authentication or routing.

### 2. Updated Routing
- **Owner Access**: Retains exclusive access to `/control` for platform configuration and system settings.
- **Super Admin**: Approval panel is integrated into the main application. No separate admin site.
- **School Admin**: Represents one school and accesses the main workspace upon approval.

### 3. Updated Approval Flow
- Super Admin can access the "Registration Approval" panel from within the main application.
- Approving a request automatically sets the user status to `ACTIVE`, assigns a `workspaceId`, creates the organization profile if needed, and writes to the audit log. The role remains `SCHOOL_ADMIN`.

### 4. Updated Registration Flow
- Registration creates a Firebase Auth account and a Firestore profile with `status = PENDING`, `role = SCHOOL_ADMIN`, and `workspaceId = null`.
- Pending users are redirected to the Pending page.

### 5. Removal of Mandatory Email Verification
- Email verification checks have been removed from the login flow. Authentication now depends solely on Firebase Auth and the Firestore profile status (`ACTIVE`).

### 6. Migration Strategy
- Existing users with old roles (`VIEWER`, `TEACHER`, `OPERATOR`, `HEADMASTER`, `ADMIN`) are automatically migrated to `SCHOOL_ADMIN` upon their next login via the `UserService.syncUser` method.

### 7. Runtime Verification
- Code changes have been successfully compiled and built.
