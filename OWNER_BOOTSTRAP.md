# OWNER BOOTSTRAP

## Status
PASS

## Details
- Email: `kkg1jaro@gmail.com`
- Role: `OWNER`
- Status: `ACTIVE`
- Workspace ID: `SYSTEM`
- Approval Bypass: `true`

The OWNER is fully bootstrapped and assigned dynamically on first login via `UserService.syncUser`. The user is immediately granted access to the `/control` dashboard, bypassing any school registration or workspace approval steps.

The `OWNER` cannot be suspended, role-changed, or removed by any other user, including `SUPER_ADMIN`.
