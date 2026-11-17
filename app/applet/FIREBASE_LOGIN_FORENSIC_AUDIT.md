# Enterprise Forensic Audit: Firebase Login Failure

## 1. Executive Summary

**ROOT CAUSE:** The application is attempting to authenticate against Firebase using placeholder credentials (`remixed-api-key`) instead of the actual production API key. This occurs because the Vite build process resolves `import.meta.env.VITE_FIREBASE_API_KEY` to `undefined` during compilation when environment variables are not injected into the build environment, forcing the application to rely on a hardcoded fallback configuration.

**Risk Level:** CRITICAL (Complete authentication failure in production; total block on user access).

---

## 2. Investigation Details

### Firebase Initialization Files
- **Primary Initialization File:** `src/lib/firebase.ts`
- **Fallback Configuration File:** `firebase-applet-config.json`

### `firebaseConfig` Verification
The configuration is dynamically constructed in `src/lib/firebase.ts` using the logical OR (`||`) operator:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId
};
```

### The Origin of `remixed-api-key`
Searching the repository reveals that `remixed-api-key` is defined inside `firebase-applet-config.json`:
```json
{
  "projectId": "remixed-project-id",
  "appId": "remixed-app-id",
  "apiKey": "remixed-api-key",
  ...
}
```
**Why it exists:** This file acts as a structural placeholder, likely generated when the repository was remixed or cloned from a template to prevent committing real production secrets to version control.

### Vite Environment Loading & Netlify Compatibility
Vite packages Single Page Applications (SPAs) into static files.
- `import.meta.env.*` variables are evaluated and statically replaced **at build time** (during `vite build`).
- If a CI/CD platform (like Netlify, Vercel, or a Docker build process) executes `npm run build` without the `VITE_FIREBASE_*` variables present in the build environment, Vite replaces them with `undefined`.
- The browser cannot read server-side environment variables at runtime. Consequently, the compiled JavaScript executes `undefined || defaultFirebaseConfig.apiKey`, which resolves to `"remixed-api-key"`.

### Authentication Initialization & Login Flow
1. **Login Action:** User submits form in the UI.
2. **Auth Service:** Calls `AuthService.login(email, password)` in `src/services/auth/authService.ts`.
3. **Firebase SDK:** Invokes `signInWithEmailAndPassword(auth, email, password)`.
4. **Initialization:** The `auth` object is exported from `src/lib/firebase.ts`, where it was created using `initializeApp(firebaseConfig)`.
5. **Network Request:** The Firebase SDK makes a POST request to `identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=remixed-api-key`. Because the API key is invalid, Google Identity Toolkit rejects it with an **HTTP 400 Bad Request**.

*Note: The Firebase Local Emulator (`connectAuthEmulator`) is not present in the codebase, ruling out emulator misdirection.*

---

## 3. Conclusion & Recommended Fix

The architecture relies on static environment variable injection. The production build pipeline is starved of the required Firebase environment variables.

### Recommended Fix
1. **Provide Build-Time Variables:** The immediate fix is to ensure that `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc., are explicitly defined in the deployment platform's (e.g., Netlify) environment variable settings **before** triggering the build.
2. **Remove Fallback for Production:** The fallback to `defaultFirebaseConfig` masks the configuration error. In a production environment, missing API keys should throw a clear `Error` during initialization rather than silently defaulting to a dummy key that causes obscure HTTP 400s during user interactions.

### Affected Files
- **Must be modified:** deployment platform settings (Netlify/Vercel/Docker environment variables).
- **Optional Architectural Fix:** `src/lib/firebase.ts` (to throw an error if config is missing rather than using placeholders).
- **Files that MUST NOT be modified:** `firebase-applet-config.json` (this should remain a safe dummy placeholder to prevent secret leakage in version control).
