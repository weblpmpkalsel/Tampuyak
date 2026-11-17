# Enterprise Publishing Platform — Architecture Baseline Freeze v1.0
**Checkpoint:** OMEGA-BASELINE-1.0
**Project:** TAMPUYAK OS

## 1. Status

Seluruh fase Discovery, Audit, Root Cause Analysis, Architecture Design, Migration Planning, Governance, dan Engineering Constitution telah selesai.

Dokumen berikut resmi menjadi Architecture Baseline v1.0:
- `ENTERPRISE_PUBLISHING_V2_ARCHITECTURE.md`
- `CANONICAL_RENDERER_MIGRATION_AUDIT.md`
- `CANONICAL_RENDERER_V2_SPECIFICATION.md`
- `CANONICAL_RENDERER_V2_ARCHITECTURE_REVIEW.md`
- `CANONICAL_RENDERER_V2_IMPLEMENTATION_CONTRACT.md`
- `ENGINEERING_CONSTITUTION.md`

**Mulai checkpoint ini, seluruh dokumen di atas berstatus: LOCKED.**
Mulai saat ini fokus proyek berubah dari **Architecture First** menjadi **Implementation First**.

## 2. Implementation Policy

Semua implementasi wajib mengikuti baseline. 
- Tidak boleh mengubah baseline hanya untuk mempermudah coding.
- Jika implementasi menemukan masalah arsitektur:
  - **JANGAN** langsung mengubah dokumen.
  - Gunakan **ADR (Architecture Decision Record)**.

## 3. Change Control

Mulai hari ini setiap perubahan dikategorikan:

### LEVEL A - Implementation
Tidak membutuhkan ADR.
Contoh:
- Bug fix
- Rendering adjustments
- Adapter mapping updates
- `layoutStyle` additions (as per architectural intent)
- Pagination implementation fixes

### LEVEL B - Architecture
**WAJIB ADR.**
Contoh:
- `CanonicalDocument` berubah skema secara mendasar
- Renderer berubah filosofi (misal menambahkan state/business logic)
- Pagination berubah konsep
- Geometry berubah
- Dependency berubah

## 4. Implementation Order

Implementasi dilakukan secara bertahap sesuai urutan berikut:

- **Stage 1:** CanonicalRenderer Feature Parity - Target: **RKJM** (Status: IN PROGRESS)
- **Stage 2:** CanonicalRenderer Feature Parity - Target: **RKT** (Status: PENDING)
- **Stage 3:** CanonicalRenderer Feature Parity - Target: **RKAS** (Status: PENDING)
- **Stage 4:** EnterpriseDocumentViewer → LEGACY → Adapter Only (Status: PENDING)
- **Stage 5:** EnterpriseDocumentViewer → REMOVED (Status: PENDING)

## 5. Release Rule

Tidak boleh memulai Stage berikutnya sebelum Stage sebelumnya lulus:
1. UAT
2. Release Gate
3. Regression Test

## 6. Implementation Discipline

Setiap pekerjaan wajib mengikuti siklus:
`Task` → `Analysis` → `Implementation` → `Build` → `STOP` → `UAT` → `Release Gate` → `Merge`

**Dilarang Keras:**
Melakukan patching beruntun tanpa validasi (`Task` → `Patch` → `Patch` → `Patch` → `Merge`).

## 7. Technical Debt Policy

Setiap Technical Debt wajib:
- Memiliki ID
- Memiliki Severity
- Memiliki Owner
- Memiliki Target Release
- Memiliki Rencana Penghapusan

Tidak boleh ada Technical Debt yang tidak terdokumentasi (e.g., TECHDEBT001).

## 8. Code Quality Policy

`CanonicalRenderer` wajib tetap:
- **Domain Agnostic:** Tidak mengetahui konteks bisnis.
- **Stateless:** Bergantung sepenuhnya pada props (`CanonicalDocument`).
- **Pure Rendering Layer:** Hanya menerjemahkan data ke representasi visual.

**Dilarang:**
- Menyisipkan Business Rules.
- Melakukan String Matching berbasis Domain (misal `includes("Program")`).
- Melakukan Parsing Heading.
- Menyisipkan Hardcoded RKJM/RKT/RKAS Logic.

Seluruh pengetahuan domain WAJIB berada pada **Adapter**.

## 9. Release Target

Enterprise Publishing Platform V2 dianggap selesai hanya jika:
- RKJM menggunakan `CanonicalRenderer`.
- RKT menggunakan `CanonicalRenderer`.
- RKAS menggunakan `CanonicalRenderer`.
- KSP tetap berjalan tanpa regresi.
- `EnterpriseDocumentViewer` hanya berstatus Legacy.
- Semua Release Gate **PASS**.

---

# FINAL BASELINE DECLARATION

Mulai hari ini:

**CanonicalRenderer adalah satu-satunya target evolusi Enterprise Publishing Platform Tampuyak OS. EnterpriseDocumentViewer memasuki fase Legacy dan tidak lagi menjadi tempat pengembangan fitur baru. Seluruh keputusan arsitektur telah dibekukan dalam Baseline v1.0 dan hanya dapat diubah melalui Architecture Decision Record (ADR).**
