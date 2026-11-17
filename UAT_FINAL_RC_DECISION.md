# FINAL RC DECISION — KSP EXPORT FEATURE

Berdasarkan audit UI dan Feature Readiness untuk fase Final RC-UAT, berikut adalah status fitur pada KSP beserta rekomendasi UX penanganannya agar tidak memberikan ekspektasi palsu kepada pengguna.

## STATUS FEATURE READINESS

| Feature | Status | Keterangan |
| :--- | :--- | :--- |
| **Preview** | Ready | Fitur berjalan dengan baik melalui `DedicatedKspPrintRoot` dan `CanonicalRenderer`. |
| **Browser Print** | Ready | Menggunakan DOM yang sama dengan preview, diisolasi secara stabil melalui Generic Page Wrapper, memanggil `window.print()`. |
| **Export PDF** | Not Ready | Saat ini hanyalah *shortcut* (alias) yang memanggil `window.print()`. Tidak ada implementasi ekspor PDF via `html2pdf`. |
| **Export DOCX** | Not Ready | Saat ini hanyalah *shortcut* (alias) yang memanggil `window.print()`. Tidak ada implementasi native ke dokumen DOCX untuk struktur `CanonicalDocument`. |

## REKOMENDASI UI/UX

**Pilihan Terbaik: Badge "Coming Soon" (Disable sementara dengan informasi visual)**

**Alasan Teknis & UX:**
- **Hidden sementara** dapat menimbulkan spekulasi atau pertanyaan dari *stakeholder/user* ("Apakah aplikasi ini selamanya tidak bisa diekspor ke PDF/DOCX?"). 
- Menghapus tombol sama sekali membuat UI terlihat tidak konsisten dengan dokumen lain (RKJM, RKT, RKAS) yang memiliki fitur tersebut.
- Menyematkan **Badge "Coming Soon"** (sambil melakukan *Disable/Greyed-out* pada tombol) adalah pendekatan paling aman, transparan, dan profesional. Hal ini secara eksplisit mengomunikasikan bahwa fitur ini masuk ke dalam _roadmap_ namun tidak disertakan dalam versi RC-UAT saat ini (mencegah komplain ekspektasi palsu saat presentasi).

## LANGKAH TINDAKAN (TIDAK ADA KODE YANG DITULIS)
Jika disetujui untuk diimplementasi kelak, pada `KspPreviewWorkspace.tsx`, tombol ekspor PDF dan DOCX cukup diubah properti `disabled={true}` dan ditambahkan badge UI kecil bertuliskan "Coming Soon", tanpa menyentuh layer arsitektur `DocumentExportEngine` maupun logika paginasi.
