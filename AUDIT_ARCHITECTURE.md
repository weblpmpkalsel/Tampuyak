# Audit Architecture

## Overview
The platform requires an unalterable trail of administrative actions for compliance and debugging. However, to respect Firebase cost policies and boundaries, business data is excluded.

## Collection: `auditLogs`

### Schema
- `timestamp`: serverTimestamp
- `actorUid`: string (User performing the action)
- `actorRole`: string (Role at the time of the action)
- `action`: enum (APPROVE_REQUEST, REJECT_REQUEST, SUSPEND_USER, ACTIVATE_USER, PROMOTE_ROLE, DEMOTE_ROLE, OWNER_TRANSFER)
- `targetId`: string (UID of the target user or Request ID)
- `metadata`: map (Optional payload, e.g., `{ newRole: 'ADMIN' }`)

### Design Constraints
1. **Administrative Only**: Only structural changes (role changes, suspensions, approvals) are logged.
2. **Immutable**: Security rules strictly deny `update` and `delete` operations on this collection.
3. **No Business Logic**: Actions like "Created RKJM" or "Edited KSP" are NOT tracked in Firestore.
