# STATE MODEL DESIGN: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Fase:** S6.6 State Model Design
**Status:** FINAL (Safe Mode)

## 1. TUJUAN

Dokumen ini mendefinisikan desain model *State* yang akan digunakan pada Modul Supervisi Akademik. Desain ini murni menggunakan prinsip *TypeScript Interfaces* dan sepenuhnya terlepas dari pustaka spesifik (seperti React, Redux, Zustand, atau Context). Pendekatan agnostik ini menjamin portabilitas, prediktabilitas, serta *Separation of Concerns* (SoC) yang baik sebelum UI diimplementasikan.

## 2. PENGELOMPOKAN STATE

Model state dibagi menjadi tiga kategori utama:

1. **Persistent State**: Representasi dari data di *Storage* (Database). Bersifat *Immutable* (salinan baca) di dalam aplikasi.
2. **Transient State**: *State* interaksi UI dan aplikasi sementara yang tidak disimpan ke Database. Bersifat *Mutable* untuk mengakomodir perubahan interaksi pengguna.
3. **Derived State**: Data hasil komputasi *on-the-fly* yang diturunkan dari *Persistent State*.

## 3. STATE CONTRACTS

### A. PERSISTENT STATE

#### 1. Plan State
- **Deskripsi:** Menyimpan daftar Program Supervisi aktif/lampau beserta entitas program yang sedang diaktifkan.
- **Lifecycle:** Di-*load* dari penyimpanan saat modul supervisi dibuka.
- **Owner:** Supervision Module
- **Mutable / Immutable:** *Immutable*.
- **Reset Rule:** Kosongkan saat *logout* atau berpindah profil sekolah.

#### 2. Schedule State
- **Deskripsi:** Menyimpan koleksi jadwal (*SupervisionSchedule*) di dalam satu Program Supervisi.
- **Lifecycle:** Di-*load* ketika sebuah Program (Plan) dipilih/aktif.
- **Owner:** Supervision Module
- **Mutable / Immutable:** *Immutable*.
- **Reset Rule:** Di-*reset* saat berpindah atau menutup Program.

#### 3. Observation State
- **Deskripsi:** Menyimpan data tunggal proses observasi di kelas (beserta bukti, skor, dan catatan refleksi/coaching terkait).
- **Lifecycle:** Dimuat spesifik saat asesor memasuki sesi pengamatan seorang guru.
- **Owner:** Supervision Module
- **Mutable / Immutable:** *Immutable*.
- **Reset Rule:** Di-*reset* ketika sesi kelas ditutup (kembali ke *dashboard* jadwal).

#### 4. Recommendation State
- **Deskripsi:** Menyimpan seluruh data agregat RTL (*FollowUp*) dan rekomendasi (*Recommendation*) tingkat sekolah.
- **Lifecycle:** Dimuat saat kepala sekolah mengakses dasbor mutu/rekomendasi.
- **Owner:** Supervision Module
- **Mutable / Immutable:** *Immutable*.
- **Reset Rule:** Di-*reset* ketika keluar dari modul.

### B. TRANSIENT STATE

#### 5. Selection State
- **Deskripsi:** Penanda (ID) dari apa yang saat ini sedang disorot/diklik oleh *user* (Jadwal, Program, Indikator).
- **Lifecycle:** Aktif selama layar menampilkan elemen tersebut, hancur jika layar berpindah.
- **Owner:** UI Layer / Presenter
- **Mutable / Immutable:** *Mutable*.
- **Reset Rule:** Di-*reset* saat navigasi *router* berubah.

#### 6. Loading State
- **Deskripsi:** Status *boolean* berbagai proses *async* untuk menampilkan *spinner* atau menonaktifkan tombol.
- **Lifecycle:** Hidup selama *promise* / *async operation* dari repositori berjalan.
- **Owner:** Application Layer
- **Mutable / Immutable:** *Mutable*.
- **Reset Rule:** Dikembalikan menjadi `false` ketika proses terkait selesai (baik *success* maupun *fail*).

#### 7. Error State
- **Deskripsi:** Menyimpan pesan kesalahan (*error message*) atau data validasi jika operasi gagal.
- **Lifecycle:** Timbul akibat `catch` dari lapisan servis, hancur saat pengguna menekan tombol *Dismiss*.
- **Owner:** Application Layer
- **Mutable / Immutable:** *Mutable*.
- **Reset Rule:** Di-*reset* (menjadi `null`) tepat sebelum aksi *async* baru dijalankan.

#### 8. Draft State
- **Deskripsi:** Buffer penyimpanan *form* setengah jadi (contoh: *autosave* lembar observasi sebelum di-*submit* final).
- **Lifecycle:** Dimulai saat formulir diubah, hancur saat data berhasil dipersistenkan atau dibatalkan.
- **Owner:** Form / UI Layer
- **Mutable / Immutable:** *Mutable*.
- **Reset Rule:** Di-*reset* pada aksi *Submit Success* atau *Cancel*.

#### 9. Attachment State
- **Deskripsi:** Mengontrol antrean (*queue*) unggahan berkas bukti (*evidence*) lengkap dengan indikator progresnya.
- **Lifecycle:** Aktif selama sesi *upload*.
- **Owner:** Application Layer
- **Mutable / Immutable:** *Mutable*.
- **Reset Rule:** Di-*reset* saat *queue* kosong atau sesi unggahan selesai.

#### 10. Monitoring State
- **Deskripsi:** *State* kendali spesifik seperti *filter dropdown* atau *search text* di halaman pemantauan RTL.
- **Lifecycle:** Hidup selama tab Monitoring dibuka.
- **Owner:** UI Layer
- **Mutable / Immutable:** *Mutable*.
- **Reset Rule:** Kembali ke kondisi semula (*default filter*) saat panel ditutup.

### C. DERIVED STATE

#### 11. Derived State (Computed)
- **Deskripsi:** Data turunan seperti `completionPercentage` (misalnya 75% selesai) atau status `isReadyForRecommendation`.
- **Lifecycle:** Dihitung ulang kapan pun sumber *Persistent State* terkait berubah.
- **Owner:** Application Selectors
- **Mutable / Immutable:** *Immutable*.
- **Reset Rule:** Akan senantiasa mengekor validitas data pada *Persistent State*.

### D. ROOT STATE

#### 12. Root State
- **Deskripsi:** *Object tree* puncak yang membungkus keseluruhan sub-*state* Modul Supervisi Akademik.
- **Lifecycle:** Setara dengan sesi aplikasi (*App Session*).
- **Owner:** State Manager (TBD)
- **Mutable / Immutable:** Memadukan sifat unik dari tiap irisan (*slice*).
- **Reset Rule:** Secara mutlak di-*reset* ke nol pada peristiwa *User Logout*.

## 4. KESIMPULAN

Struktur `SupervisionState.ts` secara bersih menyajikan model *State* tanpa satupun ketergantungan spesifik pada React (nol pengimporan Hook, Context, ataupun *Reducer*). Hal ini membuat logika modul sangat mudah dites secara mandiri (*Unit Test*) maupun ditransplantasi ke pustaka *State Management* (contoh: Redux, Zustand) kelak. Modul utama (KSP/RKT) sepenuhnya bebas dari perubahan, menjamin prinsip *Zero Impact*.
