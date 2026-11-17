## A. Modified files

- `vite.config.ts` (Modified)

## B. Unified diff

```diff
--- a/vite.config.ts
+++ b/vite.config.ts
@@ -10,7 +10,7 @@
       react(), 
       tailwindcss(),
       VitePWA({
-        registerType: 'autoUpdate',
+        registerType: 'prompt',
         includeAssets: ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-256.png', 'icon-384.png', 'icon-512.png', 'maskable-icon-192.png', 'maskable-icon-512.png', 'maskable-icon.png', 'tampuyak-icon.png', 'robots.txt'],
         manifest: {
           name: 'TAMPUYAK OS',
```

## C. Technical explanation

By changing the VitePWA `registerType` from `autoUpdate` to `prompt`, we instruct the service worker to install the new version in the background, but to **wait** (skipWaiting is not called immediately) before taking control. This fires a `needRefresh` event via `virtual:pwa-register/react`, causing our `EnterpriseUpdateManager` to render the update toast. When the user clicks "Muat Ulang" on the toast, `updateServiceWorker(true)` is invoked, which sends the `SKIP_WAITING` message to the service worker, taking control and gracefully reloading the page to display the newly deployed application without cache conflicts.

## D. Risk assessment

- **Low Risk:** The core PWA configuration (runtime caching, file exclusions, maximum file sizes) is entirely unchanged. Only the update strategy has shifted from transparent background-swaps (which can cause mismatching UI assets in an SPA) to an explicit, user-coordinated reload. 
- **Graceful Fallback:** If the `virtual:pwa-register/react` module fails or is unsupported by the browser, the new service worker simply takes control on the next hard navigation (which resolves stale UI over time naturally).

## E. Enterprise UAT

- [ ] Verify that building and deploying a new version causes the browser of an active session to show the "Versi terbaru tersedia" toast.
- [ ] Confirm `updateServiceWorker(true)` successfully reloads the application and serves the new deployment.
- [ ] Verify `cleanupOutdatedCaches` continues to clear old caches to prevent disk usage bloating.
- [ ] Verify `navigateFallback` continues serving `index.html` on deep links offline.
- [ ] Confirm offline functionality (`offlineReady` toast appearing and offline caching working) is unbroken.
