# FUNCTIONAL SPECIFICATION REVIEW: MODUL SUPERVISI AKADEMIK

**Tanggal Review:** 26 Juli 2026
**Status Dokumen:** FINAL (Safe Mode / Validasi)
**Klasifikasi:** FUNCTIONAL REVIEW

Laporan ini merupakan hasil validasi menyeluruh terhadap seluruh *blueprint* (Audit Arsitektur, Architecture Lock, Reuse Audit, dan Business Flow) untuk Modul Supervisi Akademik. Review ini dilakukan melalui kacamata 4 aktor utama: Kepala Sekolah, Pengawas Sekolah, Guru, dan Operator Sekolah.

---

## A. KELEBIHAN BLUEPRINT
1. **Isolasi Arsitektur yang Kuat:** Pendekatan *Sidecar Module* dan *Read-Only Projection* menjamin keamanan mutlak bagi modul legacy (KSP, RKJM, RKT, RKAS). Risiko regresi atau kerusakan data perencanaan sangat rendah.
2. **Efisiensi Pengembangan Tinggi:** Tingkat guna ulang (*reuse*) yang mencapai 75-80% pada komponen UI, autentikasi, dan *Export Engine* memungkinkan pengembangan modul yang cepat dengan *user experience* (UX) yang seragam.
3. **Pemisahan Perencanaan dan Evaluasi:** Blueprint telah merancang alur *evidence flow* yang tepat dengan tidak menyuntikkan hasil RTL secara otomatis ke RKT. Sistem murni bertindak sebagai *decision support system* (memberikan rekomendasi) yang tetap menempatkan Kepala Sekolah sebagai pengambil keputusan akhir.
4. **Siklus Status yang Rapi:** *Workflow status* yang didefinisikan (Draft -> Direncanakan -> Dijadwalkan -> Pra Observasi -> Observasi -> Pasca Observasi -> RTL -> Selesai) sepenuhnya selaras dengan standar operasional prosedur (SOP) supervisi di sekolah nyata.

---

## B. KEKURANGAN BLUEPRINT
1. **Dinamika Data Master (Kekurangan Mitigasi):** Blueprint menyarankan "Deep Copy" untuk menghindari mutasi, namun belum merinci *kapan* copy tersebut dilakukan. Jika nama guru berubah di `OrganizationProfile` saat status masih "Dijadwalkan", apakah nama di dokumen supervisi ikut berubah atau menggunakan nama lama (terkunci sejak *Draft*)?
2. **Fleksibilitas Instrumen:** Blueprint menyebutkan Instrumen Observasi, namun belum merinci apakah rubrik penilaian bersifat statis (di- *hardcode* dalam sistem) atau dinamis (bisa di-*custom* oleh Kepala Sekolah sesuai kebutuhan spesifik kurikulum sekolah).

---

## C. CELAH FUNGSIONAL
Setelah menempatkan diri sebagai berbagai aktor, ditemukan beberapa celah kecil:
1. **Celah Aktor - Guru:** Guru diposisikan sebagai objek yang disupervisi (Read-Only / Acknowledge). Namun di lapangan, Pra-Observasi sering membutuhkan Guru untuk **mengunggah (upload)** dokumen RPP/Modul Ajar ke sistem agar dapat ditelaah oleh Asesor. Blueprint belum secara eksplisit menyebutkan alur *upload evidence* dari sisi Guru.
2. **Celah Aktor - Operator Sekolah:** Meskipun Operator berstatus *Administrative*, pada praktiknya mereka sering bertugas *menarik* data agregat (Export Excel) untuk pelaporan ke Dinas Pendidikan. Blueprint hanya menyebutkan Export PDF, belum menyentuh ekstraksi data raw (CSV/Excel).
3. **Proses Pengulangan (Remedial):** Blueprint belum secara eksplisit mendefinisikan status jika observasi kelas gagal atau perlu diulang karena kondisi mendadak (misal: guru sakit atau jam pelajaran terpotong). Harus ada mekanisme pembatalan (*Cancel/Reschedule*) pada *Workflow Status*.

---

## D. RISIKO IMPLEMENTASI
1. **Potensi Perubahan KSP/RKT di Tengah Siklus:** Karena modul ini bergantung (*Read-Only*) pada RKT, ada risiko RKT diubah oleh Kepala Sekolah sementara pelaksanaan supervisi sedang berjalan. Supervisi yang merujuk pada "Program A" di RKT bisa kehilangan konteks jika "Program A" dihapus dari RKT. 
2. **Beban State Management:** Meskipun terpisah dari `WorkspaceContext`, jika `SupervisionContext` tidak dikelola dengan sistem *lazy loading* atau *pagination*, memuat ratusan riwayat observasi guru di akhir semester dapat memperlambat *Dashboard Engine*.

---

## E. REKOMENDASI PENYEMPURNAAN
1. **Snapshot Data Historis:** Lakukan *snapshot* (pembekuan data) referensi RKT, Kalender, dan Data Guru *tepat pada saat* Program Supervisi beralih dari status `Draft` ke `Direncanakan`. Dengan demikian, integritas laporan supervisi tetap terjaga meskipun data sumbernya berubah di masa depan.
2. **Fitur Upload Pra-Observasi:** Tambahkan hak akses parsial bagi Guru (Auditee) untuk mengunggah tautan (URL) atau dokumen Modul Ajar/RPP pada fase `Pra Observasi`.
3. **Penambahan Status Workflow:** Sisipkan status `Dibatalkan` atau `Penjadwalan Ulang` pada siklus supervisi untuk mengakomodasi realita di lapangan.
4. **Fleksibilitas Export:** Pastikan tabel rekapitulasi pada `Laporan Supervisi Akademik` tidak hanya dirancang untuk PDF via `DocumentExportEngine`, tetapi datanya juga bisa disalin (*copyable*) atau diekspor ke format tabular (Excel/CSV).

---

## F. CHECKLIST KESIAPAN IMPLEMENTASI
- [x] **Arsitektur (Safe Mode & Sidecar):** Jelas dan disetujui.
- [x] **Hak Akses & Role (Actor Matrix):** Terdefinisi dengan baik.
- [x] **Siklus Proses Bisnis:** Logis dan sesuai praktik akademik.
- [x] **Pemanfaatan Komponen Eksisting (Reuse):** Telah diaudit dan dipetakan.
- [x] **Struktur Database (No SQL Injection ke Modul Lama):** Terisolasi dengan aman.
- [x] **Mitigasi Konflik Planning Engine:** Aman, menggunakan rekomendasi manual, bukan injeksi otomatis.

---

## KESIMPULAN

**READY FOR IMPLEMENTATION**

**Alasan:**
Celah fungsional dan kekurangan mitigasi yang ditemukan (seperti *upload* dokumen oleh guru atau status batal/reschedule) bersifat minor dan merupakan *detail teknis implementasi* yang sangat mudah ditambahkan ke dalam UI/UX saat *coding* berlangsung, tanpa merombak arsitektur dasar.

Fondasi arsitektur (*Architecture Lock*) dan Alur Bisnis (*Business Flow*) yang telah disusun sudah sangat solid, memenuhi prinsip keamanan tingkat Enterprise (bebas dari risiko regresi pada modul lama), dan secara operasional sangat memahami kebutuhan pengelolaan sekolah yang nyata. Cetak biru (Blueprint) ini sudah sepenuhnya matang dan siap menjadi acuan bagi penulisan kode sumber (pengembangan).
