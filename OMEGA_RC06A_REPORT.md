# OMEGA-RC06A — DOCUMENT RENDER PIPELINE AUDIT

## 1. KSP (Kurikulum Satuan Pendidikan)
- **Renderer yang digunakan:** `CanonicalRenderer` (melalui `KspPreviewWorkspace.tsx`)
- **Wrapper tabel:** `<div className="overflow-x-auto print:overflow-visible w-full gdds-table-block">`
- **Komponen tabel:** `<table className="w-full border-collapse border border-black text-sm">`
- **CSS print:** Menggunakan `print:overflow-visible` untuk mencegah scrollbar/potongan di cetak.
- **Menggunakan overflow-x-auto:** Ya (ditambah `print:overflow-visible`).
- **Renderer kanonik:** Ya.

## 2. RKJM, RKT, RKAS
- **Renderer yang digunakan:** `EnterpriseDocumentViewer` (melalui `Tampuyak.tsx`)
- **Wrapper tabel:** `<div className="overflow-x-auto  w-full gdds-table-block">`
- **Komponen tabel:** `<table className="w-full min-w-[800px]  table-auto max-w-full border-collapse border border-slate-300 text-sm">`
- **CSS print:** Tidak ada `print:overflow-visible` di wrapper. Terdapat `min-w-[800px]` pada tabel.
- **Menggunakan overflow-x-auto:** Ya (tapi tanpa `print:overflow-visible`).
- **Renderer kanonik:** Tidak (KSP menggunakan CanonicalRenderer, sementara ketiganya menggunakan EnterpriseDocumentViewer).

## 3. Kesimpulan & Komponen Penyebab Perbedaan
KSP menggunakan pipeline **CanonicalRenderer** (Standardisasi KSP), sedangkan RKJM, RKT, dan RKAS di-*render* secara *hardcode* dalam komponen tunggal **EnterpriseDocumentViewer.tsx**.

Perbedaan pada komponen tabel menjadi penyebab munculnya isu scaling dan pemotongan tabel:
- Di `EnterpriseDocumentViewer.tsx`, tabel memiliki `min-w-[800px]` yang memaksa browser untuk mengecilkan dokumen saat dicetak (scaling), atau terpotong jika layar sempit (karena hilangnya `print:overflow-visible`).
- `CanonicalRenderer` telah mendukung tabel responsif cetak dengan bersih tanpa paksaan `min-w`.

**File & Komponen Penyebab:** `src/EnterpriseDocumentViewer.tsx`
