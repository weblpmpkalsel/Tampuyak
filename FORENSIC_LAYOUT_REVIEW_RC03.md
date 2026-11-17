# FORENSIC LAYOUT REVIEW - RC-03 (ARCHITECT DECISION)

## 1. Root Cause Verification

| ID | Root Cause | Evidence | File | Line | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Tailwind Spacing di TOC (`mb-2`, `mb-6`, `mb-4`, `mt-4`) | Class `mb-2`, `mb-6`, `mb-4`, `mt-4` ada pada container TOC | `EnterpriseDocumentViewer.tsx` | 437, 444, 459, 460 | VERIFIED |
| 2 | Hardcoded Inline Breaks | `style={{ pageBreakBefore: 'always', breakBefore: 'page' }}` | `EnterpriseDocumentViewer.tsx` | 431 | VERIFIED |
| 3 | Table Padding (`0.5rem`) | `padding: 0.5rem;` pada selector `th, td` media print | `index.css` | 124 | VERIFIED |
| 4 | Table Border (`#333`) | `border: 1px solid #333;` pada selector `th, td` media print | `index.css` | 123 | VERIFIED |
| 5 | Color Bleed | `text-slate-900`, `bg-gray-200`, `bg-slate-100` | `EnterpriseDocumentViewer.tsx`, `CanonicalRenderer.tsx` | 270, 439, dll | VERIFIED |
| 6 | Signature Identity Margin | `.gsls-role-block p, .gsls-identity-block p { margin-bottom: 2px !important; }` | `index.css` | 368 | VERIFIED |
| 7 | Cover Image Scale | `style={{ transform: \`scale(${profile.coverLogoScale || 1})\` }}` | `CanonicalRenderer.tsx` | 291 | VERIFIED |
| 8 | Wrapper Flex-Col | `<div className="flex flex-col">` | `CanonicalRenderer.tsx` | 338, 381 | VERIFIED |
| 9 | Print Display Override | `!important` berlimpah pada `@media screen` & `@media print` | `index.css` | 77-80, 394-405 | VERIFIED |
| 10 | Landscape Wrapper | `.landscape-section` dengan kombinasi `@page landscape-page` | `index.css` | 87-90 | VERIFIED |

## 2. CSS Ownership Verification

| Property | Current Owner | Previous Owner | Final Computed Owner | Reason |
| :--- | :--- | :--- | :--- | :--- |
| `width` | `@page` & Tailwind | Inline style | Print CSS `@page` & Media Queries | `@media print` overrides screen rules. Specificity tinggi. |
| `margin-bottom` (Paragraph) | GDDS CSS (`.gdds-p`) | Inline LayoutProfile | GDDS CSS (`.gdds-p`) | `paragraphSpacing` menjadi 0 sehingga inline tidak merender `marginBottom`. Class GDDS mengambil alih penuh (`0`). |
| `padding` (Table) | Print CSS | Tailwind | Print CSS | Deklarasi `.print-th` atau rule `th, td` pada `@media print` (`0.5rem`). Konflik web-convention vs print. |
| `color` | Tailwind | GDDS | Tailwind | Utility class `text-slate-800` menang dari definisi warna body, berisiko warna abu saat print. |
| `page-break` | Inline Style | Print CSS | Inline Style | `style={{ pageBreakBefore: 'always' }}` meng-override segalanya. |

## 3. Wrapper Verification

**Total Wrappers:** Banyak
- **Apakah wrapper `<div className="flex flex-col">` wajib?** TIDAK.
- **Mengapa menjadi technical debt:** Flexbox secara otomatis dapat mengubah behavior natural flow-document, terutama pada pagination dan page-breaking di print. Mengganti dengan `block` lebih tepat.

## 4. Block Spacing Verification

