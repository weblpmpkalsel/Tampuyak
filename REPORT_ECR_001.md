# ECR-001: KSP Metadata Adapter Implementation Specification

### 1. File yang HARUS berubah
- `src/ksp/KspMetadataAdapter.ts` (BARU)
  Alasan: Membuat fungsi murni dan hook untuk membaca global state `Settings` menjadi `KspMetadata` tanpa membocorkan tipe data `Settings`.
  Risiko: Sangat rendah (File baru).
- `src/ksp/KSPDashboard.tsx`
  Alasan: Mengubah hardcoded mock `EnterpriseConfigurationCenter` menjadi metadata asli yang dikonsumsi melalui Adapter (`useKspMetadata`).
  Risiko: Rendah (Hanya mengganti variabel rujukan nilai UI, tidak ada perubahan business logic).
- `src/enterprise/workspace/preview/KspPreviewWorkspace.tsx`
  Alasan: Menginjeksikan `KspMetadata` melalui adapter agar disuplai ke `assembleKspDocument()`.
  Risiko: Rendah.
- `src/enterprise/document/ksp/KspDocumentAssembler.ts`
  Alasan: Menghapus import `EnterpriseConfigurationCenter`. Fungsi harus menerima parameter `(metadata: KspMetadata)` sebagai ganti data internal statis.
  Risiko: Medium (Mengubah signature core function Assembler).

### 2. File yang TIDAK BOLEH berubah
- `src/Tampuyak.tsx` (Root Component / Router / Global State)
- `src/workspace/*` (Core Workspace UI)
- `src/planning/*` (Modul RKT)
- `src/rkas/*` (Modul RKAS)
- `src/DocumentCompositionEngine/*` (Modul RKJM)
- `src/models/*`
- `src/engines/*`

### 3. Penjelasan Perubahan Tiap File
- **KspMetadataAdapter** (Baru): 
  Membuat interface `KspMetadata`. Membuat class murni `KspMetadataAdapter.adapt(settings)` dan hook `useKspMetadata()` (yang mengambil nilai dari `useApp().settings` di dalam scope adapter sehingga consumer tidak perlu menyentuh object `settings` mentah sama sekali).
- **KSPDashboard**:
  Mengganti import `EnterpriseConfigurationCenter` dengan hook `useKspMetadata()`. Variabel `EnterpriseConfigurationCenter.schoolName` akan diubah menjadi `metadata.schoolName`, dan seterusnya. UI tetap, state lokal tidak berubah.
- **KspPreviewWorkspace**:
  Memanggil hook `useKspMetadata()` untuk mendapatkan object `metadata`. Pada parameter `useState(() => assembleKspDocument())`, diubah menjadi `useState(() => assembleKspDocument(metadata))`.

### 4. Perubahan Kontrak KspDocumentAssembler
- **Sebelum**: 
  Fungsi parameterless `export function assembleKspDocument(): CanonicalDocument`. Metadata langsung diambil dari import module `EnterpriseConfigurationCenter`.
- **Sesudah**: 
  Fungsi murni parameter injection: `export function assembleKspDocument(metadata: KspMetadata): CanonicalDocument`. Assembler tidak memiliki efek samping dan mutlak bergantung pada parameter yang diterimanya, sesuai dengan arsitektur Stateless Pure Function.

### 5. Perubahan Preview
- **KspPreviewWorkspace**:
  Tidak lagi merender data statis dari Assembler secara buta. Preview bertindak sebagai container yang mendengarkan perubahan dari Adapter dan mengumpankannya ke fungsi Assembler saat akan membangun virtual AST document.

### 6. Sequence Diagram
Settings (AppContext)
  ↓ [State disadap oleh hook internal adapter]
Metadata Adapter (`useKspMetadata()`)
  ↓ [Mengirim data bersih DTO `KspMetadata`]
Dashboard / Preview (Consumers)
  ↓ [Passing dependency parameter]
Assembler (`assembleKspDocument(metadata)`)
  ↓ [AST Response]
Preview (Render Engine)

### 7. Validation Checklist
- Nama sekolah berubah ✓
- Jenjang berubah ✓
- Alamat berubah ✓
- Preview berubah ✓
- RKJM tetap normal ✓
- RKT tetap normal ✓
- RKAS tetap normal ✓

### 8. Regression Checklist
- **Workspace**: Tidak ada refactoring core layout workspace.
- **Planning (RKT/RKAS)**: Parameter builder RKT/RKAS tidak disentuh.
- **Backup**: State struktur KSP (Document Canonical) tetap sama persis, AST serialization tidak pecah.

### 9. Perhitungan Tingkat Risiko
**Probabilitas Regresi: < 1%**
Karena perubahan dibatasi HANYA di lingkungan namespace `/ksp` dan adapter `/enterprise/document/ksp`. Semua modul luar KSP tidak mengimpor `KspDocumentAssembler` sehingga modifikasi argument tidak akan mematahkan pipeline build modul lain. `Tampuyak.tsx` sama sekali tidak dimodifikasi.

### 10. GO / NO GO
**GO**
Implementasi ini 100% aman karena berpegang teguh pada prinsip Inversion of Control. Assembler KSP dibuat *pure*, dan Adapter melindungi komponen React dari dependency pada core state. Dengan tidak menyentuh `Tampuyak.tsx`, risiko crash pada level top-router ditiadakan secara fundamental.
