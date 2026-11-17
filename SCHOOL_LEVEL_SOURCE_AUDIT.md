# ECO-003: SCHOOL LEVEL SOURCE AUDIT
## SCIENTIFIC FIDELITY AUDIT

### 1. Candidate Fields

Berdasarkan audit mendalam terhadap struktur state global di `Tampuyak.tsx` dan modul turunan, ditemukan kandidat properti yang menyimpan informasi jenjang sekolah:

**Candidate 1: `settings.school.level`**
- **Lokasi**: `src/Tampuyak.tsx` (`DEFAULT_SETTINGS` dan `<SettingsTabs.School>`).
- **Nilai Contoh**: `"SD", "SMP", "SMA", "SMK", "SLB"`
- **Digunakan oleh Modul**: 
  - `Chapter1Builder.ts` (Akses langsung ke _settings raw_).
  - Pengecekan Token di `Tampuyak.tsx` (`getTokens()`).
  - Form Input _Data Sekolah_ (menggunakan _Dropdown Select_ yang secara eksplisit memanggil `update("level", v)`).
- **Status**: ✓ **Digunakan** (Ini adalah *Single Source of Truth* yang sah).

**Candidate 2: `settings.school.jenjang`**
- **Lokasi**: `src/Tampuyak.tsx` (Baris ~8074, di bagian UI ringkasan data).
- **Nilai Contoh**: Tidak ada (Fallback ke "SD").
- **Digunakan oleh Modul**: Hanya UI Ringkasan Data.
- **Status**: ✓ **Legacy / Typo** (UI memanggil `.jenjang` yang sebenarnya tidak ada di `DEFAULT_SETTINGS` karena form menyimpan ke `.level`).

---

### 2. Multiple Source Check
Tidak ditemukan *Multiple Source* di layer _State/Data_. Seluruh operasi simpan dari pengguna mengarah pada `settings.school.level`.
Namun, terdapat *Multiple Interpretation* akibat typo di _View layer_ yang mencoba memanggil `jenjang`. 

---

### 3. Missing Source Check
**Status**: **TIDAK MISSING**.
Data jenjang sekolah sudah ada secara bawaan di sistem dengan nama properti `level`. Tidak diperlukan penambahan field baru apa pun di dalam `Settings`.

---

### 4. Dependency Report

- **Adapter (`KspMetadataAdapter.ts`)**:
  - **Status**: Saat ini **TIDAK** memetakan `settings.school.level`. Field ini bocor sehingga tidak bisa dijangkau oleh konsumen abstrak.
- **Dashboard (`KSPDashboard.tsx`)**:
  - **Status**: Menggunakan fungsi **INFERENSI** (`includes()`).
  - **Logic**: `metadata.schoolName?.includes("SMP") ? "SMP (Fase D)" : "SMA (Fase E/F)"`.
  - **Kritik**: Sangat berbahaya. Jika nama sekolah "SLB Negeri", dashboard akan mendeteksinya sebagai "SMA".
- **Builder (`Chapter1Builder.ts`)**:
  - **Status**: Menggunakan pemanggilan langsung (Direct Access).
  - **Logic**: `settings?.school?.level || '-'`.
  - **Kritik**: Melanggar kaidah *Adapter Pattern* karena Builder membaca `settings` secara *raw* alih-alih melalui `KspMetadata`.
- **Preview**:
  - **Status**: Terdampak oleh Builder.

---

### 5. GO / NO GO
**GO** (Lanjut ke tahap Eksekusi / Coding).

**Alasan**: 
Audit membuktikan secara empiris bahwa:
1. Field penyimpan jenjang sekolah SUDAH ADA (`settings.school.level`).
2. Tidak perlu membuat field baru di *Settings*.
3. Sistem saat ini mengalami kecacatan arsitektur dimana *Dashboard* menebak jenjang berdasarkan `schoolName` (Inferensi), dan *Builder* menembus batas isolasi (Direct Access).

**Tindakan yang Dibutuhkan Selanjutnya**:
Menambahkan `educationLevel` dan `phase` ke `KspMetadata` di Adapter, mengambilnya dari `settings.school.level`, lalu mengganti logika `.includes()` di Dashboard dengan properti Adapter yang valid.
