# ECO-002: EDUCATION LEVEL VALIDATION
## SCIENTIFIC FIDELITY AUDIT

### 1. Field yang Digunakan
Field yang digunakan sebagai sumber data saat ini adalah `metadata.schoolName`.

### 2. Apakah Berasal dari Settings?
**TIDAK** secara langsung.
Tidak ada field `educationLevel` atau `phase` yang disimpan secara persisten di dalam Settings (Data). Sistem membaca field `schoolName` yang berasal dari Settings.

### 3. Apakah Masih Menggunakan Fungsi Inferensi?
**YA**.
Sistem mencoba menebak (inferensi) Education Level dan Phase berdasarkan _string matching_ terhadap nama sekolah.

### 4. Lokasi File dan Fungsi
- **File**: `src/ksp/KSPDashboard.tsx`
- **Baris**: 49
- **Logika Inferensi (Ternary/Regex)**:
  `{metadata.schoolName?.includes("SMP") ? "SMP (Fase D)" : "SMA (Fase E/F)"}`

### 5. Asal Usul Perhitungan Phase
Dihitung otomatis (hardcode) bersamaan dengan pengecekan nama sekolah. Jika mengandung "SMP", paksa "Fase D". Jika bukan, paksa "SMA (Fase E/F)".

### 6. Rekomendasi (Berdasarkan Enterprise Constitution)
Berdasarkan CDS-001 (**RULE 005: Settings menjadi sumber identitas**), _Education Level_ dan _Phase_ merupakan fakta struktural absolut (Master Data Satuan Pendidikan), **BUKAN** sesuatu yang boleh ditebak (inferensi) dari sekadar nama sekolah. (Contoh cacat logika saat ini: Sekolah bernama "Madrasah Tsanawiyah" atau "Sekolah Alam" akan terdeteksi sebagai "SMA" karena tidak mengandung string "SMP").

**Rekomendasi Perbaikan (Sesuai Enterprise Constitution):**
1. **Settings Layer**: Tambahkan field struktural `educationLevel` (SD/SMP/SMA/SMK) di dalam entitas `school` di Settings.
2. **Knowledge Layer (Adapter)**: Petakan data mentah tersebut dari Settings dan gunakan _Mapping Dictionary_ resmi untuk menghitung *Phase* (misal: SMP -> Fase D, SMA -> Fase E/F) di `KspMetadataAdapter`.
3. **Presentation Layer (Dashboard/Builder)**: `KSPDashboard.tsx` dan `KspDocumentAssembler` dilarang keras melakukan `.includes()` atau _guessing_. Mereka hanya boleh mengkonsumsi output pasti seperti `metadata.educationLevel` dan `metadata.phase`.
