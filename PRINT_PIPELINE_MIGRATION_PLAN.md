# ENTERPRISE PRINT PIPELINE MIGRATION PLAN

## 1. Current Pipeline
Currently, the application relies on the interactive Workspace DOM to serve as the print source. The browser's print engine inherits all interactive layout constraints (scroll containers, min-widths, flexbox wrappers), which corrupts the A4 physical layout.

Knowledge Graph
↓
Canonical Builder
↓
Workspace DOM (Interactive, scrollable, constrained)
↓
Browser Print (@media print CSS overrides)
↓
PDF

## 2. Target Pipeline
The proposed architecture completely decouples the Print Engine from the Workspace UI. A dedicated Print Renderer generates an unconstrained DOM structure optimized purely for physical A4 pagination.

Knowledge Graph
↓
Canonical Builder
↓
Dedicated Print Renderer (Pure structural HTML, no responsive constraints)
↓
Print Canvas (Isolated DOM tree)
↓
Browser Print
↓
PDF

## 3. Print Canvas
*   **What is Print Canvas?** A dedicated, invisible (to screen) React component that renders a parallel DOM tree specifically designed for paper. It strictly uses absolute units (cm, mm, pt) and fluid percentages, with no interactive layout constraints like `overflow-hidden` or `h-screen`.
*   **How is it mounted?** It is mounted at the root level of the application, alongside the main interactive Workspace container. It uses CSS to remain strictly hidden on screen (`@media screen { display: none; }`) and visible only during print (`@media print { display: block; }`).
*   **When is it created?** The Print Canvas is mounted and hydrated with data immediately when the user clicks "Print" or "Export PDF". 
*   **When is it destroyed?** It is unmounted or cleared after the print dialog closes or the export completes, ensuring no memory leaks.
*   **How does it receive CanonicalDocument?** It receives the fully compiled `CanonicalDocument` model and current settings directly via React props or a dedicated Print Context, completely bypassing the interactive Workspace state.

## 4. Workspace
*   **How Preview continues working:** The existing `EnterpriseDocumentViewer` will continue to serve as the interactive Workspace Preview, retaining all its screen-optimized Tailwind classes, inline editing, and scrolling capabilities.
*   **How Editing continues working:** Editing remains embedded within the Workspace Preview. Users interact with the DOM as usual.
*   **How Save continues working:** The Save mechanism remains unchanged, persisting the underlying Knowledge Graph and settings to storage.
*   **Why Workspace should never participate in Browser Print:** The Workspace DOM requires CSS constraints (like `overflow-x-hidden`, `flex`, `h-[calc(...)]`, `min-w-[800px]`) to function as a responsive web app. These constraints actively fight the browser's native pagination engine, leading to clipped tables, overflowing covers, and broken signature blocks. Isolating it guarantees print stability.

## 5. Print Renderer Responsibilities
The Print Renderer is a collection of pure, stateless components dedicated solely to generating print-perfect HTML.
*   **Cover Renderer:** Renders a strictly bounded 1-page cover. Handles dynamic text scaling, wrapping, and absolute positioning of footers.
*   **Approval Renderer:** Renders the signature sheet. Employs strict atomic block wrappers to guarantee the grid never splits across pages.
*   **Chapter Renderer:** Enforces hard page breaks (`break-before: page`) for every major chapter and manages hierarchical typography without scroll constraints.
*   **Table Renderer:** Renders fluid tables (`w-full`). Eliminates all minimum pixel widths and horizontal scroll wrappers. Forces `word-break: break-word` on cells and natively repeats `<thead>` across pages.
*   **Appendix Renderer:** Renders lists and supplementary data with strict widow/orphan control.
*   **Signature Renderer:** Ensures atomic signature blocks (Title, Name, NIP, Space) using `page-break-inside: avoid; display: inline-block`.

## 6. Migration Strategy
*   **Step 1: Create Dedicated Print Renderers.** Develop the pure Print Renderer components (Cover, Approval, Table, etc.) based on the new constitutional rules. No responsive Tailwind UI classes, only print-safe structural classes.
*   **Step 2: Construct the Print Canvas.** Assemble the individual renderers into a cohesive `<PrintCanvas>` component that accepts a `CanonicalDocument`.
*   **Step 3: Integrate Print Canvas at Root.** Mount the `<PrintCanvas>` at the top level of the application DOM, configured to be completely hidden on screen.
*   **Step 4: Isolate the Workspace.** Apply a strict `@media print { display: none !important; }` to the entire interactive Workspace container, ensuring the browser print engine completely ignores it.
*   **Step 5: Route Print Actions.** Update the toolbar print and export actions to trigger the rendering of the Print Canvas just before invoking `window.print()` or `html2pdf`.

## 7. Risk Assessment
*   **Step 1: Create Dedicated Print Renderers.**
    *   *Risk:* Inconsistencies between screen preview and printed output.
    *   *Impact:* Low. The canonical data remains the source of truth.
    *   *Rollback:* Discard the new components.
*   **Step 2: Construct the Print Canvas.**
    *   *Risk:* CSS conflicts between the new canvas and global styles.
    *   *Impact:* Medium. Print layout might temporarily regress during development.
    *   *Rollback:* Revert to the existing `EnterpriseDocumentViewer` for printing.
*   **Step 3 & 4: Integrate and Isolate.**
    *   *Risk:* The browser prints a blank page if the toggle logic fails.
    *   *Impact:* High. Blocks document export.
    *   *Rollback:* Remove the `display: none` override on the Workspace and unmount the Print Canvas.
*   **Step 5: Route Print Actions.**
    *   *Risk:* Race conditions where `window.print()` fires before the Print Canvas fully renders the DOM.
    *   *Impact:* Medium. Incomplete print outputs.
    *   *Rollback:* Revert button handlers to their original state and rely on the old pipeline.

## 8. Regression Matrix
After migration, the following matrix must be verified to pass 100%:
| Document Type | Print Browser | PDF Export | DOCX Export | Preview Interactive | Save | Reload | Validation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **KSP** | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| **RKJM** | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| **RKT** | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| **RKAS** | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

## 9. Success Criteria
The migration is considered successful ONLY IF the following worst-case scenarios pass without layout breakage:
1.  Cover always occupies exactly one physical page.
2.  Approval Sheet never splits arbitrarily across pages.
3.  Signature blocks remain strictly atomic.
4.  Tables never overflow horizontally (no clipping, no missing columns).
5.  Long addresses wrap safely within their designated containers.
6.  Long school names never push subsequent content off the page.
7.  A 300-character address renders correctly.
8.  A 120-character school name renders correctly.
9.  A 500-row table paginates cleanly with repeating headers.
10. A 20-page narrative paginates cleanly without widows/orphans.
11. Workspace Preview remains fully editable and responsive.
12. Browser Print is 100% independent from Workspace scroll constraints.

## 10. Future Proof Design
By isolating the Print Canvas from the Interactive Workspace, this architecture achieves long-term stability:
*   **New Document Types:** Can be added by simply passing a new `CanonicalDocument` model to the generic Print Renderer.
*   **New Chapters/Layouts:** Can be introduced without fear of breaking scrollbars or responsive grids in the UI.
*   **Regulation Changes:** Updates to official formatting (e.g., margins, signature placement) can be applied purely to the Print Renderer CSS without affecting the interactive application experience.
*   **10-Year Stability:** The absolute separation of concerns ensures that future web technologies, new Tailwind utility classes, or complex interactive features added to the Workspace will NEVER degrade the physical print quality.
