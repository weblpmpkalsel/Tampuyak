# HOTFIX RC1: ROOT CAUSE ANALYSIS

## 1. Which component renders the Cover?
The Cover is rendered directly within `src/EnterpriseDocumentViewer.tsx` inside the `<div id="chapter-cover">` block. It is a hardcoded JSX layout outside of the dynamic chapter rendering loop.

## 2. Which component renders the Approval Sheet?
The Approval Sheet is also rendered directly within `src/EnterpriseDocumentViewer.tsx` inside the `<div id="chapter-approval">` block.

## 3. Which component renders enterprise tables?
Enterprise tables are rendered inline within `src/EnterpriseDocumentViewer.tsx` by the `renderChapter()` function. The logic uses JSX `<table>` and `<div>` wrappers conditionally based on `table.data`.

## 4. Why are these three behaving differently from normal chapters?
- **Cover and Approval:** Unlike regular chapters (Bab I - V) which are dynamically instantiated via Canonical Builders and strictly governed by the `EnterpriseLayoutRegistry` (which dictates clean page breaks and orientation rules), the Cover and Approval components are hardcoded as static blocks at the top level of the viewer. They bypass the strict registry-driven pagination constraints.
- **Tables:** Normal chapters consist of text that naturally reflows. Tables have hardcoded Tailwind classes (e.g., `min-w-[800px]`) and scrolling wrappers (`overflow-x-auto`) specifically meant for responsive web viewing. These static utility classes actively fight the Print Engine's page boundary constraints.

## 5. Why do normal chapters paginate correctly but these pages fail?
- **Normal Chapters:** Paginates perfectly because they leverage the `EnterpriseLayoutRegistry` and naturally reflow `w-full` text without fixed height/width constraints.
- **Bug 1 (Cover):** The `<div id="chapter-cover">` uses unconstrained flexible spacing (`flex-col space-y-16 py-12`). When dynamic data (like the school address) is longer than expected, the total height physically exceeds the A4 page height boundary (approx. 1056px / 297mm), causing the browser's print engine to overflow the remaining content onto a second page. It lacks strict bounding box constraints.
- **Bug 2 (Approval Sheet):** The signature grid (`<div className="flex justify-between mt-16 px-8">`) lacks the `break-inside-avoid` (or `page-break-inside: avoid`) CSS property. Thus, when the block falls near the bottom margin, the print engine indiscriminately splits the elements across two pages.
- **Bug 3 (Tables):** The `min-w-[800px]` class forces the table to maintain a physical minimum width of 800 pixels. Since a standard A4 portrait page (minus margins) is narrower than 800px, the table is forced to extend horizontally beyond the printable canvas, resulting in clipping and overflow.
