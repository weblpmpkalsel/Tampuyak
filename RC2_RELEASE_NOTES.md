## A. Modified files

- `src/components/EnterpriseUpdateManager.tsx` (Created)
- `src/App.tsx` (Modified)

## B. Unified diff

```diff
--- /dev/null
+++ b/src/components/EnterpriseUpdateManager.tsx
@@ -0,0 +1,63 @@
+import React from 'react';
+import { useRegisterSW } from 'virtual:pwa-register/react';
+import { RefreshCw, X } from 'lucide-react';
+
+export function EnterpriseUpdateManager() {
+  const {
+    offlineReady: [offlineReady, setOfflineReady],
+    needRefresh: [needRefresh, setNeedRefresh],
+    updateServiceWorker,
+  } = useRegisterSW({
+    onRegistered(r) {
+      // SW Registered
+    },
+    onRegisterError(error) {
+      console.error('SW registration error', error);
+    },
+  });
+
+  const close = () => {
+    setOfflineReady(false);
+    setNeedRefresh(false);
+  };
+
+  if (!offlineReady && !needRefresh) {
+    return null;
+  }
+
+  return (
+    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
+      <div className="p-4">
+        <div className="flex items-start">
+          <div className="flex-shrink-0">
+            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
+              <span className="text-xl">🚀</span>
+            </div>
+          </div>
+          <div className="ml-3 w-0 flex-1 pt-0.5">
+            <p className="text-sm font-medium text-slate-900">
+              TAMPUYAK OS Enterprise
+            </p>
+            <p className="mt-1 text-sm text-slate-500">
+              {offlineReady
+                ? 'Offline Ready'
+                : 'Versi terbaru tersedia.'}
+            </p>
+            {needRefresh && (
+              <div className="mt-3 flex space-x-3">
+                <button
+                  onClick={() => updateServiceWorker(true)}
+                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
+                >
+                  <RefreshCw className="w-4 h-4 mr-2" />
+                  Muat Ulang
+                </button>
+              </div>
+            )}
+          </div>
+          <div className="ml-4 flex-shrink-0 flex">
+            <button
+              onClick={close}
+              className="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
+            >
+              <span className="sr-only">Tutup</span>
+              <X className="h-5 w-5" />
+            </button>
+          </div>
+        </div>
+      </div>
+    </div>
+  );
+}

--- a/src/App.tsx
+++ b/src/App.tsx
@@ -1,3 +1,4 @@
+import { EnterpriseUpdateManager } from './components/EnterpriseUpdateManager';
 import OrganizationSetup from './workspace/OrganizationSetup';
 import OrganizationGuard from './workspace/OrganizationGuard';
 /**
@@ -49,6 +50,7 @@ export default function App() {
         } />
         
         <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
+      <EnterpriseUpdateManager />
     </BrowserRouter>
   );
 }
```

## C. Architecture explanation

The `EnterpriseUpdateManager` bridges the Service Worker lifecycle into the React rendering tree via `virtual:pwa-register/react`. It hooks into the `useRegisterSW` lifecycle to detect when `needRefresh` and `offlineReady` events are fired by Workbox.

By injecting the component inside `App.tsx` (specifically within the `<BrowserRouter>` but outside `<Routes>`), we ensure that it has access to the global React context while maintaining a stable, global DOM node independent of any specific route unmounting. This guarantees that the user will see the bottom-right update prompt ("Versi terbaru tersedia.") regardless of where they are in the application.

Clicking "Muat Ulang" executes `updateServiceWorker(true)`, forcing the new service worker to take control and immediately refresh the client so they get the new deployment without stale cache conflicts.

## D. Risk assessment

- **Low Risk:** The injection purely adds a non-blocking UI overlay. 
- **Zero Route Interruption:** It exists outside the routing configuration, ensuring it cannot break any business logic or routing guard.
- **Dependency Confidence:** The `virtual:pwa-register/react` module and `lucide-react` are natively supported and present in the Vite PWA ecosystem. 
- **Graceful Degradation:** If the Service Worker API is unavailable, the hooks gracefully fallback without breaking the SPA.

## E. Rollback procedure

To rollback RC-02:
1. Revert `src/App.tsx` by removing the `EnterpriseUpdateManager` import and its `<EnterpriseUpdateManager />` instantiation.
2. Delete the `src/components/EnterpriseUpdateManager.tsx` file.
3. Deploy the changes; the UI will seamlessly revert to standard invisible auto-update behavior.

## F. Enterprise UAT checklist

- [ ] Verify that a new deployment triggers the "Versi terbaru tersedia" toast on a client running a previous version.
- [ ] Confirm the toast appears fixed on the bottom-right and does not block interaction with the underlying UI.
- [ ] Verify clicking "Muat Ulang" gracefully reloads the page and loads the newest UI.
- [ ] Verify the "Offline Ready" state triggers upon caching completion for offline continuity.
