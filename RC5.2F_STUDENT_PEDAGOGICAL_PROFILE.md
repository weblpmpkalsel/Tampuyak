# RC5.2F STUDENT PEDAGOGICAL PROFILE - UX DESIGN

## 1. CONTEXT
The application requires pedagogical characteristics of students (General Characteristics, Dominant Learning Needs, Learning Challenges, Student Potential) to satisfy the content requirements of KSP BAB I. Currently, only demographic statistics (total, male, female) exist in the Profile Workspace. This design adds the necessary UI elements to capture qualitative pedagogical data.

## 2. LOCATION
**Workspace:** Profile Editor (Data Sekolah)
**Tab:** Karakteristik & Lokasi (`id: "lokasi"`)
**Section:** Karakteristik Peserta Didik (Positioned below the Location/Environment characteristics)

## 3. FIELD DEFINITIONS

### 3.1. General Characteristics (Karakteristik Umum)
- **Type:** Textarea
- **Max Length:** 500 characters
- **Placeholder:** "Contoh: Sebagian besar peserta didik berasal dari keluarga petani/nelayan, memiliki kemandirian yang tinggi, dan terbiasa dengan budaya gotong royong..."
- **Knowledge Owner:** Kepala Sekolah / Tim Penyusun KSP
- **Source of Truth:** `settings.karakteristik.pesertaDidik` (Existing)

### 3.2. Dominant Learning Needs (Kebutuhan Belajar Dominan)
- **Type:** Textarea
- **Max Length:** 500 characters
- **Placeholder:** "Contoh: Membutuhkan lebih banyak pembelajaran visual dan kinestetik, penguatan literasi dasar, serta pendampingan khusus pada numerasi..."
- **Knowledge Owner:** Guru / Wali Kelas
- **Source of Truth:** `settings.karakteristik.kebutuhanBelajar` (New)

### 3.3. Learning Challenges (Tantangan Belajar / Hambatan)
- **Type:** Textarea
- **Max Length:** 500 characters
- **Placeholder:** "Contoh: Jarak tempuh dari rumah ke sekolah cukup jauh, motivasi belajar fluktuatif saat musim panen, keterbatasan perangkat TIK di rumah..."
- **Knowledge Owner:** Guru Bimbingan Konseling / Tim KSP
- **Source of Truth:** `settings.karakteristik.hambatanBelajar` (New)

### 3.4. Student Potential & Interests (Potensi dan Minat)
- **Type:** Textarea
- **Max Length:** 500 characters
- **Placeholder:** "Contoh: Memiliki minat tinggi pada bidang olahraga (terutama sepak bola) dan kesenian lokal, serta potensi kewirausahaan dari hasil alam sekitar..."
- **Knowledge Owner:** Pembina Ekstrakurikuler / Guru
- **Source of Truth:** `settings.karakteristik.potensiSiswa` (New)

### 3.5. Optional Notes (Catatan Tambahan)
- **Type:** Textarea
- **Max Length:** 500 characters
- **Placeholder:** "Catatan tambahan terkait peserta didik yang belum tercakup di atas..."
- **Knowledge Owner:** Kepala Sekolah / Tim Penyusun KSP
- **Source of Truth:** `settings.karakteristik.catatanPesertaDidik` (New)

## 4. UI/UX BEHAVIOR
- **Form Layout:** Displayed as a grouped section (Card or Panel) titled "Karakteristik & Profil Pedagogis Peserta Didik" within the "Karakteristik & Lokasi" tab.
- **Save Action:** Auto-save or manual save alongside existing characteristic fields, updating the Workspace State (`settings.karakteristik`).
- **Data Flow Expectation:** Once populated, these fields will be mapped in `KspMetadataAdapter.ts` to `rawStudents` (e.g., mapping `settings.karakteristik.kebutuhanBelajar` to `dominantLearningNeeds`) and projected into BAB I without mock data.
