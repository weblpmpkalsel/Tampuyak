# CanonicalRenderer Architecture Audit

## 1. Architecture Diagram
```mermaid
graph TD
    DataSource[KspMetadataAdapter] --> Assembler[KspDocumentAssembler]
    Assembler --> CanonicalDoc[CanonicalDocument]
    CanonicalDoc --> Preview[KspPreviewWorkspace (Preview)]
    CanonicalDoc --> PrintRoot[DedicatedKspPrintRoot (Print)]
    
    Preview --> Renderer[CanonicalRenderer]
    PrintRoot --> Renderer
```

## 2. Render Flow
- `CanonicalRenderer` iterates over `document.sections` and delegates to `SectionRenderer`.
- `SectionRenderer` wraps each section in a `div` containing `page-break-after` and `print-section-override`.
- `BlockRenderer` recursively renders blocks (`HEADING`, `PARAGRAPH`, `LIST`, `TABLE`, `IMAGE`, `ATTACHMENT`, `CONTAINER`).
- `NodeRenderer` handles inline formatting (`TEXT`, `LINK`).

## 3. Preview Flow
- Mounted in `<div className="flex-1 overflow-y-auto">` within `KspPreviewWorkspace`.
- Scaled dynamically using the `scale` prop (passed to `width`, `minHeight`, `padding`, and `fontSize`).
- Hidden during print via `print:hidden` on the parent container.
- Allows interactive editing of `isEditable` text blocks via `overrides`.

## 4. Print Flow
- Mounted in `DedicatedKspPrintRoot` injected into `<div id="print-root">` at the body level.
- Receives the EXACT SAME `CanonicalDocument` and `CanonicalRenderer` component.
- `scale` is locked to `1`.
- Display is blocked in browser (`display: none`), but activated via CSS print media query (`@media print { #print-root { display: block !important; } }`).

## 5. Potential Defects

### Critical
1. **Cover Page Collapse (Vertical Distribution Failure)**
   - The cover page relies on `minHeight: 297mm` and `flex-grow` to distribute content vertically. 
   - However, the `print-section-override` class in `index.css` applies `min-height: 0 !important`. This strips the A4 height constraint during print, causing the cover page to collapse tightly at the top rather than spreading properly.

### Major
2. **Loss of GDDS Top Margins**
   - The system calculates `baseTopMargin = section.chapterId.startsWith('BAB_') ? 4 : 3` and applies it as `paddingTop`.
   - `print-section-override` applies `padding: 0 !important;` during print. This forces all pages to use the default `@page { margin: 2.5cm }`, completely losing the 4cm (Chapter) vs 3cm margin rules required by GDDS formatting.

3. **Table Row Splitting**
   - `tr { page-break-inside: auto; break-inside: auto; }` is defined in `index.css`.
   - This allows page breaks to occur *inside* a table row, splitting cell contents horizontally across two pages. `page-break-inside: avoid` should be used for `tr`.

### Minor
4. **Editable Block Stale Overrides Handling**
   - In `BlockRenderer`, editable paragraphs map back to `originalText` to calculate the `effectiveText`. While this works, if the underlying document is mutated, the `originalText` calculation re-runs but relies on `overrides[block.id]` which might hold stale text if the source structure changes. 

### Cosmetic
5. **Print Layout Scale Drift**
   - The print media sets `width: auto !important` via `print-section-override`, overriding `width: 210mm`. While standard A4 paper size handles this via the print dialog, it can cause minor shifting of right-aligned signatures (`gsls-signature-cell.right`) relative to the screen preview.

## 6. Exact Line Numbers
- **SectionRenderer Layout Setup**: `src/enterprise/workspace/preview/CanonicalRenderer.tsx` (Lines 43 - 53)
- **Cover Page Distribution**: `src/enterprise/workspace/preview/CanonicalRenderer.tsx` (Line 54)
- **Table Row Break CSS**: `src/index.css` (Line 731)
- **Print Section Override CSS**: `src/index.css` (Lines 777 - 783)

## 7. Exact JSX Blocks

**The exact Block that collapses due to `min-height: 0 !important`:**
```jsx
    <div
      id={section.id}
      className={`bg-white shadow-lg print:shadow-none gdds-doc page-break-after print-section-override ${isCover ? 'flex flex-col print:min-h-[297mm]' : ''}`}
      style={{
        width: `${210 * scale}mm`,
        minHeight: `${297 * scale}mm`,
        paddingTop: `${topMargin * scale}cm`,
        paddingBottom: `${3 * scale}cm`,
        paddingLeft: `${4 * scale}cm`,
        paddingRight: `${3 * scale}cm`,
        transformOrigin: 'top center',
        boxSizing: 'border-box'
      }}
    >
      <div className={`flex flex-col text-gray-900 ${isCover ? 'items-center justify-between text-center flex-grow h-full' : ''}`} style={{ fontSize: `${scale}rem` }}>
```

**The exact Block that uses EXACTLY the same renderer (DedicatedKspPrintRoot):**
```jsx
  return createPortal(
    <div className="w-full bg-white text-black font-serif m-0 p-0 relative print-canvas-root">
       {!isReady && (
         <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10">
           <div className="text-[15rem] font-black text-slate-800 transform -rotate-45 select-none tracking-widest whitespace-nowrap">DRAF</div>
         </div>
       )}
       <CanonicalRenderer 
            document={document} 
            selectedNodeId={null} 
            onSelectNode={() => {}} 
            scale={1} 
            layoutProfile={layoutProfile}
            overrides={overrides}
       />
    </div>,
    mountNode
  );
```

**Conclusion:**
Does Preview and Print use EXACTLY the same component? **YES**
The renderer requires correction at the CSS intersection (`print-section-override` and `tr page-break-inside`).
