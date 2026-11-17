# PB-1.0 PUBLISH BLOCKER INVESTIGATION

## MISSION
Identify the exact component preventing KSP from being published/printed.

## TRACE ANALYSIS

| Layer | File | Component | Condition | Result |
| :--- | :--- | :--- | :--- | :--- |
| **Print Button** | `src/ksp/PublishReadinessPanel.tsx` | `PublishReadinessPanel` | `!isReady` | "Publish PDF" and "Publish DOCX" buttons are disabled. |
| **Click Handler** | `src/ksp/PublishReadinessPanel.tsx` | `PublishReadinessPanel` | `onClick` (N/A) | The buttons are `disabled`, so the click handler cannot be triggered. |
| **Publish Guard** | `src/ksp/PublishReadinessPanel.tsx` | `PublishReadinessPanel` | `missingItems.length === 0` | Fails because `missingItems` has 3 hardcoded elements. |
| **Validation Engine** | `src/enterprise/compliance/rules/attachment/MissingAttachmentRule.ts` | `MissingAttachmentRule` | `!hasCalendarAttachment` | Hardcoded to `const hasCalendarAttachment = false;` |
| **Attachment Validation** | `src/enterprise/compliance/rules/attachment/MissingAttachmentRule.ts` | `MissingAttachmentRule` | Check for 'Kalender Pendidikan' | Returns a `CRITICAL` ComplianceIssue. |
| **Document State** | N/A | N/A | N/A | State lacks necessary flags due to hardcoded failures. |
| **PDF Generator** | N/A | N/A | N/A | Unreachable because Publish Guard blocks execution. |

## INVESTIGATION ANSWERS

### 1. Who disables the Publish button?
The `PublishReadinessPanel` component disables the "Publish PDF" and "Publish DOCX" buttons.

### 2. Why?
The `isReady` boolean evaluates to `false` because the `missingItems` array is not empty (it contains 3 hardcoded missing requirements).

### 3. Which validation fails?
The `MissingAttachmentRule` (Rule ID: `ECE-001`) in the Compliance Engine fails, reporting that the document is missing required attachments. Additionally, the Publish UI simulates failures for "Visi, Misi, Tujuan" and "Perencanaan Pembelajaran".

### 4. Which attachment is required?
"Kalender Pendidikan" (SK Kalender Pendidikan tingkat satuan pendidikan) is explicitly required and marked as missing.

### 5. Can Browser Print work independently?
Yes. The Browser Print engine operates independently of the Publish (PDF/DOCX) blockers. It relies on the browser's native print functionality (`window.print()`).

### 6. Can Preview be printed directly?
Yes. A user can open the Preview (via the "Preview Document" button in `KSPDashboard`) and use the browser's native print dialog (Ctrl+P / Cmd+P) to print the document, completely bypassing the `PublishReadinessPanel` locks.

### 7. Is Publish incorrectly blocking Browser Print?
No. The Publish blockers only disable the headless generation of PDF and DOCX files. They do not block the user from opening the DOM-based Preview and using the Browser Print engine. 

## CONCLUSION
The publishing block is a feature, not a bug. It correctly guards the headless PDF/DOCX pipeline against incomplete documents. However, it does not restrict the user from independently utilizing the browser's native print capabilities on the Preview canvas.