- **TOC:** Spacing berasal dari Tailwind (`mb-2`, `mb-6`). Terjadi konflik secara logis dengan standar GDDS.
- **Table:** Spacing padding dari CSS Web (`0.5rem`), sedangkan `border-spacing` dan margin menggunakan GDDS.
- **Paragraph:** Spacing dari CSS (`margin-bottom: 0`, `line-height: 1.5`). Murni tanpa konflik.
- **Signature:** Menggunakan grid `gap: 2cm` dan tinggi cell dengan `height: 3.5cm`. Terdapat sisa Tailwind pada wrapper.

## 5. Print Pipeline Verification

**Apakah setiap layer menambahkan spacing?** YA.
- **Tailwind:** Menambahkan wrapper spacing (contoh: margin bottom untuk container).
- **Inline Style:** Meng-override behaviour page-break.
- **Media Print:** Mereset padding, width, & margin untuk sinkronisasi layout A4.

## 6. Tailwind Debt Verification

- **Total:** Tinggi.
- **Dipakai Typography:** `text-slate-800`, `text-slate-900`, `font-bold`.
- **Dipakai Utility/Layout:** `mb-2`, `mb-4`, `mb-6`, `flex`, `flex-col`, `gap-3`.
- **Harus Dihapus:** Semantic colors yang bocor ke PDF print (`bg-gray-200`, `bg-slate-100`, `text-slate-800`), dan margin structural (`mb-X`) yang seharusnya dikontrol oleh GDDS Print CSS.

## 7. Government Compliance Verification

| Element | Current | Government Standard | Deviation | Severity |
| :--- | :--- | :--- | :--- | :--- |
| Cover | 16pt / 14pt (Uppercase) | 14pt - 16pt (Bold Uppercase) | 0 | Cosmetic |
| Paragraph | 12pt, lh 1.5, indent 1.27cm | 12pt, lh 1.5, indent 1-1.5cm | 0 | Minor |
| Table | 12pt/10pt, border #333, padding 0.5rem | 11-12pt, pure black border, standard cell padding | Table border is not #000 | Minor |
| TOC | Tailwind Margins | Compact Lines with dotted leader | Spacing too wide in code | Minor |
| Colors | Slate / Gray mix | Black and White | Color bleed in print | Major |

## 8. Patch Verification

- **Patch Hapus Utility Colors (slate/gray):** SAFE. Tidak menyentuh Builder/Canonical.
- **Patch Padding & Border Tabel:** SAFE. Hanya mengubah presentasi.
- **Patch Hardcoded Breaks:** SAFE. Pembersihan inline styling.

Semua patch di atas memenuhi kriteria karena TIDAK menyentuh Knowledge Graph, Canonical Document, Document Builder, Business Rules, atau Layout Registry.

## 9. Execution Order

**Urutan Aman (Safe Execution Order):**
1. **Patch 01:** Bersihkan Hardcoded Inline Breaks (menghindari print page yang tiba-tiba blank/offset).
2. **Patch 02:** Hapus Tailwind Debt Spacing di TOC.
3. **Patch 03:** Ganti Color Bleed (`slate`, `gray-200`) dengan utility `@media print` atau hapus selektor warna di print context.
4. **Patch 04:** Standardisasi Table Padding dan Border menjadi `1px solid black`.

## 10. Final Decision

**Laporan: READY**

**Top 10 Root Cause / Technical Debt:**
1. Hardcoded inline breaks.
2. Tailwind `mb-*` di TOC.
3. Color bleed `text-slate-*` pada print mode.
4. Color bleed `bg-gray/slate` pada background elemen tabel.
5. Table padding web convention (`0.5rem`).
6. Table border `#333`.
7. Signature override margin `2px !important`.
8. Wrapper `flex flex-col` pada container block.
9. Inline scale untuk cover image.
10. Sisa `print:overflow-visible` yang redundant.

**Top Patch Prioritas:**
1. Standarisasi Tabel (Border `#000` & hapus warna background).
2. Hapus Tailwind `mb-*` dari TOC dan ganti dengan GDDS murni.
3. Hapus color class yang memengaruhi warna cetak (slate/gray).

Audit disahkan. Menunggu instruksi RC-03.
