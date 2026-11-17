# AUTH01 Security Guidelines

## Authentication Strategy
- Registration requires Email Verification before a workspace approval can proceed.
- User identity is handled strictly by Firebase Auth.

## Firestore Hardening
Security rules (to be implemented via `firestore.rules`) will be bound to this schema using the following principles:

1. **Role Enforcement**: `users` records contain the `role` field. Updates to `role` or `status` are forbidden for standard users.
2. **Workspace Isolation**: Documents inside workspaces are protected by `schoolId`. `allow read, write: if resource.data.schoolId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.schoolId;`
3. **Approval Protections**: Only users with the `ADMIN` or `SUPER_ADMIN` role can update `workspaceRequests`.

## Service Integrity
- Approvals use `runTransaction` to guarantee no orphan states occur during workspace creation. If setting the workspace fails, the request state will rollback to `PENDING`.
