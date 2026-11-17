# CHECKPOINT OMEGA — PAGINATION ARCHITECTURE AUDIT

Berdasarkan analisis logis terhadap kode (terutama `src/EnterpriseDocumentViewer.tsx` dan `src/enterprise/document/layout/LayoutEngine.ts`), berikut adalah hasil audit arsitektur pagination:

## 1. Konsep Halaman
Engine **tidak memiliki konsep fisik "Page" yang eksplisit** di level rendering DOM. Meskipun secara logika data terdapat konsep `Chapter`, `Section`, dan `Front Matter` (melalui `DocumentModel`), pada saat dirender ke DOM, seluruh dokumen dicetak sebagai **satu aliran HTML panjang (continuous stream)**. Tidak ada abstraksi yang memecah dokumen menjadi objek-objek "Halaman Kertas".

## 2. Page Boundary
Penentuan batas halaman (kapan Cover selesai, kapan Pengesahan mulai) diserahkan **sepenuhnya kepada Browser**. Engine hanya menyematkan class CSS pasif (seperti `.page-break-after` atau `.page-break-before`) pada akhir/awal suatu tag `<div>`. Tidak ada mekanisme eksplisit di JavaScript yang menghitung tinggi blok (seperti 297mm untuk A4) atau memotong node DOM.

## 3. Section Registry
Ya, `LayoutRegistry` (melalui `DefaultDocumentLayoutConfig`) **mengetahui** secara logis bahwa Cover, Pengesahan, Daftar Isi, dan setiap BAB harus berada di halaman tersendiri. Hal ini dibuktikan dengan adanya flag boolean seperti:
`pageBreaks: { beforeTOC: true, beforeChapter: true, beforeApproval: true, beforeAppendix: true }`
Namun, registry hanya sebatas "konfigurasi niat". Ia tidak mengeksekusi paginasi, melainkan hanya memberitahu komponen React untuk menyelipkan class CSS `page-break-*`.

## 4. Pagination Engine
**TIDAK ADA**. Secara arsitektur, aplikasi tidak memiliki komponen khusus seperti `PaginationEngine` atau `PageComposer`. Prosesnya murni delegasi dari data -> React Component (`EnterpriseDocumentViewerContent`) -> DOM Stream lurus ke bawah.

## 5. Browser Dependency
**YA, SANGAT BERGANTUNG**. Engine saat ini 100% bergantung pada **Chrome Print Flow** (native browser print engine) untuk menginterpretasikan dan mengeksekusi pemisahan halaman. Dampaknya sangat krusial: CSS `page-break-*` sering mengalami konflik jika diletakkan pada elemen yang menggunakan layout modern seperti Flexbox (`display: flex`) atau Grid. Browser sering kali mengabaikan instruksi break ini jika konteks layoutnya dianggap tidak memungkinkan, yang memicu masalah "halaman menyatu" atau "lompat-lompat".

## 6. Root Cause
Akar masalah yang paling dominan adalah: **Tidak adanya Pagination Architecture**.
*Alasan:* HTML/CSS secara natural didesain untuk media layar yang memanjang ke bawah (fluid scroll), bukan media fisik/kertas (paged media). Bergantung pada atribut pasif seperti CSS `page-break` di dalam struktur DOM yang dinamis, kompleks, dan penuh dengan Flexbox akan selalu rapuh (*fragile*). Selama tidak ada sistem/struktur yang mengisolasi halaman secara fisik di level blok DOM luar (Explicit Paging), masalah margin, padding, dan halaman yang menyatu tidak akan pernah bisa diselesaikan secara permanen hanya dengan mengotak-atik CSS.

## 7. Rekomendasi Arsitektur Minimal (Tanpa Refactor Enterprise Pipeline)
Untuk memastikan setiap bagian utama (Cover, Pengesahan, Daftar Isi, BAB, Lampiran) selalu berada di halaman baru tanpa mengubah Arsitektur Enterprise yang sudah LOCK, berikut rekomendasi minimalnya:

1. **Gunakan "Explicit Block Page Wrapper"**:
   Alih-alih menempelkan class `page-break-*` langsung pada elemen presentasi konten (seperti `<div id="chapter-cover" className="flex flex-col...">`), buatlah bungkus luar (wrapper) murni untuk setiap seksi root di dalam `EnterpriseDocumentViewerContent`.
2. **Pemisahan Konteks (Isolasi Flexbox)**:
   - Wrapper luar (misal: `<div className="print-page-wrapper">`) **wajib** menggunakan `display: block` (bukan flex) dan menanggung beban `page-break-before: always` (kecuali cover) dan `page-break-after: always`.
   - Konten di dalamnya (seperti cover atau isi bab) baru boleh menggunakan Flexbox. Hal ini mencegah Chrome Print Flow kebingungan antara memproses pemisahan halaman dengan algoritma flex-layout.
3. **Standarisasi Node**:
   Pastikan setiap BAB, Cover, Pengesahan, dan Lampiran dibungkus oleh wrapper block-level ini secara konsisten. Ini mensimulasikan "lembar kertas terpisah" di DOM tanpa perlu PaginationEngine kompleks di level JavaScript.
