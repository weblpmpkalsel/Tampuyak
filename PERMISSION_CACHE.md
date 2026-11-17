# Permission Cache

## The Problem
Validating roles across numerous UI components (`RoleGuard`, `PermissionGuard`, `WorkspaceGuard`) could potentially result in an excessive number of redundant reads to the `users` Firestore collection. 

## The Solution
`PermissionService` provides an in-memory caching mechanism.

### Mechanics
- **Initialization**: Upon successful login and profile retrieval, `PermissionService.setCache(profile)` stores the user's role and statically maps it to an array of string permissions (e.g., `['manage_users', 'access_own_school']`).
- **TTL**: The cache has a Time-To-Live (TTL) of 5 minutes. 
- **Retrieval**: Guards call `PermissionService.getCache()`. If the cache is valid, no network request is made. If expired, the application must re-fetch the `UserProfile` from Firestore, automatically catching any role demotions or account suspensions that occurred in the last 5 minutes.

## Permissions Map
- `OWNER` / `SUPER_ADMIN` ➔ `manage_users`, `manage_workspaces`, `view_audit`, `access_all_schools`
- `ADMIN` ➔ `manage_users`, `manage_workspaces`, `access_all_schools`
- `OPERATOR` / `HEADMASTER` / `TEACHER` ➔ `access_own_school`
- `VIEWER` ➔ `view_only`
