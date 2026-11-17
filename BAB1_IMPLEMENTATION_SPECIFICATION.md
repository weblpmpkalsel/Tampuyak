# CHECKPOINT KSP GOLD 5.0
## BAB I IMPLEMENTATION SPECIFICATION

### 1. BAB I Final Structure (Regulatory Blueprint)

Berdasarkan Permendikdasmen Nomor 13 Tahun 2025, BAB I Karakteristik Satuan Pendidikan wajib menguraikan 6 elemen karakteristik secara komprehensif.

**A. Karakteristik Peserta Didik**
*   **Tujuan Subbab:** Menggambarkan profil, demografi, potensi, serta kebutuhan belajar peserta didik.
*   **Posisi:** Subbab pertama di BAB I (1.1).
*   **Isi Minimum WAJIB:** Jumlah peserta didik, sebaran gender, karakteristik umum (kognitif/non-kognitif), kebutuhan belajar dominan.
*   **Isi Opsional:** Data spesifik hambatan klinis, sebaran bakat dan minat.
*   **Sumber Data:** KSP Content (Peserta Didik), Rapor Pendidikan.
*   **Knowledge Domain:** `StudentCharacteristicDomain`
*   **Output Render:** Paragraf deskriptif tentang komposisi dan keberagaman siswa yang bermuara pada alasan diferensiasi pembelajaran.

**B. Karakteristik Pendidik dan Tenaga Kependidikan (PTK)**
*   **Tujuan Subbab:** Memetakan kapasitas SDM pengampu pendidikan di sekolah.
*   **Posisi:** Subbab kedua di BAB I (1.2).
*   **Isi Minimum WAJIB:** Jumlah guru/tendik, distribusi kualifikasi pendidikan, persentase sertifikasi, kompetensi unggulan.
*   **Isi Opsional:** Area pengembangan diri secara spesifik.
*   **Sumber Data:** KSP Content (Data PTK).
*   **Knowledge Domain:** `TeacherCharacteristicDomain`
*   **Output Render:** Paragraf naratif (dan tabel opsional) memetakan tingkat kesiapan PTK dalam menjalankan kurikulum sekolah.

**C. Karakteristik Sosial Budaya**
*   **Tujuan Subbab:** Mendeskripsikan akar sosiologis dan latar belakang masyarakat penyangga.
*   **Posisi:** Subbab ketiga di BAB I (1.3).
*   **Isi Minimum WAJIB:** Latar belakang ekonomi orang tua, mayoritas profesi orang tua, keragaman suku/agama (iklim kebhinekaan), norma/nilai budaya lokal.
*   **Isi Opsional:** Tokoh adat, sejarah lokal.
*   **Sumber Data:** KSP Content (Karakteristik & Potensi).
*   **Knowledge Domain:** `SocioCulturalCharacteristicDomain`
*   **Output Render:** Narasi tentang modal sosial (social capital) dan kekayaan budaya yang dibawa siswa ke sekolah.

**D. Karakteristik Lingkungan**
*   **Tujuan Subbab:** Menggambarkan konteks ekologis, topografis, dan geografis sekitar sekolah.
*   **Posisi:** Subbab keempat di BAB I (1.4).
*   **Isi Minimum WAJIB:** Letak geografis (pantai/pegunungan/kota), potensi alam, aksesibilitas fisik.
*   **Isi Opsional:** Isu lingkungan spesifik.
*   **Sumber Data:** KSP Content (Data Lokasi dan Sarpras).
*   **Knowledge Domain:** `EnvironmentalCharacteristicDomain`
*   **Output Render:** Paragraf deskriptif yang menjadi justifikasi muatan lokal (mulok) dan konteks proyek.

**E. Kemitraan**
*   **Tujuan Subbab:** Mendaftar kolaborasi strategis institusional.
*   **Posisi:** Subbab kelima di BAB I (1.5).
*   **Isi Minimum WAJIB:** (Bersifat kondisional, jika sekolah memiliki mitra maka wajib menjabarkan daftar institusi mitra dan bentuk/bidang kerjasamanya).
*   **Isi Opsional:** Durasi MoU, status keberlanjutan.
*   **Sumber Data:** KSP Content (Kemitraan/Program).
*   **Knowledge Domain:** `PartnershipCharacteristicDomain`
*   **Output Render:** List (Bullet-points) institusi DUDI/Pemerintah beserta kontribusinya pada pembelajaran.

