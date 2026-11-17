# Government Document Design System (GDDS) v1.0

## Executive Summary
The Government Document Design System (GDDS) serves as the single, unified visual constitution for all printable government documents within TAMPUYAK OS, including KSP, RKJM, RKT, RKAS, and School Reports. It ensures absolute Government Fidelity, structural consistency, and visual professionalism across all enterprise documents without polluting the Knowledge Layer or Canonical Domain.

---

## 1. Visual Constitution (Hierarchy)
The visual hierarchy enforces a strict reading order and structural clarity appropriate for formal government planning documents.
- **Document Title**: Highest prominence, centered, bold.
- **BAB Title (Chapter)**: High prominence, centered, uppercase, bold.
- **Sub BAB (Level 2)**: Medium-high prominence, left-aligned, bold, alphabetical prefix (A., B., C.).
- **Sub Section (Level 3)**: Medium prominence, left-aligned, bold, numerical prefix (1., 2., 3.).
- **Body Text**: Standard prominence, justified (rata kiri-kanan), standard weight.
- **Caption**: Low prominence, centered, italicized.
- **Table Heading**: Medium prominence, centered, bold, shaded background.
- **Table Content**: Standard prominence, left-aligned or centered based on data type.

## 2. Typography Constitution
Typography strictly adheres to Indonesian government formal document standards.
- **Font Family**: Arial or Times New Roman (Times New Roman preferred for formal print decrees).
- **Document Title**: 14pt - 16pt, Bold, Uppercase.
- **BAB Title**: 12pt - 14pt, Bold, Uppercase.
- **Heading Level 2**: 12pt, Bold, Title Case.
- **Heading Level 3**: 12pt, Bold, Sentence Case.
- **Body Size**: 12pt, Regular weight.
- **Line Height**: 1.5 spacing.
- **Paragraph Spacing**: 0pt before, 6pt or 12pt after.
- **Letter Spacing**: Normal (0pt).
- **Bold Usage**: Restricted to titles, headings, and critical emphasis. Avoid inline bolding of entire paragraphs.
- **Capitalization Rules**: 
  - BAB titles and Document titles must be ALL CAPS.
  - Sub-headings use Title Case.

## 3. Page Constitution (Composition)
Page composition guarantees proper binding and printing on standard A4 paper.
- **Paper Size**: A4 (210mm x 297mm).
- **Top Margin**: 3 cm (or 4 cm for chapter starting pages).
- **Bottom Margin**: 3 cm.
- **Left Margin**: 4 cm (to accommodate physical binding/stapling).
- **Right Margin**: 3 cm.
- **Safe Print Area**: 14 cm width x 23.7 cm height.
- **Maximum Content Width**: Constrained strictly by margins.
- **Vertical Rhythm**: Consistent baseline grid relying on strict line-heights and paragraph margins.

## 4. Cover Constitution
The Cover page must project official authority and adhere strictly to this sequence:
1. **Document Title**: e.g., "KURIKULUM SATUAN PENDIDIKAN" (Centered, Bold, Uppercase, 16pt).
2. **School Name**: e.g., "SDN 1 CONTOH" (Centered, Bold, Uppercase, 14pt).
3. **School Status**: e.g., "STATUS: NEGERI" (Centered, Regular, 12pt).
4. **Logo**: Official school or regional government logo (Centered, proportional size, e.g., 5x5 cm).
5. **NPSN**: e.g., "NPSN: 12345678" (Centered, Regular, 12pt).
6. **Address**: Full school address (Centered, Regular, 12pt, max 3 lines).
7. **Academic Year**: e.g., "TAHUN AJARAN 2024/2025" (Centered, Bold, 12pt, anchored near the bottom).
- **Spacing**: Vertical distribution must be optically balanced.
- **Alignment**: Absolutely centered horizontally.

## 5. Approval Constitution (Lembar Pengesahan)
The approval page provides legal validation and must follow a rigid signature grid.
- **Grid Layout**: Symmetrical matrix for signatures.
- **Roles Included**:
  - *Committee Chair* (Left aligned, below).
  - *Principal* (Right aligned, below).
  - *Supervisor* (Left aligned, bottom).
  - *Head of Education Office* (Right aligned or Centered, bottom - configurable).
