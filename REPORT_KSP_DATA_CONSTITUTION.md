# KSP GOLD 2.5 - ENTERPRISE DATA CONSTITUTION
## TAMPUYAK OS ENTERPRISE ARCHITECTURE

### 1. ENTERPRISE DATA CONSTITUTION
Aturan mutlak yang mengikat seluruh desain arsitektur dan aliran data pada modul KSP:
- **RULE 001 - Single Source of Truth**: Setiap entitas data hanya boleh dimiliki oleh satu pemilik mutlak. Tidak boleh ada duplikasi state atau kebingungan sumber.
- **RULE 002 - Data Ownership**: Data secara ketat dipisahkan menjadi 4 domain: School Identity, KSP Content, Government Knowledge, dan Curriculum Structure.
- **RULE 003 - Builder is Stateless**: Semua komponen Builder/Assembler adalah *pure functions*. Dilarang keras menyimpan state internal atau memiliki hardcoded mock data.
- **RULE 004 - Dashboard is Consumer**: Dashboard murni berperan sebagai representasi (view) baca (Read Only) dan tidak memiliki hak kepemilikan atas data yang ditampilkannya.
- **RULE 005 - Preview is Consumer**: Preview Workspace murni merender struktur AST; tidak menyimpan atau mengubah state dokumen asal.
- **RULE 006 - Government Data is Read Only**: Referensi normatif dari pemerintah, regulasi, dan standar struktur BAB bersifat Read Only (Mutlak) dan tidak bisa diubah user.
- **RULE 007 - School Identity berasal dari Settings**: Seluruh atribut identitas sekolah (Nama, NIP, Alamat, dll) mutlak ditarik dari modul global Settings.
- **RULE 008 - Curriculum Structure berasal dari Enterprise Master Curriculum**: Struktur beban JP dan muatan lokal akan merujuk ke EMC (Roadmap Masa Depan), bukan dikelola oleh KSP.
- **RULE 009 - KSP Content berasal dari User Input**: Konten dinamis seperti Visi, Misi, Tujuan, Analisis Lingkungan dimiliki oleh modul Data KSP berdasarkan input pengguna.
- **RULE 010 - Tidak Boleh Ada Hardcode pada Builder**: Assembler dilarang keras menggunakan literal string atau injeksi data statis internal dalam produksi dokumen KSP.

### 2. DATA OWNERSHIP MATRIX

| Field Data | Owner | Editable | Read Only | Source of Truth |
| :--- | :--- | :--- | :--- | :--- |
| Nama Sekolah, NPSN, Alamat, Identitas | **Settings** (School Identity) | YA (via Settings) | TIDAK | Global `AppContext` Settings |
| Kepala Sekolah, Pengawas, Dinas | **Settings** (School Identity) | YA (via Settings) | TIDAK | Global `AppContext` Settings |
| Tahun Pelajaran, Semester | **Settings** (School Identity) | YA (via Settings) | TIDAK | Global `AppContext` Settings |
| Visi, Misi, Tujuan Sekolah | **User Input** (KSP Content) | YA (via Form) | TIDAK | Modul Data KSP / Settings Identitas |
| Analisis Lingkungan Belajar | **User Input** (KSP Content) | YA (via Form) | TIDAK | Modul Data KSP |
| Struktur BAB & Penamaan | **Government Knowledge** | TIDAK | YA | Modul KSP Core (Canonical Engine) |
| Profil Pelajar Pancasila | **Government Knowledge** | TIDAK | YA | Modul KSP Core / SPKG |
| Daftar Mapel Intrakurikuler | **Enterprise Master Curr.** | TIDAK (Roadmap) | YA | EMC Base (Roadmap) |
| Alokasi JP & Kokurikuler | **Enterprise Master Curr.** | TIDAK (Roadmap) | YA | EMC Base (Roadmap) |
| Tanggal Pengesahan | **User Input** (KSP Content) | YA | TIDAK | Modul Data KSP |

### 3. CONSUMER MATRIX

