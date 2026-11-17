# FORENSIC LAYOUT AUDIT - RC-03 (ENTERPRISE PUBLISHING ENGINE)

## 1. Root Cause Ranking (Top 10)
Berdasarkan audit pasca RC-02D, engine layout sudah sangat stabil. Sisa-sisa utang teknis (technical debt) yang masih membayangi:
1. **Tailwind Spacing di TOC:** Penggunaan `mb-2`, `mb-6`, `mb-4`, `mt-4` pada `EnterpriseDocumentViewer.tsx` masih membaypass GDDS.
2. **Hardcoded Inline Breaks:** Penggunaan `style={{ pageBreakBefore: 'always', breakBefore: 'page' }}` membypass class `.page-break-before`.
3. **Table Padding:** `padding: 0.5rem` pada tabel merupakan konvensi web/Tailwind, bukan standar cetak (`pt/cm`).
4. **Table Border:** `border: 1px solid #333` masih belum pure black (`#000`).
5. **Color Bleed:** Class `text-slate-900`, `text-slate-800`, `bg-gray-200` pada TOC dan Table membuat dokumen tidak pure black & white saat di-print.
6. **Signature Identity Margin:** Paragraf pada signature menggunakan `margin-bottom: 2px !important;` untuk melawan default margin web.
7. **Cover Image Scale:** Penggunaan inline style `style={{ transform: scale(...) }}`.
8. **Wrapper Flex-Col:** Penggunaan `<div className="flex flex-col">` pada `CanonicalRenderer.tsx` berpotensi menimbulkan gap tak terduga.
9. **Print Display Override:** Media query print memiliki banyak `!important` untuk reset layout screen.
10. **Landscape Wrapper:** Ketergantungan pada class `.landscape-section` dengan kombinasi `@page landscape-page` yang rentan terputus jika parent container membatasi width.

## 2. CSS Ownership Matrix
Penguasaan CSS berdasarkan prioritas spesifisitas pada lingkungan cetak:

| Property | Renderer (Inline) | Tailwind | GDDS CSS | Print CSS | Computed Winner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `width` | `width: 100% !important` | `w-full` | N/A | `@page { size: A4 }` | Print CSS |
| `padding-top` | N/A | `pt-3cm` (screen) | N/A | `@page { margin: 3cm... }` | Print CSS (Margin) |
| `margin-bottom` | `marginBottom: Xpt` (dinonaktifkan) | `mb-6` | `.gdds-p { 0 }` | N/A | GDDS / Tailwind (Tergantung Node) |
| `display` | N/A | `flex`, `grid` | `.gsls-signature-grid { grid }` | `table-header-group` | GDDS & Tailwind |
| `overflow` | N/A | `overflow-x-auto` | N/A | `overflow: visible` | Print CSS (via `print:overflow-visible`) |
| `box-sizing` | N/A | `border-box` | `.gdds-page-wrapper { border-box }` | N/A | GDDS |

**Alasan Computed Winner:** Print CSS mendominasi ukuran kertas dan margin utama melalui `@page`. Untuk layout blok, GDDS CSS memenangkan kompetisi pada elemen narasi karena selektor class khusus, sementara elemen struktural (TOC, wrapper) masih dikendalikan Tailwind.

## 3. Wrapper Tree Audit
Pohon DOM dari `CanonicalRenderer` dan `EnterpriseDocumentViewer`:

`EnterpriseDocumentViewer`
  ↓ `<div className="enterprise-page-composer-wrapper block print:break-before-page">` (Wrapper)
    ↓ `<div id="chapter-X" className="portrait-section gdds-page-wrapper">` (Page Boundaries)
      ↓ `CanonicalRenderer`
        ↓ `<div id="bab-X-section-root" className="flex flex-col w-full h-full">` (Section Flex Wrapper)
          ↓ `<h2 className="gdds-title-bab">` (Heading)
          ↓ `<p className="gdds-p">` (Paragraph)
          ↓ `<div className="flex flex-col">` (Container Block Flex Wrapper)
            ↓ `<ol className="list-decimal gdds-list">` (List)

