# CANONICAL RENDERER V2 IMPLEMENTATION CONTRACT
**Checkpoint:** OMEGA-IMPLEMENTATION-CONTRACT-V1
**Project:** TAMPUYAK OS
**Status:** IMPLEMENTATION CONTRACT (LOCKED)

## 1. Global Definition of Done (DoD)
Setiap Sprint wajib memenuhi seluruh kriteria berikut sebelum dapat dinyatakan **SELESAI (DONE)**:
- [x] **Build PASS:** Aplikasi berhasil di-compile tanpa error.
- [x] **TypeScript PASS:** Tidak ada *type error* atau *any* yang tidak terdefinisi secara sengaja.
- [x] **Lint PASS:** Kode mematuhi standar *linter* proyek.
- [x] **Print PASS:** Hasil cetak via *Chrome Print Engine* tidak mengalami anomali (*clipping, overlap, extra blank pages*).
- [x] **Preview PASS:** Tampilan di layar (UI) identik dengan orientasi dan proporsi cetak.
- [x] **Regression PASS:** Fitur yang sudah ada tidak mengalami kerusakan.

*Jika salah satu gagal, Sprint dianggap GAGAL dan wajib dilakukan Rollback atau Hotfix sebelum melanjutkan ke Sprint berikutnya.*

## 2. Sprint 1: Cover Engine
- **Scope:** Memisahkan logika rendering Cover, Approval, dan Preface dari monolith `CanonicalRenderer` ke dalam `CoverEngine` yang independen. Memastikan *geometry* halaman cover akurat.
- **Out of Scope:** Tidak menyentuh logika tabel, kalkulasi TOC, atau *landscape engine*.
- **Acceptance Criteria:**
  - Cover Preview = PDF (100% *pixel-identical*).
  - Elemen identitas (Logo, Judul, Dinas) berada di posisi proporsional.
- **Regression Test:** KSP Document Cover, Approval Page.
- **Changed Files:** `CanonicalRenderer.tsx`, pembuatan `CoverEngine.tsx`.
- **Rollback Plan:** *Revert commit* yang memisahkan `CoverEngine`, kembalikan blok render cover ke dalam `CanonicalRenderer`.
- **Rollback Success Indicator:** Cover kembali dirender oleh `CanonicalRenderer` tanpa ada halaman yang hilang.

## 3. Sprint 2: Pagination Engine
- **Scope:** Mengimplementasikan mesin pemotong halaman (*page breaks*) dan kalkulasi nomor halaman (terutama untuk TOC) yang murni bergantung pada CSS *print media* atau pengukuran DOM terisolasi.
- **Out of Scope:** Tidak mengubah *layout* kolom tabel atau komponen *cover*.
- **Acceptance Criteria:**
  - Tidak ada halaman kosong (*blank pages*) ekstra saat di-*print*.
  - Tidak ada BAB yang melompat (*page jump* yang tidak wajar).
  - Tidak ada Cover yang melompat atau terpotong setengah.
- **Regression Test:** Dokumen KSP panjang dengan banyak sub-bab, TOC KSP.
- **Changed Files:** Pembuatan `PaginationEngine.ts`, `TocEngine.tsx`, pembaruan `CanonicalRenderer.tsx`.
- **Rollback Plan:** *Revert* injeksi `PaginationEngine`, kembalikan kelas CSS *hardcoded* `page-break` pada komponen.
- **Rollback Success Indicator:** Halaman kembali terpotong mengikuti atribut *hardcoded* awal tanpa *crash*.

## 4. Sprint 3: Table Engine
- **Scope:** Mengimplementasikan *Column Layout Engine* ke dalam `CanonicalRenderer` (membawa standar RC06C), mendistribusikan lebar kolom secara proporsional.
- **Out of Scope:** Tidak menyentuh fitur *Landscape*, TOC, atau Cover.
- **Acceptance Criteria:**
  - Tidak ada *clipping* pada tabel cetak.
  - Tidak ada *scrollbar* horizontal pada mode cetak/PDF.
  - Proporsi kolom sesuai jenis tabel pada mode Portrait.
- **Regression Test:** Tabel Matriks, Tabel Struktur Kurikulum pada KSP.
- **Changed Files:** Pembuatan `TableEngine.tsx`, pembaruan `CanonicalDocumentTypes.ts` (penambahan meta kolom), modifikasi *table block renderer*.
- **Rollback Plan:** Hapus pemanggilan `TableEngine` dan kembalikan tabel ke format `table-auto` bawaan Browser.
- **Rollback Success Indicator:** Tabel dirender default oleh browser (*auto layout*).

## 5. Sprint 4: Landscape Engine
- **Scope:** Mengimplementasikan *Page Geometry* yang mendukung peralihan dari *Portrait* ke *Landscape* (dan sebaliknya) secara per-seksi (*per-section*).
- **Out of Scope:** Tidak menyentuh *engine* kalkulasi TOC atau struktur data RKAS/RKT (hanya infrastruktur kanvasnya saja).
- **Acceptance Criteria:**
  - Landscape Preview = Landscape Print = Landscape PDF (identik 100%).
  - Halaman setelah *landscape* bisa kembali menjadi *portrait* (jika didefinisikan).
- **Regression Test:** Render dokumen *dummy* berisi 1 halaman Portrait dan 1 halaman Landscape berdampingan.
- **Changed Files:** `PageGeometry.ts`, `PrintLayout.tsx`, `CanonicalDocumentTypes.ts` (properti `orientation`).
- **Rollback Plan:** *Revert* gaya CSS yang memutar/melebarkan kanvas, kunci kembali kanvas utama ke lebar `210mm` mutlak.
- **Rollback Success Indicator:** Seluruh dokumen kembali terkunci di ukuran A4 Portrait.

## 6. Sprint 5: Migration (EnterpriseDocumentViewer Deprecation)
- **Scope:** Membangun *Document Adapter/Assembler* yang mengubah `DocumentModel` (RKJM, RKT, RKAS) menjadi `CanonicalDocument` dan mengarahkannya ke `CanonicalRenderer`.
- **Out of Scope:** Menambah fitur baru di luar kapabilitas `EnterpriseDocumentViewer` saat ini.
- **Acceptance Criteria:**
  - Skema data berjalan dari: `EnterpriseDocumentViewer -> Adapter -> CanonicalRenderer`.
  - Dokumen RKJM, RKT, dan RKAS muncul sempurna tanpa kehilangan data teks, tabel, atau *cover*.
- **Regression Test:** RKJM, RKT, RKAS.
- **Changed Files:** Pembuatan adapter (e.g., `RkjmDocumentAssembler.ts`), perubahan integrasi `Tampuyak.tsx` (atau level orkestrator lainnya), dan penonaktifan `EnterpriseDocumentViewer.tsx`.
- **Rollback Plan:** Ganti komponen pemanggil (di *router* / orkestrator) untuk langsung menunjuk kembali ke komponen `EnterpriseDocumentViewer.tsx` lama.
- **Rollback Success Indicator:** KSP menggunakan `CanonicalRenderer`, sementara RKJM/RKT/RKAS kembali dirender oleh monolith `EnterpriseDocumentViewer` tanpa cacat.
