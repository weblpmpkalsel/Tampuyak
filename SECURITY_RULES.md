# Firestore Security Rules Architecture

Below is the theoretical layout for the `firestore.rules` configuration that maps to our enterprise requirements.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isOwner() {
      return getUserData().role == 'OWNER';
    }
    
    function isSuperAdmin() {
      return getUserData().role == 'SUPER_ADMIN';
    }

    function isAdmin() {
      return getUserData().role == 'ADMIN' || isSuperAdmin() || isOwner();
    }

    match /users/{uid} {
      // Users can read their own profile, Owners/Admins can read all
      allow read: if request.auth.uid == uid || isAdmin();
      // Only Owner/SuperAdmin can write/update roles
      allow write: if isOwner() || isSuperAdmin();
    }

    match /schools/{schoolId} {
      allow read: if request.auth != null;
      allow write: if isOwner() || isSuperAdmin();
    }

    match /workspaceRequests/{requestId} {
      allow read: if request.auth.uid == resource.data.requestedBy || isAdmin();
      // Only Admins can modify requests (Approvals)
      allow write: if request.auth.uid == request.resource.data.requestedBy || isAdmin();
    }

    match /workspaces/{workspaceId} {
      // Only users belonging to the school can read the workspace
      allow read: if request.auth != null && getUserData().schoolId == resource.data.schoolId;
      allow write: if isAdmin();
    }

    match /auditLogs/{logId} {
      // Audit logs are read-only for high level admins
      allow read: if isOwner() || isSuperAdmin();
      // Only system backend/services can create audit logs
      allow create: if isAdmin();
      allow update, delete: if false; // Immutable
    }
  }
}
```

## Guiding Principles
- **Deny by Default**: Any collection not explicitly matched is inaccessible.
- **Immutable Audit**: The `auditLogs` collection cannot be updated or deleted.
- **Tenant Isolation**: Workspace reads are strictly tied to the `schoolId` present in the user's secure profile.
