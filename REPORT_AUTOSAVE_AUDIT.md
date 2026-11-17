# Laporan Audit Autosave & Potensi Blocking

Berdasarkan analisis mekanisme penyimpanan (autosave) pada aplikasi, berikut adalah temuan dan evaluasi potensi masalah.

## 1. Lokasi Kode Autosave
Proses autosave utama ditemukan di file `src/Tampuyak.tsx` (baris ~3579-3597). Autosave ini menggunakan `useEffect` yang merespon setiap perubahan pada objek global `settings` dengan debounce sebesar **800ms**.

Bagian kode yang ditandai:
```tsx
  useEffect(() => {
    const saveToLocal = setTimeout(() => {
      try {
        setSaveStatus("saving");
        const dataToSave = {
          ...settings,
          metadata: { ...settings.metadata, lastUpdated: Date.now() },
        };
        if (typeof localStorage !== 'undefined') {
          // POTENSI BLOCKING MAIN THREAD
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        }
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
        console.error("Failed to save", error);
      }
    }, 800);
    return () => clearTimeout(saveToLocal);
  }, [settings]);
```

## 2. Potensi Masalah (Blocking & JSON.stringify)

- **Proses berjalan di Main Thread:** Ya. `JSON.stringify` dan `localStorage.setItem` adalah operasi *synchronous* yang berjalan sepenuhnya di *Main Thread*.
- **Ukuran Object Sangat Besar:** Objek `settings` menyimpan seluruh state aplikasi (Data Sekolah, RKT, RKAS, Rapor, data Base64 logo, dll). 
- **Dampak Kinerja:**
  Setiap kali user mengetik sesuatu (misalnya mengetik "A" di form input), state `settings` akan berubah, yang kemudian memicu timer 800ms. Setelah timer selesai, browser akan melakukan serialisasi (`JSON.stringify`) pada keseluruhan objek `settings` yang bisa berukuran beberapa Megabyte. Proses ini akan menahan *Main Thread*, sehingga UI akan terasa terhenti sesaat (*lag/freeze* atau *stutter*) setiap 800ms jika user terus mengetik. Dampak ini sangat terasa di perangkat mobile atau laptop dengan CPU terbatas.

## 3. Rekomendasi Optimasi Ringan (Tanpa Mengubah Arsitektur Besar)

Untuk mengurangi beban *Main Thread* tanpa membongkar arsitektur React Context saat ini, berikut adalah beberapa rekomendasi ringan:

1. **Memperpanjang Interval Debounce (Delay)**
   Naikkan nilai debounce dari `800ms` menjadi nilai yang lebih konservatif, misalnya `3000ms` (3 detik) atau `5000ms`. Ini akan mengurangi frekuensi *lag* saat user mengetik teks panjang secara berturut-turut.
   
2. **Implementasi Deep Equal Check Sebelum Save**
   Seringkali state berubah namun data intinya belum tentu berubah secara signifikan, atau perubahan terjadi pada state yang tak perlu memicu autosave langsung. Melakukan komparasi ringan sebelum melakukan serialisasi penuh bisa mengurangi operasi tulis yang berulang.

3. **Gunakan Async Storage Layer (IndexedDB)**
   Meskipun menggunakan `localStorage` cukup umum, beralih dari `localStorage.setItem` ke metode *asynchronous* seperti `idb-keyval` (IndexedDB) yang telah diimpor di aplikasi akan memindahkan proses penyimpanan (I/O) agar tidak memblokir render UI, sekalipun `JSON.stringify` mungkin tetap diperlukan. Alternatifnya, kirim objek mentah ke IndexedDB dan biarkan algoritma struktur kloning browser menanganinya di latar belakang.

4. **Tunda Autosave Saat Form Aktif (onBlur / Idle)**
   Daripada merespon *setiap* perubahan karakter (via event `onChange` global), autosave bisa dikaitkan dengan event `onBlur` (saat user selesai mengisi suatu field dan berpindah) atau menggunakan API `requestIdleCallback` agar eksekusi serialisasi berat hanya terjadi ketika browser sedang tidak sibuk merender frame UI.
