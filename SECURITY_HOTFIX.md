# RBAC Security Audit Pass

## Verification Points:
1. **OWNER Immutable**: `OWNER` user profiles are now rendered as a static `Platform Owner` badge instead of a `<select>` dropdown.
2. **Action Buttons Disabled**: Suspend, activate, and reset buttons are conditionally hidden for `OWNER`.
3. **Firestore Layer Defense**: `UserService.updateUserProfile` enforces strict role escalation validation `if (data.role === 'OWNER' && currentUserRole !== 'OWNER') throw new Error('ACCESS DENIED: Cannot promote to OWNER');`
4. **AdminService Layer**: Validates that only `OWNER` can modify, create, or demote `SUPER_ADMIN`.
5. **SUPER_ADMIN Constraints**: If a `SUPER_ADMIN` views another `SUPER_ADMIN` in the Control Center UI, the select dropdown and action buttons are disabled (read-only).

## Attack Simulation:
- **SUPER_ADMIN -> Promote User to OWNER**: REJECTED by `UserService.updateUserProfile`.
- **SUPER_ADMIN -> Delete/Suspend OWNER**: REJECTED by `AdminService.suspendUser` and UI hidden.
- **SUPER_ADMIN -> Demote SUPER_ADMIN**: REJECTED by `AdminService.changeUserRole` and UI disabled.
