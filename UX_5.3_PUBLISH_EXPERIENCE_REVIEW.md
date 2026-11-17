# UX-5.3 PUBLISH EXPERIENCE REVIEW

## MISSION
Evaluate whether the dedicated "Publish" menu is still necessary or if its functionalities should be consolidated elsewhere in the application flow.

## CURRENT vs PROPOSED FLOW
**Current Flow:** Home ➔ Preview ➔ Validation ➔ Attachments ➔ Workspace ➔ Publish (Separate Module)
**Proposed Flow:** Home ➔ Preview ➔ Workspace ➔ Attachments ➔ Export Actions integrated inside Preview & Home.

## EVALUATION

### 1. User Journey
*   **Current:** Disconnected. A user previews the document to ensure it looks correct, but then has to navigate to a separate, blind "Publish" screen to actually generate the PDF/DOCX.
*   **Proposed:** Seamless. The user previews the document and, satisfied with the visual output, clicks "Print/Export" directly from the Preview interface.

### 2. Navigation Complexity
*   **Current:** Cluttered. The "KSP Studio" sidebar currently has up to 6 sub-items, overwhelming the user with too many discrete steps.
*   **Proposed:** Streamlined. Removing the standalone "Publish" route simplifies the navigation tree and focuses the user on core tasks (Edit, Validate, Preview).

### 3. Number of Clicks
*   **Current:** High. From Preview, the user must click the sidebar "Publish" menu, then click the export button (2+ clicks, plus context switching).
*   **Proposed:** Low. Export actions are immediately available within the Preview toolbar or the Dashboard (1 click, zero context switching).

### 4. Discoverability
*   **Current:** Poor. Users naturally look for "Download", "Print", or "Export" buttons while viewing the document, not in a separate navigation menu.
*   **Proposed:** High. Placing export actions directly in the Preview header matches standard mental models established by enterprise tools like Google Docs, Microsoft Word, and standard PDF viewers.

### 5. Maintainability
*   **Current:** Complex. Requires maintaining a separate React route, a dedicated component (`PublishingCenterView`), and duplicated validation logic just to render export buttons.
*   **Proposed:** Efficient. We already have the `PublishReadinessPanel` on the Dashboard and a robust `KspPreviewWorkspace`. Integrating export buttons there leverages existing components and centralizes state management.

### 6. Enterprise Consistency
*   **Current:** Anti-pattern. Enterprise applications rarely separate the "Publishing" action from the "Preview" or "Dashboard" context unless it involves a complex, multi-step deployment pipeline (which KSP export does not).
*   **Proposed:** Standard. Contextual actions (Print/Export) belong with the artifact being reviewed.

## ARCHITECTURAL DECISION
**Decision: DEPRECATE STANDALONE PUBLISH MODULE.**

The "Publish" module should **NOT** remain a standalone navigation item. Instead, the publish and export functionalities (PDF, DOCX) should be consolidated into **Preview Actions** (as toolbar buttons in the Preview screen) and **Dashboard Actions** (via the existing `PublishReadinessPanel`). The hardcoded "Publish" sidebar menu item should be removed entirely.
