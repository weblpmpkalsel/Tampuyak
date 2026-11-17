## PWA Update Lifecycle Audit Report

1. **Is `registerType` currently prompt?**
   **Yes**. In `vite.config.ts`, `VitePWA` is configured with `registerType: 'prompt'`.

2. **Is `EnterpriseUpdateManager` actually imported and rendered?**
   **Yes**. It is imported and rendered at the root level in `src/App.tsx` (placed just before closing `</BrowserRouter>`).

3. **Is `useRegisterSW()` reachable?**
   **Yes**. It is called successfully inside the `EnterpriseUpdateManager` component.

4. **Is `updateServiceWorker(true)` wired to the reload button?**
   **Yes**. The "Muat Ulang" button has `onClick={() => updateServiceWorker(true)}`.

5. **Does `vite-plugin-pwa` generate a waiting Service Worker?**
   **Yes**. Because `registerType: 'prompt'` is used and `skipWaiting` is not forced to true, the new Service Worker will install and then pause in the `waiting` state until triggered by the user.

6. **Is `cleanupOutdatedCaches` present?**
   **Yes**. `cleanupOutdatedCaches: true` is explicitly configured in the `workbox` configuration in `vite.config.ts`.

7. **Is `clientsClaim` or `skipWaiting` overriding the prompt strategy?**
   **No**. Neither `clientsClaim` nor `skipWaiting` are set in the `workbox` config. They retain their default behavior, properly respecting the prompt strategy.

8. **Explain why Browser A updates but Browser B remains on the previous version.**
   When Browser A clicks the "Muat Ulang" button, `updateServiceWorker(true)` sends a `SKIP_WAITING` message to the waiting Service Worker. The Service Worker activates and Browser A immediately hard-reloads (due to the `true` argument) to fetch the new assets.
   Browser B (representing another open tab/instance), however, is already running the SPA in memory. Even though the new Service Worker is now active globally for that origin, Browser B will not spontaneously reload itself. It will continue running the older version of the code in its current execution context until the user manually refreshes Browser B.
