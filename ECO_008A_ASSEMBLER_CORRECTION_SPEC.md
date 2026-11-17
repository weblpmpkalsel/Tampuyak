# ECO-008A: ASSEMBLER RESPONSIBILITY CORRECTION
## IMPLEMENTATION SPECIFICATION

### 1. Mengapa Assembler Tidak Boleh Membuat Domain Data?
Assembler dirancang khusus untuk berfungsi sebagai **Orchestrator** (pengatur aliran kerja), bukan **Producer** (penghasil data). Jika Assembler melakukan *hardcoding* data (*dummy* ataupun rill):
- Melanggar **Strict Separation of Concerns (Rule 001)** karena mencampur aduk peran pengatur kerangka dokumen dengan logika pembuatan isi/pengetahuan.
- Menghancurkan **Single Source of Truth (SSOT) (Rule 002)**, karena data terkunci di dalam file perakit dokumen, bukan di *State/Settings* di mana pengguna atau *database* beroperasi.
- Menghambat skalabilitas, karena satu *hardcode* akan berefek pada seluruh dokumen (*cross-tenant data leakage*).

### 2. Sumber Payload StudentCharacteristicDomain
Payload `StudentCharacteristicDomain` seharusnya bersumber dari siklus aliran data yang valid:
- **Root Source:** `Settings` / Master Data (Input dari pengguna terkait demografi sekolah).
- **Knowledge Processing:** `SchoolContextService` dan `SchoolContextBuilder` di *Knowledge Layer* bertugas melakukan agregasi dan membentuk objek `StudentCharacteristicDomain` yang formal berdasarkan Root Source.
- **Transport:** Dikirim ke *Assembler* secara *pass-through* (baik via parameter metadata maupun *Service Result*).

### 3. Owner & Consumer
- **Data Owner:** Master Data / `Settings` (User Input).
- **Domain Producer:** `SchoolContextBuilder` (Knowledge Layer).
- **Orchestrator (Pass-through):** `KspDocumentAssembler`.
- **Consumer:** `buildKspBab1Section` (Document Layer).

### 4. Data Provenance Diagram
```text
[Observation] (User Input / Settings / Master Data)
      ↓
[Knowledge] (SchoolContextService / SchoolContextBuilder)
      ↓
[StudentCharacteristicDomain] (Canonical Payload Assembled)
      ↓
[Assembler] (KspDocumentAssembler - Pass-through only)
      ↓
[Builder] (buildKspBab1Section)
      ↓
[Canonical Document] (DocumentBlocks for Render)
```

### 5. File yang Akan Berubah (Impact Analysis)
1. `src/enterprise/document/ksp/KspDocumentAssembler.ts` (Pembersihan *hardcoded object*).
2. `src/enterprise/knowledge/builders/SchoolContextBuilder.ts` (Penegasan *interface input/output* untuk menyerap properti `students`).
3. `src/ksp/KspMetadataAdapter.ts` (Menambahkan properti karakteristik siswa ke dalam adapter atau _fallback_ agar data mengalir mulus ke Assembler dari Settings).

### 6. Perubahan Tanggung Jawab
- **SEBELUM:** `KspDocumentAssembler` membuat data buatan (`students: { totalStudents: 320, ... }`) secara manual dan memberikannya ke *Builder*.
- **SESUDAH:** `KspDocumentAssembler` **hanya menerima** Domain *Knowledge* (seperti `metadata.students` atau _resolved knowledge object_) lalu meneruskannya tanpa modifikasi ke `buildKspBab1Section`.

### 7. Apakah SchoolContextBuilder Merupakan Lokasi Tepat?
**YA.**
`SchoolContextBuilder` berada di **Knowledge Layer**. Tugas utamanya adalah merangkum *raw observation* (data mentah) menjadi *Canonical Knowledge Payload* yang terstruktur. Menugaskan pembuatan/agregasi `StudentCharacteristicDomain` di dalam Builder ini memastikan *Document Layer* dan *Assembler* tetap murni.

### 8. Reusability untuk Domain B-F
**YA.**
Koreksi *Assembler Responsibility* ini akan mencetak standar (*Reference Implementation*). Seluruh Domain berikutnya (B: Karakteristik PTK, C: Sosial Budaya, D: Lingkungan, dst) WAJIB:
1. Diformat di *Knowledge Layer*.
2. Hanya dilewatkan melalui *Assembler* (*pass-through*).
3. Dikonsumsi langsung oleh *Document Builder*.

### 9. Risk Assessment
- **Risiko Operasional:** Sangat Rendah. Perubahan ini murni *refactoring* aliran data (_data flow_), bukan mengubah logika UI.
- **Risiko Kompilasi:** Terkendali. Kesalahan *type-mismatch* akan langsung terdeteksi oleh *TypeScript compiler* saat *interface payload* dipindahkan.
- **Keuntungan:** Membersihkan basis kode untuk skalabilitas *multi-tenant* dan data *real-time*.

### 10. GO / NO GO
**GO** 
Spesifikasi arsitektur telah selesai disusun dan disetujui. Siap dieksekusi dalam implementasi *coding* selanjutnya tanpa melanggar *Enterprise Constitution*.
