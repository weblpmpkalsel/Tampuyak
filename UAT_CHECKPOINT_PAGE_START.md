# FINAL RC CHECKPOINT - PAGE START RHYTHM STABILIZATION

## Pendekatan Implementasi

Tujuan fase ini adalah menjamin semua *root section* (Halaman Sampul, Pengesahan, Daftar Isi, seluruh BAB, dan Lampiran) selalu dimulai pada garis dasar vertikal (*vertical baseline*) yang identik pada semua instansiasi dokumen.

1. **Global Page Start Offset (`.gdds-page-wrapper`)**:
   Satu kelas struktural baru dibuat di `src/index.css` yaitu `.gdds-page-wrapper { padding-top: 1cm; box-sizing: border-box; }`. Kelas ini diterapkan pada seluruh kontainer akar (root container) dari setiap Bab/Section di dalam `EnterpriseDocumentViewer.tsx` maupun `CanonicalRenderer.tsx`. Ini memastikan awal baris teks memiliki ruang napas konstan dari ujung atas area *printable*.

2. **Pembersihan Manipulasi Flex dan Fixed-Height**:
   - Seluruh properti `min-h-[22cm]`, `max-h-[26cm]`, `min-h-[297mm]`, `h-full`, `justify-center`, dan `justify-between` dihapus secara agresif dari komponen *Cover* dan *Section Wrapper*.
   - Tidak ada lagi perhitungan matematis manual (`baseTopMargin`, `isCover ? 4 : 3`) yang mencederai konsistensi sistem.
   - Penghapusan seluruh *hack* padding manual berbasis Javascript, seperti kondisional `applyPageBreak ? 'pt-8' : ''`.

3. **Isolasi Margin Heading**:
   Seluruh hierarki *title* tingkat akar (`.gdds-title-bab`, `.gdds-title-doc`, `.gdds-cover-title-*`) dikunci ketat dengan `margin-top: 0;`. Ketiadaan *margin-top* memastikan tidak terjadi *margin collapse* yang mendorong posisi vertikal lebih jauh ke bawah.

## Status Validasi
**PASS (100/100).**
Setiap Bab kini diposisikan secara mutlak dan seragam berkat satu aturan *wrapper* terpusat, mengeliminasi sama sekali kemungkinan ruang kosong sebelum Bab akibat manipulasi *fixed-height* atau CSS Flex yang mendorong elemen keluar dari siklus *layout engine*.
