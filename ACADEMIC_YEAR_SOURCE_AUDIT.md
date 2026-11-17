# ECO-006: ACADEMIC YEAR SOURCE AUDIT
## SOURCE TRACE & IMPACT REPORT

### 1. Field apa yang digunakan Header?
Header menggunakan fungsi utilitas `getActiveAcademicYear()`.
**Path lengkap:** `settings.academicYears[].name` (di mana properti `isActive` bernilai `true`).

### 2. Field apa yang digunakan KSP Dashboard?
KSP Dashboard menggunakan hook `useKspMetadata()`.
**Path lengkap:** `metadata.academicYear` yang bersumber langsung dari `settings.education.academicYear`.

### 3. Apakah keduanya berasal dari field yang sama?
**TIDAK.**

### 4. SOURCE MISMATCH
**SOURCE MISMATCH DETECTED.**
Header membaca dari state array dinamis (`settings.academicYears`), sedangkan Dashboard KSP membaca dari state objek statis lama/legacy (`settings.education.academicYear`).

### 5. Apakah Adapter melakukan mapping Academic Year?
**YA.**
Di `src/ksp/KspMetadataAdapter.ts`, adapter memetakan nilai menggunakan:
`academicYear: settings?.education?.academicYear || ''`

### 6. Keberadaan default / fallback / hardcode / legacy mapping
- **Legacy Mapping:** Ya, KspMetadataAdapter masih mengikat diri ke `settings.education.academicYear` yang merupakan struktur lama dan tidak di-update oleh UI pengaturan *Tahun Pelajaran*.
- **Fallback / Default:** Ya. Di dalam `getActiveAcademicYear()`, terdapat fallback hardcode `${new Date().getFullYear()}/${new Date().getFullYear() + 1}` jika array `academicYears` kosong atau tidak ada yang aktif.

### 7. Apakah terdapat lebih dari satu field academicYear di Settings?
**YA.**
Di `DEFAULT_SETTINGS`, terdapat dua tempat yang menyimpan informasi tahun pelajaran:
1. `settings.academicYears` (Array data yang terhubung dengan UI *Tahun Pelajaran*).
2. `settings.education.academicYear` (Field *string* tunggal yang sudah usang dan statis).

### 8. Source Trace

**A. Trace untuk Header:**
Header
↓
`getActiveAcademicYear()`
↓
`settings.academicYears` (Array of objects)
↓
`find(y => y.isActive)`
↓
Return `.name`

**B. Trace untuk Dashboard:**
Dashboard
↓
`useKspMetadata()`
↓
`KspMetadataAdapter.adapt(settings)`
↓
`settings.education.academicYear` (Legacy field)
↓
Return *string*

### 9. Rekomendasi
Untuk menormalisasi isu ini dan menjaga prinsip *Single Source of Truth* (SSOT), disarankan:
1. **Perbaikan Adapter (Knowledge Layer):** Modifikasi `KspMetadataAdapter.adapt` agar membaca dari `settings.academicYears`. Karena Adapter adalah *Pure Function*, adapter dapat melakukan `.find(y => y.isActive)?.name` secara internal untuk mendapatkan nilai yang sah, persis seperti cara kerja Header.
2. **Pembersihan Settings (Data Layer):** Hapus properti `academicYear` dan `semester` dari objek `settings.education` (atau keseluruhan objek jika sudah tidak ada field relevan lain di dalamnya) di dalam `DEFAULT_SETTINGS` untuk mencegah *multiple sources* di masa depan.
3. **Penyelarasan Dashboard (View Layer):** Tidak ada perubahan logic yang diperlukan di Dashboard, karena perbaikan difokuskan murni di level Adapter.
