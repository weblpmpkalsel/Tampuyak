# CANONICAL RENDERER MIGRATION AUDIT
**Checkpoint:** OMEGA-PUBLISHING-V2.1
**Project:** TAMPUYAK OS
**Status:** FEASIBILITY STUDY

## 1. Executive Summary
Studi kelayakan ini dilakukan untuk memverifikasi apakah `CanonicalRenderer` dapat sepenuhnya menggantikan `EnterpriseDocumentViewer` sebagai satu-satunya Enterprise Rendering Engine, sehingga `EnterpriseDocumentViewer` dapat dipensiunkan (deprecated).

Berdasarkan audit arsitektur kode saat ini, **CanonicalRenderer BELUM SIAP** menggantikan `EnterpriseDocumentViewer` 100%. Terdapat *gap* fungsionalitas yang cukup besar, terutama pada dukungan orientasi Landscape, perhitungan otomatis nomor halaman (Pagination/TOC), dan Column Layout Engine untuk tabel.

Namun, secara arsitektur abstraksi (`CanonicalDocument`), struktur Canonical jauh lebih unggul dan tidak terikat (agnostic) pada jenis dokumen (tidak *hardcode* KSP, RKT, RKAS).

## 2. Capability Matrix

| Feature | CanonicalRenderer | EnterpriseDocumentViewer | Status |
| :--- | :--- | :--- | :--- |
| **Geometry (Portrait)** | ✅ Ya (Hardcoded classes) | ✅ Ya (CSS class) | Compatible |
| **Geometry (Landscape)** | ❌ Belum Ada | ✅ Ya | **Gap** |
| **Pagination (Page Breaks)** | ⚠️ Sebagian (Hardcode Cover/TOC) | ⚠️ Sebagian | Needs Refactoring |
| **Pagination (Page Numbers)**| ❌ Belum Ada | ✅ Ya (ResizeObserver) | **Gap** |
| **Cover Layout** | ✅ Ya (Agnostic Blocks) | ⚠️ Ya (Hardcoded Title) | Canonical Lebih Baik |
| **TOC Layout** | ⚠️ Ya (Tanpa Nomor Halaman) | ✅ Ya (Dengan Nomor) | **Gap** |
| **Table Layout Engine** | ❌ Belum Ada (Tabel Polos) | ✅ Ya (Column Engine RC06C)| **Gap** |
| **Chapter Structure** | ✅ Ya (Dynamic Sections) | ⚠️ Ya (Hardcoded loop) | Canonical Lebih Baik |
| **Editing Support** | ✅ Ya (Node Selection/Override) | ✅ Ya (EditableRegion) | Compatible (Different Pattern) |

## 3. Gap Analysis & Missing Features

1. **Landscape Orientation Support:**
   `CanonicalRenderer` mengunci seluruh seksi dokumen (sections) dengan kelas CSS *hardcoded* `portrait-section w-[210mm] min-h-[297mm]`. Belum ada dukungan metadata orientasi dari `CanonicalDocument` untuk memicu `landscape-section`. (RKAS membutuhkan mode Landscape).

2. **Column Layout Engine untuk Tabel:**
   `CanonicalRenderer` mencetak semua tabel secara *default* (`table-auto` tanpa definisi proporsi lebar). Sedangkan `EnterpriseDocumentViewer` baru saja mendapatkan *Column Layout Engine* pada RC06C untuk memastikan hasil cetak tabel tidak berantakan/menyusut.

3. **TOC Page Number Calculation:**
   `CanonicalRenderer` memiliki blok kontainer untuk TOC, namun kelas `gdds-toc-page` dikosongkan. `EnterpriseDocumentViewer` mengandalkan `ResizeObserver` untuk menghitung tinggi piksel (DOM-based pagination calculation). Canonical belum memiliki `PaginationEngine` serupa.

4. **Dynamic Page Breaks (Widow/Orphan control):**
   `CanonicalRenderer` hanya melakukan pemotongan halaman (`needsPageBreak`) berdasarkan ID bawaan (`chapter-cover`, `chapter-approval`). Tidak ada kecerdasan untuk memutuskan apakah sebuah tabel besar harus dipindah ke halaman selanjutnya.

## 4. Compatibility Analysis

Pendekatan struktur dokumen sangat berbeda:
- `EnterpriseDocumentViewer` membaca **`DocumentModel`** (yang sangat terikat pada skema RKJM/RKT/RKAS seperti `cover`, `approval`, `chapter1`, dll).
- `CanonicalRenderer` membaca **`CanonicalDocument`** (berisi deretan `sections` & `blocks` yang sepenuhnya agnostik).

Untuk menggunakan `CanonicalRenderer` pada RKJM/RKT/RKAS, maka *DocumentAssembler* (seperti `KspDocumentAssembler`) harus dibuat khusus untuk mengubah `DocumentModel` RKJM/RKT/RKAS menjadi `CanonicalDocument`.

## 5. Migration & Deprecation Plan

Karena `CanonicalRenderer` secara konseptual lebih bersih, ia **LAYAK** menjadi fondasi tunggal. Penghentian `EnterpriseDocumentViewer` akan dilakukan.

**Rencana Migrasi (Estimated Sprint Order):**

*   **Sprint 1: Canonical Table Engine (Patch 1)**
    *   Memindahkan aturan proporsi kolom (Column Layout Engine RC06C) ke dalam *TableBlock Renderer* milik `CanonicalRenderer`.
*   **Sprint 2: Canonical Page Geometry (Patch 2)**
    *   Menambahkan dukungan metadata `orientation: 'portrait' | 'landscape'` pada `DocumentSection` milik Canonical.
*   **Sprint 3: Canonical Pagination & TOC (Patch 3)**
    *   Membangun `PaginationEngine` abstrak di luar *renderer*, dan menyuntikkannya ke `CanonicalRenderer` untuk mengisi nomor halaman TOC.
*   **Sprint 4: RKT/RKJM/RKAS Assembler**
    *   Membuat *assembler* (`RkjmDocumentAssembler.ts`, dll) yang mengubah JSON keluaran *builder* saat ini menjadi format `CanonicalDocument`.
*   **Sprint 5: Orchestrator Switch & Deprecation**
    *   Mengubah `Tampuyak.tsx` agar menggunakan `CanonicalRenderer` alih-alih `EnterpriseDocumentViewer`.
    *   Menghapus `EnterpriseDocumentViewer.tsx` sepenuhnya.

**Kesimpulan:** Pengembangan *Publishing V2* wajib difokuskan sepenuhnya pada penambahan fitur (TOC numbering, Landscape, Table Proporsional) ke `CanonicalRenderer`. `EnterpriseDocumentViewer` dinyatakan berstatus *Legacy/Frozen*.
