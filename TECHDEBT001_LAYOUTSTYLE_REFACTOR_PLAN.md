# TECHDEBT 001 - LAYOUT STYLE REFACTOR PLAN
**Checkpoint:** OMEGA-TECHDEBT-001
**Project:** TAMPUYAK OS

## 1. Metadata yang dibutuhkan
Untuk melepaskan ketergantungan `CanonicalRenderer` terhadap istilah spesifik domain (seperti "RKJM", "Rencana Kegiatan", "SWOT"), kita membutuhkan sekumpulan nilai `layoutStyle` yang bersifat generik (agnostik terhadap domain). 
Metadata ini akan disisipkan sebagai atribut tambahan (opsional) pada `ContainerBlock` atau blok lainnya:
- `layoutStyle: 'PROGRAM_CARD'` (Untuk merender struktur hierarkis judul, deskripsi, dan grid aktivitas)
- `layoutStyle: 'SIGNATURE_GRID'` (Untuk merender *grid* tanda tangan, menggantikan pengecekan ID spesifik)
- `layoutStyle: 'COVER_TOP'` / `'COVER_MIDDLE'` / `'COVER_BOTTOM'` (Untuk merender perataan khusus sampul)
- `layoutStyle: 'TOC_CONTAINER'` (Untuk menggantikan pengecekan boolean/id pada *Table of Contents*)
- (Di masa depan dapat diperluas menjadi `GRID_INFORMATION`, `TIMELINE`, `MATRIX`, `INFOBOX`)

## 2. Perubahan CanonicalDocument
File `src/enterprise/document/CanonicalDocumentTypes.ts` akan diperbarui untuk menambahkan properti opsional `layoutStyle` pada antarmuka blok terkait (misalnya `ContainerBlock`).
```typescript
export interface ContainerBlock extends BaseBlock {
  type: 'CONTAINER';
  blocks: DocumentBlock[];
  layoutStyle?: 'PROGRAM_CARD' | 'SIGNATURE_GRID' | 'COVER_TOP' | 'COVER_MIDDLE' | 'COVER_BOTTOM' | 'TOC_CONTAINER' | string;
}
```

## 3. Perubahan Adapter
File `src/enterprise/document/rkjm/RkjmDocumentAssembler.ts` (dan *assembler* modul lain) akan mengambil alih tanggung jawab penentuan *layout*.
- Saat merakit tabel program (berisi *activities*), *Adapter* menyisipkan atribut `layoutStyle: 'PROGRAM_CARD'` pada kontainer.
- Saat menyusun sampul, *Adapter* membubuhkan *style* `COVER_TOP`, `COVER_MIDDLE`, atau `COVER_BOTTOM`.
- Saat mengonversi data aktivitas, struktur *string* gabungan (`"Output: X | Outcome: Y"`) sebaiknya direstrukturisasi menjadi representasi meta-data yang lebih rapi (misal: struktur *key-value* di dalam atribut blok yang relevan), agar *Renderer* tidak perlu lagi melakukan *parsing* teks.

## 4. Perubahan Renderer
File `src/enterprise/workspace/preview/CanonicalRenderer.tsx` akan dibersihkan dari seluruh *domain knowledge*.
- Menghapus logika heuristik tebakan berbasis ID, misal: `if (block.id.startsWith('approval-signatures-'))`.
- Menghapus inspeksi *string matching* dalam *loop* konten, misal: `if (text === 'Rencana Kegiatan:')` atau `text.startsWith('Output:')`.
- Mengganti alur rendering dengan *switch-case* berbasis struktur deklaratif `layoutStyle`:
```typescript
switch (block.layoutStyle) {
   case 'PROGRAM_CARD':
       return <ProgramCardRenderer block={block} />;
   case 'SIGNATURE_GRID':
       return <SignatureGridRenderer block={block} />;
   default:
       return <DefaultContainerRenderer block={block} />;
}
```

## 5. Migration Risk
- **Visual Regression (Menengah):** Jika *Adapter* terlewat menyematkan `layoutStyle` pada elemen tertentu, *Renderer* akan melakukan *fallback* ke tata letak generik (`flex-col` standar), yang mana dapat merusak tampilan visual komponen yang bergantung pada *style* spesifik.
- **Data Contract Breaking (Tinggi):** Mengubah format penyusunan (misalnya dari *string paragraph* menjadi format data objek terstruktur untuk *Program Card*) mewajibkan semua implementasi dokumen lama yang sudah tersimpan untuk di-*migrate* (atau setidaknya tetap diakomodir oleh logika *fallback*).

## 6. Backward Compatibility
- Pada masa transisi (Phase 1 & 2), properti `layoutStyle` dijamin opsional (`?`). Dokumen *Canonical* lama yang telah tersimpan di *database/storage* akan tetap terbaca tanpa menyebabkan *error* TypeScript atau *runtime crash*.
- `CanonicalRenderer` akan tetap mendukung proses *render block-by-block* dasar sebagai *fallback behavior* untuk blok yang belum mendefinisikan `layoutStyle`.

## 7. Rollback
- Proses *rollback* bisa dilakukan seketika dengan me-revert *commit* (misal melakukan `git revert`) ke status *patch* saat `CanonicalRenderer.tsx` dan `RkjmDocumentAssembler.ts` ditutup di fase `DEFECT-002`.
- Perubahan pada `CanonicalDocumentTypes.ts` tidak akan berdampak destruktif sehingga tidak wajib di-revert, karena sifatnya yang opsional dan non-interferensial terhadap implementasi *legacy*.
