# CONTEXT ARCHITECTURE: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Fase:** S6.7 React Context
**Status:** FINAL (Safe Mode)

## 1. TUJUAN

Dokumen ini menjelaskan rancangan arsitektur React Context yang bertanggung jawab atas pengelolaan *State* di dalam UI Modul Supervisi Akademik. Implementasi berpusat pada pemanfaatan `useReducer` untuk menghindari prop-drilling, menjaga sentralisasi logika perubahan state, dan mempersiapkan landasan penyajian data ke antarmuka pengguna (UI).

## 2. KONTRAK IMPLEMENTASI (THE NO'S)

- **NO Business Logic:** Context ini 100% "bodoh" (*dumb*). Ia tidak mengandung logika domain atau aturan validasi apa pun. Context hanya bertindak memanggil `ApplicationService` dan menaruh hasilnya ke *state*.
- **NO Repository Implementation:** Context tidak mengetahui dari mana data berasal. Ia tidak melakukan pemanggilan langsung ke Firebase, IndexedDB, atau *fetch*.
- **NO UI Components:** Context dipisah secara independen tanpa menyertakan elemen visual, JSX layout, Menu, maupun Route.
- **NO Individual useState:** Seluruh mutasi state diorkestrasi menggunakan sebuah mesin `Reducer` tunggal (*Single Source of Truth*).

## 3. KOMPONEN ARSITEKTUR

Pendekatan *React Context* dipecah menjadi beberapa berkas fungsional tunggal untuk menjamin skalabilitas (*Separation of Concerns*):

### A. SupervisionActions.ts
- **Fungsi:** Mendefinisikan kontrak *type* dan struktur *payload* dari seluruh aksi yang mungkin terjadi (seperti `SET_PLANS`, `SET_LOADING`, `SET_ERROR`).

### B. SupervisionReducer.ts
- **Fungsi:** Murni (*pure function*) memetakan `SupervisionAction` menjadi `SupervisionRootState` yang baru tanpa mutasi *(immutable update)*.
- **Isi Utama:** Fungsi `supervisionReducer` dan definisi status awal (`initialSupervisionState`).

### C. SupervisionContext.tsx
- **Fungsi:** Menyediakan objek `React.Context` yang memuat struktur: `{ state, dispatch, applicationService }`.

### D. SupervisionProvider.tsx
- **Fungsi:** Komponen *wrapper* (`Provider`) yang menginisiasi `useReducer` serta melakukan instansiasi `SupervisionApplicationService` secara *stateless*.

### E. useSupervision.ts
- **Fungsi:** Sebuah *Custom Hook* ringkas untuk dikonsumsi oleh komponen *child*. 
- **Validasi:** Secara otomatis melempar error (*throw Error*) jika dipanggil di luar jangkauan `SupervisionProvider`.

### F. SupervisionSelectors.ts
- **Fungsi:** Kumpulan fungsi utilitas (seperti `selectDerivedState`) yang bertugas mengkalkulasi ulang data derivasi (misal: `completionPercentage` dan status `isReadyForRecommendation`) dari *State* pusat.

## 4. KESIMPULAN

Layer *React Context* berhasil dibentuk secara tipis (*thin layer*) tanpa merampas tanggung jawab layer lain. Implementasi ini berhasil mempertahankan isolasi *Zero Impact* pada *Legacy Code*, lulus proses *Build* serta *Type Check*, dan siap diinjeksikan secara aman ke dalam komponen UI (Antarmuka) Modul Supervisi Akademik pada fase berikutnya.
