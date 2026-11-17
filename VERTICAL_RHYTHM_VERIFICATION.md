# VERTICAL RHYTHM VERIFICATION

## 1. Paragraph Rendering Pipeline
Pelacakan pipeline paragraf dari Canonical Document hingga ke CSS Computed Style:

1. **Canonical Document** (`ParagraphBlock`)
   ↓
2. **CanonicalRenderer** (`SectionRenderer` -> `BlockRenderer`)
   ↓
3. **BlockRenderer** (Menentukan `<p>` element, class `gdds-p`, dan inline style)
   ↓
4. **Editable Override Check** (Memeriksa apakah `overrides[block.id]` ada, tanpa menggunakan `EditableRegion` wrapper eksternal)
   ↓
5. **Presentation CSS** (`index.css` class `.gdds-p`)
   ↓
6. **Computed CSS**

## 2. Spacing Control Audit
Berdasarkan investigasi pipeline di atas, berikut adalah seluruh parameter spacing yang terlibat:

- **`margin-top`**: Dikontrol oleh `.gdds-p` (di set ke `0`).
- **`margin-bottom`**: Dikontrol oleh `.gdds-p` (di set ke `0`).
- **`paragraphSpacing`**: Dikontrol oleh `LayoutProfile.ts` (default di set ke `0`, sehingga mematikan inline style di `CanonicalRenderer`).
- **`line-height`**: Dikontrol oleh `.gdds-p` (di set ke `1.5`).
- **`spaceBefore` / `spaceAfter`**: Tidak ada implementasi parameter ini di level paragraf standar.
- **`padding`**: Tidak ada padding di level paragraf.
- **`gap` / `flex-gap`**: Tidak ada gap container yang memengaruhi `<p>` secara langsung di dalam `.gdds-doc`.

## 3. Siapa yang Mengontrol Spacing?
Saat ini, **semua vertical rhythm pada paragraf standar hanya dikontrol oleh satu sumber (Single Source of Truth)**, yaitu class CSS `.gdds-p` di `index.css`:
```css
.gdds-p {
  text-align: justify;
  text-indent: 1.27cm;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.5;
  orphans: 3;
  widows: 3;
}
```

Inline style `marginBottom` dari `LayoutProfile.ts` yang tadinya menjadi sumber konflik (double spacing) kini tidak lagi di-inject (karena valuenya `0`).

## 4. Kesimpulan
Tidak ada lagi konflik (double spacing) dari inline-style vs CSS. Semua margin tambahan yang sebelumnya merusak komposisi dan membuat halaman terasa bolong telah dinetralkan.

**GDDS Vertical Rhythm CERTIFIED.**
