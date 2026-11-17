# UX-6.1 PREVIEW COMMAND CENTER

## MISSION
Transform the Preview page into the primary document command center, bridging the gap between visual review and export execution.

## IMPLEMENTATION
The `KspPreviewWorkspace` has been upgraded with the following structural improvements:

1.  **Command Center Header**: A new fixed header replaces the basic zoom toolbar, serving as the primary control surface for the document.
2.  **Document Status Card**: A dedicated status card has been embedded at the top of the workspace. It surfaces real-time metrics from the `EnterpriseComplianceEngine`:
    *   **Completion**: Displays the percentage of required sections filled.
    *   **Validation Summary**: Shows either "All Checks Passed" or the number of issues found.
    *   **Publishing Readiness**: Clearly marks the document as "READY TO PUBLISH" or "BLOCKED".
3.  **Action Bar**: Directly integrated into the header, providing immediate access to:
    *   Print Browser
    *   Export PDF
    *   Export DOCX
    *   These actions are automatically disabled if the `releaseReadiness` check fails.
4.  **Validation Drawer**: Instead of forcing the user to navigate to a separate page, the "Open Validation" button now triggers an integrated sliding drawer. This drawer houses the `KSPValidationPanel`, allowing the Headmaster to review compliance issues side-by-side with the visual document.
5.  **Floating Controls**: The original zoom controls have been repositioned to a floating pill at the bottom right of the viewer to maximize screen real estate.

## CURRENT ROUTING STATE
*   The original "Publish" menu remains intact (stubbed) in the sidebar.
*   The original "Validation" menu remains intact in the sidebar.
*   These will be deprecated in the next phase, but their functionalities are now fully available directly within the Preview flow.

## REGRESSION RISK
**LOW.** All changes were strictly UI structural refactors within `KspPreviewWorkspace.tsx`. No core rendering, printing, or validation engine logic was altered. The standalone validation and publish routes remain untouched for now.
