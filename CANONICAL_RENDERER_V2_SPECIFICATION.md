# CANONICAL RENDERER V2 SPECIFICATION
**Checkpoint:** OMEGA-PUBLISHING-V3
**Project:** TAMPUYAK OS
**Status:** ARCHITECTURE SPECIFICATION

## 1. Vision
Mengokohkan `CanonicalRenderer` sebagai satu-satunya *Enterprise Rendering Platform* (Single Source of Truth) untuk Tampuyak OS. Seluruh dokumen (KSP, RKJM, RKT, RKAS) akan dirender melalui arsitektur terpusat ini. `EnterpriseDocumentViewer` akan dipensiunkan secara bertahap dan diturunkan derajatnya menjadi sekadar *Adapter/Orchestrator* penyambung data lama ke *Canonical Engine*.

## 2. Design Principles
1. **Single Source of Truth:** Satu mesin tunggal untuk pagination, satu mesin tunggal untuk geometry. Tidak ada lagi kalkulasi tersebar atau CSS sisipan (*inline*).
2. **Document Agnostic:** Renderer tidak peduli apakah itu dokumen KSP atau RKJM. Renderer hanya mengerti bahasa `CanonicalDocument`.
3. **Decoupled Architecture:** Setiap *engine* memiliki batasan tanggung jawab (*boundary*) yang sangat ketat dengan hierarki dependensi satu arah.
4. **Print as a First-Class Citizen:** *Layout print* (Portrait, Landscape, Margin, Overflow) adalah entitas *native*, bukan modifikasi CSS belakangan.

## 3. Engine List & Specifications

### 3.1 PageGeometry Engine
- **Responsibility:** Menentukan dimensi fisik, *padding*, *margin*, dan *printable area* (A4 Portrait & Landscape).
- **Input:** `orientation` ('portrait' | 'landscape'), `context` ('screen' | 'print').
- **Output:** Obyek kalkulasi dimensi (Pixel/MM) dan *Style Mapping*.
- **Dependency:** -
- **Public API:** `getDimensions(orientation)`, `getPrintableWidth(orientation)`

### 3.2 Pagination Engine & Virtual Pagination
- **Responsibility:** Menghitung letak pemotongan halaman fisik (*page boundaries*) berdasarkan hasil *render* DOM. Mencegah *widows/orphans*.
- **Input:** Hierarki DOM (*React Refs*), hasil dari `PageGeometry`.
- **Output:** Posisi indeks *page-break*, daftar jumlah halaman per seksi (*section*).
- **Dependency:** `PageGeometry`.
- **Public API:** `calculatePageBreaks()`, `getPageCount(sectionId)`

### 3.3 Page Number Engine
- **Responsibility:** Membangkitkan penomoran berkesinambungan (contoh: angka Romawi untuk sampul/pengesahan, angka Arab untuk bab konten).
- **Input:** Hasil luaran `PaginationEngine`.
- **Output:** Peta (map) relasi antara ID Node dengan nomor halamannya.
- **Dependency:** `PaginationEngine`.
- **Public API:** `getPageNumber(nodeId)`, `formatPageNumber(index, style)`

### 3.4 Table Engine (Column Layout Engine)
- **Responsibility:** Mendistribusikan lebar kolom tabel secara proporsional berdasar tipe konten (implementasi RC06C). Mencegah *scaling/clipping* saat cetak.
- **Input:** Data `TableBlock`.
- **Output:** *Markup* HTML Tabel yang responsif dan aman untuk cetak.
- **Dependency:** -
- **Public API:** `renderTable(block)`

### 3.5 Header/Footer Engine
- **Responsibility:** Menyuntikkan *running headers*, *footers*, dan nomor halaman pada setiap halaman cetak fisik.
- **Input:** Luaran `PaginationEngine` dan `PageNumberEngine`.
- **Output:** Elemen *overlay/absolute* di layar *Preview* dan *Print*.
- **Dependency:** `PaginationEngine`, `PageNumberEngine`.
- **Public API:** `renderHeaderFooter(pageIndex)`

### 3.6 TOC Engine
- **Responsibility:** Mencetak *Table of Contents* (Daftar Isi) yang dinamis beserta penomoran halamannya.
- **Input:** Struktur TOC dari `CanonicalDocument`, *Mapping* nomor halaman dari `PageNumberEngine`.
- **Output:** *Markup* TOC dengan garis titik-titik (*leaders*) dan nomor halaman akurat.
- **Dependency:** `PageNumberEngine`.
- **Public API:** `buildTOC(document, pageMapping)`

