# Role Matrix

| Action / Permission | OWNER | SUPER_ADMIN | ADMIN | OPERATOR | HEADMASTER | TEACHER | VIEWER |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Manage Self** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Audit Logs** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Approve Workspaces** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Suspend Users** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Promote to Admin** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Demote Super Admin** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Suspend Super Admin**| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Transfer Ownership** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Definitions
- **OWNER**: Absolute system administrator. Cannot be suspended or modified except by themselves. Defined via env `VITE_OWNER_EMAIL`.
- **SUPER_ADMIN**: High-level platform administrator. Can do almost everything the owner can, except modify the owner or other super admins.
- **ADMIN**: Can approve workspaces and manage standard users, but cannot view system-wide audit logs or promote others to Admin.
- **OPERATOR / HEADMASTER / TEACHER / VIEWER**: Tenant-level roles that operate within the boundaries of a specific `workspace` (`schoolId`).
