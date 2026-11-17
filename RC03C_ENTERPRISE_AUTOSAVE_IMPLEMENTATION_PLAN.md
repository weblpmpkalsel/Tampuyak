# RC03C Enterprise Autosave Implementation Plan

## Objective
Migrate the primary auto-persistence mechanism from the synchronous, quota-limited `localStorage` to the asynchronous, high-capacity `IndexedDB` (via `idb-keyval`). The transition must be completely transparent to the user, ensure zero data loss, and preserve all existing features, including JSON Backup/Restore.

---

## Phase 1: Persistence Layer Upgrade (Write)
**Goal:** Safely route all auto-save operations to IndexedDB to bypass the 5MB quota.

1. **Import Update (`src/Tampuyak.tsx`)**:
   - Ensure `idb-keyval` exports `set`, `get`, and `entries` (or `keys`).
   - `import { get, set, entries } from "idb-keyval";`

2. **Refactor Auto-Save `useEffect`**:
   - Locate the debounced save hook (line ~3580).
   - Replace `localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))` with an asynchronous `set(STORAGE_KEY, dataToSave)`.
   - **Optimization:** Since `idb-keyval` stores structured clones, `JSON.stringify` is no longer strictly necessary for `IndexedDB`, but to maintain schema compatibility with `Backup JSON` and `Restore`, we will continue storing the serialized string, or store as an object and adjust the load logic. Storing as a parsed object is preferred for IndexedDB.
   - **Error Handling:** Attach `.catch(err)` to the `set()` Promise to update the `setSaveStatus("error")` state if IndexedDB writes fail (e.g., in private browsing modes that restrict IDB).

---

## Phase 2: Migration & Load Strategy (Read)
**Goal:** Transparently load data from IndexedDB, with a fallback to `localStorage` for backward compatibility and seamless migration.

1. **Refactor `loadData` (`AppProvider`)**:
   - Modify the initialization sequence to perform a dual-read.
   - **Step 1:** `const idbData = await get(STORAGE_KEY);`
   - **Step 2:** If `idbData` exists, use it. 
   - **Step 3:** If `idbData` is null/undefined, attempt to read from `localStorage.getItem(STORAGE_KEY)`.
   
2. **Heavy Data Integration**:
   - The system already attempts to load `const heavyData = await get("tampuyak.heavy") || {};`. We will preserve this, but note that future saves will merge heavy data into the primary `STORAGE_KEY` via IndexedDB.

---

## Phase 3: Backup & Export Preservation
**Goal:** Ensure the Backup JSON feature exports the complete state, including data that has been migrated to IndexedDB.

1. **Refactor `handleExport`**:
   - Convert `handleExport` to an `async` function.
   - **Step 1:** Iterate through `localStorage` and collect all `tampuyak.*` and `eoffice.*` keys (preserving legacy / non-migrated state like QA statuses).
   - **Step 2:** Await `entries()` from `idb-keyval` to retrieve all IndexedDB entries.
   - **Step 3:** Merge the IDB entries into the `backupData` object, overwriting any stale `localStorage` keys with fresh IDB data.
   - **Step 4:** Generate and download the JSON file as before.

---

## Migration Strategy (localStorage → IndexedDB)
The migration is designed as a **Lazy Up-Migration**:
1. **On App Load:** The app checks IDB first. Finding nothing (first load after update), it checks `localStorage`.
2. **In-Memory Rehydration:** The app loads the `localStorage` data into the React state (`settings`).
3. **Auto-Trigger Write:** The very first state initialization triggers the auto-save `useEffect`.
4. **Migration Complete:** The auto-save writes the complete state into `IndexedDB`. On all subsequent loads, the app will find the data in IDB and ignore `localStorage`.
5. **No Destructive Actions:** We will *not* aggressively delete `localStorage` data upon migration. It remains as a dormant fallback until naturally cleared by the browser or user.

---

## Rollback Strategy
If `IndexedDB` encounters fatal errors (e.g., unsupported browser, strict private mode, corrupted database):
1. **Graceful Fallback:** The auto-save `Promise.catch()` can be configured to attempt a fallback write to `localStorage.setItem` if the `set()` to IDB fails.
2. **Export Parity:** Because `handleExport` combines both `localStorage` and `IndexedDB`, users can always manually trigger a Backup JSON export regardless of which storage layer succeeded.
3. **Manual Restore:** If the state becomes completely unreadable, the user's previously downloaded Backup JSON can be re-imported. The `handleImport` logic parses the file and pushes the state back into the React Context, which will then immediately attempt to save to the persistence layer.
