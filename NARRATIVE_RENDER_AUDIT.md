# NARRATIVE RENDER AUDIT

## Rendering Path Trace (BAB III)

**Preview Renderer**
↓ `<EnterpriseDocumentViewer>` (in `DocumentWorkspaceView`)
↓ `document={cachedDocumentModel}`
↓ `renderChapter(document.chapter3, "bab3")`

**Print Renderer**
↓ `<DedicatedPrintRoot>` (rendered via `createPortal` to `#print-root`)
↓ `<EnterpriseDocumentViewer>`
↓ `document={documentModel}` (which references the exact same `cachedDocumentModel` instance)
↓ `renderChapter(document.chapter3, "bab3")`

### Node Consumption Analysis
**Result:** Both renderers consume the exact same `CanonicalDocument` node (`cachedDocumentModel`). They are fed identical data properties.

---

## Narrative Blocks Report

**Canonical source**
`DocumentCompositionEngine` -> `Chapter3Builder.ts` (injects hardcoded strings directly into the `sections[i].paragraphs` array for each section 3.1 - 3.5).

**Preview renderer**
Consumes `section.paragraphs` via the `.map()` loop in `EnterpriseDocumentViewer` and mounts the DOM nodes.

**Print renderer**
Consumes the identical `section.paragraphs` via the same `.map()` loop in `EnterpriseDocumentViewer` (mounted in the `#print-root` portal).

**Rendered HTML**
```html
<p class="text-slate-800 leading-relaxed text-justify mb-4 indent-8">
  Sasaran strategis disusun sebagai arah kebijakan kelembagaan untuk merespons hasil evaluasi pendidikan secara terukur. Penetapan sasaran difokuskan pada penyelesaian permasalahan.
</p>
```

## Divergence Analysis
If Preview and Print consume different properties: **No divergence exists.**
Both renderers consume the exact same properties from the exact same component structure. The divergence does not occur in the React tree or data property layer, but rather downstream in the browser's CSS layout/print engine (e.g., hidden overflow, print media queries, or container transforms masking the text).
