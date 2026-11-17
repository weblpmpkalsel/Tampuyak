# Laporan Fitur Tampilkan/Sembunyikan Kata Sandi

Fitur untuk melihat dan menyembunyikan kata sandi telah diimplementasikan pada halaman Login (`src/portal/LoginPage.tsx`) sesuai dengan permintaan.

## 1. Implementasi & Perbaikan
- Mengimpor ikon `Eye` dan `EyeOff` dari pustaka `lucide-react`.
- Menambahkan *state* `showPassword` menggunakan `useState` untuk melacak visibilitas kata sandi.
- Mengubah elemen input kata sandi agar bertipe dinamis antara `"text"` dan `"password"` berdasarkan *state* tersebut.
- Menambahkan tombol bertipe `"button"` (menghindari ketidaksengajaan terkirimnya form) yang memuat ikon mata di dalam kontainer relatif, agar posisi ikon sejajar rapi secara presisi.
- Meningkatkan pengalaman pengguna untuk memastikan kata sandi yang diketik dapat diperiksa sebelum dikirimkan (*submit*), meminimalisir kemungkinan salah ketik.

Aplikasi telah dibangun kembali (*recompile*) dengan sukses. Fitur tambahan ini aman tanpa mengubah *logic* autentikasi *backend*.
