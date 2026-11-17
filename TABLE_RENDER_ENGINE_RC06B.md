# TABLE RENDER ENGINE RC06B REPORT
**Checkpoint:** OMEGA-TABLE-PRINT-RC06B
**Project:** TAMPUYAK OS

## 1. Root Cause Analysis
Tabel-tabel di dalam `EnterpriseDocumentViewer.tsx` (RKJM, RKT, RKAS) secara persisten dirender dengan menggunakan `overflow-x-auto` yang aktif hingga media cetak (*print*), dan setiap elemen `<table>` memiliki *hardcoded limit* `min-w-[800px]` serta `table-auto`. 

**Matematika Print Area (DPI 96):**
- **Portrait A4:** Lebar 210mm. Area yang dapat dicetak (printable width) = 210mm - 70mm (Padding 4cm Kiri + 3cm Kanan) = 140mm = **~529px**.
- **Landscape A4:** Lebar 297mm. Printable width = 297mm - 70mm = 227mm = **~858px**.

**Konsekuensi:** 
Sebuah tabel dengan `min-w-[800px]` **mustahil** muat pada kertas Portrait A4 tanpa menyebabkan Chrome Print Engine memaksa skala dokumen menyusut (*scaling/shrink*). Selain itu, karena komponen *wrapper* menggunakan `overflow-x-auto` tanpa menonaktifkannya pada saat *print* (melalui `print:overflow-visible`), tabel yang melewati 529px langsung mengalami terpotong secara horizontal (clipping/overflow) alih-alih me-wrap konten barisnya secara otomatis. Pada CanonicalRenderer, kedua hal ini tidak terjadi karena tabel tidak memiliki hardcode width dan dibungkus `print:overflow-visible`.

## 2. Daftar Tabel Terdampak
1. Tabel Proyeksi Target Capaian (4 Tahun) / RKJM
2. Tabel Matriks Identifikasi, Refleksi, Benahi (IRB Matrix)
3. Tabel Deskripsi & Jadwal Kegiatan (RKT)
4. Tabel Generic Data List (Lampiran / RKAS)

## 3. Perubahan yang Dilakukan
Patch hanya diberlakukan pada level *wrapper* dan komponen `<table/>` secara *surgical*, agar merespons natural seperti orientasi halamannya.
1. **Strategi Overflow Print:** Menambahkan `print:overflow-visible` pada struktur pembungkus (`<div className="overflow-x-auto ...">`) agar Chrome Print Engine tidak mengunci tabel layaknya elemen *scrollable*, namun menumpahkannya ke *flow* halaman.
2. **Strategi Width Tabel:** Menghapus `min-w-[800px]` secara total dari seluruh empat tabel.
3. **Strategi Layout Tabel:** Menghapus `table-auto` dan `max-w-full`. Tabel sekarang murni menggunakan `w-full` agar kolom menyusut dan melebar mengikuti kontainer *printable area* 100%.

## 4. Before vs After
**Before:** 
`<div className="overflow-x-auto w-full gdds-table-block">`
`<table className="w-full min-w-[800px] table-auto max-w-full border-collapse border border-slate-300 text-sm">`

**After:** 
`<div className="overflow-x-auto print:overflow-visible w-full gdds-table-block">`
`<table className="w-full border-collapse border border-slate-300 text-sm">`

## 5. Bukti Golden Rule Dipatuhi
- ✅ **Geometry Engine Tidak Berubah:** Tidak ada satu pun ukuran milimeter di kertas (210mm/297mm) atau padding (3cm/4cm) yang dirubah. Tabel lah yang kini patuh pada Geometry Engine, bukan sebaliknya.
- ✅ **Front Matter Tidak Berubah:** Kontinuitas halaman (Cover, Lembar Pengesahan, Daftar Isi) sama sekali tak tersentuh. Pagination tetap mengandalkan perbaikan RC05A.
- ✅ **Hanya EnterpriseDocumentViewer Dipatch:** Seluruh perbaikan hanya dieksekusi secara lokal pada `src/EnterpriseDocumentViewer.tsx`. `CanonicalRenderer.tsx` tidak disentuh.
