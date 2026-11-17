# BOOTSTRAP-OWNER RC1

## Objective
Implemented permanent OWNER bootstrap replacing email-based ownership with Firebase UID ownership.

## Changes Made
1. **User Profile Extension:**
   - Added `approvalBypass?: boolean` to `UserProfile` interface in `userService.ts`.
2. **Owner Bootstrap Logic (userService.ts):**
   - Modified `UserService.syncUser` to fetch the `system/platform` document upon login.
   - If `system.ownerUid` does not exist and the authenticated email is `kkg1jaro@gmail.com`, the user's Firebase UID is permanently stored in `system/platform` as the `ownerUid` along with `bootstrappedAt: serverTimestamp()`.
   - The user is assigned the `OWNER` role, `ACTIVE` status, `workspaceId: 'SYSTEM'`, and `approvalBypass: true`.
3. **Owner Validation (userService.ts):**
   - On subsequent logins, `UserService.syncUser` compares `currentUser.uid` with `system.ownerUid` loaded from `system/platform`.
   - If they match, it ensures the user retains `OWNER`, `ACTIVE`, `SYSTEM` workspace, and `approvalBypass`.
   - If they don't match, normal RBAC applies.
   - If a non-owner somehow has the `OWNER` role (e.g. from a past state), they are demoted to `VIEWER`.
4. **Ownership Transfer (adminService.ts):**
   - Modified `AdminService.transferOwnership` to update the `system/platform` document, replacing the `ownerUid` and `ownerEmail` with the new owner's details, alongside `transferredAt: serverTimestamp()`.
   - The current owner is gracefully demoted to `SUPER_ADMIN` with `approvalBypass: false`, while the new owner is promoted to `OWNER` with `approvalBypass: true`.

## Status
IMPLEMENTATION COMPLETE
