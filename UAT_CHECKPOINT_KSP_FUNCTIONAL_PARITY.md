# FINAL UAT — KSP FUNCTIONAL PARITY AUDIT

Berdasarkan audit mendalam terhadap sistem, telah ditemukan **perbedaan implementasi fundamental** antara alur ekspor dokumen RKJM (dan dokumen enterprise lama) dengan KSP. KSP saat ini menggunakan mekanisme *mock/placeholder* untuk fitur ekspornya.

Berikut adalah tabel matriks paritas fungsional:

| Fitur | RKJM | KSP | Sama/Berbeda | Penyebab |
| :--- | :--- | :--- | :--- | :--- |
| **Print Browser** | - **File:** `src/Tampuyak.tsx`<br/>- **Mode:** Render `PrintDocumentRenderer` yang secara reaktif menampilkan dokumen untuk siap di-print.<br/>- **Pipeline:** `generateAppDocument()` -> `EnterpriseDocumentViewer`. | - **File:** `src/enterprise/workspace/preview/KspPreviewWorkspace.tsx`<br/>- **Event:** `onClick` inline button.<br/>- **Action:** Menyembunyikan `#print-guard` dan memanggil `window.print()`.<br/>- **Pipeline:** Me-render `DedicatedKspPrintRoot` melalui React Portal. | **Berbeda** | KSP memiliki Workspace mandiri (`KspPreviewWorkspace.tsx`) yang terpisah dari legacy print modal `Tampuyak.tsx`. |
| **Export PDF** | - **Event Handler:** `handleExportClick()` di `Tampuyak.tsx`<br/>- **Generator:** `DocumentExportEngine.ts` -> `generatePDF()`<br/>- **Library:** Memanfaatkan *html2pdf.js* untuk meng-capture elemen DOM `#printable-doc-export`. | - **Event Handler:** Inline anonymous function.<br/>- **Action:** Hanya memanggil `window.print()` (Sama persis dengan Print Browser).<br/>- **Generator:** Tidak ada (menyerahkan ke PDF printer bawaan browser). | **Berbeda (KSP tidak punya PDF Generator Asli)** | KSP belum diintegrasikan ke `DocumentExportEngine`. Tombol "Export PDF" di UI KSP saat ini hanyalah alias fiktif untuk memicu `window.print()`. |
| **Export DOCX** | - **Event Handler:** `handleExportClick(true)` di `Tampuyak.tsx`<br/>- **Generator:** `DocumentExportEngine.ts` -> `generateDocx()`<br/>- **Library:** Memanfaatkan *docx* (npm package) dan membangun struktur Office secara programatik dari model `DocumentChapter`. | - **Event Handler:** Inline anonymous function.<br/>- **Action:** Hanya memanggil `window.print()` (Sama persis dengan Print Browser dan Export PDF).<br/>- **Generator:** Tidak ada. Menghasilkan PDF dari browser, bukan file .docx. | **Berbeda (KSP tidak bisa menghasilkan DOCX)** | Engine `generateDocx()` saat ini terikat pada (tightly coupled) struktur `DocumentModel` lama (Cover, Approval, TOC, Chapter1-5), sehingga gagal/tidak kompatibel mengonsumsi arsitektur baru `CanonicalDocument` milik KSP. Oleh karena itu, pengembang sebelumnya menempelkan `window.print()` sebagai *shortcut*. |

### Rangkuman Penjelasan Teknis

1. **RKJM menggunakan `DocumentExportEngine`:** 
   RKJM memiliki *pipeline* yang mengumpulkan data *Knowledge Graph* melalui `generateAppDocument()`, mengubahnya menjadi `DocumentModel`, lalu mengoper model tersebut ke `DocumentExportEngine`. Engine ini memiliki kapabilitas *Native PDF Capture* (`html2pdf`) dan *Native DOCX Generation* (`docx`).

2. **KSP hanya bergantung pada Chrome Print Flow:**
   KSP dirancang menggunakan arsitektur `CanonicalDocument` dan dirender menggunakan `CanonicalRenderer` di React Portal khusus (`DedicatedKspPrintRoot`). Saat ini, tombol Export PDF maupun Export DOCX di KSP secara harfiah hanyalah *hardcoded script* berikut:
   ```javascript
   onClick={() => {
     const guard = window.document.getElementById('print-guard');
     if (guard) guard.style.setProperty('display', 'none', 'important');
     window.print();
     // ...
   }}
   ```

3. **Alasan Utama KSP Berbeda:**
   KSP tidak dapat menggunakan `DocumentExportEngine` lama untuk DOCX karena data structure-nya berbeda jauh. `DocumentModel` RKJM mengharapkan struktur statis (Bab 1, Bab 2, dll), sedangkan `CanonicalDocument` KSP bersifat dinamis (Sections/Blocks). Daripada menulis ulang DOCX generator untuk struktur Canonical, implementasi sementara hanya menyambungkannya ke perintah `window.print()`.
