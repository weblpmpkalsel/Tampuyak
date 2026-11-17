# SUPER_ADMIN BOOTSTRAP

## Status
PASS

## Details
- Email: `denidemian83@gmail.com`
- Role: `SUPER_ADMIN`
- Status: `ACTIVE`
- Workspace ID: `SYSTEM`
- Approval Bypass: `true`

The SUPER_ADMIN is fully bootstrapped and assigned dynamically on first login via `UserService.syncUser`. The user is immediately granted access to the `/control` dashboard, bypassing any school registration or workspace approval steps.

The `SUPER_ADMIN` has full access to the Control Center to manage users, schools, workspaces, registrations, and audit logs. However, the `SUPER_ADMIN` is prevented from modifying the `OWNER`.
