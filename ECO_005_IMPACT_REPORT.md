# ECO-005: DOCUMENT COMPOSITION ENGINE IMPACT AUDIT

### 1. Mengapa file ini ikut berubah?
File `DocumentCompositionEngine.ts` ikut berubah karena `Chapter1Builder.ts` yang menangani dokumen RKJM diubah pada ECO-004 untuk tidak lagi menerima raw `settings`, melainkan menerima `metadata` murni yang telah diadaptasi. Karena `DocumentCompositionEngine.ts` adalah orkestrator yang memanggil `chapter1Builder.build(kg, settings)`, maka argumen panggilannya perlu disesuaikan.

### 2. Bagian mana yang berubah?
*   **import**: Menambahkan `import { KspMetadataAdapter } from '../ksp/KspMetadataAdapter';`.
*   **business logic**: Mengubah instansiasi variabel argumen dengan menambahkan logika `const kspMetadata = KspMetadataAdapter.adapt(settings); const metadata = { ...settings, ...kspMetadata };`.
*   **parameter pass (function signature di internal panggil)**: Mengganti argumen `settings` menjadi `metadata` saat memanggil `this.chapter1Builder.build(kg, metadata);`.

### 3. Apakah perubahan tersebut hanya untuk KSP?
**TIDAK.** KspMetadataAdapter sejatinya dibuat untuk KSP, namun disuntikkan ke dalam `DocumentCompositionEngine` yang memproduksi dokumen RKJM.

### 4. Apakah RKJM menggunakan file ini?
**YA.** Berdasarkan `DocumentRouter.ts`, rute `rkjm` menggunakan `DocumentCompositionEngine`.

### 5. Apakah RKT menggunakan file ini?
**TIDAK.** RKT menggunakan `RKTDocumentBuilder.ts`.

### 6. Apakah RKAS menggunakan file ini?
**TIDAK.** RKAS menggunakan `RKASDocumentBuilder.ts`.

### 7. Apakah perubahan dapat mempengaruhi dokumen selain KSP?
**YA.** Perubahan ini SECARA LANGSUNG mempengaruhi RKJM. `DocumentCompositionEngine.ts` adalah milik RKJM. RKJM yang semula mengambil nilai profil sekolah langsung dari `settings` kini mengkombinasikannya dengan field bentukan `KspMetadataAdapter` (seperti `schoolLevel` dan `phase`). RKJM tidak rusak, namun kini menggunakan properti metadata milik KSP.

### 8. Apakah perubahan hanya berupa Dependency Injection? Atau mengubah alur DocumentCompositionEngine?
Perubahan ini adalah **Dependency Injection (Data Transformation)**. Alur (flow) `composeDocument` tidak berubah, jumlah builder yang dipanggil tetap sama, namun payload data yang disuntikkan ke `Chapter1Builder` mengalami penambahan atribut dari adapter.

### 9. Diff Summary
*   **Sebelum:** `composeDocument(kg, settings)` langsung meneruskan `settings` mentah ke `chapter1Builder.build(kg, settings)`.
*   **Sesudah:** `composeDocument(kg, settings)` membungkus `settings` dengan data dari `KspMetadataAdapter`, lalu meneruskan `metadata` gabungan ke `chapter1Builder.build(kg, metadata)`.

### 10. Risk Assessment
**LOW**
**Alasan:**
Perubahan bersifat _additive_ (menambah properti baru melalui _spread operator_ `{...settings, ...kspMetadata}`). Properti bawaan RKJM tetap ada. `Chapter1Builder` (milik RKJM) telah disesuaikan di ECO-004 untuk membaca properti baru tersebut (`metadata.schoolLevel`). Tidak ada _breaking changes_ karena properti esensial tidak dihapus dari _payload_.

**GO / NO GO**
**GO** (Aman).
