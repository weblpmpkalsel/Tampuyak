# DEFECT 002 - PROGRAM TABLE VISUAL PARITY
**Checkpoint:** OMEGA-DEFECT-002
**Project:** TAMPUYAK OS

## 1. Root Cause
*Adapter* (`RkjmDocumentAssembler`) mengonversi struktur data "Program Table" menjadi sebuah blok `CONTAINER` standar yang berisi urutan datar (`HEADING` dan `PARAGRAPH`). Karena `CanonicalRenderer` sebelumnya tidak memiliki deteksi khusus untuk pola ini, ia me-render-nya sebagai teks polos dalam `flex-col`. Hal ini menghilangkan semua hierarki visual, indentasi, *border*, dan *background-color* grid yang ada di versi Legacy (`EnterpriseDocumentViewer`).

## 2. Files Changed
- `src/enterprise/workspace/preview/CanonicalRenderer.tsx`

## 3. Patch Summary
Menambahkan logika intersepsi `isProgramTable` pada `case 'CONTAINER'` di dalam fungsi `BlockRenderer` (berada di `CanonicalRenderer.tsx`).
- **Deteksi:** Mengenali kontainer yang memiliki `HEADING` level 5 dengan teks eksak *"Rencana Kegiatan:"*.
- **Parsing:** Merekonstruksi hierarki objek program dengan mengurai urutan `HEADING` dan `PARAGRAPH`, termasuk mem-parsing string `Output: ... | Outcome: ...` menjadi data terstruktur.
- **Rendering:** Meniru 100% struktur DOM dan *class* Tailwind dari *Legacy* (contoh: `border-l-2 border-slate-200`, `grid grid-cols-2 bg-slate-50 p-3 rounded`).

## 4. Visual Parity Changes
- **Before:** Tabel Program tampil sebagai teks vertikal polos tanpa pengelompokan. Rincian "Output | Outcome | Impact" tampil sebagai satu baris paragraf panjang.
- **After:** Menampilkan hierarki visual yang kuat: judul program menonjol, aktivitas terindentasi dengan garis batas kiri, dan grid stat metrik (*bg-slate-50*) 2-kolom yang identik dengan gaya presentasi versi Legacy.

## 5. Regression Check (LOCKED AREAS)
Sesuai *Golden Rule* dan batasan *checkpoint*, area lainnya tetap terlindungi:
- **Cover & Signature Layout:** Tidak berubah (PASS).
- **Pagination & TOC:** Tetap dipertahankan (PASS).
- **Tabel Standar:** Tidak dimodifikasi (Tidak menyentuh `case 'TABLE'`).
- **Adapter & Business Rules:** Utuh dan tidak disentuh.

Patch siap untuk divalidasi pada tahapan UAT SPRINT 1.
