# DEPENDENCY MATRIX REPORT

## 1. Core Planning Matrices

### KSP (Kurikulum Satuan Pendidikan)
- **Upstream Dependencies**: School Identity, Rapor Pendidikan.
- **Downstream Documents**: RKJM.

### RKJM (Rencana Kerja Jangka Menengah)
- **Upstream Dependencies**: School Identity, Visi Misi, Rapor Pendidikan, Analisis Prioritas.
- **Downstream Documents**: RKT.

### RKT (Rencana Kerja Tahunan)
- **Upstream Dependencies**: RKJM Disetujui (Approved), Sasaran Strategis Tahunan.
- **Downstream Documents**: RKAS.

### RKAS (Rencana Kegiatan dan Anggaran Sekolah)
- **Upstream Dependencies**: RKT Disetujui (Approved), Rincian Kegiatan Tahunan.
- **Downstream Documents**: Monitoring & Evaluasi.

## 2. Evaluation Matrices

### Monitoring
- **Upstream Dependencies**: RKAS Disetujui (Approved), Implementasi Pelaksanaan.
- **Downstream Documents**: Evaluasi.

### Evaluasi
- **Upstream Dependencies**: Monitoring Disetujui (Approved), Laporan Capaian.
- **Downstream Documents**: None.

## 3. Findings
All matrices form a linear, non-circular graph. Forward dependencies are fully mapped.
