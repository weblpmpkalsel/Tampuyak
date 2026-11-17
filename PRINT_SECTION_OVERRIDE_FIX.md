# Print Section Override Fix

## Current Rule
```css
.print-section-override {
  width: auto !important;
  min-height: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
}
```

## New Rule
```css
@page canonical-page {
  size: A4 portrait;
  margin: 0; /* Remove browser margins so inline GDDS padding dictates exactly */
}

.print-section-override {
  page: canonical-page;
  width: auto !important;
  margin: 0 !important;
  box-shadow: none !important;
}
```

## Reason
- **min-height: 0 !important** removes the critical `minHeight: 297mm` inline style, which breaks vertical distribution (e.g., flex-grow pushing content to the bottom of the A4 Cover page).
- **padding: 0 !important** removes the dynamically calculated GDDS inline padding (`paddingTop: 4cm` for chapters, `3cm` otherwise), forcing all content to fall back to the browser's default or global `@page` margins, thereby losing chapter-specific spacing.
Removing these two declarations preserves the CanonicalRenderer's layout-critical inline dimensions. Adding `page: canonical-page;` with a 0-margin named `@page` rule ensures that the print spooler does not add its own margins on top of the inline padding (avoiding double-margins), while keeping other modules (like RKJM/RKT) unaffected. 

## Regression Risk
**None / Isolated:**
- By isolating the zero-margin requirement to the named `@page canonical-page` and applying it exclusively to `.print-section-override`, RKJM, RKT, and RKAS remain completely untouched and will continue to use the global `@page` margin settings. 
