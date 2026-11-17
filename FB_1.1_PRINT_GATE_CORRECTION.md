# FB-1.1 PRINT GATE CORRECTION

## MISSION
Separate Review Actions from Publishing Actions. Print Browser and Preview should always be enabled, while Export PDF/DOCX remain gated by the Publish Validation engine. Validation severities are updated to Blocking, Quality, and Recommendation to clearly communicate their impact.

## IMPLEMENTATION DETAILS
*   **Action Gating**:
    *   The `Print Browser` button is guaranteed to be enabled.
    *   The `Preview` and `Validation` flows are fully accessible regardless of the document's completion status.
    *   `Export PDF` and `Export DOCX` rely on the updated `Blocking` severity check in the `EnterpriseComplianceEngine`.
*   **Validation Severities Refactored**:
    *   Updated `ComplianceIssue.ts` to replace the old generic severities (`CRITICAL`, `MAJOR`, `MINOR`, `INFO`) with semantic severities: `'Blocking'`, `'Quality'`, `'Recommendation'`.
    *   Updated the `ComplianceEngine` to compute `releaseReadiness` based strictly on issues marked as `'Blocking'`.
    *   Updated `KSPValidationPanel.tsx` UI rendering logic to match the new semantic severities with appropriate colors and icons.
*   **Semantic Labeling**:
    *   Updated `MissingAttachmentRule.ts` to use official document terminology. Instead of the colloquial "Kalender Pendidikan", it now strictly validates and reports on "SK Penetapan Kalender Pendidikan".

## REGRESSION RISK
**LOW**. All updates correctly mapped the validation taxonomy. The separation of the action bar gating was preserved and enhanced by the semantic severity changes.
