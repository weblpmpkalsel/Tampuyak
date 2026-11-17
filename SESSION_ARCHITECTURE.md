# Session Architecture

## Overview
The Session Management layer sits directly above Firebase Auth to provide fine-grained, app-level session control. 

## Device Registry (`deviceSessions` collection)
Every successful login provisions a session document.

**Schema:**
- `sessionId`: string (Format: `{uid}_{deviceId}_{timestamp}`)
- `uid`: string (User's ID)
- `deviceId`: string
- `browser`: string
- `platform`: string
- `lastLogin`: Timestamp
- `lastSeen`: Timestamp
- `isActive`: boolean

## Features
- **Session Revocation**: System administrators or the user themselves can revoke a specific session (by setting `isActive = false`). This acts as an immediate force logout.
- **Role Refresh Mechanism**: If a user's role is modified or suspended while they are actively logged in, the `SessionManager` intercepts the backend change or the expired Permission Cache forces a re-read, catching the `DISABLED` status.
- **Heartbeat (Last Seen)**: The app can occasionally update the `lastSeen` timestamp via `SessionService.updateLastSeen()` to track active users.

## Login Sequence
1. User logs in via `AuthService.login`.
2. App verifies `user.emailVerified`.
3. App retrieves/syncs profile via `UserService.syncUser`.
4. App creates session in `deviceSessions`.
5. Profile sets memory cache in `PermissionService`.
6. React Router redirects user to `/dashboard`.
