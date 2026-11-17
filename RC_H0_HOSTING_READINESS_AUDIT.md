# RC-H0 KSP HOSTING READINESS AUDIT

## 1. Feature Matrix
| Chapter | Status | Notes |
|---------|--------|-------|
| BAB I: Karakteristik Satuan Pendidikan | ✅ Complete | Fully connected to Workspace |
| BAB II: Visi, Misi, dan Tujuan | ✅ Complete | Fully connected to Workspace |
| BAB III: Pengorganisasian Pembelajaran | ⚠️ Partial | Adapters and Builders exist, but NO Workspace UI |
| BAB IV: Perencanaan Pembelajaran | ❌ Missing | Missing from Assembler, Builder, and Workspace |
| BAB V: Evaluasi & Pengembangan | ⚠️ Partial | Mislabeled as BAB IV in code, missing Workspace UI |

## 2. Missing Workspace Matrix
The following KSP domains are missing editable fields in the user interface (`Tampuyak.tsx` and legacy Workspace):
- **Pengorganisasian Pembelajaran**: No forms for `Intrakurikuler`, `Kokurikuler`, and `Beban Belajar`.
- **Perencanaan Pembelajaran**: No forms for `Ruang Lingkup Satuan Pendidikan` and `Ruang Lingkup Kelas`.
- **Evaluasi & Pendampingan**: No forms for `Monitoring`, `Evaluasi Program`, or `Pengembangan Profesional`.
*(Note: Enterprise modules like `CurriculumHubModule` and `EvaluationHubModule` exist in the codebase but are currently disconnected/unreachable from the active UI).*

## 3. Missing Preview Matrix
- **BAB III & BAB V**: Rendered in Preview using default/fallback values from Adapters because the Workspace has no inputs to supply real data.
- **BAB IV (Perencanaan Pembelajaran)**: Completely missing from the Preview because it is not implemented in `KspDocumentAssembler.ts` or `KspBab4Structure.ts` (which currently renders BAB V content).

## 4. Missing PDF Matrix
- The PDF engine relies on the Preview/Canonical models. Since BAB IV is missing from the Canonical model, it is missing from the generated PDF.
- The "Publish PDF" button in the KSP Dashboard is hardcoded to a `disabled` state with a mock "Attachments Required" lock.

## 5. UX Risks (Developer Terminology & Dead Ends)
- **Dead Buttons**: The "KSP Settings", "Publish PDF", and "Publish DOCX" buttons in `KSPDashboard.tsx` are non-functional.
- **Disconnected Modules**: The new Enterprise Workspace Shell (`EnterpriseWorkspaceShell.tsx`) is not mounted. Users are trapped in the legacy `Tampuyak.tsx` environment.
- **WIP Badges**: The `WorkspaceModuleRegistry.ts` contains multiple modules marked with `isFuture: true` (WIP).
- **Developer Terminology**: Leftover developer tags exist in the KSP Dashboard ("KSP Gold", "Enterprise Workspace").

## 6. Hosting Risks (Release Blockers)
1. **Missing Data Entry**: Users cannot legally complete a KSP document because there is no way to enter Intracurricular subjects, Cocurricular programs, or Evaluation plans.
2. **Missing Chapter**: BAB IV (Perencanaan Pembelajaran) is completely missing from the Enterprise Pipeline.
3. **Mislabeled Chapter**: BAB V is currently being compiled and rendered under the identifier `BAB_IV` in `KspBab4Structure.ts`.

## FINAL DECISION
**NO GO**

**Recommendation for Beta Hosting**: 
1. Mount the `EnterpriseWorkspaceShell` to replace the legacy `Data Sekolah` workspace so users can access the Curriculum and Evaluation Hubs.
2. Build and assemble `BAB IV: Perencanaan Pembelajaran` in the Canonical Document Model.
3. Rename the current `KspBab4Structure.ts` to `KspBab5Structure.ts` and correct its chapter assignments.
4. Enable the PDF/DOCX Export buttons in the KSP Dashboard.
