# CHECKPOINT OMEGA-ARCH-01 — PAGE WRAPPER DESIGN

Berdasarkan analisis arsitektur Print Engine saat ini (yang tidak memiliki konsep fisik halaman secara eksplisit dan murni mengandalkan browser), berikut rancangan **Enterprise Page Wrapper** yang dapat diimplementasikan tanpa menyentuh Pipeline, Builder, maupun layer Data.

### 1. Komponen Apa yang Menjadi Page Wrapper
**Page Wrapper** bukanlah sebuah service atau engine JavaScript baru, melainkan sebuah **komponen struktural DOM pasif (HTML Tag)** yang murni bertipe `display: block`. 
Komponen ini bertugas sebagai pelindung (isolator) antara Print Engine bawaan browser (Chrome Print Flow) dengan konten presentasi. Wrapper ini secara eksklusif memegang instruksi paginasi CSS (seperti `page-break-before: always` atau `page-break-after: always`), membebaskan konten di dalamnya dari konflik layout (seperti Flexbox atau Grid) saat dicetak.

### 2. Di Mana Wrapper Ditempatkan
Wrapper ditempatkan murni di lapisan presentasi terluar pada masing-masing renderer utama:
- **`EnterpriseDocumentViewerContent` (Untuk RKJM, RKT, RKAS):** Ditempatkan langsung mengelilingi elemen root dari blok statis (Cover, Lembar Pengesahan, Daftar Isi) dan di dalam iterasi `document.chapters.map`.
- **`CanonicalRenderer` (Untuk KSP):** Ditempatkan di dalam iterasi `document.content.sections.map`, mengelilingi setiap blok hasil render seksi.

### 3. Bagaimana Wrapper Membaca Informasi Section Tanpa Mengubah Builder
Wrapper tidak perlu meminta data baru dari Builder. Komponen renderer saat ini sudah memiliki informasi yang cukup:
- Di `EnterpriseDocumentViewerContent`, seksi Cover, Approval, dan TOC dirender secara hardcode berurutan. Wrapper cukup diletakkan membungkus blok-blok tersebut secara statis, dan secara dinamis membungkus setiap elemen `chapter` dalam perulangan.
- Di `CanonicalRenderer`, objek `section` dari `CanonicalDocument` sudah membawa tipe (seperti `chapterId` atau `type`). Wrapper cukup membaca apakah iterasi saat ini adalah seksi baru, lalu menerapkan instruksi `page-break-before` (kecuali pada elemen pertama/Cover).

### 4. Mengapa Desain Ini Tidak Meregresi RKJM, RKT, RKAS, dan KSP
- **Data & Business Logic Tetap:** Desain ini sama sekali tidak menyentuh Knowledge Graph, DocumentRouter, DocumentBuilder, ataupun metadata. Proses penyusunan dokumen (Document Composition) tidak menyadari adanya perubahan ini.
- **Visual Presentation Tetap:** Isi dari dokumen (seperti flexbox cover, layout tabel, dan format teks) tidak diubah sama sekali. Wrapper bertipe `display: block` bersifat transparan terhadap layout layar (screen) dan hanya bertindak tegas pada media cetak (`@print`).
- **Targeted Scope:** Modifikasi hanya terjadi di layer DOM terluar, mencegah efek domino pada hierarki CSS komponen di bawahnya.

### 5. Bagaimana Migrasi Dilakukan dengan Perubahan Seminimal Mungkin
1. **Definisi CSS Minimal:** Membuat satu atau dua utilitas CSS dasar (misalnya `.enterprise-page-wrapper { display: block !important; break-inside: auto; }`).
2. **Isolasi Paginasi:** Mencabut seluruh atribut `page-break-before`, `page-break-after`, dan `print-no-break` yang saat ini menempel pada elemen container presentasi (elemen yang menggunakan `flex` atau `grid`).
3. **Penyisipan Wrapper:** Membungkus setiap blok utama (Cover, Pengesahan, TOC, BAB, Lampiran) dengan elemen `div` baru berspesifikasi `.enterprise-page-wrapper` yang memegang kendali paginasi.
4. **Eksekusi:** Migrasi ini hanya melibatkan modifikasi sintaks JSX pada fungsi render di `EnterpriseDocumentViewer.tsx` dan `CanonicalRenderer.tsx`.
