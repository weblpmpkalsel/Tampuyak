# PORTAL-01 Routing Architecture

## Public Routes
These routes do not require authentication and are accessible to anyone on the internet.
- `/` - **Landing Page**: Main marketing and informational portal.
- `/login` - **Login Page**: Portal entry for existing users.
- `/register` - **Registration Page**: Institution onboarding form.
- `/forgot-password` - **Password Reset**: Self-service recovery flow.

## Interstitial Routes
These routes are displayed when an authenticated user does not have an active or approved profile status.
- `/pending` - Displayed to users whose `status === 'PENDING'`. They are awaiting workspace approval.
- `/rejected` - Displayed to users whose `status === 'REJECTED'`.
- `/unauthorized` - Catch-all for `DISABLED` users or users attempting to access secure resources without proper authorization context.

## Protected Routes
- `/dashboard/*` - The core TAMPUYAK OS enterprise application. This route is guarded by `PortalDashboardGuard`. Only users with a synced profile and `status === 'ACTIVE'` may enter. The core application handles its internal routing based on the roles stored in the `PermissionService` cache.