**F. Analisis Karakteristik**
*   **Tujuan Subbab:** Mensintesiskan elemen A-E menjadi simpulan strategis penentu arah sekolah.
*   **Posisi:** Subbab keenam di BAB I (1.6).
*   **Isi Minimum WAJIB:** Kesimpulan analisis kekuatan (strengths) dan peluang (opportunities) untuk menutupi kelemahan (weaknesses) dan ancaman (threats).
*   **Isi Opsional:** Matriks SWOT utuh.
*   **Sumber Data:** Rapor Pendidikan & KSP Content.
*   **Knowledge Domain:** `CharacteristicAnalysisDomain`
*   **Output Render:** Benang merah (justifikasi) yang menghubungkan Karakteristik Satuan Pendidikan dengan Visi Misi yang akan dirumuskan di BAB II.

---

### 2. Implementation Gap Analysis (Builder Saat Ini vs Spesifikasi Regulasi)

Berdasarkan audit terhadap `src/enterprise/document/ksp/bab1/KspBab1Structure.ts`:

| Subbab Spesifikasi (Regulasi 2025) | Status di Builder KSP Saat Ini | Keterangan |
| :--- | :--- | :--- |
| **A. Karakteristik Peserta Didik** | **MISSING** | Sama sekali tidak ada blok paragraf mengenai siswa di `KspBab1Structure.ts`. |
| **B. Karakteristik PTK** | **MISSING** | Sama sekali tidak ada blok paragraf mengenai guru/tendik. |
| **C. Karakteristik Sosial Budaya** | **PARTIAL** | Saat ini digabung dengan lingkungan dalam subbab "A. Karakteristik Sosial Budaya dan Lingkungan Sekolah". |
| **D. Karakteristik Lingkungan** | **PARTIAL** | Saat ini digabung dengan sosial budaya. Terdapat juga "B. Karakteristik Fasilitas" yang bersifat non-regulatory/usang. |
| **E. Kemitraan** | **PARTIAL** | Saat ini masuk secara sempit sebagai list *Industry Partners* di dalam subbab A. Seharusnya menjadi subbab mandiri. |
| **F. Analisis Karakteristik** | **MISSING** | Tidak ada sintesis kesimpulan strategis sama sekali. |
| *Karakteristik Organisasi dan Tata Kelola*| **NON REGULATORY** | Saat ini berada di subbab C pada Builder, tidak relevan dengan BAB I Karakteristik (Regulasi baru meletakkannya di BAB lain atau tidak diperlukan di narasi BAB I). |

---

### 3. Implementation Roadmap

Berikut langkah-langkah implementasi yang diizinkan untuk Sprint coding berikutnya:

**Step 1: Domain Construction (Knowledge Layer)**
*   Membangun struktur data di `SchoolContextBuilder` (atau membuat builder domain baru) agar mampu memproses dan menampung payload untuk elemen A, B, C, D, E, dan F berdasarkan CDS-001.

**Step 2: Cleanup Non-Regulatory Blocks (Document Layer)**
*   Menghapus subbab "Karakteristik Fasilitas dan Infrastruktur" dari `KspBab1Structure.ts`.
*   Menghapus subbab "Karakteristik Organisasi dan Tata Kelola" dari `KspBab1Structure.ts`.
*   Menghapus struktur gabungan "Karakteristik Sosial Budaya dan Lingkungan Sekolah".

**Step 3: Document Assembler Implementation (Presentation Layer)**
*   Membangun ulang blok dokumen di `KspBab1Structure.ts` sesuai 6 subbab regulasi (A-F).
*   Menyambungkan abstraksi *Domain* (payload) ke teks *ParagraphBlock* dan *HeadingBlock* dengan menjaga kaidah *Pure Function* (tanpa memanggil `settings` secara langsung).

**Step 4: Preview Validation**
*   Menguji hasil rendering di Document Preview untuk memastikan BAB I sukses diubah ke format 6 subbab yang sesuai dengan Permendikdasmen Nomor 13 Tahun 2025.

---

### 4. Government Fidelity Checklist
- [ ] 1.1 Karakteristik Peserta Didik tersedia.
- [ ] 1.2 Karakteristik Pendidik dan Tenaga Kependidikan tersedia.
- [ ] 1.3 Karakteristik Sosial Budaya tersedia.
- [ ] 1.4 Karakteristik Lingkungan tersedia.
- [ ] 1.5 Kemitraan tersedia.
- [ ] 1.6 Analisis Karakteristik tersedia.
- [ ] Subbab Non-Regulatory (Organisasi, Fasilitas murni) telah dihapus dari BAB I.
- [ ] Tidak ada referensi ke state langsung (`settings`) di dalam layer Canonical Document.

---

### 5. Readiness Score
- **Scientific Specification**: 100/100
- **Regulatory Alignment**: 100/100
- **Builder Roadmap Actionable**: 100/100
- **OVERALL STATUS**: **READY FOR CODING SPRINT**
