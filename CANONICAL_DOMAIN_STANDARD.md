# CANONICAL DOMAIN STANDARD (CDS-001)
## EDUCATION DOMAIN ENGINEERING

### 1. Canonical Domain Definition
**Definisi Domain dalam TAMPUYAK:**
Domain adalah abstraksi konseptual murni dari sebuah area pengetahuan spesifik dalam ekosistem pendidikan yang memiliki aturan (rules), batasan (boundaries), dan tujuan ilmiah (scientific objective) yang diatur oleh regulasi. Domain tidak berisi kode implementasi UI atau logika presentasi, melainkan mendefinisikan *apa* yang harus diketahui oleh sistem tentang area tersebut secara semantik.

**Perbedaan dan Hubungan (Data, Knowledge, Domain, Document, Builder):**
*   **Data**: Nilai mentah, angka, atau teks yang belum memiliki konteks (contoh: angka "18", teks "PT Maju Jaya").
*   **Knowledge**: Data yang telah diberi konteks dan makna (contoh: "18 adalah jumlah Rombongan Belajar", "PT Maju Jaya adalah mitra DUDI").
*   **Domain**: Entitas terstruktur yang mengelompokkan *Knowledge* ke dalam sebuah model ilmiah dan regulatori yang utuh (contoh: `StudentCharacteristicDomain` yang berisi seluruh knowledge tentang siswa beserta aturan validasinya).
*   **Builder (Assembler)**: Mesin (*Pure Function*) yang menerjemahkan *Domain* menjadi bentuk presentasi (AST). Builder memetakan "Apa" (Domain) menjadi "Bagaimana ditampilkan" (Document).
*   **Document (Canonical Document)**: Hasil akhir berwujud AST (*Abstract Syntax Tree*) yang siap dirender menjadi UI, PDF, atau Word, yang merepresentasikan *Domain* secara visual.

**Hubungan Keseluruhan:**
Data membentuk Knowledge -> Knowledge diikat ke dalam Domain -> Builder mengonsumsi Domain -> Builder merender Document.

---

### 2. Canonical Domain Structure
Setiap Domain dalam ekosistem TAMPUYAK WAJIB memiliki 14 struktur konseptual berikut:
1.  **Identity**: Nama unik domain (contoh: `SchoolContextDomain`).
2.  **Purpose**: Alasan eksistensi domain di dalam ekosistem.
3.  **Scientific Objective**: Sasaran edukasional/ilmiah yang ingin dicapai.
4.  **Knowledge Elements**: Komponen penyusun (variabel/properti konseptual).
5.  **Knowledge Relationship**: Kaitan antar elemen di dalam dan di luar domain.
6.  **Government Reference**: Rujukan regulasi mutlak (misal: Permendikdasmen).
7.  **Owner**: Pemilik mutlak state/data.
8.  **Consumer**: Entitas yang membaca domain.
9.  **Input**: Asal usul data mentah (UI Form, Settings, dll).
10. **Output**: Hasil proyeksi / representasi.
11. **Lifecycle**: Fase hidup domain.
12. **Validation Rule**: Aturan validitas keabsahan data.
13. **Dependency**: Ketergantungan ke domain lain.
14. **Implementation Status**: Tingkat kematangan domain (Level 0-5).

---

### 3. Domain Lifecycle
Fase kehidupan sebuah Domain dari ketiadaan hingga evaluasi:
**Observation** -> Proses pengumpulan data lapangan/asesmen awal.
↓
**Knowledge** -> Ekstraksi makna dari data mentah.
↓
**Domain** -> Pembentukan objek ilmiah (*Domain Object*) yang valid dan solid.
↓
**Builder** -> Perakitan *Domain* oleh *Pure Function* Assembler.
↓
**Canonical Document** -> Pembentukan AST (*Abstract Syntax Tree*).
↓
**Publishing** -> Output visual untuk dicetak atau dilihat (PDF/DOCX/Dashboard).
↓
**Evaluation** -> Validasi oleh Pengawas/Dinas Pendidikan (Government Check).
↓
**Continuous Improvement** -> Refleksi dan umpan balik untuk siklus observasi tahun berikutnya.

---

