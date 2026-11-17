# AUTH01 Architecture

## System Diagram
The identity system relies on Firebase Authentication linked symmetrically with a `users` Firestore collection.

### Identity Layer
- **Authentication**: Firebase Auth provides secure email+password and session management.
- **Profile Synchronization**: The `users` collection maintains rich metadata (roles, school linkages) decoupled from the strict Auth payload.

### Provisioning Layer
The Workspace Creation pipeline runs via an approval workflow.
- **Request Lifecycle**: Users submit requests for a school workspace. This creates a `workspaceRequests` record in `PENDING` state.
- **Admin Approval**: `SUPER_ADMIN` or `ADMIN` operators review requests.
- **Atomicity**: An approval uses a Firestore Transaction to:
  1. Set request to `APPROVED`
  2. Create a `workspaces` record
  3. Update `users` status to `ACTIVE`

## Role Based Access Control (RBAC)
Roles are statically defined to map enterprise boundaries:
- `SUPER_ADMIN`
- `ADMIN`
- `OPERATOR`
- `HEADMASTER`
- `TEACHER`
- `VIEWER`

## Services Abstraction
All Firebase SDK surface area is strictly encapsulated within `/src/services`. No React components directly interface with `firebase/firestore` or `firebase/auth`.
