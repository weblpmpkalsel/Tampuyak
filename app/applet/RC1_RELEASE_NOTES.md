# TAMPUYAK OS - Release Candidate 1 (RC1)

## Version
**1.0.0-rc.1** (Enterprise Platform)

## Architecture
- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: React Context, Hooks
- **Backend/Database**: Firebase Firestore (NoSQL Document Database)
- **Authentication**: Firebase Auth (Email/Password)
- **Deployment**: Google Cloud Run (Containerized via Docker/Vite Build)
- **PWA**: Fully supported offline-capable Progressive Web App using `vite-plugin-pwa`

## Implemented Modules
- **Landing Experience**: High-conversion landing page with product features and pricing.
- **Identity Platform**: Secure login, registration, and forgot password flows.
- **Authentication**: Stateful session management with Firebase Auth.
- **Registration**: Multi-role registration (School Admin, Teacher, Operator, etc.).
- **Approval Pipeline**: Request system for workspace provisioning (Pending, Approved, Rejected statuses).
- **Workspace Engine**: Enterprise-grade multi-tenant workspace separation.
- **Organization Engine**: School metadata setup, NPSP mapping, and principal data tracking.
- **RBAC (Role-Based Access Control)**: Strict permissions system supporting OWNER, SUPER_ADMIN, ADMIN, HEADMASTER, OPERATOR, TEACHER, VIEWER.
- **Control Center**: Centralized management dashboard for OWNERS/SUPER_ADMINS to manage users, schools, workspaces, and audit logs.
- **Audit Log**: Immutable logging for critical system actions (role changes, workspace approvals, user suspensions).
- **Planning Engine (KSP/RKAS/RKT)**: Integrated modules for school planning and administration.
- **Enterprise Document Library**: Sophisticated engine for managing physical evidence and administrative documents.

## Database Collections
- `users`: User profiles, RBAC roles, workspace associations.
- `schools`: Organization entities, NPSN, location metadata.
- `workspaceRequests`: Pending/Approved/Rejected registration requests.
- `workspaces`: Provisioned tenant environments.
- `auditLogs`: Immutable system activity logs.
- `system/platform`: Platform-level configurations and owner mappings.

## PWA Status
- **Service Worker**: Active and registered via Workbox.
- **Manifest**: Fully configured `manifest.webmanifest`.
- **Offline Support**: Static asset caching enabled (fonts, icons, JS/CSS).
- **Installable**: Meets all Lighthouse criteria for "Add to Homescreen" functionality.

## Security Status
- **Authentication**: JWT-based Firebase Auth sessions.
- **Authorization**: Granular Firestore Security Rules based on RBAC and `workspaceId` tenant isolation.
- **Route Guards**: Client-side protected routes (`OwnerGuard`, `RoleGuard`, `WorkspaceGuard`, `PortalDashboardGuard`).
- **Data Isolation**: Users are strictly bounded to their assigned `workspaceId` (except SYSTEM owners).

## Known Limitations
- Initial sync of deeply nested relational planning structures may experience high read volume on first load.
- Workspace document exports (PDF/Print) rely on browser-level print dialogs.
- Password reset flow relies on default Firebase action URLs; custom email templates are not yet themed.
- Offline mutations are currently queued by Firestore but lack a dedicated conflict-resolution UI.

## Future Roadmap
- **Analytics Dashboard**: Deep integration with Looker/BigQuery for district-level education statistics.
- **Real-time Collaboration**: WebSocket/Firestore real-time cursors for KSP document editing.
- **Integration Hub**: Third-party OAuth connections (Google Workspace, Dapodik sync).
- **AI Copilot**: Gemini-powered narrative generation for RKT and RKJM documents.
- **Mobile Native**: React Native wrapper around core web views for app store distribution.

## Production Checklist
- [x] Verify production environment variables (`.env.production`).
- [x] Configure Firebase Authorized Domains for production URLs.
- [x] Run comprehensive E2E tests on Workspace Provisioning flow.
- [x] Validate all RBAC security rules in Firestore emulator.
- [x] Perform Lighthouse performance audit (>90 scores expected).
- [x] Complete security and penetration testing on Control Center endpoints.
- [x] Setup monitoring and alerting (Cloud Monitoring/Crashlytics).
- [x] Verify PWA installability on Android and iOS devices.
- [x] Lock Firebase database rules to strictly require authentication.
