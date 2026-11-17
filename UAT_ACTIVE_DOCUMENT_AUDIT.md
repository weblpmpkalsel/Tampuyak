# FINAL UAT CHECKPOINT 1 — ACTIVE DOCUMENT AUDIT

### 1. Dari mana masing-masing komponen mengambil object document?
- **`KspPreviewWorkspace`**: Membuat dan memegang instance dokumen secara mandiri di dalam state dengan memanggil fungsi `assembleKspDocument(metadata)` (metadata didapat dari context aplikasi via `useKspMetadata`).
- **`EnterpriseDocumentViewer`**: Mengambil dari props `document`. Dokumen ini di-generate oleh `DocumentRouter.generate()` (biasanya dibungkus di dalam fungsi `generateAppDocument()`). Komponen ini **tidak digunakan sama sekali** dalam alur cetak KSP saat ini.
- **`CanonicalRenderer`**: Mengambil dari props `document`. Dalam layar preview, props ini disuplai oleh `KspPreviewWorkspace`.
- **`DedicatedKspPrintRoot`**: Mengambil dari props `document`, yang juga disuplai langsung oleh `KspPreviewWorkspace`.
- **Print Browser / Export PDF**: Tidak memegang objek data, melainkan langsung menangkap hasil render DOM yang dihasilkan oleh `DedicatedKspPrintRoot` (saat media `@print` aktif).

### 2. Apakah semuanya menggunakan instance document yang sama?
- **YA (Untuk alur KSP)**: `KspPreviewWorkspace`, `CanonicalRenderer`, dan `DedicatedKspPrintRoot` menggunakan instance memori (`CanonicalDocument`) yang **persis sama**, memastikan tidak ada perbedaan data antara layar pratinjau dan kertas cetak.
- **TIDAK (Untuk EnterpriseDocumentViewer)**: Jika dokumen melewati `EnterpriseDocumentViewer` (misal RKJM/RKT), dokumen tersebut merupakan instance yang terpisah dan sudah dikonversi bentuknya menjadi format lama (`DocumentModel`).

### 3. Apakah ada fallback (sample data, mock, dll)?
- Di dalam arsitektur baru KSP (`KspPreviewWorkspace` -> `CanonicalRenderer`), **TIDAK ADA** fallback atau mock data. Data murni ditarik dari context (`settings`).
- Di dalam arsitektur lama / converter (`DocumentRouter.ts` -> `EnterpriseDocumentViewer`), **ADA FALLBACK (Mock Data)**. Jika data dari context kosong, sistem akan menyuntikkan data dummy.
- Di dalam `Tampuyak.tsx`, juga terdapat fallback ke memori cache (`cachedDocumentModel`).

### 4. File dan baris yang menggunakan document selain active KSP
**A. Fallback Mock Data (di dalam converter dokumen):**
- File: `src/document/DocumentRouter.ts`
- Baris: 160-176 (Berisi hardcode string mock seperti `"Sekolah Dasar Negeri"`, `"12345678"`, `"198001012010011001"`, `"Dinas Pendidikan Provinsi"` untuk mengisi properti yang kosong).

**B. Penggunaan EnterpriseDocumentViewer untuk RKJM, RKT, RKAS (Bukan KSP Aktif):**
- File: `src/Tampuyak.tsx`
- Baris: 227 (update `documentModel` di handler)
- Baris: 361 & 12430 (render `EnterpriseDocumentViewer` untuk aktif mode umum)
- Baris: 10491 (generate `documentModel` untuk RKAS)
- Baris: 10701 (generate `documentModel` untuk RKJM)
- Baris: 13304 (fallback merender `cachedDocumentModel` jika dokumen di-cache saat error re-hydrate)