- **Alignment**: Signatures must be bottom-aligned within their respective grid cells. Names must be bolded and underlined, followed by NIP (if applicable).
- **Spacing**: Adequate vertical whitespace (approx. 3-4 cm) provided for physical signatures and official stamps (cap dinas).
- **Appearance**: Formal, no borders on the grid, strictly textual.

## 6. TOC Constitution (Daftar Isi)
The Table of Contents provides navigational integrity.
- **Heading Hierarchy**: Only Level 1 (BAB) and Level 2 (Sub BAB) are typically included to avoid clutter.
- **Indentation**: Level 1 flush left, Level 2 indented by 1 cm.
- **Dot Leaders**: Must use consistent dot leaders connecting the heading to the page number.
- **Page Numbers**: Right-aligned.
- **Spacing**: 1.5 line height.
- **Exclusion Rules**: Cover Page, Approval Page, and the TOC itself must NOT be listed in the TOC. Front matter (Preface) uses Roman numerals (i, ii, iii). Main content uses Arabic numerals (1, 2, 3).

## 7. BAB Constitution (Chapter Structure)
Chapters contain the core knowledge projection.
- **BAB Title Position**: Centered, top of a new page. 
- **Heading Spacing**: 24pt before, 12pt after.
- **Paragraph Spacing**: First line indent of 1.27 cm (0.5 inch) OR 0pt indent with 12pt spacing between paragraphs. (First-line indent preferred).
- **List Indentation**: Bullets/Numbers aligned with paragraph text; text indented 0.63 cm from the bullet.
- **Quote Style**: Indented 1 cm from left and right margins, italicized, slightly smaller font (11pt).
- **Table Style**: 1pt solid black borders, single-spaced content (1.0 line height), headers centered and bold.

## 8. Print Constitution (White Space & Flow)
Defines how the document breathes and handles pagination.
- **Minimum Spacing**: 6pt between elements.
- **Maximum Spacing**: Prevent excessive gaps unless forcing a page break.
- **Section Separation**: Standard heading margins manage separation. No horizontal divider lines.
- **Page Balance**: Text should fill the page optimally without forced stretching.
- **Widow / Orphan Avoidance**: 
  - A paragraph must have at least 2 lines at the bottom of a page (Orphan control).
  - A paragraph must have at least 2 lines at the top of a page (Widow control).
  - Headings must NEVER be left alone at the bottom of a page; they must stick to the following paragraph.

## 9. Government Fidelity Audit
- **Comparison**: Official Indonesian planning documents rely heavily on structured numbering, strict margins (4-3-3-3), Times New Roman/Arial, and formal signature blocks.
- **Identified Deviations**: Default web rendering lacks proper 4-3-3-3 print margins and widow/orphan control. Page breaks are usually completely absent in standard HTML flow.
- **Improvements Needed**: The Universal Renderer must implement `@media print` CSS rules enforcing physical page sizes (A4), strict cm-based margins, and `page-break-inside: avoid` for crucial blocks.

## 10. Renderer Impact Audit
- **Verification**: ALL recommendations in this GDDS can be implemented strictly via CSS and structural logic entirely within the **Universal Renderer** (Presentation Layer).
- **Integrity**: 
  - Builders remain 100% untouched.
  - Knowledge Layer remains 100% untouched.
  - Canonical Model remains 100% untouched.

## 11. Implementation Priority Matrix (Roadmap)

| Phase | Category | Scope | Priority |
|-------|----------|-------|----------|
| **RC-2B** | Quick Wins | Typography rules (Font family, sizes, line heights), Basic text alignment, Capitalization. | HIGH |
| **RC-2C** | Medium Improvements | Page composition (Margins, A4 constraints), Cover Page layout, TOC layout (Dot leaders), Approval Grid. | HIGH |
| **RC-2D** | Print Polish | Widow/Orphan control, Page break enforcement (`page-break-after/before/inside`), Table styling. | MEDIUM |

---

## FINAL DECISION
**READY FOR VISUAL IMPLEMENTATION**

*The Government Document Design System (GDDS) v1.0 successfully establishes a strict, renderer-only visual constitution that guarantees Government Fidelity without polluting the Enterprise Architecture.*
