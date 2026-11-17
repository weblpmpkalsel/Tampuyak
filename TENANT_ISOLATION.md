# Tenant Isolation

## Workspace Context Boundary
A core invariant of TAMPUYAK OS is that it is a multi-tenant platform serving multiple schools. Absolute isolation between tenants is required.

## The `WorkspaceGuard` component
At the UI level, `WorkspaceGuard` encapsulates tenant-specific views. 
It receives the requested `targetWorkspaceId` and the authenticated user's profile.

### Isolation Rules:
1. **Match**: If `userProfile.schoolId === targetWorkspaceId`, access is granted.
2. **Mismatch**: If they differ, access is denied (fallback rendered).
3. **Admin Override**: If the user possesses the `access_all_schools` permission (granted exclusively to `OWNER` and `SUPER_ADMIN`), the guard bypasses the mismatch and grants access.

## Service Layer Enforcement
While UI guards prevent accidental navigation, the true security boundary lies in the Service Layer and Firestore Rules.
- Every business service must receive the `workspaceId` (or `schoolId`) context to filter queries.
- `firestore.rules` enforces that users can only read `workspaces/{id}` where the `id` matches their own profile's `schoolId`.
- No cross-tenant data joins are permitted.
