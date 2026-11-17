# Laporan Migrasi Autosave ke IndexedDB

Sesuai permintaan, sistem penyimpanan (autosave) telah dioptimasi dengan memindahkannya dari `localStorage` ke `IndexedDB` menggunakan pustaka `idb-keyval`.

## 1. Implementasi & Perbaikan

- **Transisi ke IndexedDB (idb-keyval):** 
  Fungsi autosave kini tidak lagi melakukan stringifikasi JSON yang memberatkan ke `localStorage`. Melainkan mendelegasikan penyimpanan objek mentah (state `settings`) ke `IndexedDB` menggunakan fungsi `set()`. `IndexedDB` menggunakan algoritma *structured clone* bawaan browser yang berjalan di background, sehingga tidak terjadi *blocking UI* (Main Thread).
- **Mekanisme Fallback:**
  Untuk mengantisipasi masalah pada browser mode *Incognito* atau perangkat lawas di mana IndexedDB ditolak, sistem dilengkapi dengan *fallback mechanism* yang otomatis menyimpan data menggunakan `localStorage.setItem` dengan blok `try-catch`.
- **Integrasi Firebase Save (Cloud):** 
  Fungsi `saveToFirebase` sudah langsung menggunakan *state* `settings` dari React Context, sehingga dapat berjalan dengan sangat baik dan terhindar dari *race conditions* atau data usang.
- **Debounce dan Idle State:**
  Penundaan penyimpanan *debounce* 3 detik (`3000ms`) tetap dipertahankan, dan pemanggilan tetap memanfaatkan eksekusi `requestIdleCallback` (jika tersedia) agar proses serialisasi/transfer IndexedDB hanya dijalankan pada saat *frame browser* sedang tidak sibuk.

## 2. Dampak Pada Performa & Keamanan

- **Batas Ukuran JSON Dihilangkan:** Limitasi statis 5MB yang secara default berlaku untuk `localStorage` kini tidak lagi menjadi masalah, sehingga input karakter atau array panjang ke dalam data struktur (KSP, RKAS, RKT) tidak akan memicu *QuotaExceededError*.
- **Tanpa Risiko *Race Condition*:** Firebase manual save serta Export JSON kini langsung meminjam data terbaru dari state `settings`.
- **User Interface (UI) Lebih Responsif:** Pengetikan cepat atau modifikasi masif secara berturut-turut pada form input sudah tak lagi memicu `JSON.stringify` sebesar jutaan karakter secara sinkron (blocking). 
- **Tidak Merusak Struktur & Arsitektur Utama:** Semua perbaikan berfokus di `Tampuyak.tsx` pada _layer_ penyimpanan, sehingga model referensi Context React tetap stabil tanpa ada _refactor_ yang merusak dependensi komponen lain.
