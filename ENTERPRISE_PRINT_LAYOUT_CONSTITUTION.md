# ENTERPRISE PRINT LAYOUT CONSTITUTION

## Preamble
This constitution defines the absolute, unyielding architectural rules for the Enterprise Print Engine. It guarantees structural integrity, legibility, and professional formatting across all enterprise documents (KSP, RKJM, RKT, RKAS) under all circumstances, including worst-case dynamic content volumes.

---

## 1. Cover Engine
The Cover must maintain absolute dimensional stability and never exceed a single physical page.
*   **Bounding Box Constraint:** The Cover operates within a strict, absolute height boundary (100vh of the print canvas, minus margins).
*   **Flexible Distribution:** Content blocks (Header, Title, Logo, Identity, Footer) use proportional flex distribution rather than hardcoded vertical spacing to prevent pushing content down.
*   **Dynamic Scaling & Truncation:** If dynamic data (School Name, Address) exceeds the visual bounds of its designated region, it must gracefully wrap. If wrapping exhausts the reserved flex region, dynamic font scaling or controlled line-clamping must engage.
*   **Reserved Regions:** The layout is divided into protected zones. An elongated address must only consume space from the central flexible gap, never pushing the footer off the page.

## 2. Approval Sheet Engine
The Approval Sheet must preserve the legal and structural integrity of its signatures.
*   **Atomic Signatures:** Signature blocks are indivisible atomic units. A signatory's title, name, NIP, and physical signature space must never be separated.
*   **Block Integrity:** The entire signature grid (e.g., Principal and Committee) must be treated as a single cohesive unit. If the remaining space on a page cannot accommodate the entire grid, the *entire grid* must move to the next page.
*   **Reserved Space:** Signature areas reserve a guaranteed minimum height to ensure physical stamps and signatures do not overlap text.

## 3. Table Engine
Tables must optimize for data density without ever breaking the physical page boundaries.
*   **Fluid Widths:** Tables must never declare minimum pixel widths (e.g., no `min-w-[800px]`). They must use fluid percentages (100%) constrained strictly by the page margins.
*   **Cell Wrapping:** Content inside table cells must aggressively wrap. Text overflow is strictly forbidden. Very long unbroken strings (e.g., URLs) must force word-breaks.
*   **Repeated Headers:** Tables that span multiple pages must automatically repeat their `<thead>` on every subsequent page to maintain context.
*   **Orientation Autonomy:** Tables containing excessive columns (e.g., RKAS budgets) must automatically trigger Landscape orientation for their section to maximize horizontal printable space.

## 4. Paragraph Engine
Paragraphs must respect typographical flow and readability standards.
*   **Widow and Orphan Control:** A single line of a paragraph must never be left alone at the bottom of a page (orphan) or the top of a page (widow). The engine must enforce a minimum of two lines before or after a page break.
*   **Keep with Next:** Headings must be strictly bound to their succeeding paragraphs. A heading must never appear as the last element on a page.
*   **Fluid Reflow:** Paragraphs must reflow naturally based on the current page orientation without hardcoded heights or forced manual line breaks.

## 5. Chapter Engine
Chapters represent major structural shifts in the document and require clean transitions.
*   **Strict Page Breaks:** Every Chapter (Bab I, Bab II, etc.) must begin on a fresh page.
*   **Tolerated Whitespace:** Empty space at the end of a chapter is an expected and acceptable artifact of structural demarcation. The engine must not attempt to "fill" this whitespace with the next chapter's content.

## 6. Print Canvas Architecture
**Decision:** A Dedicated Print Canvas MUST be used.

*   **Disadvantages of Workspace DOM:** The Workspace DOM is optimized for screen interaction (scrolling, responsive utility classes, hidden overflow wrappers). Attempting to "undo" these interactive properties using `@media print` is fragile and leads to unpredictable clipping, horizontal scroll leaks, and layout breakage when screen-oriented wrappers intercept print flows.
*   **Advantages of a Dedicated Print Canvas:** By rendering a pure, invisible, print-only DOM tree parallel to the Workspace UI, the Print Engine escapes all screen constraints. It guarantees a pristine environment where absolute physical measurements (A4, mm, pt) govern the layout, completely immune to responsive UI side effects.

## 7. Enterprise Layout Rules (The Immutable Laws)

*   **Rule 01: The Cover is Exactly One Page.** It cannot grow; it cannot shrink; it adapts its internal spacing to fit.
*   **Rule 02: Signatures Are Atomic.** An individual signature block (Title, Name, NIP, Space) never breaks across pages.
*   **Rule 03: The Approval Grid is Cohesive.** The collection of core signatures moves as a single unit to prevent orphaned signatories.
*   **Rule 04: Tables Never Overflow.** Horizontal scrolling is eliminated; tables fit 100% of the printable width, and cells wrap aggressively.
*   **Rule 05: Headers Always Repeat.** Multi-page tables replicate their headers on every new page.
*   **Rule 06: Headings Cling to Content.** A heading never prints at the bottom of a page without at least two lines of its following paragraph.
*   **Rule 07: Widows and Orphans are Banished.** Paragraphs never leave single lines isolated across page boundaries.
*   **Rule 08: Chapters Claim Fresh Pages.** Every primary Bab initiates a hard page break.
*   **Rule 09: Orientation is Content-Driven.** Wide data sets automatically invoke landscape dimensions.
*   **Rule 10: Print DOM is Sovereign.** Printing always sources from a dedicated, unconstrained Print Canvas, never the interactive screen UI.
