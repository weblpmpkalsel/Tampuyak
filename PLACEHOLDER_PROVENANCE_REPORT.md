# PLACEHOLDER PROVENANCE REPORT & ARCHITECTURE COMPLIANCE

### 1. Lokasi Placeholder
Placeholder (data *dummy* mengenai `totalStudents`, `genderDistribution`, `generalCharacteristics`, dan `dominantLearningNeeds`) berada pada file:
`src/enterprise/document/ksp/KspDocumentAssembler.ts`

### 2. Layer Lokasi
Placeholder saat ini di-inject di dalam level **Assembler** (`KspDocumentAssembler`).

### 3. Apakah Builder membuat data?
**TIDAK.** `SchoolContextBuilder` (*Knowledge Layer*) dan `KspBab1Structure` (*Document Layer*) murni bertindak sebagai penerima (*consumer*). Mereka mematuhi prinsip arsitektur yang benar dengan hanya memproses objek *payload* yang diberikan dari luar tanpa mengarang atau menyimpan data secara hardcode.

### 4. Apakah Assembler membuat data?
**YA.** `KspDocumentAssembler` saat ini mendefinisikan (hardcode) objek data `students` ke dalam instruksi pemanggilan builder (`schoolContextPayload`).

### 5. Sumber Data Domain
Sesuai arsitektur, Domain dirancang secara ketat untuk **menerima data dari luar** (melalui parameter).

### 6. Sifat Implementasi
Implementasi _hardcode_ data ini **bersifat sementara untuk Preview**. Ini dilakukan untuk memvalidasi fungsi render komponen pada Sprint 6.0 sebelum lapisan State Management / UI siap memberikan data aslinya. Jika tidak diperbaiki, data ini akan ikut ke Production dan mencetak nilai (320 siswa) yang sama pada semua dokumen KSP sekolah apa pun.

### 7. Rekomendasi
Untuk memindahkan placeholder ke lokasi yang sesuai tanpa mengubah keutuhan Enterprise Foundation:
1. **Tambahkan Skema di Metadata Layer**: Tambahkan field representasi data Peserta Didik pada `KspMetadata` dan proses pengambilannya pada `KspMetadataAdapter.adapt(settings)` (misal, meresolve dari state `settings.karakteristik` atau memberikan nilai *fallback* sementara hanya jika tidak ditemukan data).
2. **Bersihkan Assembler**: Ganti *hardcoded object* di dalam `KspDocumentAssembler` agar membaca murni dari `metadata.students` atau _property_ serupa. Assembler harus kembali "bodoh" dan semata-mata mengalirkan parameter dari sumber ke builder.
3. Dengan melakukan ini, arsitektur menjadi bersih: Data disuplai oleh *Adapter*, disusun oleh *Assembler*, dibentuk oleh *Builder*, dan di-_render_ oleh *Document Layer*.

---
### GO / NO GO
**GO** (Laporan Selesai - Struktur Foundation aman, target selanjutnya adalah pembersihan _hardcode_ dari lapisan Assembler ke lapisan yang berwenang).