### 4. Domain Classification
Domain dalam TAMPUYAK diklasifikasikan ke dalam 7 klaster fungsional:
1.  **Government Domain**: Regulasi, capaian pembelajaran (CP), standar kelulusan (SKL).
2.  **Knowledge Domain**: Karakteristik Siswa, Profil Sekolah, Sosial Budaya, Lingkungan.
3.  **Planning Domain**: Rencana Kerja Jangka Menengah (RKJM), RKT, RKAS.
4.  **Learning Domain**: Kurikulum Satuan Pendidikan (KSP), ATP, Modul Ajar, P5.
5.  **Assessment Domain**: Asesmen Formatif/Sumatif, Rapor Pendidikan.
6.  **Monitoring Domain**: Supervisi Akademik, Tingkat Kehadiran, Dashboard Kinerja.
7.  **Reference Domain**: Master Struktur Kurikulum (EMC), Kalender Akademik.

---

### 5. Domain Dependency Rule
Alur logika kausalitas (sebab-akibat) konseptual antar Domain:
- **BAB I (Karakteristik)** ↓ *mempengaruhi*
- **BAB II (Visi, Misi, Tujuan)** ↓ *mempengaruhi*
- **BAB III (Pengorganisasian Pembelajaran)** ↓ *mempengaruhi*
- **BAB IV (Perencanaan Pembelajaran)** ↓ *mempengaruhi*
- **RKJM (Perencanaan Jangka Menengah)** ↓ *mempengaruhi*
- **RKT (Perencanaan Tahunan)** ↓ *mempengaruhi*
- **RKAS (Anggaran)** ↓ *mempengaruhi*
- **Dashboard & AI Recommendation**

---

### 6. Domain Ownership Rule
Setiap Domain wajib didefinisikan kepemilikannya dengan aturan berikut:
*   **Owner**: Modul penguasa tunggal (contoh: Modul KSP Content).
*   **Consumer**: Entitas penerima murni (contoh: Dashboard, Assembler).
*   **Maintainer**: Pengguna utama / Aktor (contoh: Tim Pengembang Kurikulum).
*   **Government Source**: Rujukan hukum tertinggi (contoh: Permendikdasmen Nomor 13 Tahun 2025).
*   **Scientific Source**: Basis teori pedagogik (contoh: Naskah Akademik Pembelajaran Mendalam).

---

### 7. Canonical Naming Convention
Penamaan Domain WAJIB menggunakan `PascalCase` dengan sufiks `Domain`. Contoh:
*   `StudentCharacteristicDomain`
*   `TeacherCharacteristicDomain`
*   `VisionDomain`
*   `MissionDomain`
*   `CurriculumStructureDomain`
*   `AnnualWorkPlanDomain`

---

### 8. Domain Maturity Model
Tolok ukur status kesiapan implementasi setiap Domain:
*   **Level 0**: Belum dimodelkan (Hanya angan-angan).
*   **Level 1**: Knowledge Model (Struktur dan relasi telah dirumuskan).
*   **Level 2**: Canonical Domain (Sudah mematuhi semua komponen CDS-001).
*   **Level 3**: Builder Ready (*Pure function* assembler telah siap).
*   **Level 4**: Document Ready (Sukses dirender menjadi AST di Preview).
*   **Level 5**: Government Validated (Lulus verifikasi dan final siap cetak/publish).

---

### 9. Canonical Domain Constitution
12 Aturan Mutlak yang mengatur integritas Domain di dalam TAMPUYAK OS:
*   **RULE 001**: Domain wajib berasal dari Knowledge.
*   **RULE 002**: Builder tidak boleh membuat Knowledge.
*   **RULE 003**: Builder hanya merender Domain.
*   **RULE 004**: Government menjadi sumber regulasi.
*   **RULE 005**: Settings menjadi sumber identitas.
*   **RULE 006**: User menjadi sumber konten.
*   **RULE 007**: Knowledge menjadi sumber Domain.
*   **RULE 008**: Domain menjadi sumber Builder.
*   **RULE 009**: Builder menjadi sumber Canonical Document.
*   **RULE 010**: Tidak boleh ada Domain yang langsung membaca UI.
*   **RULE 011**: Tidak boleh ada Domain yang bergantung pada Builder.
*   **RULE 012**: Semua Domain wajib mengikuti struktur Canonical Domain Standard.

---

### 10. Architecture Readiness
**STATUS: LOCKED & READY**
Canonical Domain Standard (CDS-001) secara resmi dikunci sebagai standar tertinggi dalam mendefinisikan *Knowledge Domain* di Tampuyak OS. Semua implementasi ke depan (KSP, RKJM, RKT, RKAS, ATP, Modul Ajar, Dashboard, AI) **WAJIB** dibangun menggunakan standar ini, memastikan kemandirian data (Domain) dan ketidaktergantungan presentasi (Builder). Tidak boleh lagi ada perombakan struktur fundamental setelah fase CDS ini selesai disetujui.
