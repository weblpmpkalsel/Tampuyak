# Laporan Audit Firebase (Invalid Data: undefined)

Berdasarkan hasil inspeksi statis terhadap struktur *source code* dan logika migrasi `src/Tampuyak.tsx`, berikut adalah daftar field yang menyebabkan error `Unsupported field value: undefined` saat `saveToFirebase()` dipanggil.

## 1. Daftar Field yang bernilai `undefined`
Field yang teridentifikasi menyimpan atau dimutasi menjadi `undefined` sebelum masuk ke Firestore adalah:
- **`settings.planning.operationalActivities[i].metadata.programName`**
- **`settings.planning.operationalActivities[i].metadata.activityName`**

*Catatan: Lokasi eksaknya bergantung pada `annualPlans` yang digabung ke dalam state `operationalActivities`.*

## 2. Berasal Dari Mana dan Kenapa Nilainya `undefined`?
Nilai `undefined` tersebut berasal dari blok kode **"ONE-TIME MIGRATION"** di dalam fungsi `loadFromIndexedDB` (sekitar baris 3431 - 3444).
```javascript
// ONE-TIME MIGRATION: Clear persisted placeholder strings in metadata
if (migrated.planning && migrated.planning.operationalActivities) {
  migrated.planning.operationalActivities.forEach((op: any) => {
    if (op.metadata) {
      if (op.metadata.programName === "Unknown Program") {
        op.metadata.programName = undefined; // <-- PENYEBAB UTAMA
      }
      if (op.metadata.activityName === "Unknown Activity") {
        op.metadata.activityName = undefined; // <-- PENYEBAB UTAMA
      }
    }
  });
}
```
**Analisis Logis:**
- Saat aplikasi memuat data dari `IndexedDB`, kode migrasi otomatis akan membersihkan *placeholder* `"Unknown Program"` dan `"Unknown Activity"`.
- Developer sebelumnya menggunakan operator `op.metadata.programName = undefined;` untuk mengosongkan nilai.
- Javascript dan React dapat menangani *undefined* tanpa masalah, namun **Firebase Firestore secara *strict* menolak nilai `undefined`**. Firestore mengharuskan field dihapus (via `delete` atau `deleteField()`) atau diubah menjadi `null` atau `""` (string kosong).
- Karena state `settings` yang sudah termutasi tersebut diteruskan langsung ke fungsi `saveToFirebase()`, fungsi `setDoc()` akan *crash* sebelum sempat mengirim payload ke cloud.

## 3. Usulan Solusi Paling Aman
Untuk memperbaiki ini secara aman **tanpa merusak** struktur data yang sudah ada, solusi yang direkomendasikan adalah:

**Solusi 1: Hapus Properti (Rekomendasi Utama)**
Gunakan operator `delete` agar field tersebut benar-benar hilang dari objek (yang mana secara logis ekuivalen dengan `undefined` di JavaScript, namun 100% aman bagi Firebase).
```javascript
if (op.metadata.programName === "Unknown Program") {
  delete op.metadata.programName;
}
if (op.metadata.activityName === "Unknown Activity") {
  delete op.metadata.activityName;
}
```

**Solusi 2: Sanitasi di Level Firebase (Pre-hook)**
Ganti fungsi internal di dalam `saveToFirebase()` atau gunakan modul utilitas seperti `JSON.parse(JSON.stringify(backupData))` sebelum dikirim ke `setDoc()`. Operasi JSON murni secara otomatis membuang properti bernilai `undefined`, meskipun sedikit mengorbankan performa.

Kami siap untuk mengimplementasikan solusi yang paling sesuai jika disetujui.
