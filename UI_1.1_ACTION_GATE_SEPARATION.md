# UI-1.1 ACTION GATE SEPARATION

## MISSION
Separate the disabled state of "Print Browser" from "Export PDF/DOCX" buttons so that standard browser printing is always available as a diagnostic/test tool, while official PDF/DOCX exports remain strictly gated by the Enterprise Validation engine.

## ARCHITECTURE FIXES

1. **Print Browser Unlocked:**
   * Removed the `disabled={!isReady}` restriction from the Print Browser button.
   * Standardized its styling to always look active and ready (`bg-white border-gray-300`).
   * **Result:** Users can now generate test prints of incomplete documents at any time to verify layout and progress.

2. **Smart Gating on Exports (PDF / DOCX):**
   * Modified the `disabled` property and click behavior of Export buttons.
   * If `isReady` is false (blocked by validation), the buttons appear inactive (`bg-gray-100 text-gray-400`).
   * **Action Intercept:** Instead of being purely `disabled` at the HTML attribute level (which blocks all click events), we removed the native `disabled` attribute and intercepted clicks. If a user clicks Export while blocked, it now triggers `setShowValidationDrawer(true)`.
   * **Result:** Rather than confusing the user with a dead button, a blocked export now actively opens the Validation Drawer to show them exactly *why* they are blocked and what they need to fix.

## REGRESSION RISK
**LOW.** This change only updates the action bar buttons in `KspPreviewWorkspace.tsx`. It does not modify the PDF generation service or validation engine directly.
