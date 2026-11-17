# RC5.4A ENTERPRISE IMPACT ANALYSIS

## 1. IMPACT MATRIX

| Proposed Addition | Additive? | Modifies Existing State? | Renames Properties? | Affects Serializers? | Affects Builders? | Affects RKJM/RKT/RKAS? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `settings.approval` | YES | NO | NO | NO | YES (KSP) | NO |
| `settings.draftingTeam` | YES | NO | NO | NO | YES (KSP) | NO |
| `settings.karakteristik` (Pedagogical fields) | YES | NO | NO | NO | YES (KSP) | NO |
| `settings.kemitraan` | YES | NO | NO | NO | YES (KSP) | NO |
| `settings.curriculum` | YES | NO | NO | NO | YES (KSP) | NO |
| `settings.calendar` | YES | NO | NO | NO | YES (KSP) | NO |
| `settings.evaluation` | YES | NO | NO | NO | YES (KSP) | NO |

*All additions are strictly additive. They append new domains or new fields to existing domains in the root `settings` object without altering existing fields.*

---

## 2. RISK MATRIX

| Risk Area | Description | Probability | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Legacy Profile Crash** | Older saved profiles lack these new fields; accessing them might throw `undefined` errors in the UI. | High | High | Use optional chaining (`?.`) and fallback defaults (`|| []`) in all new UI components. |
| **RKJM / RKT / RKAS Interference** | Other document engines might iterate over `settings` and break if unrecognized domains appear. | Low | High | The planning engine adapters explicitly pluck the fields they need. Additive root properties will be safely ignored. |
| **KSP Builder Breakage** | Builders expect specific shapes. If new UI data is passed directly without mapping, it may break validation rules. | Low | High | All new data MUST route through `KspMetadataAdapter`. Builders are strictly isolated and already tolerate missing data via Partial Projection. |
| **State Bloat** | Adding deep arrays to `settings` could cause performance lag during React state updates if not localized properly. | Medium | Medium | Debounce inputs for textareas. Keep curriculum and evaluation array shapes flat and primitive. |

---

## 3. AFFECTED FILES

**UI / Presentation Layer:**
- `src/Tampuyak.tsx` (To add new tabs, state structure, and default settings)

**Adapter Layer:**
- `src/ksp/KspMetadataAdapter.ts` (To map new Workspace state to `rawStudents`, `rawStrategicPolicy`, calendar, curriculum, etc.)

**Assembler Layer:**
- `src/enterprise/document/ksp/KspDocumentAssembler.ts` (To pass the newly mapped data from the adapter to the Enterprise Knowledge services)

*(No changes required in `src/enterprise/knowledge/builders/*` because they already accept optional domains and use Partial Knowledge Projection.)*

---

## 4. AFFECTED MODULES

- **KSP Module:** Directly affected. New data will activate previously dormant paragraphs and tables in BAB I, BAB III, and BAB IV.
- **RKJM / RKT / RKAS Modules:** Unaffected. They do not consume `settings.curriculum`, `settings.evaluation`, or `settings.draftingTeam`.
- **Master Data Layer:** Additive extension.
- **Enterprise Knowledge Layer:** Unaffected structurally; will simply receive richer payloads.

---

## 5. REGRESSION RISK

**Overall Regression Risk: LOW**

Since the architectural directive is strictly ADDITIVE:
1. No existing fields (like `settings.school`, `settings.identitas`) are renamed or moved.
2. The UI components for existing tabs will not be refactored, only new tabs added.
3. KSP Builders are already fortified with Partial Knowledge Projection (from RC5.2E), meaning they won't crash if the new data structures are momentarily empty or malformed during development.

---

## 6. SAFE MIGRATION STRATEGY

1. **Step 1: Expand DEFAULT_SETTINGS**
   - Inject the new empty structures (`approval`, `draftingTeam`, `kemitraan`, `curriculum`, `calendar`, `evaluation`) into `DEFAULT_SETTINGS` in `Tampuyak.tsx`.
2. **Step 2: Build UI Components**
   - Implement the new settings tabs sequentially using existing `updateSetting` patterns. Use extreme care to avoid mutating other state keys.
3. **Step 3: Update KSP Adapter**
   - Wire the new state fields through `KspMetadataAdapter.ts`.
4. **Step 4: Connect Assembler**
   - Map the adapter output to the Knowledge Service inputs in `KspDocumentAssembler.ts`.

==================================================
## FINAL DECISION
**GO**

The Workspace Evolution is architecturally safe. It poses zero regression risk to existing RKJM/RKT/RKAS flows and maintains strict compliance with the Enterprise boundaries. Additive state expansion is approved.
