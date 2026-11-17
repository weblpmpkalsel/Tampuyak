# ENTERPRISE PUBLISHING V2 ARCHITECTURE
**Checkpoint:** OMEGA-PUBLISHING-V2
**Project:** TAMPUYAK OS
**Status:** ARCHITECTURE DESIGN (PRE-IMPLEMENTATION)

## 1. Current Architecture
Saat ini, `EnterpriseDocumentViewer.tsx` bertindak sebagai sebuah **God Object / Monolith** yang merangkap berbagai tanggung jawab secara paralel tanpa separasi yang jelas.
- **Rendering:** Semua jenis dokumen (RKJM, RKT, RKAS) menggunakan file ini.
- **Pagination & Print CSS:** Kalkulasi halaman, manipulasi *page-break*, `<style>` tag untuk `@media print`, serta *ResizeObserver* menumpuk di file yang sama.
- **Cover Layout & Approval:** Logika *rendering* sampul depan, halaman pengesahan, dan tim penyusun tergabung erat di dalam loop utama.
- **Table Layout:** Seluruh jenis tabel (SWOT, IRB, Generic Data) dirender menggunakan kondisi `if-else` yang sangat panjang di dalam *Chapter Composition*.
- **TOC Engine:** Perhitungan *Table of Contents* (TOC) dihitung secara lokal di dalam komponen ini.

## 2. Identified Problems
1. **Konflik Aturan (Rule Conflicts):** Penentuan tinggi halaman (A4) ada di beberapa blok (CSS inline, Tailwind classes, dan blok `<style>`), yang sering tumpang tindih.
2. **Table Rendering Tersebar:** Masing-masing tabel diperlakukan unik secara manual (`table-auto` vs `table-fixed`), namun tidak memiliki *Single Source of Truth* terkait proporsi kolom untuk kertas cetak.
3. **Pagination Rapuh:** Penggunaan instruksi *page-break* tersebar. Ketika sebuah baris tabel diperbaiki agar tidak terpotong, hal ini merusak *page-break* di halaman Cover atau Daftar Isi.
4. **Maintenance Nightmare:** File terlalu besar dan rentan terhadap regresi (*regression bug*). Memperbaiki RKT berpotensi merusak RKAS.

## 3. Dependency Graph (Current)
```text
[DocumentModel] 
       ↓
[EnterpriseDocumentViewer.tsx]
       ├── Cover & Approval (Hardcoded)
       ├── TOC Engine (Hardcoded State)
       ├── Chapter Rendering (Map Loop)
       │    └── Table Rendering (If-Else Hell)
       └── Print Styling (Inline <style>)
```

## 4. New Module Structure
Target arsitektur *V2* memecah *monolith* di atas ke dalam direktori khusus `src/enterprise/publishing/`:

- **`PageGeometry.ts`**: *Single Source of Truth* untuk ukuran A4 (Portrait/Landscape), margin, padding, *printable area*, *header/footer offset*.
- **`PaginationEngine.ts`**: Menghitung secara absolut di mana sebuah komponen harus memutus halaman. Tidak ada lagi `pageBreakBefore` yang dilempar secara acak di dalam elemen UI.
- **`PrintLayout.tsx`**: Komponen pembungkus (Wrapper) yang murni menyediakan injeksi CSS (`@media print`, `@page`) serta menaungi *resize observer*.
- **`CoverEngine.tsx`**: Khusus menangani *Front Matter* (Cover, Lembar Pengesahan, Tim Penyusun).
- **`TocEngine.tsx`**: Khusus mengolah *Table of Contents*.
- **`TableEngine.tsx`**: Menerima data JSON dan *type* tabel, lalu mengembalikan *markup* tabel dengan kolom berproporsi ketat sesuai strategi yang didefinisikan (Column Layout Engine).
- **`ChapterRenderer.tsx`**: Mengurai isi paragraf, subjudul, dan memanggil `TableEngine` saat bertemu struktur tabel.
- **`EnterpriseDocumentViewer.tsx`**: Berubah menjadi *Thin Orchestrator*. File ini hanya membaca konfigurasi dan menyusun blok-blok dari *Engine* di atas ke dalam *PrintLayout*.

## 5. Migration Plan & Order
Migrasi akan dilakukan dengan pendekatan **Strangler Fig Pattern** (Bertahap per *Sprint*).

- **Sprint 1: CoverEngine & PrintLayout**
  - Pisahkan CSS `@media print` dan geometri dasar ke `PrintLayout` & `PageGeometry`.
  - Ekstrak *Cover, Approval, Team* ke `CoverEngine`.
- **Sprint 2: TableEngine**
  - Ekstrak seluruh logika `if-else` pembentuk tabel dari dalam *EnterpriseDocumentViewer* ke dalam satu *Column Layout Engine* terpusat.
- **Sprint 3: PaginationEngine & TocEngine**
  - Pindahkan mekanisme perhitungan halaman (TOC dan lompatan antar-bab) dari *EnterpriseDocumentViewer* ke dalam *Engine* independen.
- **Sprint 4: ChapterRenderer**
  - Ekstrak komponen blok konten (*heading, paragraph*).
- **Sprint 5: Orchestrator Assembly**
  - Bersihkan `EnterpriseDocumentViewer.tsx` hingga hanya tersisa *wrapper* deklaratif.

## 6. Rollback Plan
- Setiap akhir *Sprint*, kita melakukan *commit/lock* arsitektur.
- Apabila terjadi *rendering failure* (halaman meloncat atau tabel terpotong di Chrome Print Engine) pada saat implementasi `Sprint N`, kita akan me-*revert* *codebase* ke *state* `Sprint N-1` dan mengembalikan fungsi yang bermasalah tersebut sementara waktu ke `EnterpriseDocumentViewer`.

## 7. Risk Analysis
- **High Risk:** Perhitungan jumlah halaman pada TOC bergantung pada DOM *rendering* (karena tinggi elemen dinamis). Pemisahan ke `TocEngine` berpotensi menyebabkan ketidakcocokan nomor halaman jika `PageGeometry` gagal di-*sync*.
- **Medium Risk:** *Table page-break (widows/orphans)* mungkin berulah kembali saat pindah ke `TableEngine`.

## 8. Compatibility Matrix
- **Data Input:** Harus tetap mendukung *JSON schema* `DocumentModel` secara penuh (kompatibilitas 100% *backward*).
- **Print Engine:** Harus mematuhi limitasi Google Chrome Print Preview & Microsoft Print to PDF.
