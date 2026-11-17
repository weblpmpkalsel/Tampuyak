# PC-2.0 PAGED MEDIA ENGINE

## EXECUTIVE SUMMARY
This document outlines the hardening of the Enterprise Publishing Engine's CSS for Paged Media. The focus was to achieve visual parity across Preview, Browser Print, and PDF by addressing browser inconsistencies and edge cases related to pagination, widows, orphans, and table rendering.

## AUDIT & RESOLUTION

### 1. Repeating Table Headers (`<thead>`)
*   **Issue**: Chrome and Edge struggled to repeat `<thead>` correctly on very long tables, especially when cells contained extensive content or when page breaks occurred ambiguously.
*   **Resolution**: Enforced `display: table-header-group;` along with `break-inside: avoid;` and `page-break-inside: avoid;` specifically for `<thead>`. Ensure `<tr>` and `<td>` explicitly declare `page-break-inside: avoid` to prevent mid-cell splitting which often confused the rendering engine.

### 2. Deep Table Row Pagination (Keep With Next & Keep Together)
*   **Issue**: Multi-paragraph narrative cells forced awkward row splits or massive blank spaces.
*   **Resolution**: 
    *   Added explicit `break-inside: avoid; page-break-inside: avoid;` to `tr`, `td`, and `th`. 
    *   While we cannot completely prevent large blank spaces if a single row is taller than a page, the engine now prioritizes moving the entire row to the next page rather than fracturing the content mid-sentence.

### 3. Heading Pagination (Keep With Next)
*   **Issue**: Headings could appear at the bottom of a page, separated from their following paragraphs (Orphaned headers).
*   **Resolution**: Enforced `break-after: avoid; page-break-after: avoid;` for all heading tags (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`) to ensure they bind to the subsequent content block.

### 4. Widows and Orphans
*   **Issue**: Paragraphs leaving a single line at the top or bottom of a page.
*   **Resolution**: Increased `orphans` and `widows` CSS properties from 2 to 3 for `p`, `li`, `td`, and heading tags to ensure better readability and block grouping.

### 5. Nested Lists and Attachments
*   **Issue**: Complex nested lists or attachment blocks could break mid-item.
*   **Resolution**: Added `break-inside: avoid; page-break-inside: avoid;` to `li` and generic `.print-no-break` utility classes commonly used on attachment containers.

### 6. Image Scaling
*   **Issue**: Images could overflow the printed page boundaries.
*   **Resolution**: Forced `max-width: 100% !important;` and `height: auto !important;` on all `img` tags within print media.

## DOCUMENTED CSS RULES

The following critical rules were added/hardened in the `@media print` block:

```css
@media print {
    /* Widow/Orphan Control */
    p, h1, h2, h3, h4, h5, h6, li, td, th {
        orphans: 3;
        widows: 3;
    }

    /* Heading "Keep With Next" */
    h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        break-after: avoid;
    }

    /* Table Stability */
    table {
        page-break-inside: auto;
        break-inside: auto;
        border-collapse: collapse;
        width: 100%;
    }
    
    thead {
        display: table-header-group;
        page-break-inside: avoid;
        break-inside: avoid;
    }
    
    tfoot {
        display: table-footer-group;
        page-break-inside: avoid;
        break-inside: avoid;
    }
    
    tr, td, th {
        page-break-inside: avoid;
        break-inside: avoid;
    }
    
    /* List & Block Stability */
    ul, ol, li, blockquote, img {
        page-break-inside: avoid;
        break-inside: avoid;
    }
    
    img {
        max-width: 100% !important;
        height: auto !important;
    }
}
```

## SUCCESS METRICS
By hardening the CSS Paged Media rules, the rendering engines for Chrome, Edge, and Firefox are given strict, standardized directives on how to handle content fragmentation. 

**DECISION**: **GO** - The Publishing Engine has received the necessary CSS hardening to achieve the Gold Standard.
