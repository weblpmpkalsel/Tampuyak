# CANONICAL PLATFORM EVOLUTION ROADMAP
**Checkpoint:** OMEGA-PLATFORM-EVOLUTION-001
**Project:** TAMPUYAK OS
**Date:** 2026-07-13

## 1. Platform Features
Fitur-fitur ini merupakan kebutuhan generik yang bersifat lintas-dokumen dan pantas untuk diintegrasikan ke dalam `CanonicalDocument` dan `CanonicalRenderer`:
- **Tabel Multi-Header (Colspan/Rowspan)**: Dukungan *advanced table cell* untuk matriks kompleks.
- **Visualisasi Timeline (Gantt View)**: Dukungan layout jadwal/waktu lintas periode.
- **Real Pagination Engine V2**: Pengganti *MockPaginationEngine* untuk menangani *Daftar Isi* otomatis, Header/Footer halaman, dan perhitungan tinggi halaman secara nyata.
- **Generic Nomenclature (Layout Styles)**: Perubahan nama *style* yang terikat domain (seperti `PROGRAM_CARD`, `PROGRAM_TITLE`) menjadi nama generik (`CARD_CONTAINER`, `CARD_TITLE`).
- **Flexible Signature Grid**: Abstraksi komponen tanda tangan (Approval) yang dapat menyesuaikan jumlah *signee* (tidak terpaku pada 2 orang saja).

## 2. Document Features
Fitur-fitur ini spesifik hanya untuk satu dokumen dan/atau tidak memiliki nilai *reusability* lintas dokumen. Akan tetap ditangani di level `Adapter` atau sebagai *Metadata*:
- **Tabel Target 4 Tahun RKJM**: Logika perhitungan kolom Tahun 1 hingga 4.
- **Tabel Target & Anggaran RKT**: Pemetaan kolom yang khusus berisi data Rencana Kegiatan Tahunan.
- **Pola Persetujuan Kepala Sekolah & Komite**: Default struktur pengesahan untuk RKJM/RKT (meski Grid-nya platform, isian defaultnya adalah Document Feature).

## 3. Reusability Analysis
| Fitur / GAP | Reusable? | Target Evolusi | Alasan |
|---|---|---|---|
| Tabel Multi-Header | **YA** | Canonical Platform | RKAS dan Laporan Keuangan BOS akan membutuhkan tabel kompleks dengan multi-header. |
| Timeline (Gantt) | **YA** | Canonical Platform | RKAS, RKT, dan Dokumen Perencanaan selalu membutuhkan timeline kegiatan. |
| Card Nomenclature | **YA** | Canonical Platform | Standarisasi komponen UI (Card, Metric Grid) untuk semua dokumen. |
| Real Pagination | **YA** | Canonical Platform | Semua dokumen *print-ready* wajib memiliki paginasi yang presisi. |
| Flexible Signature| **YA** | Canonical Platform | Dokumen BOS mungkin memiliki 3-4 *signee*, bukan hanya 2. |
| RKJM Target | **TIDAK**| Adapter/Metadata | Hanya berlaku untuk RKJM (Jangka Menengah 4 tahun). |

## 4. Priority Matrix
| Priority | Klasifikasi | Item |
|---|---|---|
| **P0** (Wajib sebelum RKAS) | Blocker untuk RKAS | 1. Tabel Multi-Header<br>2. Generic Card Layout Nomenclature |
| **P1** (Boleh sesudah RKAS) | Core Feature / Enhancement | 1. Visualisasi Timeline (Gantt)<br>2. Real Pagination Engine V2 |
| **P2** (Future) | Polish & Advanced UI | 1. Flexible Signature Grid<br>2. Watermark / Callout / Infobox |

## 5. Version Roadmap
### Canonical Platform v2.1
Fokus: Persiapan RKAS dan Standarisasi Penamaan
- Tabel Multi-Header (Colspan/Rowspan di `TableCellNode`).
- Generic Card Nomenclature (Migrasi `PROGRAM_CARD` -> `CARD_CONTAINER`).

### Canonical Platform v2.2
Fokus: Visualisasi Perencanaan
- Timeline Engine (Gantt View Rendering).
- Flexible Signature Grid.

### Canonical Platform v2.3
Fokus: Produksi Cetak Lanjutan
- Real Pagination Engine V2.
- Dukungan *Page Header*, *Page Footer*, dan *Watermark*.
- Infobox & Callout Components.

## 6. Migration Impact
Setiap evolusi `CanonicalRenderer` (seperti perubahan Nomenclature P0) akan berdampak pada dokumen yang sudah ada. Oleh karena itu:
- Perubahan `layoutStyle` (misal `PROGRAM_CARD` ke `CARD_CONTAINER`) wajib diikuti oleh refaktor pada `BaseDocumentAssembler` dan `CanonicalRenderer` secara bersamaan (Atomic Commit).
- Penambahan properti baru (seperti `colspan` pada tabel) harus *backward-compatible* sehingga dokumen RKJM/RKT yang lama tidak pecah jika dirender ulang.

## 7. Recommended Implementation Order
1. **(Immediate)** Lakukan *Find & Replace* untuk menuntaskan *Generic Card Nomenclature* (menghapus *technical debt* RKJM).
2. **(Before RKAS)** Implementasi struktur data `colspan`/`rowspan` pada *Canonical Document Types* dan update *Renderer* untuk tabel generik.
3. **(Next Phase)** Rancang skema JSON dan *Renderer* untuk `TIMELINE_VIEW`.
4. **(Future Phase)** Ganti MockPaginationEngine.
