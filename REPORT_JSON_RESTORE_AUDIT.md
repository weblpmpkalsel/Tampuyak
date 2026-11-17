# Laporan Audit Fitur Import/Restore JSON

Berdasarkan audit pada fitur Import/Restore JSON, kami telah menemukan *root cause* (akar penyebab) mengapa file backup gagal dipulihkan (terutama backup dari versi terbaru), beserta analisis kompatibilitasnya.

## 1. Perbandingan Struktur Backup (Lama vs Baru)
- **Format Lama (V1):** Objek JSON langsung memuat *state* aplikasi di *root*. Field seperti `school`, `guru`, `metadata`, langsung berada di struktur terluar.
- **Format Baru (V2):** Fungsi `handleExport` saat ini mengemas semua *storage* browser menjadi satu objek. *State* utama aplikasi kini disimpan di bawah kunci/properti `tampuyak.settings` (sebagai *Storage Key*), sementara *root* JSON berisi daftar *key-value* dari seluruh *localStorage*.

## 2. Penyebab Gagalnya Restore (Incompatibility & Bug)
Bagian kode yang menjadi penyebab utama kegagalan (*bug*) terletak di dalam fungsi `handleImport` (`src/Tampuyak.tsx`), yaitu:
1. **Salah Sasaran Penyimpanan:** Ketika membaca format baru (`parsed['tampuyak.settings']`), kode mem-parsing dan menyimpan setiap data **hanya ke `localStorage`** melalui loop `localStorage.setItem()`.
2. **Prioritas IndexedDB:** Aplikasi ini menggunakan mekanisme pengambilan data `loadFromIndexedDB()` saat di-load. Fungsi ini akan memprioritaskan data di `IndexedDB` daripada `localStorage`. Karena `handleImport` tidak memperbarui (overwrite) `IndexedDB`, aplikasi akan tetap memuat data lama (yang ada di IndexedDB) sesaat setelah dipulihkan, seolah-olah proses restore gagal.
3. **Reload Terlalu Cepat:** Proses `handleImport` memanggil `window.location.reload()` segera setelah menyimpan ke `localStorage`. Karena *React state* belum diperbarui via `importSettings`, efek auto-save ke IndexedDB tidak pernah terjadi.

**Sisi Terang untuk Backup Lama:**
Paradoksnya, backup dari format lama (`else if (parsed.school)`) justru berfungsi lebih baik karena kode memanggil `importSettings(parsed)` yang akan meng-update *state* React, dan secara otomatis *auto-save* akan menulisnya dengan benar ke IndexedDB.

## 3. Apakah Backup User Lama Terancam Hilang/Tidak Dapat Dipulihkan?
**TIDAK.** Data backup (baik versi lama maupun baru) masih **valid dan aman**.
Kegagalan sepenuhnya terjadi di **logic cara aplikasi membaca dan menimpa database (IndexedDB)** saat *runtime import*. File JSON pengguna tidak rusak. Setelah kompatibilitas diperbaiki, file backup lama dan baru akan dapat di-restore dengan mulus.

## 4. Rekomendasi Perbaikan (Mekanisme Migrasi Otomatis)
Kami merekomendasikan penambahan *Compatibility & Migration Layer* pada fungsi `handleImport` dengan tahapan berikut:

1. **Deteksi Versi (Normalization):**
   ```javascript
   // Ambil payload utama tergantung format
   let coreSettings = parsed['tampuyak.settings'] ? 
       (typeof parsed['tampuyak.settings'] === 'string' ? JSON.parse(parsed['tampuyak.settings']) : parsed['tampuyak.settings']) 
       : parsed;
   ```
2. **Inject Default Values / Migrasi Field:**
   ```javascript
   if (!coreSettings.version) coreSettings.version = 1;
   if (!coreSettings.metadata) coreSettings.metadata = { lastUpdated: Date.now() };
   if (!coreSettings.planning) coreSettings.planning = PlanningEngine.createInitialState();
   ```
3. **Simpan ke Target yang Tepat (IndexedDB):**
   Gunakan fungsi *asynchronous* untuk memastikan data utama juga ditulis ke `IndexedDB` menggunakan *method* `saveToIndexedDB()`.
4. **Eksekusi State:**
   Ganti logika `window.location.reload()` langsung dengan memanggil `importSettings(coreSettings)`, lalu jalankan notifikasi, dan lakukan *reload* jika memang diperlukan setelah sinkronisasi DB selesai.

Jika instruksi ini disetujui, kami siap menerapkan perbaikan kode pada `src/Tampuyak.tsx`.
