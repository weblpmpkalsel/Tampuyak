# PATCH M1.1-R1 | IMPLEMENTATION REPORT

## 1. Enterprise Change Summary
- Dihapusnya antisipasi terhadap field *workspace* yang belum berstatus kontrak (`settings?.timPenyusun` dan `settings?.draftingTeam`) pada `KspMetadataAdapter`. Pemetaan `draftingTeam` pada adapter sekarang tidak membaca nilai yang tidak didukung atau direstui dari *settings* untuk menjaga kesucian kontrak ruang kerja (Workspace contract).
- Dilakukan penyesuaian teks status kekosongan (*empty-state*) di dalam `TeamBuilder` sesuai prinsip *Government Fidelity*, merujuk pada standar administratif resmi, membuang frasa *placeholder* generik sebelumnya.

## 2. Files Modified
- `src/ksp/KspMetadataAdapter.ts`: Menghapus baris kode yang membaca `settings?.timPenyusun || settings?.draftingTeam`. Mengikuti aturan bahwa *Metadata Adapter* hanya mengonsumsi daftar kolom (fields) *Workspace* yang terpublikasi dan resmi.
- `src/enterprise/document/frontmatter/TeamBuilder.ts`: Mengganti frasa `"Data sedang dalam tahap penyusunan."` menjadi pesan normatif sesuai dokumen perundang-undangan: `"Susunan Tim Penyusun Kurikulum Satuan Pendidikan ditetapkan secara terpisah melalui Surat Keputusan Kepala Sekolah."`

## 3. Boundary & Fidelity Audit
- **PASS**: Pengambilan nilai `draftingTeam` patuh pada pola ketiadaan (*absence of data*) karena belum ada sumber resmi, namun ini tidak memblokir render halaman karena `TeamBuilder` menggunakan *fallback state* (skenario di mana penyusun ditetapkan di luar dokumen KSP, melalui Surat Keputusan Kepsek).
- **PASS**: Implementasi sama sekali tidak mengambil sumber tebakan atau menyimpulkan tim dari data profil guru yang ada, mencegah data tiruan atau salah asumsikan.

## 4. Build & Regression
- **LINT**: PASS
- **BUILD**: PASS

M1.1 kini siap dikunci (LOCKED) tanpa adanya kebocoran *workspace property* atau ketidaksesuaian tata bahasa birokrasi pemerintahan.
