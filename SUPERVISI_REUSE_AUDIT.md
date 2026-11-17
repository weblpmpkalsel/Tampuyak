# Laporan Enterprise Reuse Audit: Modul Supervisi Akademik

**Tanggal Audit:** 26 Juli 2026
**Status Dokumen:** FINAL (Safe Mode / Read-Only Audit)
**Klasifikasi:** ENTERPRISE REUSE AUDIT

Laporan ini mengidentifikasi komponen, layanan, dan infrastruktur sistem TAMPUYAK OS yang ada saat ini yang dapat digunakan kembali (*reusable*) untuk membangun Modul Supervisi Akademik. Tujuannya adalah untuk menerapkan prinsip **Reuse before Build**, meminimalkan kode baru, dan menjaga konsistensi ekosistem tanpa memodifikasi modul *legacy*.

---

## A. Reusable Components (Komponen UI Tingkat Tinggi)
Sebagian besar *wrapper* dan struktur layout dapat langsung di-*import* dan digunakan.

1. **`EnterpriseWorkspaceShell`**
   - **Lokasi:** `src/enterprise/workspace/EnterpriseWorkspaceShell.tsx`
   - **Fungsi:** Menyediakan struktur *sidebar*, *header*, dan area konten utama yang konsisten dengan standar *Enterprise*.
2. **`OrganizationGuard` & `PortalDashboardGuard`**
   - **Lokasi:** `src/workspace/OrganizationGuard.tsx`, `src/portal/PortalDashboardGuard.tsx`
   - **Fungsi:** Mengunci akses modul hanya untuk pengguna yang telah *login* dan terhubung dengan sekolah yang valid.
3. **`RoleGuard` & `PermissionGuard`**
   - **Lokasi:** `src/components/auth/guards.tsx`
   - **Fungsi:** Sangat krusial untuk memastikan bahwa instrumen supervisi hanya bisa diisi oleh pengguna ber-role `Kepala Sekolah` atau `Asesor/Pengawas`, sedangkan guru hanya berhak membaca (Read-Only).
4. **`Button` Component & CSS Classes**
   - **Lokasi:** `src/components/ui/button.tsx`, `src/index.css`
   - **Fungsi:** Komponen tombol dan utilitas CSS global (`.enterprise-card`, `.enterprise-btn-primary`, dll.) memastikan Modul Supervisi memiliki tampilan *pixel-perfect* yang sama dengan KSP/RKAS.

---

## B. Reusable Services (Layanan Data Read-Only)
Modul Supervisi tidak perlu membuat layanan baru untuk mengambil data dasar. Layanan berikut siap digunakan:

1. **`SchoolProfileService` / `OrganizationService`**
   - Untuk memuat data sekolah (NPSN, Alamat, Nama Kepala Sekolah) yang akan ditaruh di *header* laporan supervisi.
2. **`AcademicCalendarService`**
   - **Lokasi:** `src/enterprise/knowledge/services/AcademicCalendarService.ts`
   - Untuk melakukan validasi apakah jadwal observasi supervisi jatuh pada rentang kalender akademik/hari efektif sekolah yang benar.
3. **`EvaluationService`**
   - **Lokasi:** `src/enterprise/knowledge/services/EvaluationService.ts`
   - Untuk mengambil skor Rapor Pendidikan historis yang akan dijadikan referensi dalam menentukan indikator supervisi.
4. **`EventBus`**
   - **Lokasi:** `src/events/EventBus.ts`
   - Dapat digunakan untuk melempar '*Domain Events*' (misal: `SupervisionScheduled`, `ObservationCompleted`) tanpa mengikat kode satu sama lain.

---

## C. Reusable Helpers (Fungsi Bantuan Eksekusi)
Sistem memiliki berbagai fungsi *helper* terkait konversi, pemformatan, dan abstraksi *event*.

1. **Pemformatan Data (Date & Currency)**
   - Dapat me-reuse metode format tanggal/waktu yang sama dari modul RKT agar tampilan *timeline* observasi seragam.
2. **`DomainEvent` & `EventEnvelope`**
   - **Lokasi:** `src/events/DomainEvent.ts`, `src/events/EventEnvelope.ts`
   - Standar pembungkusan komunikasi antar sistem yang akan menjamin audit-trail yang baik.

---

## D. Reusable Hooks (Koneksi Status Reaktif)
Beberapa *React Hooks* dari infrastruktur yang ada bisa dimanfaatkan kembali, asalkan hanya untuk membaca.

1. **`usePlanningContext()`** (Secara parsial/Read-Only)
   - Digunakan murni untuk membaca Tahun Ajaran aktif atau status dokumen yang sedang berjalan.
