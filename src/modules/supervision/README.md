# Modul Supervisi Akademik

**Status:** IN DEVELOPMENT (Phase S6.1 Foundation)

## Arsitektur Modul

Modul Supervisi Akademik dirancang sebagai **Sidecar Module** di dalam ekosistem TAMPUYAK OS. Modul ini beroperasi secara terisolasi dan sepenuhnya mematuhi prinsip **Strict Read-Only** terhadap modul inti lainnya (seperti KSP, RKJM, RKT, dan RKAS).

### Aturan Utama (Architecture Lock)
1. **No Mutation:** Modul ini tidak akan pernah mengubah data referensi dari Profil Sekolah, Data Guru, Kalender Pendidikan, KSP, RKJM, maupun RKT. Semua data tersebut diakses melalui teknik *Read-Only Projection*.
2. **Independent Storage:** Seluruh data yang dihasilkan (Program Supervisi, Jadwal, Hasil Observasi, Coaching, RTL) akan disimpan pada *collection/namespace* yang sepenuhnya terpisah dari sistem perencanaan.
3. **No Automatic Sync:** Hasil atau rekomendasi dari supervisi hanya bersifat sebagai bahan pertimbangan (insight) bagi Kepala Sekolah dan tidak secara otomatis mengubah dokumen perencanaan operasional.
4. **Independent State Management:** Modul ini akan memiliki React Context (`SupervisionContext`) sendiri yang tidak berbagi *state mutable* dengan `WorkspaceContext` atau `PlanningContext`.

### Struktur Direktori
- `components/`: Komponen UI spesifik untuk modul supervisi (rubrik, form observasi).
- `pages/`: Tampilan tingkat halaman (Dasbor Supervisi, Pengisian Instrumen).
- `services/`: Layanan untuk komunikasi dengan *independent storage* (Firestore/IndexedDB khusus supervisi).
- `types/`: Definisi antarmuka (interface) dan tipe data TypeScript untuk domain supervisi.
- `hooks/`: Kumpulan *React Hooks* khusus untuk pengelolaan *state* lokal supervisi.
- `utils/`: Fungsi-fungsi bantuan spesifik modul supervisi.

---
*Dokumen ini merupakan bagian dari blueprint implementasi aman (Fail-Safe Incremental Delivery) TAMPUYAK OS.*
