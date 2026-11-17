# Hasil Audit Perubahan Teks Tidak Normal (Mutasi Teks)

Sesuai dengan instruksi, kami telah melakukan audit menyeluruh pada *pipeline* data (dari Input -> Local Storage -> Firebase -> Render) serta menganalisis kode untuk menemukan penyebab berubahnya teks secara spesifik seperti "Visi Misi" menjadi "kunjungan" dan "NIP" menjadi "Gigit".

## 1. Implementasi Audit Logging
Kami telah menyematkan *audit tracker* (berupa `console.log`) pada setiap fase siklus data di dalam file utama `Tampuyak.tsx`:
- `[AUDIT] INPUT` pada komponen `<Input>` dan `<Textarea>` saat fungsi `onChange` terpanggil.
- `[AUDIT] SAVE LOCAL` saat data disimpan ke `IndexedDB`.
- `[AUDIT] LOAD LOCAL` saat data diambil dari `IndexedDB` (atau _fallback_ `localStorage`).
- `[AUDIT] SAVE CLOUD` saat payload dikemas menuju Firestore.
- `[AUDIT] LOAD CLOUD` saat payload ditarik dari Firestore.
- `[AUDIT] RENDER` (via `useEffect`) untuk memantau nilai mutlak yang di-render oleh React UI.

**Cara Membaca Log (Bagi Developer/User):**
Jika di log `[AUDIT] RENDER` teks masih bertuliskan "NIP", namun di layar pengguna terlihat sebagai "Gigit", maka masalah 100% terjadi di luar React (yakni di layer Browser/Ekstensi).

## 2. Hasil Audit Kode (Logic & Transformasi)
Kami juga mengecek penggunaan `.replace()`, *mapping string*, dan transformasi pada seluruh direktori.
- Ditemukan beberapa penggunaan `.replace()` (seperti di `DocumentCompositionEngine/utils.ts` dan `Chapter2Builder.ts`), tetapi semuanya **hanya berfungsi untuk membersihkan teks** (menghapus URL, spasi berlebih, nomor urut), **bukan untuk menerjemahkan bahasa**.
- **Tidak ada fungsi internal aplikasi** yang secara sengaja memetakan kata "NIP" menjadi "Gigit" atau "Visi" menjadi "Kunjungan".

## 3. Dugaan Utama Penyebab (Root Cause)
Perubahan teks seperti "NIP" → "Gigit" dan "Visi" → "Kunjungan" adalah **gejala klasik dari fitur Auto-Translate Browser (misal: Google Translate di Google Chrome)**.

**Mengapa ini terjadi?**
- Jika kita memeriksa `index.html`, tag bahasa saat ini diatur sebagai `<html lang="en">` (Bahasa Inggris).
- Karena browser mengira halaman ini berbahasa Inggris, fitur *auto-translate* secara otomatis akan menerjemahkan teks ke Bahasa Indonesia.
- Dalam bahasa Inggris, **"NIP"** (sebagai kata kerja) berarti mencubit atau **menggigit**, sehingga diterjemahkan menjadi **"Gigit"**.
- Demikian pula kata-kata serapan/singkatan lain yang diartikan secara literal oleh mesin penerjemah.

## 4. Rekomendasi Solusi (Fix)
Karena akar masalah berasal dari intervensi *Browser Environment* dan bukan dari *State Management* (React/Firebase), maka solusinya sangat sederhana namun berdampak krusial. 

**Solusi yang disarankan:**
Ubah atribut bahasa pada file `index.html` dari `en` menjadi `id` dan tambahkan meta tag untuk menonaktifkan fitur terjemahan otomatis pada aplikasi ini:

```html
<!-- Pada file index.html -->
<html lang="id" translate="no">
<head>
  <!-- Menolak auto-translate dari Google Chrome -->
  <meta name="google" content="notranslate" />
  ...
```

Perubahan ini akan memerintahkan browser untuk mengenali aplikasi sebagai aplikasi berbahasa Indonesia dan melarang ekstensi *auto-translate* bawaan untuk mengubah teks UI, sehingga teks aneh seperti "Gigit" tidak akan muncul lagi.
