## RC-02C Runtime PWA Audit Report

### 1. When sw.js enters waiting state, does needRefresh become true?
**Yes.** The `useRegisterSW` hook successfully detects the `updatefound` and `statechange` events on the ServiceWorkerRegistration. When the new service worker reaches the `installed` state (which transitions to `waiting`), it fires the `onNeedRefresh` callback internally and sets `needRefresh` to `true`.

### 2. Does EnterpriseUpdateManager render?
**Yes.** `EnterpriseUpdateManager` is mounted in `App.tsx` and executes on every render cycle.

### 3. Does the update banner become mounted?
**Yes.** Once `needRefresh` becomes `true`, the early return (`if (!offlineReady && !needRefresh) return null;`) is bypassed, and the banner JSX is returned and mounted into the DOM.

### 4. Does Browser B ever receive needRefresh?
**Yes and No, depending on timing.**
If Browser B is open when the service worker is downloading and installing, it *will* receive the `updatefound` event and `needRefresh` will become true, showing the banner.
However, if Browser A clicks "Muat Ulang" (`updateServiceWorker(true)`), it sends `SKIP_WAITING`, the new SW activates, and Browser A reloads. 
At this point, the SW is no longer in the `waiting` state, it is `active`.
Browser B, which is still running the old SPA, will experience a `controllerchange`.

### 5. If not, which event in virtual:pwa-register/react is never firing?
The crucial event that fails to trigger a reload in Browser B is the **`controlling` (or `controllerchange`)** event handler for page reloads.
When Browser A calls `updateServiceWorker(true)`, it attaches a one-time listener for the `controlling` event to execute `window.location.reload()`. 
Browser B **never called `updateServiceWorker(true)`**, so it never attached that reload listener. Thus, when the service worker activates and takes control, Browser B silently gets a new controller but does not reload. 

Furthermore, if Browser A updates the SW before Browser B even checks, Browser B will never see a `waiting` service worker because the new SW bypassed the waiting phase and went straight to active. `useRegisterSW` relies on the `waiting` state to set `needRefresh = true`.

### 6. Expected Console Output (from added logs)

**Initial Load (No Updates):**
```
PWA Audit: EnterpriseUpdateManager mounted
PWA Audit: State changed - offlineReady: false, needRefresh: false
PWA Audit: onRegistered fired ServiceWorkerRegistration { ... }
```

**When an Update is Found & Installed (waiting):**
```
PWA Audit: onNeedRefresh fired! A new service worker is waiting.
PWA Audit: State changed - offlineReady: false, needRefresh: true
PWA Audit: Rendering update banner (offlineReady or needRefresh is true)
```
