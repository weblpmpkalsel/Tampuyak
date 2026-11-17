# CHECKPOINT KSP GOLD META-001
## FINAL METADATA CONSISTENCY AUDIT

### 1. Metadata Matrix

| Metadata | Source | Dashboard | Cover | Pengesahan | BAB I | BAB II | BAB III | BAB IV | Lampiran | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Nama Sekolah** | `settings.school.name` | ✓ | ✓ | ✓ | ✓ | - | - | - | - | PASS |
| **2. NPSN** | `settings.school.npsn` | ✓ | ✓ | - | - | - | - | - | - | PASS |
| **3. Alamat** | `settings.school.address` | ✓ | ✓ | - | - | - | - | - | - | PASS |
| **4. Desa** | `settings.school.village` | ✓ | ✓ | - | ✓ | - | - | - | - | PASS |
| **5. Kecamatan** | `settings.school.district` | ✓ | ✓ | - | ✓ | - | - | - | - | PASS |
| **6. Kabupaten/Kota** | `settings.school.regency` | ✓ | ✓ | ✓ | ✓ | - | - | - | - | PASS |
| **7. Provinsi** | `settings.school.province` | ✓ | ✓ | ✓ | ✓ | - | - | - | - | PASS |
| **8. Tahun Pelajaran**| `settings.academicYears[]` | **FAIL**| **FAIL**| - | **FAIL**| - | **FAIL**| - | - | **FAIL** |
| **9. Jenjang Sekolah**| `settings.school.level` | ✓ | - | - | - | - | **FAIL**| - | - | **FAIL** |
| **10. Fase** | `Adapter` | ✓ | - | - | - | - | **FAIL**| - | - | **FAIL** |
| **11. Status Sekolah**| `settings.school.status` | ✓ | ✓ | - | ✓ | - | - | - | - | PASS |
| **12. Nama Kepsek** | `settings.principal.name` | ✓ | - | ✓ | ✓ | - | ✓ | - | - | PASS |
| **13. NIP Kepsek** | `settings.principal.nip` | ✓ | - | ✓ | - | - | - | - | - | PASS |
| **14. Jabatan Kepsek**| `settings.principal.position` | ✓ | - | ✓ | - | - | - | - | - | PASS |
| **15. Nama Pengawas** | `settings.pengawas.name` | ✓ | - | ✓ | - | - | ✓ | - | - | PASS |
| **16. NIP Pengawas** | `settings.pengawas.nip` | ✓ | - | ✓ | - | - | - | - | - | PASS |
| **17. Nama Ketua Komite**| `settings.komite.name`| ✓ | - | ✓ | - | - | - | - | - | PASS |
| **18. Nama Kadis** | `settings.kepalaDinas.name`| ✓ | - | ✓ | - | - | - | - | - | PASS |
| **19. Nomor Dokumen** | `N/A (Missing Source)` | - | - | - | - | - | - | - | - | **FAIL** |
| **20. Tanggal Penetapan**|`N/A (Missing Source)` | - | - | **FAIL**| - | - | - | - | - | **FAIL** |

---

### 2. Source Trace Report

*   **Header Aplikasi:**
    `Header` → `getActiveAcademicYear()` → `settings.academicYears[].name` (dimana isActive = true).
*   **Dashboard KSP:**
    `Dashboard` → `useKspMetadata()` → `KspMetadataAdapter.adapt(settings)`
*   **Cover (Sampul):**
    `KspDocumentAssembler` → `buildKspCoverSection(metadata)`
*   **Pengesahan:**
    `KspDocumentAssembler` → `buildKspApprovalSection(metadata)`
*   **BAB I (Karakteristik):**
    `KspDocumentAssembler` → `buildKspBab1Section(schoolContextPayload)`
*   **BAB III (Pengorganisasian):**
    `KspDocumentAssembler` → `buildKspBab3Section(learningOrgPayload)`

---

### 3. Source Mismatch Report

**A. ACADEMIC YEAR (Tahun Pelajaran)**
*   **Lokasi A (Header):** Bersumber dari array `settings.academicYears[]` (melalui fungsi `getActiveAcademicYear()`). Ini adalah Single Source of Truth yang sah dan terhubung dengan antarmuka pengguna.
*   **Lokasi B (Adapter & Document):** Bersumber dari field usang `settings.education.academicYear` pada `KspMetadataAdapter`. Seluruh dokumen (Cover, BAB I, BAB III) mewarisi nilai *legacy* yang tidak akurat ini.

**B. SCHOOL LEVEL (Jenjang Sekolah)**
*   **Lokasi A (Settings):** Bersumber dari `settings.school.level`.
*   **Lokasi B (Adapter & Dashboard):** Berhasil di-_map_ dengan benar oleh `KspMetadataAdapter`.
*   **Lokasi C (KspDocumentAssembler -> BAB III):** `learningOrgPayload.stage.schoolLevel` di-hardcode dengan string `"SMP"`. Nilai ini bocor dan mengabaikan nilai dari Adapter.

**C. TANGGAL PENETAPAN & NOMOR DOKUMEN**
*   **Lokasi A (Settings):** Field penyimpan Tanggal Penetapan Pengesahan dan Nomor Dokumen KSP belum eksis di _settings_ maupun _adapter_.
*   **Lokasi B (KspDocumentAssembler):** Di-hardcode langsung sebagai `'15 Juli 2023'` (Approval) dan `'KSP-001'` (Metadata KSP).

---

### 4. Architecture Violation Report

**VIOLATION 1: ILLEGAL HARDCODING (PHASE / FASE)**
*   **Deskripsi:** `Phase` atau `Fase` adalah _derived property_ (properti turunan) yang WAJIB dihitung HANYA oleh `KspMetadataAdapter` (sebagai _Knowledge Layer_).
*   **Temuan:** `KspDocumentAssembler.ts` melakukan pelanggaran arsitektur dengan melakukan *hardcode* nilai `educationStage: 'Fase D'` pada `learningOrgPayload`. Renderer BAB III akan secara paksa merender Fase D terlepas dari apa yang dilaporkan oleh Adapter.

---

### 5. Metadata Consistency Score
- **Total Fields Audited:** 20
- **Total PASS:** 14
- **Total FAIL:** 6
- **Consistency Score:** 70%

---

### 6. GO / NO GO
**NO GO** (Belum dapat dikunci/LOCKED).

**Tindakan yang Diperlukan (Rekomendasi Sebelum Locking):**
1. **Academic Year Patch:** `KspMetadataAdapter` harus diubah untuk membaca dari `settings.academicYears` (menyamakan _logic_ dengan Header). Hapus `settings.education.academicYear` dari `DEFAULT_SETTINGS`.
2. **KspDocumentAssembler Patch:** Hapus semua _hardcoding_ di `KspDocumentAssembler.ts`. Khususnya:
   - Ganti `'SMP'` dengan `metadata.schoolLevel`.
   - Ganti `'Fase D'` dengan `metadata.phase`.
   - Ganti `'15 Juli 2023'` dengan variabel dinamis (misalnya dari pengaturan yang akan ditambahkan kelak atau biarkan kosong *placeholder* yang sah).
3. **Missing Source Addition:** Pertimbangkan untuk menambahkan input "Tanggal Penetapan KSP" dan "Nomor Dokumen" pada *Settings* jika dipersyaratkan secara ketat, agar Assembler tidak perlu melakukan hardcode.
