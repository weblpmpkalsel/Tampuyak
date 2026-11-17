# OWNER UID ARCHITECTURE

## Core Philosophy
Ownership in the platform is now strictly cryptographically bound to the Firebase UID, resolving vulnerabilities associated with email changes or arbitrary email-based role assumptions.

## Data Structure
The platform owner is registered persistently within Firestore:
**Collection:** `system`
**Document:** `platform`

```json
{
  "ownerUid": "string",
  "ownerEmail": "string",
  "bootstrappedAt": "timestamp",
  "transferredAt": "timestamp (optional)"
}
```

## Security Constraints
1. **Immutable by Default:** The `ownerUid` cannot be removed once set. It can only be transferred by the current `OWNER`.
2. **Self-Preservation:** The `OWNER` cannot suspend, delete, or reject themselves, as enforced in `AdminService`.
3. **UID Dominance:** Only a matching `uid` guarantees `OWNER` privileges. Even if a user's email matches the historical `ownerEmail`, without the matching `uid`, they are subjected to standard RBAC.
4. **Resilience to Credential Changes:** If the `OWNER` changes their email address or resets their password, their `uid` remains constant, preserving their ownership seamlessly.

## Workflow Execution
- **Login Event:** `PortalDashboardGuard` triggers `UserService.syncUser`.
- **System Check:** `syncUser` queries `system/platform`.
- **Validation:** Compares `user.uid` against `system.ownerUid`.
- **Enforcement:** Unmatched accounts holding `OWNER` roles are forcibly demoted to `VIEWER` to maintain single-owner integrity.
