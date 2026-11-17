# RC-3.0 MIRROR MODE IMPLEMENTATION

## EXECUTIVE SUMMARY
This document outlines the implementation of the Enterprise Mirror Mode. Mirror Mode provides a migration-safe foundation allowing Master Data and Workspace Data to coexist. It continuously compares and synchronizes specified domains between the legacy data structures and the new Enterprise Workspace models without breaking existing application behavior, document builders, or adapters.

## ARCHITECTURE
The Mirror Mode introduces a read-only synchronization layer (`EnterpriseMirrorService`) that observes both the legacy `DEFAULT_SETTINGS` (Master Data) and the Enterprise Workspace payloads. 

```
                    MASTER DATA
                         │
                         │
                         ▼
                 Mirror Synchronizer
                         ▲
                         │
                    WORKSPACE
```

*   **Non-Destructive**: Builders continue to read existing Workspace payloads. The Mirror Synchronizer does not alter the Adapter priority (which currently favors Master Data in `mergeNonEmpty`).
*   **Conflict Detection**: If discrepancies are found, they are logged as conflicts rather than automatically overwritten, ensuring no data loss.

## SYNCHRONIZATION FLOW
1.  **Trigger**: The `EnterpriseMirrorService.runMirrorAudit(settings)` is executed (e.g., periodically, on save, or on load).
2.  **Domain Mapping**: The service iterates through predefined mappings of domains (e.g., `SchoolIdentity`).
3.  **Comparison**: The service compares values from the Master Data path (e.g., `settings.school.name`) against the Workspace path (e.g., `settings.enterpriseProfile.identity.name`).
4.  **Logging**: Differences are captured as `MirrorConflict` instances within a `MirrorResult`.

## CONFLICT MATRIX
When `Workspace != Master`, the service evaluates the conflict:
*   **MASTER_NEWER**: Master Data has a more recent timestamp (if tracking is available).
*   **WORKSPACE_NEWER**: Workspace Data has a more recent timestamp.
*   **DIFFERENT**: Values mismatch, but causality/timestamp is unknown.
*   **IDENTICAL**: Values match (No conflict).

*Note: In the current iteration, lacking field-level timestamps, any mismatch defaults to `DIFFERENT` to prevent accidental data loss.*

## MIGRATION STRATEGY
1.  **Phase 1 (Current - RC-3.0)**: Introduce `EnterpriseMirrorService`. Run silently. Log conflicts. Ensure zero regressions in existing flows (KSP, RKJM, RKT, RKAS).
2.  **Phase 2**: Introduce UI for the Headmaster/Operator to resolve `MirrorConflict`s manually, explicitly choosing the Source of Truth.
3.  **Phase 3**: Shift Adapter priority. `mergeNonEmpty` will be updated to respect the Enterprise Data Dictionary ownership defined in RC-2.2.
4.  **Phase 4**: Fully decouple. Remove legacy fields that belong exclusively to the Workspace.

## REGRESSION MATRIX
| Module/Feature | Status Post-Mirror Mode | Notes |
| :--- | :--- | :--- |
| **KSP Builder** | ✅ UNCHANGED | Still reads from `KspMetadataAdapter`. |
| **RKJM Builder** | ✅ UNCHANGED | Still reads from legacy structure. |
| **RKT Builder** | ✅ UNCHANGED | Still reads from legacy structure. |
| **RKAS Builder** | ✅ UNCHANGED | Still reads from legacy structure. |
| **Live Preview** | ✅ UNCHANGED | No UI or rendering logic altered. |
| **PDF Export** | ✅ UNCHANGED | Payload generation remains identical. |
| **Adapters** | ✅ UNCHANGED | `EnterpriseAdapter.mergeNonEmpty` unchanged. |

**DECISION**: **GO** - Mirror Mode is implemented safely. The foundation for the final Source of Truth switch is established.