| Consumer Component | Peran Consumer | Data yang Dikonsumsi (Read-Only) |
| :--- | :--- | :--- |
| `KSPDashboard` | Visualisasi UI Status | School Identity (Settings), Meta KSP Content |
| `KspDocumentAssembler` | Generator AST | School Identity, KSP Content, Government Knowledge, EMC |
| `KspPreviewWorkspace` | Renderer Layar KSP | Output AST (CanonicalDocument) dari Assembler |

### 4. BOUNDARY DIAGRAM

```text
=============================================================================
                          ENTERPRISE BOUNDARIES
=============================================================================
[ SHARED / GLOBAL DATA ]
      ┌─────────────────────────┐           ┌─────────────────────────┐
      │   SCHOOL IDENTITY       │           │  KSP USER CONTENT       │
      │   (Global Settings)     │           │  (Local KSP Inputs)     │
      └───────────┬─────────────┘           └───────────┬─────────────┘
                  │                                     │
==================│=====================================│====================
[ KSP MODULE CORE ]▼                                     ▼
      ┌─────────────────────────────────────────────────────────────┐
      │                       METADATA ADAPTER                      │
      │        (Anti-Corruption Layer - Transforms to KspMetadata)  │
      └───────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
      ┌─────────────────────────────────────────────────────────────┐
      │                   KSP DOCUMENT ASSEMBLER                    │
      │                  (Stateless Pure Function)                  │
      └───────┬─────────────────────────────────────────────┬───────┘
              │                                             │
============= │ =========================================== │ ===============
[ REFERENCE ] │                                             │
      ┌───────▼─────────────────┐                   ┌───────▼───────────────┐
      │ GOVERNMENT KNOWLEDGE    │                   │ CURRICULUM STRUCTURE  │
      │ (Read-Only Base)        │                   │ (EMC - ROADMAP)       │
      └─────────────────────────┘                   └───────────────────────┘
```

### 5. DATA FLOW DIAGRAM

```text
        [SETTINGS]                [GOVERNMENT KNOWLEDGE]          [EMC (ROADMAP)]
             │                              │                            │
             │ (School Identity)            │ (Normative Ref)            │ (Mapel & JP)
             ▼                              ▼                            ▼
  +--------------------+          +--------------------+        +--------------------+
  |  KSP DASHBOARD     |<--Read---|  KSP ASSEMBLER     |<--Read-|  KSP PREVIEW       |
  |  (UI Representation|          |  (Document Builder)|        |  (Document Render) |
  +--------------------+          +---------+----------+        +--------------------+
             ▲                              ▲                            ▲
             │                              │                            │
             └──────────────────────────────┼────────────────────────────┘
                                            │ (Visi, Misi, Analisis)
                                     [KSP CONTENT]
                                      (User Input)
```

### 6. ARCHITECTURE VALIDATION

| Prinsip | Status | Catatan Validasi Konstitusi |
| :--- | :--- | :--- |
| **Data Independence** | **PASS** | KSP bertindak murni sebagai konsumen data entitas luar tanpa merusak state mereka. |
| **Separation of Concern** | **PASS** | View (Preview/Dashboard), Builder (Assembler), dan Data (Settings) terpisah tegas. |
| **Stateless Builder** | **PASS** | Builder diformalkan sebagai fungsi *pure* (menerima input, mengeluarkan AST). |
| **Source of Truth** | **PASS** | Identitas dipastikan bersumber dari Settings, menghapus kemungkinan replikasi data statis. |

### 7. ENTERPRISE READINESS
**Status: READY FOR IMPLEMENTATION**
Konstitusi Data telah dikunci. Modul KSP telah memiliki landasan arsitektur (Anti-Corruption Layer) dan pemetaan Ownership yang terdefinisi dengan sangat ketat. Pembuatan kode implementasi untuk *Metadata Adapter* (penghapusan hardcode di KSP) sekarang sepenuhnya aman untuk dilaksanakan dengan risiko regresi ke subsistem RKAS, RKJM, dan RKT pada level ZERO.
