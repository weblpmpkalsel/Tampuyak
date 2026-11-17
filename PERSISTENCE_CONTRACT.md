# PERSISTENCE CONTRACT: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Fase:** S6.5 Persistence Contract
**Status:** FINAL (Safe Mode)

## 1. TUJUAN

Dokumen ini mendefinisikan Kontrak Penyimpanan (Persistence Contract) untuk Modul Supervisi Akademik. Kontrak ini berupa _interface_ (Repository Pattern) yang akan digunakan oleh _Application Service_ atau layer lain yang membutuhkan akses data. 

Pendekatan abstraksi ini memastikan bahwa Modul Supervisi Akademik tidak terikat (*coupled*) secara langsung dengan implementasi basis data atau penyimpanan nyata tertentu (seperti Firebase, IndexedDB, atau LocalStorage), sehingga sewaktu-waktu implementasinya dapat ditukar (*swappable*) tanpa mengganggu fungsionalitas.

## 2. KONTRAK IMPLEMENTASI (THE NO'S)

- **NO Concrete Implementation:** Dokumen ini dan _PersistenceContracts.ts_ hanya berisi definisi struktur dan antarmuka (_interfaces_), bukan logika cara penyimpanan data.
- **NO Third-Party Coupling:** Tidak ada pemanggilan ke Firebase SDK, _fetch_, _axios_, atau API spesifik *browser* (`localStorage`, `sessionStorage`, IndexedDB API).
- **NO React:** Tidak boleh ada React Context atau Hook pada _layer_ ini.

## 3. DESIGN KONTRAK (REPOSITORY PATTERN)

Semua repositori mengikuti pola CRUD sederhana dan ditambahkan operasi pengarsipan (*Archive & Restore*) untuk manajemen data dengan konsep *soft delete*. Antarmuka repositori yang tersedia:
- `SupervisionRepository`
- `ObservationRepository`
- `RecommendationRepository`
- `EvidenceRepository`
- `AttachmentRepository`
- `AuditTrailRepository`

Setiap Repositori mewajibkan adanya implementasi _method_ asinkron berikut:
- `create()`
- `update()`
- `delete()`
- `findById()`
- `findAll()`
- `archive()`
- `restore()`

## 4. METADATA & VERSIONING

Terdapat antarmuka ekstensi metadata pada kontrak penyimpanan:
- **`VersionedEntity`**: Mendukung skema _optimistic locking_ atau rekam versi dokumen.
- **`SoftDeleteEntity`**: Menandai data sebagai terhapus namun tidak benar-benar dihilangkan dari basis data.
- **`AuditableEntity`**: Melacak `createdBy` dan `updatedBy`.
- **`SnapshotEntity<T>`**: Memastikan struktur _immutable_ dengan kata kunci `readonly` pada tipe data _snapshot_ dari modul luar (KSP/RKT/Kalender/Guru) sehingga mematuhi aturan utama _Safe Implementation_.

## 5. DTO PENYIMPANAN

Untuk operasi yang lebih spesifik ketimbang sekadar menggunakan Domain Model mentah, disediakan DTO khusus penyimpanan:
- `CreateSupervisionRecordDTO`
- `UpdateObservationDTO`
- `ArchiveRecommendationDTO`
- `RestoreEvidenceDTO`

## 6. STANDARISASI ERROR (ERROR CONTRACT)

Semua Error yang terjadi saat eksekusi persistensi dibungkus di dalam _Custom Error_ untuk memudahkan validasi _error-handling_ pada layer pemanggil:
- `RepositoryError`: _Base error class_
- `RecordNotFound`
- `DuplicateRecord`
- `ValidationError`
- `StorageUnavailable`

## 7. KESIMPULAN

Struktur Repository (_Persistence Contracts_) telah selesai dibuat dan diverifikasi *zero-impact*. Kode ini tidak melakukan eksekusi apapun selain penyediaan kerangka tipe. Modul akan siap menggunakan *Storage Adapter* konkrit jika diimplementasikan pada _checkpoint_ berikutnya.
