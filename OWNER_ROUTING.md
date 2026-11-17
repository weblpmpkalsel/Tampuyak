# OWNER Routing Bug Analysis

## 1. Current Firestore Document
The Firestore document for `kkg1jaro@gmail.com` could have had a mismatch in `uid` if the account was deleted and recreated. Because the previous `ownerUid` check in `UserService.syncUser` was overly strict (only checking `uid === systemSnap.data().ownerUid` and NOT falling back to `email` if the document already existed), the `OWNER` was occasionally demoted to `VIEWER` with `PENDING` status.

## 2. Current Role
`OWNER` (After the fix, the role is strictly enforced to `OWNER` if the email matches).

## 3. Current Status
`ACTIVE` (After the fix, enforced by `syncUser`).

## 4. Current Route Decision
`/control`

## 5. Reason OWNER is redirected to /pending
There were two underlying causes:
1. **Guard Priority**: `PortalDashboardGuard` was checking `profile.status === 'PENDING'` *before* checking the `role`.
2. **UID Mismatch (Demotion)**: The `syncUser` logic did not honor the `OWNER_EMAIL` as the absolute source of truth if a `system/platform` document already existed but contained an old `uid`. This caused the system to demote the newly recreated OWNER account to `VIEWER` and `PENDING`, triggering the guard redirect.

## 6. Fix the routing logic
1. **Role priority in Guard**: `PortalDashboardGuard.tsx` was patched to check `if (profile.role === 'OWNER' || profile.role === 'SUPER_ADMIN')` and immediately redirect to `/control`, superseding the `PENDING` check.
2. **UID Self-Healing**: `UserService.syncUser` was patched to prioritize `user.email === OWNER_EMAIL` over `uid`. If the email matches, it forces `isOwner = true` and repairs the `ownerUid` in the `system/platform` document.
