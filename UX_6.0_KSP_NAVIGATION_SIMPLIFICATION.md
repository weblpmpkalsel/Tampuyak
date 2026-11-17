# UX-6.0 KSP NAVIGATION SIMPLIFICATION

## EXECUTIVE SUMMARY
This blueprint re-architects the KSP module navigation from a fractured, feature-centered layout to a cohesive, document-centered workflow. The objective is intuitive operation for a first-time Headmaster: the software must mimic the natural lifecycle of document drafting, review, and publication.

## CURRENT NAVIGATION
*   **🏠 Home:** General dashboard with scattered metrics.
*   **👁 Preview:** Purely a visual read-only canvas.
*   **📋 Validation:** Standalone screen listing compliance issues.
*   **📎 Attachments:** Dedicated screen for uploading supporting files.
*   **⚙️ Workspace:** Data entry and content authoring.
*   **📄 Publish:** Hardcoded dead-end (disabled stub).

## PROBLEMS IDENTIFIED
1.  **Fragmented Journey:** Users must bounce between Workspace (to edit), Validation (to check errors), and Preview (to see results).
2.  **Disconnected Publishing:** "Publish" is a separate menu item rather than a contextual action on the finalized document.
3.  **Standalone Validation:** Validation is a diagnostic tool, not a destination. It should inform the authoring (Workspace) or review (Preview) phases, not sit alone.
4.  **Overwhelming Sidebar:** Too many KSP-specific menu items dilute the primary actions and confuse new users.

## NEW INFORMATION ARCHITECTURE
The new navigation strictly limits KSP to **four** primary views. 

**KSP Studio**
*   **🏠 Home (Project Dashboard):** The entry point. Displays overall completion, active warnings, recent changes, and publishing readiness.
*   **📝 Workspace:** The authoring engine. Focused purely on data entry, drafting, and content assembly.
*   **👁 Preview (Command Center):** The review and export hub. Combines the visual document with validation feedback and all export actions.
*   **📎 Attachments:** The filing cabinet. Strictly for uploading and managing supporting appendices (SK, calendars).

*Note: "Publish" is deprecated as a menu item. "Validation" is deprecated as a standalone screen.*

## PREVIEW AS THE COMMAND CENTER
The **Preview** screen will be upgraded to the final "Command Center." It will contain:
*   **Visual Canvas:** The rendered document.
*   **Action Toolbar:** Print Browser, Export PDF, Export DOCX.
*   **Embedded Validation Panel:** A side-drawer or overlay showing the Validation Summary and Publishing Readiness, allowing users to see exactly what blocks their export without leaving the preview.
*   **Document Status:** Clear indicators of draft vs. production readiness.

## VALIDATION MODULE DECISION
**Decision: EMBED.** 
The standalone Validation menu item will be removed. The validation logic and UI (currently `KSPValidationPanel`) will be embedded as a contextual drawer accessible directly from the **Home** dashboard (as "Required Actions") and the **Preview** screen (as a pre-flight checklist). 

## LEGACY MODULES AUDIT
*   **Publishing Center (`PublishingCenterView`):** DEPRECATE. Actions moved to Preview.
*   **Validation Panel (`KSPValidationPanel`):** KEEP / REFACTOR. Convert from full-screen route to overlay/drawer.
*   **Print Diagnostic / Generation Diagnostic:** HIDE. Keep accessible only via developer flags for debugging; remove from user-facing navigation.

## WORKFLOW DIAGRAM
```text
[ HOME ] --> Shows 80% Complete, 2 Missing Items
   |
   +--> [ WORKSPACE ] --> User writes missing content.
   |
   +--> [ ATTACHMENTS ] --> User uploads SK Kalender.
   |
   +--> [ PREVIEW ] --> User reviews document.
           |
           +--> (Embedded Validation verifies 100% Ready)
           |
           +--> [ EXPORT PDF / DOCX ] 
```

## USER JOURNEY
1. **Discover:** Headmaster lands on **Home**. Sees the document is 80% ready and needs an attachment.
2. **Execute:** Clicks the warning, navigates to **Attachments**, and uploads the file. 
3. **Draft:** Goes to **Workspace** to finish writing the Bab II characteristics.
4. **Review & Publish:** Navigates to **Preview**. The embedded validation panel confirms "All Checks Passed". The "Export PDF" button unlocks. The Headmaster prints the document.

## MIGRATION STRATEGY
1.  **Phase 1 (UI Prep):** Move PDF/DOCX export buttons from the Dashboard/Publish readiness panel into the Preview header. 
2.  **Phase 2 (Consolidation):** Integrate the Validation panel as a sliding drawer within the Preview workspace.
3.  **Phase 3 (Cleanup):** Remove the "Validation" and "Publish" buttons from the main sidebar. Delete the `PublishingCenterView`.
4.  **Phase 4 (Home Upgrade):** Enhance the KSP Dashboard to clearly route users to Workspace or Attachments based on missing validation items.

## REGRESSION RISK
**Low to Medium.** 
No core data models or document generation logic are being altered. The risk is purely UI state management (ensuring the Validation drawer renders correctly over the Preview canvas and that the Export buttons receive the correct `isReady` props from the Validation Engine). 

## DECISION
**GO.** 
This simplification drastically reduces cognitive load and aligns the software with standard document processor paradigms (like Google Docs), ensuring immediate familiarity for school principals.
