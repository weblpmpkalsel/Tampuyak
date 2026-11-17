# DEFECT 002 - ARCHITECTURE REVIEW
**Checkpoint:** OMEGA-ARCH-DEFECT002
**Project:** TAMPUYAK OS

## 1. Direct Recognition of Specific Terms
**Apakah CanonicalRenderer mengenali term secara langsung?**
**YA.**
Lokasi: `src/enterprise/workspace/preview/CanonicalRenderer.tsx` pada baris evaluasi `case 'CONTAINER':` di dalam `BlockRenderer`.
```typescript
const isProgramTable = (block as ContainerBlock).blocks.some(b => 
  b.type === 'HEADING' && (b as HeadingBlock).level === 5 && b.nodes?.[0]?.type === 'TEXT' && (b.nodes[0] as any).text === 'Rencana Kegiatan:'
);
```

## 2. Visual Parity Mechanism
**Apakah visual parity dicapai melalui metadata CanonicalDocument ATAU string matching terhadap heading?**
Visual parity dicapai melalui **string matching terhadap heading**.
`CanonicalRenderer` terpaksa melakukan *reverse-engineering* terhadap isi teks (memeriksa string eksak `"Rencana Kegiatan:"`, mem-parsing string `"Output: ... | Outcome: ..."`) untuk menyusun ulang struktur UI yang tepat. Tidak ada *metadata* struktural yang digunakan.

## 3. Reusability
**Apakah solusi ini dapat dipakai ulang oleh RKJM, RKT, RKAS tanpa menambah kondisi baru?**
**TIDAK.**
Pendekatan ini sangat rapuh (*brittle*). Jika modul lain seperti RKT atau RKAS menggunakan terminologi yang sedikit berbeda (misal: "Rincian Kegiatan", "Daftar Kegiatan", atau bahkan hanya perbedaan tanda baca `:`), logika *Program Table* tidak akan terpicu. Renderer akan gagal mengenali komponen dan kembali menghasilkan susunan teks polos yang berantakan. `CanonicalRenderer` akan dibanjiri kondisional `if` untuk setiap *edge-case* bahasa di berbagai dokumen.

## 4. Refactor Recommendation
Untuk meraih "Kemenangan Jangka Panjang" dan menjaga `CanonicalRenderer` tetap bersih (*domain-agnostic*), disarankan melakukan *refactoring* dengan pola arsitektur berikut:

1. **Tambahkan Properti Layout Hint pada Adapter:**
   Perluas `CanonicalDocumentTypes.ts` untuk `ContainerBlock` agar memiliki opsional properti meta seperti `layoutStyle?: 'program-card' | 'default'`.
   Adapter (`RkjmDocumentAssembler`) bertanggung jawab memberi label kontainer ini sebelum dikirim ke *Renderer*.

2. **Kirim Data Terstruktur (JSON), Bukan String Gabungan:**
   Daripada Adapter menggabungkan data ke dalam satu `PARAGRAPH` berformat string (`"Output: X | Outcome: Y"`), Adapter harus mengirimkannya dalam bentuk blok data terstruktur (misal: *key-value pair list* atau properti `metrics` pada *custom block*).

3. **Renderer Reaktif Terhadap Metadata, Bukan Teks:**
   `CanonicalRenderer` cukup memeriksa metadata struktural:
   ```typescript
   if (block.type === 'CONTAINER' && block.layoutStyle === 'program-card') {
       // Render sesuai style program card tanpa menebak string judul
   }
   ```
   Dengan demikian, `CanonicalRenderer` tidak tahu apa itu "RKJM" atau "Rencana Kegiatan", ia hanya tahu cara merender `program-card` atau `grid-metrics`.
