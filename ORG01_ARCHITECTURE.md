# ORG-01 ARCHITECTURE

## Organization Engine

**Role:** 
The Single Source of Truth for workspace identity and configuration. Every future module (RKJM, RKT, RKAS, KSP) depends on this baseline data.

## Component Stack
1. **Model (`OrganizationProfile.ts`)**: 
   A strict TypeScript interface representing the current shape of the organization.
2. **Service (`OrganizationService.ts`)**:
   - Handles Firestore persistence in the `organizationProfiles` collection.
   - Tied directly to a 1:1 relationship with `workspaceId`.
   - Stores versioning and timestamp metadata alongside user-provided fields.
3. **UI Engine (`OrganizationSetup.tsx`)**:
   - React functional component mapping step-by-step metadata entry.
   - Operates securely under the `PortalDashboardGuard` meaning it requires active authentication and approval.
4. **Guard (`OrganizationGuard.tsx`)**:
   - High-order component sitting inside the portal guard.
   - Evaluates if the authenticated and approved user's workspace contains an initialized profile.
   - Exerts strict redirects keeping users blocked from the main dashboard until setup completes.

## Security & Access
- The setup wizard and guard are strictly isolated from RBAC / Authentication flows ensuring pure separation of concerns.
