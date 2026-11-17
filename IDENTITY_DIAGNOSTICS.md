# Identity Diagnostics

## Overview
As per the requirement to implement runtime diagnostics instead of manual UI testing, an **Identity Trace Log** and **Identity Health** panel have been successfully added to the system.

## Implementation Details

### 1. Identity Trace Service
- A new service (`src/services/admin/identityTraceService.ts`) has been created to record diagnostic traces.
- `PortalDashboardGuard` was updated to invoke the logger securely on each successful authentication step.
- Traces are securely recorded in the `identity_traces` Firestore collection.

### 2. Login Trace Execution
Each login is now traced step-by-step and recorded as `PASS` or `FAIL` (or `N/A`), capturing:
1. Firebase Authentication
2. Firestore profile read
3. Role resolution
4. Status resolution
5. Workspace lookup
6. Organization lookup
7. Final route

### 3. Identity Health Panel (OWNER QA)
- The Control Center (`src/control/ControlCenter.tsx`) now features an enhanced **Identity Health** diagnostic tab.
- This tab is strictly available only to the `OWNER`.
- It dynamically fetches the latest Identity Traces and displays them in a QA log format.
- It displays the current OWNER's active diagnostic state:
  - Current User UID
  - Firebase Auth status
  - Firestore profile status
  - Role & Status
  - Workspace ID
  - Organization ID
  - Session Validity
  - Current Route

## Conclusion
The identity system is now observable, providing concrete step-by-step verification logic at runtime for QA verification.
