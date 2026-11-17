# ECO-008B: DOMAIN PRODUCER MIGRATION (STUDENT CHARACTERISTIC)
## IMPLEMENTATION SPECIFICATION

### 1. Migration Specification

**Lokasi Producer yang Benar:**
Lokasi yang tepat untuk menjadi *Producer* dari `StudentCharacteristicDomain` adalah **`SchoolContextBuilder`** (di dalam Knowledge Layer), dan didukung oleh *Knowledge Services* terkait (misalnya `SchoolContextService`).

**Alasan Ilmiah & Arsitektural:**
Menurut *Canonical Domain Standard (CDS)*, *Knowledge Layer* berfungsi sebagai pabrik (factory) yang merangkai dan memvalidasi observasi mentah (*raw data*) menjadi Pengetahuan Kanonikal (*Canonical Knowledge*). Karakteristik Peserta Didik secara semantik adalah bagian dari Konteks Sekolah (*School Context*). Memusatkan produksi pada `SchoolContextBuilder` memastikan seluruh elemen ekosistem internal (Siswa, PTK, Fasilitas, Budaya) diproduksi secara holistik dalam satu _Knowledge Graph_ tanpa perlu membuat layanan pembangun (_builder_) baru yang memecah kohesi domain.

**Aliran Data (Data Flow) Baru:**
```text
[Observation] (Input dari pengguna / Adapter)
      ↓
[Knowledge Source] (Raw Data / State)
      ↓
[StudentCharacteristicDomain] (Dibentuk dan divallidasi)
      ↓
[SchoolContextBuilder] (Mengemas ke dalam SchoolContextKnowledgePayload)
      ↓
[KspDocumentAssembler] (Hanya meneruskan payload, tanpa menyentuh isi)
      ↓
[KspBab1Structure] (Menerjemahkan payload menjadi node teks/paragraf)
      ↓
[Canonical Document] (Siap di-render oleh DocumentViewer)
```

### 2. Responsibility Matrix

| Komponen | Peran / Tanggung Jawab |
| :--- | :--- |
| **KspMetadataAdapter** | **Provide Observation:** Mengambil state mentah dari Settings dan menyediakannya sebagai input bagi Knowledge Layer. |
| **SchoolContextService** | **Process Knowledge:** Memvalidasi kelengkapan data karakteristik mentah. |
| **SchoolContextBuilder** | **Produce Domain:** Merakit `StudentCharacteristicDomain` menjadi payload kanonikal yang solid. |
| **KspDocumentAssembler** | **Consume & Route Domain:** Mengambil payload dari lapisan atas dan meneruskannya (pass-through) ke Document Builder tanpa memodifikasi atau membuat data. |
| **KspBab1Structure** | **Render Domain:** Menerjemahkan `StudentCharacteristicDomain` menjadi `DocumentBlock` (Teks, Heading, List) murni. |

### 3. Dependency Matrix (Impact Analysis)

1. **`src/enterprise/knowledge/builders/SchoolContextBuilder.ts`**
   - *Peran Saat Ini:* Mendefinisikan interface, namun mengandalkan input luar secara pasif tanpa merangkum dari entitas domain secara penuh.
   - *Peran Sesudah Migrasi:* Menjadi *Producer* resmi. Akan mengekstrak data dari hasil _Service_ (seperti `SchoolContextService`) untuk menghasilkan blok `students` di dalam `SchoolContextKnowledgePayload`.

2. **`src/enterprise/document/ksp/KspDocumentAssembler.ts`**
   - *Peran Saat Ini:* Melakukan *hardcoding* data `students: { totalStudents: 320, ... }`.
   - *Peran Sesudah Migrasi:* Pembersihan total dari literal objek. Akan menjadi *Consumer* murni: `students: metadata.students` (atau serupa). Tidak boleh ada _default values_, placeholder, atau pembentukan objek doman di sini.

### 4. Acceptance Criteria

Migrasi dinyatakan selesai dan sukses jika:
1. **[  ]** Tidak ada struktur *literal object* (`students: { ... }`) di dalam `KspDocumentAssembler.ts`.
2. **[  ]** `StudentCharacteristicDomain` 100% dirakit dan diproduksi dari area `SchoolContextBuilder` / `SchoolContextService` (Knowledge Layer).
3. **[  ]** `KspDocumentAssembler` hanya menerima Domain secara *pass-through* (via parameter `metadata` atau sumber eksternal lainnya).
4. **[  ]** `KspBab1Structure` hanya menerima payload yang sudah dirakit dan mengubahnya menjadi narasi paragraf (tidak ada *logic* pengisian kekosongan data selain *fallback string*).

### 5. Reusability Blueprint

**YA, Pola ini SANGAT BISA Didaur Ulang.**
Pola yang sama (*Observation -> Knowledge Service -> Builder -> Assembler -> Document Renderer*) akan menjadi **REFERENCE IMPLEMENTATION** (Kerangka Referensi) yang baku untuk menyusun domain selanjutnya.

**Pola Umum untuk Domain B-F:**
- **Domain B (Karakteristik PTK):** Dibuat *Knowledge Model* `TeacherCharacteristicDomain` -> Diproduksi di `SchoolContextBuilder` -> Dilewatkan oleh Assembler -> Dirender di BAB I.
- **Domain C (Sosial Budaya):** Dibuat `SocialCultureDomain` -> Diproduksi di `SchoolContextBuilder` -> Dilewatkan oleh Assembler -> Dirender di BAB I.
- **Domain D & E (Lingkungan & Kemitraan):** Diproses dengan jalur yang sama identik.
- **Kesimpulan:** Tidak ada lagi variasi atau eksperimen alur kerja antar subbab. Satu arsitektur *pass-through* melayani semua.

### 6. Regression Boundary

Migrasi ini **TIDAK AKAN** menyentuh dan dipastikan aman bagi komponen berikut:
- [x] RKJM (Rencana Kerja Jangka Menengah)
- [x] RKT (Rencana Kerja Tahunan)
- [x] RKAS (Rencana Kegiatan dan Anggaran Sekolah)
- [x] Settings UI & Core State Schema
- [x] KspMetadataAdapter (kecuali sekadar penambahan mapping _property_ yang tidak merusak property lama)
- [x] Dokumen Publishing & Print Services
- [x] Backup & Restore Services

### 7. Risk Assessment

**Level Risiko: SAFE (SANGAT RENDAH)**
- Tidak ada penghapusan fitur *business logic*.
- Hanya merupakan relokasi tanggung jawab (*responsibility shift*) pembuat objek (dari Assembler ke Knowledge Builder).
- TypeScript Compiler akan langsung menangkap kesalahan jika ada *interface* yang bocor.

### 8. GO / NO GO

**GO**
(Spesifikasi disetujui. Siap dieksekusi oleh tim Engineering sesuai prinsip TEC-009 dan CDS).
