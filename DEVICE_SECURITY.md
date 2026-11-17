# Device Security

## Purpose
Tracking user devices improves security auditing and allows users or admins to terminate compromised sessions.

## Lightweight Data Collection
The `SessionService` collects minimal metadata:
- `browser`: (e.g., Chrome, Firefox)
- `platform`: (e.g., Windows, macOS)
- `deviceId`: A stable local identifier generated per-client device

**Policy**: No IP addresses, precise geolocation, or deeply sensitive PII are collected in the device registry.

## Admin Actions
Admins (OWNER, SUPER_ADMIN) have the authority to view active sessions in the system.
If a security breach occurs, admins can trigger `SessionService.logoutAllDevices(uid)` or target a specific session via `forceLogout`. 
When `isActive` is set to false in Firestore, the client-side session manager will automatically detect the invalidation and kick the user back to the `/login` portal.