**Temuan:** Terdapat terlalu banyak wrapper `flex flex-col`. Pada lingkungan PDF/Print, hal ini dapat mengganggu *natural text flow* dan *page-breaking algorithm* dari browser.

## 4. Print Cascade Matrix
Hierarki instruksi rendering halaman cetak:

- **Level 1 (Browser Print Settings):** Paper Size, Orientation, Margins (Dikendalikan oleh `@page`).
- **Level 2 (Media Query `@media print`):** `display: none` untuk UI, `display: block` untuk `#print-root`. Reset `box-shadow`, `border`, `padding`.
- **Level 3 (Component Framework):** Tailwind `print:` variants (seperti `print:overflow-visible`).
- **Level 4 (Document GDDS):** Class `.gdds-p`, `.gdds-heading`, dll.

## 5. Block Composition Matrix
| Block | Margin Top | Margin Bottom | Padding Top | Padding Bottom | Wrapper |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cover Heading 1** | `0` | `24pt` | `0` | `0` | Flex Column |
| **Bab Heading** | `0` | `24pt` | `0` | `0` | Section Div |
| **Sub Heading 2** | `18pt` | `12pt` | `0` | `0` | Section Div |
| **Paragraph** | `0` | `0` | `0` | `0` | Section Div |
| **Ordered List** | `6pt` | `12pt` | `0` | `0` | Section Div |
| **Table** | `12pt` | `12pt` | `0` | `0` | `overflow-x-auto w-full` |
| **Signature** | `1.5cm` | `0` | `0` | `0` | CSS Grid |
| **TOC Row** | `0` (Tailwind `mb-*` dominan) | `2pt` (via GDDS) | `0` | `0` | Flexbox |

## 6. Government Spacing Matrix
| Element | Current Setup | Government Standard | Delta |
| :--- | :--- | :--- | :--- |
| **Cover Title** | 16pt / 14pt (Uppercase) | 14pt - 16pt (Bold Uppercase) | 0 |
| **Bab Title** | 14pt, 24pt mb | 14pt, 24pt/3cm mb | 0 |
| **H2 Title** | 12pt, 18pt mt, 12pt mb | 12pt, 1.5-2 line space | 0 |
| **Paragraph** | 12pt, lh 1.5, mb 0, indent 1.27 | 12pt, lh 1.5, indent 1-1.5cm | 0 |
| **Table Text** | 12pt / 10pt (text-sm) | 11pt - 12pt (Single Space) | Minor Font Size Diff |
| **Signature** | Height 3.5cm | Height 3-4cm | 0 |

## 7. Technical Debt Ranking
1. Warna abu-abu (`text-slate-800`, `bg-gray-200`) pada elemen cetak. Seharusnya `color: black` dan `background: transparent`.
2. Inline styles untuk page break. Seharusnya pure class CSS.
3. Struktur Flexbox untuk menampung elemen narasi (Paragraph). Dokumen tradisional menggunakan flow layout.

## 8. Regression Risk
Karena margin paragraph sudah diubah menjadi 0 dan dikendalikan CSS murni, risiko regresi pada spasi teks sudah teratasi.
Tabel dan gambar masih rentan terpotong (page-break issues) karena browser handling untuk CSS Grid dan Flexbox pada mode cetak.

## 9. Minimal Surgical Patch Recommendation
1. Hapus utility colors (slate, gray) dari `EnterpriseDocumentViewer` dan ganti menjadi selektor hitam/putih untuk print.
2. Ganti `padding: 0.5rem` di `th, td` menjadi padding `pt` untuk konsistensi.
3. Ganti `border: 1px solid #333` menjadi `black` pada `@media print`.

STATUS: **FORENSIC AUDIT COMPLETE. WAITING FOR ARCHITECT DECISION.**
