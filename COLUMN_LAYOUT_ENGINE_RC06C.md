# COLUMN LAYOUT ENGINE RC06C REPORT
**Checkpoint:** OMEGA-TABLE-COLUMN-ENGINE-RC06C
**Project:** TAMPUYAK OS

## 1. Root Cause Analysis
Browser seringkali gagal mendistribusikan ruang kolom tabel secara proporsional jika bergantung pada *automatic column layout* (`table-layout: auto`), terutama pada ruang sempit seperti kanvas cetak (*Print Area* A4 Portrait yang hanya memiliki lebar ~529px).
Ketiadaan definisi `width` eksplisit dan hilangnya `table-fixed` membuat *Chrome Print Engine* memampatkan tabel secara ekstrem atau memaksa teks menumpuk (*clipping* / terlalu sempit), menyebabkan ketidakkonsistenan distribusi ruang antara layar Preview dan hasil cetak PDF.

## 2. Tabel Terdampak dan Strategi Distribusi Kolom
*Column Layout Engine* baru ini tidak memakai rasio pukul rata, namun memetakan struktur unik dari masing-masing jenis tabel, yakni sebagai berikut:

**1. Proyeksi Target Capaian (4 Tahun)**
- **Karakteristik:** Empat kolom nilai tahun (angka/persen).
- **Strategi Lebar Kolom:** `w-1/4` (25% rata per kolom).

**2. Matriks Identifikasi, Refleksi, Benahi (IRB Matrix)**
- **Karakteristik:** Tiga kolom uraian kalimat/paragraf panjang.
- **Strategi Lebar Kolom:** Identifikasi (30%), Refleksi (30%), Tindakan Benahi (40%). Ruang lebih besar diberikan pada tindakan benahi.

**3. Tabel Program & Kegiatan (RKT)**
- **Karakteristik:** Memiliki satu kolom penjelas mayor dan kolom sisipan minor.
- **Strategi Lebar Kolom:** Kegiatan (25%), Deskripsi / Output (45%), Jadwal (15%), Penanggung Jawab (15%).

**4. Generic Data Table (RKAS / Lampiran / Dinamis)**
- **Karakteristik:** Kolom tabel bergantung pada format kunci (*keys*) JSON dinamis.
- **Strategi Lebar Kolom (Smart Keyword Mapping):**
  - **Fixed Narrow:** `no` (5%).
  - **Numeric/Metrics:** `semester`, `kuartal`, `tahun`, `skor`, `nilai`, `jumlah`, `volume`, `satuan` (8%).
  - **Dates/Schedule:** `jadwal`, `waktu`, `bulan` (10%).
  - **Financial/Meta:** `harga`, `biaya`, `sumber`, `penanggung`, `pj` (12%).
  - **Title/Labels:** `program`, `kegiatan`, `nama` (25%).
  - **Long Descriptions:** `uraian`, `deskripsi`, `analisis`, `strategi`, `indikator` (35%).

## 3. Before vs After
**Before:** 
`<table className="w-full text-sm border-collapse ...">`
`<th>Identifikasi</th>` 
*(Browser menentukan sendiri lebar tabel dan kolom, dan sangat mudah hancur pada saat cetak/A4)*

**After:**
`<table className="w-full table-fixed text-sm border-collapse ...">`
`<th className="w-[30%] ...">Identifikasi</th>`
*(Browser **diwajibkan** mendistribusikan ruang 30% untuk kolom ini secara absolut berdasarkan dimensi kertas saat ini)*

## 4. Bukti Kepatuhan Golden Rule
- ✅ **Hanya EnterpriseDocumentViewer Dipatch:** Perubahan hanya menyasar kelas CSS pada `src/EnterpriseDocumentViewer.tsx`.
- ✅ **Geometry Engine Tidak Berubah:** Pengaturan Margin 4cm/3cm, dan resolusi A4 210mm/297mm tetap terkunci dan tidak berubah.
- ✅ **Pagination Engine Tidak Berubah:** Pemisahan halaman dan Front Matter tetap konsisten seperti pada RC05A. Tabel mengalir menyesuaikan kertas, bukan sebaliknya.
