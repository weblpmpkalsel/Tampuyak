# RC03C Enterprise Autosave Architecture Audit

## 1. Current Architecture
- **State Management:** Enterprise state is managed globally via React Context (`AppContext`) within `src/Tampuyak.tsx`. The central state object is `settings`, initialized with `DEFAULT_SETTINGS`.
- **Persistence Mechanism:** The primary automatic persistence is handled by a `useEffect` hook in `src/Tampuyak.tsx` that triggers a debounced `localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))` every 800ms when `settings` changes.
- **Heavy Data Handling:** During initialization, the app attempts to read heavy data using `idb-keyval` (`const heavyData = await get("tampuyak.heavy") || {};`), intended for large fields like `branding`, `visualIdentity`, and `documents`.

## 2. Root Cause of Autosave Failure
Enterprise data fails to restore after a browser restart/refresh because **data is not being saved successfully** in the first place.
- **QuotaExceededError:** `localStorage` has a strict ~5MB limit. When users upload Base64 images (e.g., School Logo, Government Logo, signatures) or generate large enterprise documents (KSP, RKJM, RKT), the `dataToSave` object quickly exceeds this limit.
- **Silent Save Abort:** When `localStorage.setItem` exceeds the 5MB quota, it throws a `DOMException` (QuotaExceededError). The `try/catch` block in the autosave `useEffect` swallows this error, logs "Failed to save", and updates the status to "error". **The save is completely aborted.**
- **Missing IndexedDB Implementation:** While the load logic attempts to read heavy data from IndexedDB (`idb-keyval`), **there is absolutely no `set("tampuyak.heavy", ...)` implementation in the codebase.** Heavy data is never actually written to IndexedDB. 

As a result, once the 5MB limit is reached, all subsequent user interactions are lost upon browser close.

## 3. Missing Persistence Points
- `idb-keyval` write logic (`set`) is completely missing for all heavy data or state objects.
- The autosave mechanism does not offload large Base64 images or document arrays from `localStorage`, leaving it vulnerable to quota exhaustion.

## 4. Modules That MUST Persist Automatically
The autosave system must guarantee persistence for:
- ✓ School Profile
- ✓ Identity
- ✓ KSP
- ✓ RKJM
- ✓ RKT
- ✓ RKAS
- ✓ Calendar
- ✓ Intrakurikuler
- ✓ Kurikulum
- ✓ Assessment
- ✓ Master Data
- ✓ Settings
- ✓ All Enterprise forms

## 5. Startup Restoration & Overwrite Analysis
- **Restoration:** State restoration occurs correctly during the `loadData()` initialization phase in `AppProvider`. However, because saving failed, the restored data is stale (representing the last state before the 5MB limit was hit) or entirely empty.
- **Overwrite:** Initialization does not overwrite successfully saved data. It merges `DEFAULT_SETTINGS` with the parsed data correctly.

## 6. Backup as the ONLY Permanent Mechanism
Because `localStorage` silently fails after 5MB, the "Backup JSON" feature currently serves as the **only** reliable persistence mechanism for heavy enterprise workloads, as it serializes the entire in-memory React state and exports it bypassing browser limits.

## 7. Recommended Implementation Strategy
**Migrate Primary Autosave to IndexedDB (`idb-keyval`)**
1. **Change Persistence Layer:** Replace `localStorage.setItem` in the autosave `useEffect` with `idb-keyval`'s `set(STORAGE_KEY, dataToSave)`. IndexedDB provides virtually unlimited storage (GBs) and natively handles large objects without the 5MB restriction.
2. **Update Load Logic:** Modify `loadData()` to primarily `await get(STORAGE_KEY)` from `idb-keyval`.
3. **Legacy Migration:** Maintain a one-time read from `localStorage` if IndexedDB is empty, to migrate existing user data.
4. **Preserve Backup:** The current Backup logic remains unaffected as a pure export/disaster recovery feature.

## 8. Risk Assessment
- **Risk:** Low. `idb-keyval` is already included as a dependency and imported in `Tampuyak.tsx`.
- **Files Involved:** Only `src/Tampuyak.tsx` requires modification.
- **Impact:** High. Resolves catastrophic data loss without requiring a full architectural redesign.
