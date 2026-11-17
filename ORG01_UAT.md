# ORG-01 UAT

## Test Case 1: First Login Redirection
- **Action:** Approved user logs in for the first time without an Organization Profile.
- **Expected:** `OrganizationGuard` detects missing profile and redirects securely to `/workspace/setup`.

## Test Case 2: Multi-step Setup Wizard
- **Action:** User fills in the 4 steps of the wizard (School Profile, Leadership, Academic Profile, Identity) and clicks "Complete Setup".
- **Expected:** Service writes to Firestore `organizationProfiles` using the current user's `workspaceId`. Setup completes successfully and redirects to `/dashboard`.

## Test Case 3: Subsequent Logins
- **Action:** User with an existing Organization Profile logs in.
- **Expected:** `OrganizationGuard` detects the profile and bypasses the setup, directly routing the user to `/dashboard/*`.
