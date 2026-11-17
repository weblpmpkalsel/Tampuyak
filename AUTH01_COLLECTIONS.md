# AUTH01 Collections Schema

## `users`
Represents an individual platform user profile linked to Firebase Auth UID.
- `uid`: string (Primary Key)
- `email`: string
- `displayName`: string
- `role`: enum ('SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'HEADMASTER', 'TEACHER', 'VIEWER')
- `schoolId`: string | null (Foreign Key to `schools`)
- `status`: enum ('PENDING', 'ACTIVE', 'REJECTED', 'DISABLED')
- `createdAt`: number (Unix Timestamp)

## `schools`
Represents an enterprise entity or institution.
- `schoolId`: string (Primary Key)
- `schoolName`: string
- `npsn`: string
- `principal`: string
- `province`: string
- `district`: string
- `status`: enum ('ACTIVE', 'INACTIVE')
- `createdAt`: number (Unix Timestamp)

## `workspaceRequests`
Represents a workflow ticket requesting provisioning of a school workspace.
- `requestId`: string (Primary Key)
- `schoolId`: string
- `requestedBy`: string (Foreign Key to `users.uid`)
- `status`: enum ('PENDING', 'APPROVED', 'REJECTED')
- `submittedAt`: number (Unix Timestamp)

## `workspaces`
Represents the provisioned enterprise tenant space for an active school.
- `workspaceId`: string (Primary Key)
- `schoolId`: string (Foreign Key to `schools`)
- `status`: enum ('ACTIVE', 'ARCHIVED', 'DISABLED')
- `createdAt`: number (Unix Timestamp)
