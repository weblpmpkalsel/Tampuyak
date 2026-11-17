# FINAL ROOT CAUSE AUDIT — SHARED SCHOOL METADATA

Berdasarkan audit forensik mendalam (tanpa merubah satu baris kode pun), saya telah menelusuri aliran data dari `Workspace` hingga `Document Builder` dan merunut sumber pasti dari string yang muncul.

## AUDIT PER FIELD

### 1. School Name
Current Value: SEKOLAH MENGengah ATAS NEGERI 1 KOTA BANDUNG PROVINSI JAWA BARAT DENGAN NAMA YANG SANGAT PANJANG SEKALI SEHINGGA LEBIH DARI SATU RATUS DUA PULUH KARAKTER UNTUK STRESS TEST
Source: Override lokal terhadap variabel `settings`
File: `src/EnterpriseDocumentViewer.tsx` (untuk RKJM/RKT/RKAS)
Line: 19
Function: `EnterpriseDocumentViewerContent`
Origin: Hardcode / Stress Test
Confidence: 100%

### 2. Principal
Current Value: Dr. Ir. H. Budi Santoso, M.Pd., M.Si., M.T., Ph.D. dengan nama yang sangat panjang sekali lebih dari seratus karakter
Source: Override lokal terhadap variabel `settings`
File: `src/EnterpriseDocumentViewer.tsx` (untuk RKJM/RKT/RKAS)
Line: 19
Function: `EnterpriseDocumentViewerContent`
Origin: Hardcode / Stress Test
Confidence: 100%

### 3. Supervisor
Current Value: Dra. Hj. Siti Aminah, M.Pd., Kons. dengan gelar yang sangat banyak dan panjang sekali lebih dari seratus karakter
Source: Override lokal terhadap variabel `settings`
File: `src/EnterpriseDocumentViewer.tsx` (untuk RKJM/RKT/RKAS)
Line: 19
Function: `EnterpriseDocumentViewerContent`
Origin: Hardcode / Stress Test
Confidence: 100%

### 4. Address
Current Value: Jalan Jenderal Sudirman Kavling 12345 RT 01 RW 02 Kelurahan Babakan Ciamis Kecamatan Sumur Bandung Kota Bandung...
Source: Override lokal terhadap variabel `settings`
File: `src/EnterpriseDocumentViewer.tsx` (untuk RKJM/RKT/RKAS)
Line: 19
Function: `EnterpriseDocumentViewerContent`
Origin: Hardcode / Stress Test
Confidence: 100%

### 5. Academic Year
Current Value: [Tergantung tahun aktif (cth: 2026/2027)]
Source: Computed dari `settings.academicYears` (dinamis)
File: `src/EnterpriseDocumentViewer.tsx`
Line: 350
Function: `EnterpriseDocumentViewerContent`
Origin: Context / Default (Bukan hardcode stress test)
Confidence: 100%

---

## PENCARIAN KHUSUS STRING

**1. "SEKOLAH MENGengah ATAS NEGERI 1"**
- File: `src/EnterpriseDocumentViewer.tsx`
- Baris: 19
- Fungsi: `EnterpriseDocumentViewerContent`

**2. "Dr. Ir. H. Budi Santoso"**
- File: `src/EnterpriseDocumentViewer.tsx` (Baris 19 - Fungsi: `EnterpriseDocumentViewerContent`)
- *Juga ditemukan sebagai placeholder input di `src/Tampuyak.tsx` (Baris 5112) dan `src/enterprise/workspace/modules/ProfileModule.tsx` (Baris 146), serta sebagai string statis di `src/enterprise/configuration/EnterpriseConfigurationCenter.ts` (Baris 13).*

**3. "Dra. Hj. Siti Aminah"**
- File: `src/EnterpriseDocumentViewer.tsx` (Baris 19 - Fungsi: `EnterpriseDocumentViewerContent`)
- *Juga ditemukan sebagai string statis di `src/enterprise/configuration/EnterpriseConfigurationCenter.ts` (Baris 16).*

**4. "Babakan Ciamis"**
- File: `src/EnterpriseDocumentViewer.tsx`
- Baris: 19
- Fungsi: `EnterpriseDocumentViewerContent`

---

## JAWABAN PERTANYAAN KHUSUS

**Apakah KspMetadataAdapter.ts adalah Root Cause atau Hanya menerima data yang sudah salah?**
- **ROOT CAUSE**. File `src/ksp/KspMetadataAdapter.ts` **TIDAK** menerima data yang sudah salah dari Context. Data dari Context masuk dengan benar (kosong jika belum diinput). Namun, fungsi `KspMetadataAdapter.adapt()` secara paksa *melakukan override* terhadap metadata sekolah menggunakan string hardcode stress test tersebut sebelum diserahkan ke Document Assembler (Baris 48-51, yang telah saya hapus di FIX-001).

**Tentukan SATU FILE PERTAMA yang menyebabkan seluruh dokumen (KSP, RKJM, RKT, RKAS) menggunakan identitas sekolah yang salah.**
- **NOT PROVEN**. Bukti forensik menunjukkan bahwa **TIDAK ADA** mutasi state global (Shared Metadata) yang membuat keempatnya rusak dari satu titik asal.
- Akar masalah ini adalah **COPY-PASTE HARDCODE** di dua file penampil/adapter yang terpisah:
  1. KSP salah karena: `src/ksp/KspMetadataAdapter.ts` (sekarang sudah fix).
  2. RKJM, RKT, RKAS salah karena: `src/EnterpriseDocumentViewer.tsx` (Baris 19).
- Karena RKJM/RKT/RKAS mengalir dan dirender melalui `EnterpriseDocumentViewerContent`, baris 19 di file tersebut membajak data dengan menimpa props `settings` secara lokal:
  `settings = { ...settings, school: { ...settings?.school, name: "SEKOLAH MENGengah ATAS NEGERI 1..." }, ... };`

---

## KESIMPULAN (TABEL STATUS)

| Field | Current Value | Source File | Function | Origin | Status |
|---|---|---|---|---|---|
| School Name | SEKOLAH MENGengah ATAS NEGERI 1... | `src/EnterpriseDocumentViewer.tsx` | `EnterpriseDocumentViewerContent` | Hardcode | HARDCODE |
| Principal | Dr. Ir. H. Budi Santoso... | `src/EnterpriseDocumentViewer.tsx` | `EnterpriseDocumentViewerContent` | Hardcode | HARDCODE |
| Supervisor | Dra. Hj. Siti Aminah... | `src/EnterpriseDocumentViewer.tsx` | `EnterpriseDocumentViewerContent` | Hardcode | HARDCODE |
| Address | Jalan Jenderal Sudirman Kavling 12345... | `src/EnterpriseDocumentViewer.tsx` | `EnterpriseDocumentViewerContent` | Hardcode | HARDCODE |
| Academic Year | (Tahun berjalan dinamis) | `src/EnterpriseDocumentViewer.tsx` | `EnterpriseDocumentViewerContent` | Context | VALID |

*(Status di atas berlaku untuk RKJM, RKT, RKAS saat ini. Untuk KSP sudah berstatus VALID pasca FIX-001).*
