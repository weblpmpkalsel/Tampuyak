# FINAL ARCHITECTURE DECISION — KSP EXPORT PIPELINE

Berdasarkan audit arsitektur ekspor dokumen KSP vs RKJM, berikut adalah analisis dan keputusan arsitektur untuk masa depan ekspor dokumen di TAMPUYAK OS.

## ANALISIS OPSI ARSITEKTUR

### Opsi A: Hubungkan KSP ke DocumentExportEngine Lama
Engine lama (`DocumentExportEngine`) dirancang khusus untuk mengonsumsi `DocumentModel` yang memiliki struktur statis (`cover`, `approval`, `toc`, `chapter1` hingga `chapter5`, `appendix`).
- **Keuntungan:** Tidak perlu membuat layer export baru secara konseptual.
- **Kekurangan:** Engine lama harus dimodifikasi secara masif menggunakan banyak `if-else` untuk mengecek tipe objek (`DocumentModel` vs `CanonicalDocument`). 
- **Risiko:** Risiko regresi yang sangat tinggi pada dokumen RKJM, RKT, dan RKAS saat proses ekspor DOCX.
- **Dampak terhadap CanonicalDocument:** Memaksa struktur dinamis Canonical untuk tunduk pada keterbatasan statis engine lama.
- **Potensi Regresi:** Sangat Tinggi (Kritis).

### Opsi B: Bangun Canonical Export Engine
Membuat service baru (misal: `CanonicalExportEngine`) yang secara eksklusif dirancang untuk mem-parsing `CanonicalDocument` (Sections & Blocks) menjadi PDF dan DOCX.
- **Keuntungan:** Bersih (*Clean Architecture*), memisahkan *legacy code* dari *modern code*. Sepenuhnya mendukung fleksibilitas jumlah seksi/blok tanpa batasan 5 BAB. Tidak ada risiko pada RKJM.
- **Kekurangan:** Memerlukan usaha (*effort*) awal yang lebih besar untuk membangun dari nol logika konversi `Block` menjadi elemen `docx`.
- **Risiko:** Isolasi risiko sangat baik (hanya berdampak pada KSP).
- **Kompleksitas:** Tinggi pada saat *development* awal, namun sangat rendah pada pemeliharaan jangka panjang.
- **Skalabilitas:** Sangat Tinggi (Future-proof).

### Opsi C: Buat Adapter (CanonicalDocument → DocumentModel)
Membuat fungsi adapter yang meremas (*squash*) struktur dinamis CanonicalDocument ke dalam cetakan statis `DocumentModel` agar bisa masuk ke `DocumentExportEngine` lama.
- **Keuntungan:** Paling cepat diimplementasikan. Tanpa menyentuh `DocumentExportEngine`.
- **Kekurangan:** Menghancurkan filosofi Canonical.
- **Risiko Kehilangan Informasi:** Sangat Tinggi. Jika KSP memiliki 8 seksi utama, adapter harus memaksanya masuk ke `chapter1` sampai `chapter5`, yang berarti penggabungan paksa (concatenation) atau hilangnya data.
- **Kompleksitas Maintenance:** Akan menjadi "monster" (Technical Debt) karena setiap penambahan fitur di KSP harus disiasati di dalam Adapter.
- **Dampak Jangka Panjang:** Menjadi penghalang evolusi dokumen enterprise.

---

## TABEL PENILAIAN & PERBANDINGAN

| Kriteria Penilaian | Opsi A (Modifikasi Engine Lama) | Opsi B (Canonical Export Engine) | Opsi C (Adapter Konversi) |
| :--- | :--- | :--- | :--- |
| **Enterprise Architecture** | Buruk (Tight Coupling) | **Sangat Baik (Decoupled)** | Buruk (Anti-pattern / Force fit) |
| **Maintainability** | Rendah | **Tinggi** | Rendah (Penuh hack) |
| **Scalability** | Terbatas (Statis 5 BAB) | **Tak Terbatas (Dinamis)** | Terbatas (Statis 5 BAB) |
| **Technical Debt** | Tinggi (Spaghetti Code) | **Nol (Greenfield)** | Sangat Tinggi (Adapter Monster) |
| **Risiko Regresi** | Tinggi (Mengancam RKJM/RKT) | **Nol (Terisolasi di KSP)** | Menengah |
| **Konsistensi Visi** | Bertentangan | **Sangat Selaras** | Bertentangan |

---

## REKOMENDASI FINAL

**Rekomendasi Terpilih: OPSI B (Bangun Canonical Export Engine)**

**Alasan Teknis:**
Opsi B adalah satu-satunya jalur yang sejalan dengan **Enterprise Architecture** yang telah dicanangkan untuk TAMPUYAK OS. 
`CanonicalDocument` diciptakan justru untuk mengatasi keterbatasan struktur statis `DocumentModel` (Cover + 5 BAB) dari dokumen-dokumen legacy. Jika kita memilih Opsi A atau C, kita secara efektif "menarik mundur" teknologi KSP kembali ke batasan masa lalu, menghilangkan semua fleksibilitas yang menjadi alasan `CanonicalDocument` dibuat.

Dengan membuat `CanonicalExportEngine`, kita membiarkan `DocumentExportEngine` lama menjadi sistem *legacy* yang stabil (hanya melayani RKJM, RKT, RKAS hingga mereka dimigrasi kelak), sementara engine baru menjadi fondasi masa depan.

### Dampak Terhadap Roadmap TAMPUYAK OS
1. **Fase 1 (Sekarang):** KSP akan menggunakan `CanonicalExportEngine` untuk PDF dan DOCX. RKJM, RKT, dan RKAS tetap menggunakan `DocumentExportEngine`. Kedua sistem berjalan secara paralel dan aman.
2. **Fase 2 (Masa Depan):** RKJM, RKT, dan RKAS akan direfaktor secara bertahap menuju arsitektur `CanonicalDocument`.
3. **Fase 3 (End Game):** Setelah semua dokumen menggunakan struktur Canonical, `DocumentModel` statis dan `DocumentExportEngine` lama dapat dihapus (deprecated) sepenuhnya dari sistem, menyisakan satu `CanonicalExportEngine` yang solid dan dinamis untuk seluruh TAMPUYAK OS.
