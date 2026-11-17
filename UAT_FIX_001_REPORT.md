# FINAL UAT FIX-001 — REMOVE STRESS TEST OVERRIDE

## Perbaikan yang Dilakukan

- **File yang diubah:** `src/ksp/KspMetadataAdapter.ts`
- **Baris yang dihapus:** Baris 48 hingga 51.
- **Jumlah baris yang dihapus:** 4 baris.

## Validasi Data
- **School Name:** Hardcode (SEKOLAH MENGengah ATAS NEGERI 1 KOTA BANDUNG...) telah **DIHAPUS**.
- **Principal:** Hardcode (Dr. Ir. H. Budi Santoso...) telah **DIHAPUS**.
- **Supervisor:** Hardcode (Dra. Hj. Siti Aminah...) telah **DIHAPUS**.
- **Address:** Hardcode (Jalan Jenderal Sudirman Kavling 12345...) telah **DIHAPUS**.
- **Komite:** Hardcode (Prof. Dr. H. Anton Syahputra...) telah **DIHAPUS**.

## Dampak Fungsional
1. **Preview KSP:** Saat ini Preview KSP telah kembali menggunakan data metadata (`settings`) asli yang diinput oleh pengguna dari `Workspace / Context`.
2. **Browser Print:** Karena mengandalkan instance DOM yang persis sama dari layar Preview (`DedicatedKspPrintRoot`), hasil cetak juga akan menggunakan data asli pengguna.
3. **Export PDF:** Fungsi export melalui system print menu juga menggunakan rendering yang sama, bebas dari data dummy.

## Analisis Regresi RKJM, RKT, & RKAS
Penghapusan ini **dipastikan TIDAK MEREGRESI** RKJM, RKT, ataupun RKAS. Alasannya:
- `KspMetadataAdapter.ts` adalah adapter eksklusif yang hanya digunakan oleh ekosistem penyusunan KSP (di dalam hook `useKspMetadata`).
- Alur RKJM, RKT, dan RKAS menggunakan converter `DocumentRouter.generate()` yang menarik data secara langsung dari root `settings`, tanpa pernah memanggil `KspMetadataAdapter`.
- Override stress test terpisah yang berada di dalam `src/EnterpriseDocumentViewer.tsx` tidak disentuh sesuai instruksi ketat (hanya memperbaiki _root cause_ untuk KSP Preview).

Tugas selesai dan dikerjakan secara presisi tanpa restrukturisasi ataupun modifikasi komponen lain.
