# Root Cause Library

## Concept
The Root Cause Library maps low-performing Education Report (Rapor Pendidikan) indicators to a set of probable underlying issues. The Reasoning Engine uses this to generate hypotheses before recommending interventions.

## Example Mappings

### 1. Indicator: A.1 (Kemampuan Literasi Rendah)
**Probable Root Causes:**
- **RC-LIT-01:** Kurangnya budaya membaca siswa di luar jam pelajaran.
- **RC-LIT-02:** Terbatasnya ketersediaan buku bacaan non-teks di perpustakaan.
- **RC-LIT-03:** Kurangnya kompetensi pedagogik guru dalam menerapkan strategi literasi lintas mata pelajaran.
- **RC-LIT-04:** Kurangnya pelibatan orang tua dalam mendampingi literasi anak di rumah.

### 2. Indicator: A.2 (Kemampuan Numerasi Rendah)
**Probable Root Causes:**
- **RC-NUM-01:** Metode pengajaran matematika masih bersifat konvensional dan abstrak.
- **RC-NUM-02:** Kurangnya ketersediaan alat peraga matematika yang relevan.
- **RC-NUM-03:** Guru belum optimal mengintegrasikan konsep numerasi dalam pemecahan masalah sehari-hari.

### 3. Indicator: D.1 (Kualitas Pembelajaran Belum Optimal)
**Probable Root Causes:**
- **RC-QAL-01:** Guru belum sepenuhnya memahami dan mengimplementasikan pembelajaran berdiferensiasi.
- **RC-QAL-02:** Supervisi akademik oleh kepala sekolah belum berjalan secara berkesinambungan.
- **RC-QAL-03:** Iklim kelas kurang kondusif karena tingginya beban administrasi guru.

## Engine Integration
When an indicator falls below the benchmark, the Reasoning Engine assigns a **Confidence Score** to each applicable root cause based on the School Context Engine (e.g., if the school has no library facility, RC-LIT-02 gets a 99% confidence score).
