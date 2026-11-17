# Approval Chain Report

## Detected Approval Flags
- Rapor Pendidikan: `isLocked` (boolean)
- Analisis Kondisi: `status` (String: "Disetujui")
- Documents: `status` (String: "Draft", "Disetujui", "Final")

## Persistence Check
After clicking Save in the UI, `settings` is serialized to IndexedDB (`idb-keyval`). The approval flags survive reload because the entire `settings` object is persisted. However, since DOE ignores the `analisis.status` flag, the approval has no effect on downstream generation.

## What does DOE expect?
DOE expects **nothing**. It bypasses the approval chain and reads raw data directly from `settings.rapor.data` and `settings.school`. It does not check if Analisis is "Disetujui", "completed", "isApproved", etc.
