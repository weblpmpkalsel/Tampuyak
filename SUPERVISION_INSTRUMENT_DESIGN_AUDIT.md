# DESIGN AUDIT: SUPERVISION INSTRUMENT OWNERSHIP

**Fase:** S7.3 (Supervision Instrument - Pre-Implementation)
**Tanggal Audit:** 26 Juli 2026

## PENDAHULUAN
Laporan ini menganalisis penentuan *ownership* (kepemilikan) entitas `SupervisionInstrument` pada sistem. Penentuan *ownership* akan berdampak langsung pada bagaimana instrumen dibuat, disimpan, dan digunakan oleh modul supervisi. 

---

## ALTERNATIF 1: INSTRUMEN MILIK SISTEM (System-Level)
Pada pendekatan ini, instrumen supervisi disediakan oleh sistem (SuperAdmin/Aplikasi) dan bersifat global. Sekolah atau Kepala Sekolah hanya bisa memakai instrumen yang sudah ada, tanpa bisa mengubahnya.

*   **Kelebihan:**
    *   Standardisasi tinggi lintas sekolah/organisasi.
    *   Sangat mudah diimplementasikan (hardcoded atau di-seed di database).
    *   Tidak memerlukan UI form builder untuk Kepala Sekolah.
*   **Kekurangan:**
    *   Sangat kaku. Kepala Sekolah tidak bisa menyesuaikan indikator dengan kebutuhan khusus atau kebijakan lokal sekolah.
*   **Dampak terhadap Domain Model:**
    *   Entitas `SupervisionInstrument` tidak membutuhkan relasi ke `OrganizationId` atau `PlanId`.
    *   Cukup menggunakan ID statis.
*   **Dampak terhadap Persistence:**
    *   Data cukup disimpan sebagai *seed data* atau konfigurasi statis (Read-Only).
*   **Dampak terhadap UI:**
    *   Tidak diperlukan UI *builder* instrumen. Cukup UI untuk memilih instrumen yang tersedia dari *dropdown*.
*   **Dampak terhadap Pengembangan di masa depan:**
    *   Jika regulasi kementerian berubah, sistem harus di-*update* secara terpusat. Sulit jika ada sekolah yang masih menggunakan instrumen versi lama (masalah *versioning* global).

---

## ALTERNATIF 2: INSTRUMEN MILIK SEKOLAH (Organization-Level)
Instrumen dibuat dan dimiliki oleh entitas Sekolah (Organization). Kepala Sekolah dapat membuat *template* instrumen yang bisa dipakai berulang kali untuk berbagai Program Supervisi di tahun ajaran yang berbeda.

*   **Kelebihan:**
    *   *Reusability* tinggi. Instrumen yang sama bisa dipakai dari tahun ke tahun tanpa harus dibuat ulang.
    *   Fleksibilitas bagi sekolah untuk memiliki standar rubriknya sendiri.
*   **Kekurangan:**
    *   Risiko mutasi data historis. Jika instrumen diubah tahun ini, bagaimana dengan data observasi tahun lalu yang menggunakan instrumen yang sama? Membutuhkan *versioning* yang kompleks atau *snapshotting*.
*   **Dampak terhadap Domain Model:**
    *   `SupervisionInstrument` akan memiliki atribut `organizationId`.
    *   Entitas `SupervisionPlan` atau `SupervisionSchedule` akan memiliki `instrumentId` sebagai referensi.
*   **Dampak terhadap Persistence:**
    *   Membutuhkan tabel/koleksi `instruments` di level *tenant/organization*.
*   **Dampak terhadap UI:**
    *   Membutuhkan menu Master Data Instrumen yang terpisah dari alur pembuatan Program Supervisi.
*   **Dampak terhadap Pengembangan di masa depan:**
    *   Membutuhkan mekanisme *Snapshot* atau *Immutable Record* saat instrumen digunakan dalam observasi, agar perubahan *template* di masa depan tidak merusak nilai historis.

---

## ALTERNATIF 3: INSTRUMEN MILIK PROGRAM SUPERVISI (Plan-Level)
Instrumen dibuat secara spesifik dan menempel/terikat langsung pada satu `SupervisionPlan` tertentu. Setiap tahun ajaran (atau setiap program), instrumen didefinisikan ulang atau di-*copy* ke dalam program tersebut.

*   **Kelebihan:**
    *   Data historis sangat aman. Perubahan instrumen pada program tahun ini sama sekali tidak akan mempengaruhi program tahun lalu.
    *   Alur kerja yang lebih linier (buat program -> buat instrumen untuk program tersebut -> jalankan).
*   **Kekurangan:**
    *   Redundansi data. Jika instrumen tidak berubah selama 5 tahun, data yang sama harus disimpan 5 kali di setiap *Plan*.
    *   Lebih repot bagi user jika harus membuat instrumen dari nol setiap kali membuat program baru (butuh fitur *Copy from Previous Plan*).
*   **Dampak terhadap Domain Model:**
    *   `SupervisionInstrument` memiliki atribut `planId` dan merupakan bagian dari *aggregate root* `SupervisionPlan`.
*   **Dampak terhadap Persistence:**
    *   Instrumen disimpan secara relasional/bersarang (nested) di dalam koleksi/tabel `supervision_plans`.
*   **Dampak terhadap UI:**
    *   UI *Builder* instrumen berada di dalam detail Program Supervisi, setelah tahap penentuan *Teacher Assignment*.
*   **Dampak terhadap Pengembangan di masa depan:**
    *   Secara domain sangat kokoh dan *bulletproof* terhadap *historical data corruption*. Nantinya hanya butuh penambahan fitur *duplicate/clone plan* untuk mempermudah UX.

---

## REKOMENDASI AKHIR

Berdasarkan analisis di atas, direkomendasikan untuk menggunakan **ALTERNATIF 3: INSTRUMEN MILIK PROGRAM SUPERVISI (Plan-Level)**.

**Alasan Utama:**
1.  **Integritas Data Historis:** Evaluasi kinerja guru bersifat legal dan administratif. Sangat krusial bahwa instrumen yang digunakan untuk menilai guru tahun lalu tidak bisa berubah secara tidak sengaja karena *update* *template* di tahun ini. Pendekatan Plan-Level menjamin instrumen menjadi *Immutable Snapshot* seiring berakhirnya siklus *Plan*.
2.  **Kesesuaian dengan Arsitektur:** Jika diikat secara agregat ke `SupervisionPlan`, kita akan menyederhanakan *Aggregate Root* tanpa harus memikirkan kompleksitas *versioning template* lintas organisasi.

**Rencana Implementasi Lanjutan:**
*   Menambahkan referensi `planId` pada tipe `SupervisionInstrument`.
*   Menyimpan instrumen dan memuatnya menggunakan konteks dari `planId` aktif yang sedang dibuka pada UI.