### 3.7 Print Optimization Engine
- **Responsibility:** Menonaktifkan fitur interaktif (*hover*, *edit button*, *overlay UI*) dan menyuntikkan aturan `@media print` murni.
- **Input:** Status `isPrintMode`.
- **Output:** Kumpulan *class* CSS bebas distorsi untuk mode cetak.
- **Dependency:** -
- **Public API:** `getPrintClasses()`, `isPrintMode()`

### 3.8 Editing & Selection Layer
- **Responsibility:** Menangani interaksi kursor pengguna, pemilihan blok/teks (*Node Selection*), dan penyimpanan perubahan/override.
- **Input:** Event interaksi DOM (Click, Hover).
- **Output:** Eksekusi *callback* `onSelectNode` atau `onSaveOverride`.
- **Dependency:** -
- **Public API:** `handleSelection(nodeId)`, `renderEditableWrapper()`

## 4. Dependency Diagram
```text
CanonicalRenderer
│
├── PageGeometry
├── PaginationEngine
│    └── PageNumberEngine
│         ├── TOCEngine
│         └── HeaderFooterEngine
├── CoverEngine
├── TOCEngine
├── ChapterEngine
│    └── TableEngine
├── PrintOptimizationEngine
├── EditingLayer
└── NodeRenderer
```

## 5. CanonicalDocument V2 Schema Update
Berdasarkan audit, skema `CanonicalDocument` saat ini perlu ditambahkan kemampuannya (spesifikasi antarmuka) untuk menampung RKJM, RKT, dan RKAS secara utuh, tanpa implementasi terlebih dulu:

- **`DocumentSection`**: Membutuhkan properti `orientation?: 'portrait' | 'landscape'` untuk mendukung RKAS.
- **`TableBlock`**: Membutuhkan properti *metadata layout* tabel seperti `columnStrategy?: 'auto' | 'proportional' | 'fixed'` dan susunan array `columnWidths?: string[]`.
- **`PageBreakBlock`**: Membutuhkan properti pemisah halaman manual yang deklaratif (eksplicit manual page break).

## 6. Migration Contract
`EnterpriseDocumentViewer` akan di-*downgrade* perannya menjadi sekadar **Adapter / Thin Orchestrator**. Ia akan kehilangan seluruh logika *rendering* tabel dan CSS:

```text
[Legacy DocumentModel (RKJM/RKT/RKAS)] 
       ↓ (Transform)
[DocumentAdapter (misal: RkjmDocumentAssembler)] 
       ↓ (Hasil Mapping)
[CanonicalDocument V2] 
       ↓ (Render)
[CanonicalRenderer V2]
```

## 7. Compatibility Matrix
| Requirement | Canonical V1 (Saat Ini) | Canonical V2 (Target) |
| :--- | :--- | :--- |
| **Portrait Mode** | ✅ Ya | ✅ Ya |
| **Landscape Mode**| ❌ Tidak | ✅ Ya (Per-Seksi) |
| **Table Layout Engine**| ❌ Auto (Browser) | ✅ Custom Engine RC06C |
| **TOC Pagination**| ❌ Tidak Ada Nomor | ✅ Ya (Via PaginationEngine)|
| **KSP Rendering** | ✅ Penuh | ✅ Penuh |
| **RKJM/RKT/RKAS Rendering** | ❌ Tidak Kompatibel | ✅ Kompatibel Penuh |

## 8. Sprint Plan & Deprecation Strategy
**Sprint Plan:**
- **Sprint 1:** Persiapan Arsitektur & Perubahan Tipe (`CanonicalDocument V2`).
- **Sprint 2:** Ekstraksi `TableEngine` & `PageGeometry` (Landscape Support).
- **Sprint 3:** Pengembangan `PaginationEngine`, `PageNumberEngine`, dan `TOCEngine`.
- **Sprint 4:** Pembuatan Adapter/Assembler dokumen lama (RKJM, RKT, RKAS) menjadi format Canonical.
- **Sprint 5:** Uji Coba Transisi, Migrasi Komponen Pemanggil di `Tampuyak.tsx`.

**Deprecation Strategy:**
Terhitung sejak dimulainya Sprint 1, `EnterpriseDocumentViewer` berstatus **FROZEN** (Dilarang ada penambahan fitur). Pada akhir Sprint 5, setelah `CanonicalRenderer` 100% matang, file `EnterpriseDocumentViewer.tsx` akan dihapus dari *codebase* seluruhnya.
