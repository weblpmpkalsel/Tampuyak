# VP-1.0 VALIDATION POLICY RECLASSIFICATION

## MISSION
Reclassify Validation Rules according to their real impact on document generation. Only structurally invalid documents should block PDF/Print/DOCX. Attachments should only be required before final school approval and should never block the generation of the document itself.

## IMPLEMENTATION DETAILS
*   **Validation Severities Refactored**:
    *   Added `Attachment Required` as a new severity type in `ComplianceIssue.ts`.
    *   Reclassified attachment-only rules (e.g., `MissingAttachmentRule`) from `Blocking` to `Attachment Required`.
    *   Updated the rule's recommendation to explicitly state: "Required before final school approval."
*   **Validation UI Updates**:
    *   Updated `KSPValidationPanel.tsx` to handle `Attachment Required` severity, mapping it to distinctive styling (purple) to differentiate it from actual `Blocking` errors.
    *   Updated `PublishReadinessPanel.tsx` to ensure `Attachment Required` rules are still rendered as "Missing" but treated as administrative tasks rather than critical generation blockers.
*   **Engine Guarantee**:
    *   `EnterpriseComplianceEngine.ts` calculates `releaseReadiness` exclusively based on `Blocking` rules. Therefore, because attachments are now `Attachment Required` and content completion is `Quality`, they will **NEVER** prevent document export or preview.

## SUCCESS METRICS
A Headmaster can successfully:
*   Preview
*   Print Browser
*   Export PDF
*   Export DOCX
Even without uploading administrative supporting documents like "SK Penetapan Kalender Pendidikan". The validation system continues to inform the user of these missing attachments without halting the document assembly pipeline.
