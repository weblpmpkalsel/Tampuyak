# RC-02C CONTENT WIDTH FORENSIC AUDIT

## TUGAS 1: Audit Wrapper Parent Document Body

Berdasarkan audit terhadap `CanonicalRenderer.tsx` dan struktur layout aplikasinya, berikut adalah konfigurasi wrapper utama yang membungkus body dokumen:

- **Root Container (`.print-canvas-root`)**: Menggunakan class Tailwind `w-full relative flex flex-col items-center`.
- **Page Wrapper (`.enterprise-page-composer-wrapper`)**: Menggunakan class Tailwind `block`.
- **Document Page (`.portrait-section`)**:
  - `width`: Diatur secara eksplisit melalui inline style `width: 210mm`.
  - `padding`: Diatur secara eksplisit melalui inline style `paddingLeft: 4cm` dan `paddingRight: 3cm`.
  - `box-sizing`: Diatur secara eksplisit melalui inline style `boxSizing: 'border-box'`.
- **Properties Restriksi Tambahan**:
  - `max-width`, `min-width`, `inline-size`, `container`, `prose`: **TIDAK DITEMUKAN** membatasi page wrapper.
  - `margin`: Diterapkan `margin: 0 auto` melalui inline style untuk center alignment.
  - `padding` horizontal ekstra (`px-*`): **TIDAK DITEMUKAN** pada wrapper layout utama.

## TUGAS 2: Identifikasi Pembatasan Area Isi

**Tidak ditemukan** wrapper layout global yang membatasi area isi menjadi lebih sempit daripada area cetak A4 setelah dikurangi margin resmi GDDS. 

Hirarki DOM menunjukkan bahwa setiap block (paragraf, TOC, tanda tangan) dirender langsung sebagai child dari `.portrait-section`, sehingga bebas mengisi 100% lebar yang tersedia.

## TUGAS 3: Perhitungan Teoritis vs Realita

- **Lebar Kertas A4**: 210 mm
- **Margin Kiri GDDS**: 4 cm (40 mm)
- **Margin Kanan GDDS**: 3 cm (30 mm)
- **Kalkulasi Teoritis Lebar Efektif**: 210 mm - 40 mm - 30 mm = **140 mm**.

**Laporan Audit**:
Area isi **benar-benar menggunakan 140 mm penuh**. Ini dibuktikan dari kombinasi properti CSS `width: 210mm` dan `box-sizing: border-box` bersama padding. Karena tidak ada class `container`, `prose`, atau `px-*` pada wrapper, lebar teks merentang tepat 140 mm tanpa margin tambahan yang tidak diinginkan.

## TUGAS 4: Root Cause Analysis & Rekomendasi Surgical Patch

Secara global, sistem berhasil mempertahankan lebar efektif konten 140 mm. Namun, ditemukan **anomali dan hardcoding** yang berisiko pada level spesifik:

**1. Inline Styling (Technical Debt)**
- **File:** `src/enterprise/workspace/preview/CanonicalRenderer.tsx`
- **Root Cause:** Properti krusial seperti `width`, `paddingLeft`, `paddingRight`, dan `boxSizing` disematkan sebagai **inline style**, bukan memanggil class arsitektur `.gdds-page-wrapper`.
- **Rekomendasi Patch:** Pindahkan pengaturan `padding` dan `box-sizing` ke dalam file `index.css` di bawah class `.gdds-page-wrapper` dan hapus inline style tersebut untuk menyeragamkannya dengan `EnterpriseDocumentViewer.tsx`.

**2. Tabel Keluar dari Batas (Overflow)**
- **File:** `src/EnterpriseDocumentViewer.tsx`
- **Root Cause:** Terdapat class `min-w-[800px]` pada elemen tabel, yang memaksa tabel menjadi ~211mm, jauh melampaui batas isi `140mm`.
- **Rekomendasi Patch:** Class `min-w-[800px]` harus dihilangkan agar tabel dapat responsive mengikuti sisa lebar `140mm` dari container cetak.
