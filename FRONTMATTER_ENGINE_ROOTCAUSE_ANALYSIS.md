# FRONT MATTER ENGINE ROOT CAUSE ANALYSIS
**Checkpoint:** OMEGA-FRONTMATTER-STABILIZATION-001
**Date:** 2026-07-13

## 1. Current Architecture
Front Matter dirender menggunakan `CanonicalRenderer.tsx` dengan memproses daftar `DocumentSection` yang dihasilkan oleh Document Assembler. Setiap section dibungkus oleh container `enterprise-page-composer-wrapper` yang mengatur dimensi A4 (`min-h-[297mm]`) dan perilaku *page break*.

## 2. Rendering Flow
Alur rendering berawal dari `KspDocumentAssembler` (dan `BaseDocumentAssembler`) yang memecah dokumen menjadi komponen *Cover, Approval, Team, Preface, TOC*, dan *Chapter*. Masing-masing diubah menjadi `DocumentSection`. `CanonicalRenderer` memproses setiap section secara berurutan dan memutuskan *page break* berdasarkan logika `isFrontMatter`.

## 3. Pagination Flow
Sistem memutuskan pindah halaman di level **Renderer** (`CanonicalRenderer`), bukan di Assembler maupun murni di CSS. Keputusan didasarkan pada variabel `needsPageBreak = !isFrontMatter && !isFirst`.
Nomor halaman dihasilkan secara *mock* oleh `MockPaginationEngine` yang memetakan `chapterId` ke angka berurutan.

## 4. Cover Analysis
- **A.** Cover menggunakan **Flex** (`flex flex-col items-center justify-between`).
- **B.** Cover memiliki **tinggi tetap** pada saat cetak (`print:h-[296.5mm]`) dan `min-h-[297mm]` pada tampilan layar.
- **C.** Posisi Logo dihitung **otomatis** karena memanfaatkan `justify-between` dari Flexbox induknya.
- **D.** Footer menggunakan **spacing manual** (`mt-16`) ditambah `shrink-0`, dan mengandalkan `justify-between` untuk menekan posisinya ke bawah.

## 5. Approval Analysis
- **A.** Ya, blok tanda tangan dipisah menjadi beberapa node (ROLE, Spacer, NAME, NIP) di dalam satu `SIGNATURE_CELL`.
- **B.** Terdapat `page-break-inside-avoid` (melalui class dan style inline).
- **C.** Ya, `SIGNATURE_GRID` memiliki instruksi untuk *keep together* (`break-inside: avoid`).
- **D. Mengapa NIP pindah halaman?** 
  - *Root Cause:* `SIGNATURE_CELL` dirender menggunakan `display: flex` dan `height: 100%`. Aturan CSS `page-break-inside: avoid` memiliki bug kompabilitas (poor support) pada container Flexbox di sebagian besar *browser engine* (Blink/WebKit). Saat container utama mendekati batas bawah halaman, browser gagal mempertahankan keutuhan node anak dalam Flexbox dan memutusnya tepat di NIP.

## 6. Team & Preface Analysis (Tim Penyusun)
- **Mengapa halaman hanya berisi sedikit isi tapi menjadi satu halaman?**
  - *Root Cause:* Di `CanonicalRenderer.tsx`, logika `isFrontMatter` mengecek array identifier yang menggunakan huruf kecil (contoh: `['team', 'preface']`). Namun, Assembler menghasilkan `chapterId` dengan huruf kapital dan format berbeda (contoh: `'FRONT_MATTER_TEAM'`, `'FRONT_MATTER_PREFACE'`). Karena tidak cocok, `needsPageBreak` bernilai `true`, sehingga Renderer memaksakan `page-break-before: always` **dan** memberikan container tersebut `min-h-[297mm]` yang memaksanya mengisi satu halaman penuh kosong.

## 7. TOC Analysis (Daftar Isi)
- **Mengapa nomor halaman kosong?**
  - *Root Cause:* `MockPaginationEngine` menyimpan pemetaan nomor halaman berdasarkan `chapterId` (misal: 'BAB1', 'BAB2'). Namun, pada `KspTocStructure.ts`, *link URL* (yang menjadi referensi ID) menggunakan `section.id` atau `heading.id`. Karena `refId` tidak cocok dengan isi map, `pageNumbers[refId]` bernilai `undefined` atau kosong.
- **Mengapa leader dot belum sempurna & spacing kurang baik?**
  - *Root Cause:* Pada `KspTocStructure.ts`, node didaftarkan murni sebagai `type: 'PARAGRAPH'` tanpa menyisipkan atribut `layoutStyle: 'TOC_ITEM_LEVEL_1'` atau `TOC_ITEM_LEVEL_2`. Akibatnya, `CanonicalRenderer` merendernya sebagai paragraf biasa dan melewatkan blok kode yang merender `gdds-toc-layout` beserta *leader dots*-nya.

## 8. Duplicate Rules
Cover, Approval, dan TOC memiliki *rule* tersendiri di dalam Renderer.
- `isCover = section.chapterId === 'COVER'`
- `isApproval = section.chapterId === 'APPROVAL'`
- `isTOC = section.chapterId === 'TOC'`
Aturan ini disuntikkan secara berulang-ulang ke hampir seluruh komponen (contoh: `BlockRenderer` dan *styling condition* paragraf). Hal ini melanggar prinsip *Single Source of Truth* karena Renderer harus mengenali konteks spesifik dari setiap jenis blok.

## 9. Root Cause Matrix

| Problem | Root Cause | File | Severity |
|---|---|---|---|
| Halaman Tim Penyusun Kosong (Force Break) | `isFrontMatter` array menggunakan lowercase, mismatch dengan `chapterId` dari Assembler. | `CanonicalRenderer.tsx` | High |
| Nomor Halaman TOC Kosong | Key dari `MockPaginationEngine` (`chapterId`) tidak cocok dengan `url` TOC (`section.id`). | `KspTocStructure.ts` & `CanonicalRenderer.tsx` | High |
| TOC Leader Dots Hilang | TOC Item tidak diberi `layoutStyle` spesifik (`TOC_ITEM_LEVEL_1`), dirender sebagai paragraf biasa. | `KspTocStructure.ts` | Medium |
| NIP Approval Terpotong Halaman | `page-break-inside: avoid` gagal di container `display: flex`. | `index.css` & `CanonicalRenderer.tsx` | Medium |
| Logic Coupling & Duplikasi Rule | Hardcoded pengecekan tipe dokumen (`isCover`, `isTOC`) menyebar di dalam komponen Renderer. | `CanonicalRenderer.tsx` | Low (Tech Debt) |

## 10. Recommended Fix Order
1. Sinkronisasi `chapterId` konvensi (uppercase/lowercase) pada `isFrontMatter` array.
2. Injeksi `layoutStyle` (`TOC_ITEM_LEVEL_1/2`) di `KspTocStructure.ts`.
3. Sinkronisasi identifier URL di TOC agar sesuai dengan *key* yang diproduksi `MockPaginationEngine`.
4. Refaktor CSS `.gsls-signature-cell` untuk beralih dari Flexbox/height:100% ke block/grid layout agar `break-inside: avoid` dihormati oleh browser.
5. Ekstraksi aturan `isCover`/`isTOC` ke dalam konfigurasi layout abstrak agar `CanonicalRenderer` agnostik.
