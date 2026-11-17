# CHECKPOINT KSP GOLD 7.1
## GOVERNMENT FIDELITY DESIGN REPORT (FRONT MATTER)

### 1. Government Fidelity Report

**Ringkasan Audit:**
Berdasarkan Permendikdasmen Nomor 13 Tahun 2025, nomenklatur yang sah adalah **Kurikulum Satuan Pendidikan (KSP)**. Sebagian struktur *Front Matter* masih membawa sisa rancangan (legacy) Kurikulum Operasional Satuan Pendidikan (KOSP) dan memiliki celah pada struktur tata letak pengesahan serta hierarki Daftar Isi.

| Elemen | Regulasi (Permendikdasmen 13/2025) | Implementasi Saat Ini | Rekomendasi | Prioritas |
| :--- | :--- | :--- | :--- | :--- |
| **Cover: Nomenklatur Judul** | Menggunakan istilah KSP | "KURIKULUM SATUAN PENDIDIKAN" | Pertahankan. | PASS |
| **Cover: Tahun Pelajaran** | Dicantumkan pada Cover | Ditempatkan sebelum logo. | Pindahkan "Tahun Pelajaran" ke bagian paling bawah (setelah alamat) sesuai kelaziman tata letak format resmi dinas. | PARTIAL (Rendah) |
| **Pengesahan: Naskah** | Menyebutkan KSP | Naskah teks masih menggunakan "Kurikulum Operasional". | Ubah teks menjadi "Kurikulum Satuan Pendidikan". | FAIL (Tinggi) |
| **Pengesahan: Nomenklatur Tindakan** | Menetapkan (Kepsek), Menyetujui (Komite), Mengesahkan (Kadis/Yayasan) | Tidak ada "Menetapkan" dan "Menyetujui". Hanya ada nama & jabatan. | Tambahkan frasa "Menyetujui," di atas Komite dan "Menetapkan," di atas Kepala Sekolah. | FAIL (Tinggi) |
| **Pengesahan: Nomor Dokumen** | Surat Pengesahan memiliki Nomor Dokumen | Tidak ada ruang untuk Nomor Dokumen. | Tambahkan placeholder/paragraf "Nomor: ...................." setelah teks intro pengesahan. | FAIL (Sedang) |
| **Daftar Isi: Hierarki Heading** | Harus mencerminkan level Subbab secara hierarkis (indentasi) | Semua *heading* (H2, H3, H4) di-render rata/sejajar dalam satu `CONTAINER` tanpa perbedaan level/indentasi. | Tambahkan indikator level pada metadata TOC agar DocumentRenderer bisa memberikan indentasi (misal: margin-left) sesuai level *heading*. | FAIL (Tinggi) |

---

### 2. Cover Gap Analysis

- **Apa yang salah:** Tata letak urutan informasi kurang merepresentasikan kelaziman formal (meski secara teknis semua data ada). "TAHUN PELAJARAN" saat ini berada di atas logo.
- **Mengapa salah:** Dalam kaidah penyusunan dokumen resmi satuan pendidikan, *Tahun Pelajaran* dan *Alamat* biasanya berfungsi sebagai penutup halaman di bagian bawah (*footer-like area*).
- **Bagaimana seharusnya:** Urutan yang disarankan: (1) Judul (KSP), (2) Nama Sekolah, (3) Status (Opsional), (4) Logo, (5) NPSN, (6) Alamat Lengkap, (7) Tahun Pelajaran.

### 3. Approval Page Gap Analysis

- **Apa yang salah:**
  1. Penggunaan istilah usang "Kurikulum Operasional".
  2. Ketiadaan *Nomor Dokumen*.
  3. Ketiadaan frasa legal-formal penandatangan ("Menyetujui," untuk Komite, "Menetapkan," untuk Kepala Sekolah).
- **Mengapa salah:** Melanggar Permendikdasmen No. 13 Tahun 2025 terkait nomenklatur KSP. Tanpa frasa "Menyetujui" dan "Menetapkan", kekuatan hukum tanda tangan menjadi bias secara administratif.
- **Bagaimana seharusnya:**
  - Teks paragraf diubah menjadi: "...maka Kurikulum Satuan Pendidikan {Nama Sekolah} dinyatakan sah..."
  - Tambahkan baris "Nomor: ........................"
  - Pada struktur penandatangan, Komite harus memiliki teks `Menyetujui,` di atas jabatan/namanya, dan Kepala Sekolah harus memiliki teks `Menetapkan,`.

### 4. Table of Contents Gap Analysis

- **Apa yang salah:** `buildKspTocSection` mengurutkan semua *heading* yang diekstrak secara linier (sejajar/rata) tanpa memberikan informasi struktur level.
- **Mengapa salah:** Daftar Isi akan menjadi teks rata kiri yang sulit dibaca (H2, H3, H4 akan tampak sederajat). Ini menyalahi kaidah *outline* daftar isi yang standar.
- **Bagaimana seharusnya:** Logika ekstraksi `extractHeadings` harus mempertahankan properti `level` dari *HeadingBlock*, lalu `buildKspTocSection` harus mentransformasikannya menjadi struktur yang menandakan indentasi (misal menggunakan properti kustom pada DocumentBlock atau memberikan struktur berlapis) agar *Document Layer Renderer* bisa memberikan padding/indent yang sesuai untuk setiap level (A, 1, a).

---

### 5. Priority Matrix

1. **Urgensi Tinggi (Blocker untuk Validitas Hukum):**
   - Pembaruan istilah "Kurikulum Operasional" menjadi "Kurikulum Satuan Pendidikan" di *Approval Page*.
   - Penambahan klausa legal "Menetapkan," dan "Menyetujui," di *Approval Page*.
2. **Urgensi Tinggi (Blocker untuk UX/Keterbacaan):**
   - Perbaikan struktur hierarki/indentasi pada *Table of Contents*.
3. **Urgensi Sedang (Kerapian Administratif):**
   - Penambahan ruang Nomor Dokumen di *Approval Page*.
4. **Urgensi Rendah (Kosmetik):**
   - Re-order penempatan Tahun Pelajaran di *Cover*.

---

### 6. Implementation Roadmap

1. **Sprint 7.2 (Approval Page Fixes)**
   - Target: `src/enterprise/document/ksp/approval/KspApprovalStructure.ts`
   - Aksi: Ganti *hardcoded string* "Kurikulum Operasional" ke "Kurikulum Satuan Pendidikan". Tambahkan teks "Menyetujui," dan "Menetapkan,". Tambahkan *placeholder* Nomor.
2. **Sprint 7.3 (TOC Hierarchy Update)**
   - Target: `src/enterprise/document/ksp/toc/KspTocStructure.ts`
   - Aksi: Ekstrak `heading.level` dan aplikasikan atribut tambahan (atau format visual struktur *container* berjenjang) pada `ParagraphBlock` TOC untuk men-trigger indentasi di level UI.
3. **Sprint 7.4 (Cover Reordering)**
   - Target: `src/enterprise/document/ksp/cover/KspCoverStructure.ts`
   - Aksi: Susun ulang *array push* untuk meletakkan "Tahun Pelajaran" ke urutan terakhir (setelah blok alamat).

---

### 7. GO / NO GO

**GO**
*(Audit Front Matter Selesai. Hasil ini akan menjadi Blueprint untuk eksekusi perbaikan pada Sprint berikutnya, khusus menyentuh file KSP tanpa menyentuh wilayah Core, Shared, atau modul lainnya).*