2. **Custom Hooks Autentikasi**
   - Hook seperti `useAuth` (jika ada di lapisan penyedia konteks) dapat dipanggil langsung untuk mengetahui *user ID* supervisor saat ini.

---

## E. Reusable UI (Struktur Tampilan & Dasbor)
Untuk pembangunan UI Supervisi, *engine* visual dari aplikasi dapat di-*recycle*:

1. **CSS Layout System** (`src/index.css`)
   - Penggunaan `.enterprise-table`, `.enterprise-sidebar-item`, `.enterprise-card-header` akan dipakai seratus persen pada halaman daftar observasi dan pengisian rubrik supervisi.
2. **`DashboardViewBuilder` / `BaseOperationalView`**
   - **Lokasi:** `src/views/`
   - Digunakan untuk merancang *landing page* dasbor supervisi (menampilkan progres % guru yang sudah disupervisi).

---

## F. Reusable Export Engine (Mesin Pencetakan Laporan)
Modul Supervisi Akademik **sangat bergantung pada fitur ini** untuk mencetak bukti fisik pra-observasi, observasi, dan tindak lanjut. 

1. **`DocumentExportEngine`**
   - **Lokasi:** `src/DocumentExportEngine.ts`
   - Mesin utama untuk mengkonversi struktur DOM (HTML) ke dalam dokumen PDF, kompatibel sepenuhnya dengan semua elemen baru yang akan dibuat.
2. **`PublishingEngine` & `PdfPublisher`**
   - **Lokasi:** `src/enterprise/publishing/`
   - Supervisi akan me-reuse *pipeline publishing* ini untuk mengunci (*finalize*) laporan supervisi di akhir semester.
3. **`CanonicalRenderer`**
   - **Lokasi:** `src/enterprise/workspace/preview/CanonicalRenderer.tsx`
   - Dapat digunakan sebagai kerangka pratinjau cetak (*Print Preview*) Laporan Supervisi Guru.

---

## G. Komponen yang HARUS Dibuat Baru (Supervision Domain)
Sesuai dengan *Architecture Lock*, modul ini bersifat *Sidecar*. Berikut adalah komponen yang wajib dibuat dari nol:

1. **`SupervisionContext` (React Context):** Pengelola *state* yang sepenuhnya terisolasi dari *PlanningContext*.
2. **`SupervisionEngine` (Domain Logic):** Penghitung skor rubrik, manajemen siklus (Pra -> Observasi -> Pasca).
3. **Instrumen UI Khusus:**
   - Komponen **Rubrik Penilaian/Skoring** (Skala Likert/Kriteria).
   - Komponen **Lembar Jurnal Coaching & Refleksi**.
   - Komponen **Kalender Penugasan Supervisi**.
4. **Supervision Storage / Repositori:** Modul untuk *write* dan *fetch* langsung ke `academic_supervisions` di Firestore/Database (tidak via `WorkspaceService` lama).
5. **Template Laporan (*React-to-Print*):** Dokumen legal spesifik pengawasan yang akan disuplai ke `DocumentExportEngine`.

---

## H. Estimasi Persentase Reuse
Berikut adalah proyeksi tingkat *reuse* kode eksisting TAMPUYAK OS untuk membangun Modul Supervisi Akademik, meminimalkan penulisan dari nol:

- **UI & Layout Shell:** **85%** (Tinggal membungkus di dalam *EnterpriseWorkspaceShell* dan menggunakan utilitas kelas CSS).
- **Security & Guards:** **100%** (Menggunakan *RoleGuard* & *OrganizationGuard* tanpa modifikasi).
- **Export & Print Engine:** **100%** (Sistem PDF dan cetakan dapat menangani format tabel instrumen apa pun).
- **Form Engine:** **90%** (Tidak perlu pustaka form baru, cukup menggunakan *input/textarea* native React + Tailwind sesuai pedoman yang ada).
- **Dashboard & Chart:** **70%** (Pola arsitektur *view* bisa di-reuse, namun konfigurasi grafik pencapaian supervisi harus baru).
- **Business Logic (Engines):** **0%** (*By design*. Logika supervisi HARUS 100% baru dan terisolasi dari *PlanningEngine*).

**Kesimpulan:**
Secara keseluruhan, **sekitar 75% - 80% dari infrastruktur teknis Modul Supervisi Akademik dapat dibangun menggunakan komponen yang sudah dimiliki TAMPUYAK OS.** Waktu pengembangan akan difokuskan secara eksklusif pada pembuatan antar-muka formulir instrumen, manajemen jadwal, dan penyimpanan data terisolasi.
