### Ownership Model

The system currently employs a **monolithic, year-scoped ownership model**.

**Current Behavior:**
The entire application state (represented by the `settings` object) is treated as a single snapshot bound to an Academic Year. The data is NOT separated into GLOBAL and YEAR SPECIFIC partitions.

### Root Cause

The root cause of the bug resides in `src/Tampuyak.tsx` within the `switchAcademicYear` function.

**Code Location:** `src/Tampuyak.tsx`
**Function:** `switchAcademicYear`

**What happens during a switch:**
1. **Archiving the entire state**: When the academic year changes, the function copies the ENTIRE current state (`const dataToArchive = { ...prev };`) — including global master data like `school`, `identitas`, `guru`, `tendik`, `sarpras` — and archives it under the outgoing year's ID in `archivedData[currentActive.id]`.
2. **Overwriting with new or default state**: It then fetches the saved state for the incoming year ID (`const dataToLoad = newSettings.archivedData?.[id] || { ...DEFAULT_SETTINGS };`). If the incoming year has no data yet, it loads `DEFAULT_SETTINGS`.
3. **Total Replacement**: Finally, it completely overwrites the active workspace state with this `dataToLoad`.

Because Global School Data (Master Data) is NOT excluded from this archiving and swapping process, navigating to a new or different academic year wipes or replaces the global master data with the state scoped to that specific year.
