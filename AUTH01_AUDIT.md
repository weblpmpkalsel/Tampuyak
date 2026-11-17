# AUTH-01 FINAL AUDIT

## 1. List every Firestore collection.
- `users`
- `schools`
- `workspaceRequests`
- `workspaces`

## 2. List every document written during: User Registration.
Based on the current service layer implementation:
- 0 documents in Firestore during `AuthService.register` (only Firebase Auth is used).
- If considering the full Phase 5 Registration flow: 
  - 1 document in `users` (via `UserService.createUserProfile`)
  - 1 document in `workspaceRequests` (via `WorkspaceService.submitWorkspaceRequest`)

## 3. List every document written during: Admin Approval.
During `WorkspaceService.approveWorkspaceRequest` (executed in a single transaction):
- 1 update to a document in `workspaceRequests`
- 1 creation of a document in `workspaces`
- 1 update to a document in `users`

## 4. Is Firestore storing anything besides: Users, Workspace Requests, Schools, Workspace Metadata
NO

## 5. Does Firestore store: RKJM, RKT, RKAS, KSP, Letters, Monitoring, Reports, Attachments, Generated Documents
NO

## 6. How many Firestore reads occur during Login?
- **0** during `AuthService.login` (handled entirely by Firebase Auth).
- **1** if the application fetches the user's role/profile post-login via `UserService.getUserProfile`.

## 7. How many Firestore writes occur during Registration?
- **0** during `AuthService.register`.
- **2** for the complete flow (1 for `users`, 1 for `workspaceRequests`).

## 8. How many writes occur during Approval?
- **3** writes (1 update, 1 create, 1 update), executed atomically inside a Firestore Transaction.

## 9. Can Super Admin promote another Super Admin?
NO. (There is currently no logic or function implemented for role promotion or management).

## 10. Can Super Admin modify OWNER?
NO. (The `OWNER` role does not exist in the defined `UserRole` schema, and no modification logic exists).

## 11. Is OWNER email configurable through ENV?
NO. (Not implemented in the environment variables or codebase).

## 12. Is Workspace creation idempotent?
YES. (The transaction verifies that the `workspaceRequests` document has a `PENDING` status before proceeding. If it is already approved, the transaction throws an error and aborts).

## 13. Does Workspace creation use Firestore Transaction?
YES. (Implemented using `runTransaction` in `WorkspaceService.approveWorkspaceRequest`).

## 14. Does any React component directly call Firebase SDK?
NO. (All Firebase SDK calls are encapsulated within the `src/services/` and `src/lib/` directories).

## 15. Estimated monthly Firestore cost for:
Assuming 1 login/day (1 profile read), 1 approval per school (3 writes), and no document storage:
- **100 Schools**: $0 (Well within the free tier of 50,000 reads/day and 20,000 writes/day).
- **1000 Schools**: $0 (Still well within the free tier).
- **10000 Schools**: $0 to < $1 (At ~10,000 reads/day, it is still within the 50,000 free reads/day tier. Even with slight spikes over the free tier, costs are extremely negligible at ~$0.036 per 100,000 additional reads).
