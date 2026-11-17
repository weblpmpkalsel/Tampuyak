# EA-2.0 ENTERPRISE REGRESSION MATRIX

## EXECUTIVE SUMMARY
This document provides the official regression checklist for the TAMPUYAK Enterprise Architecture. It is designed to ensure zero regression across all critical layers of the platform during migrations, refactors, and feature additions.

---

## 1. Architecture Tests

### Domain: Enterprise Adapters
*   **Expected Behaviour**: Adapters (e.g., `EnterpriseAdapter`, `KspMetadataAdapter`) must correctly merge and normalize raw state payloads according to the Source of Truth definitions without dropping data.
*   **Regression Risk**: HIGH
*   **Verification Steps**:
    1. Input a legacy state payload into the adapter.
    2. Input a modern workspace payload into the adapter.
    3. Verify the merged output prioritizes fields correctly based on the current migration phase.
*   **Acceptance Criteria**: The normalized output perfectly matches the expected Enterprise Schema. No legacy fields are lost unless explicitly deprecated.

---

## 2. Knowledge Tests

### Domain: Canonical Knowledge Objects
*   **Expected Behaviour**: Knowledge domains (e.g., `CurriculumStructureKnowledge`, `LearningLoadKnowledge`) must encapsulate data strictly according to educational guidelines and throw validation errors if instantiated with invalid data.
*   **Regression Risk**: HIGH
*   **Verification Steps**:
    1. Instantiate a Knowledge Object with valid inputs.
    2. Instantiate with invalid or missing required inputs.
*   **Acceptance Criteria**: Valid inputs produce a compliant Canonical Knowledge Object. Invalid inputs produce explicit, predictable validation errors.

---

## 3. Builder Tests

### Domain: Document Builders
*   **Expected Behaviour**: Builders must consume normalized metadata and output structured, error-free Knowledge payloads ready for the Assembler.
*   **Regression Risk**: MEDIUM
*   **Verification Steps**:
    1. Pass a valid metadata payload to a Document Builder (e.g., `buildSchoolProfile`).
    2. Inspect the output payload structure.
*   **Acceptance Criteria**: The output is a valid `CanonicalKnowledgeObject` containing all expected fields mapped correctly from the input metadata.

---

## 4. Workspace Tests

### Domain: UI Data Entry & State Management
*   **Expected Behaviour**: Workspace UI modules (e.g., `CurriculumHubModule`) must accurately read from and write to the global state (`settings`) without overwriting or clearing unrelated state slices.
*   **Regression Risk**: HIGH
*   **Verification Steps**:
    1. Load a module with existing data.
    2. Modify a specific field (e.g., `learningPolicy`).
    3. Save and inspect the global state object.
*   **Acceptance Criteria**: Only the targeted slice of the state is updated. Master Data fields remain untouched.

---

## 5. Mirror Tests

### Domain: Enterprise Mirror Service
*   **Expected Behaviour**: `EnterpriseMirrorService` must compare Master Data and Workspace Data without modifying either, accurately reporting conflicts based on timestamps or value discrepancies.
*   **Regression Risk**: LOW (Read-Only)
*   **Verification Steps**:
    1. Run `runMirrorAudit` on a synchronized state.
    2. Run on a state with known discrepancies.
*   **Acceptance Criteria**: Synchronized state returns `IDENTICAL`. Discrepant state accurately flags fields as `CONFLICT` or `DIFFERENT`. Global state remains unmutated.

---

## 6. Validation Tests

### Domain: Document Quality Assurance (DQA)
*   **Expected Behaviour**: The validation engine must detect missing or non-compliant data based on Kemendikbudristek standards and flag them appropriately (Pass, Warn, Fail).
*   **Regression Risk**: MEDIUM
*   **Verification Steps**:
    1. Run validation against a complete, compliant dataset.
    2. Run validation against a dataset missing required fields (e.g., missing NPSN).
*   **Acceptance Criteria**: Compliant datasets return 100% Pass. Incomplete datasets correctly identify specific missing fields with actionable warning/failure messages.

---

## 7. Publishing Tests

### Domain: Document Assembler
*   **Expected Behaviour**: The Assembler must correctly gather all Knowledge Domains and compile them into a unified Document Structure (e.g., `KspDocumentAssembler`).
*   **Regression Risk**: HIGH
*   **Verification Steps**:
    1. Execute the Assembler with a full global state payload.
    2. Verify the presence of all required Chapters (Bab I - Bab V).
*   **Acceptance Criteria**: The final assembled document object contains all expected sections, populated with data from the correct Builders.

---

## 8. Preview Tests

### Domain: Live Preview Engine
*   **Expected Behaviour**: The Preview UI must render the assembled Document Structure accurately in the browser, reflecting all styling and structural requirements.
*   **Regression Risk**: HIGH
*   **Verification Steps**:
    1. Open the Live Preview for a generated document.
    2. Verify layout, typography, and data binding (e.g., School Name in header).
*   **Acceptance Criteria**: UI renders without React errors. Bound data matches the Workspace/Master Data inputs exactly.

---

## 9. PDF Tests

### Domain: PDF Generation
*   **Expected Behaviour**: The application must export the assembled document into a properly formatted, paginated PDF file using the designated PDF library.
*   **Regression Risk**: HIGH
*   **Verification Steps**:
    1. Trigger PDF export for a complete document.
    2. Inspect the downloaded file for pagination, margins, and content clipping.
*   **Acceptance Criteria**: PDF is generated successfully. Page breaks are respected. Headers and footers are consistent. Text is not clipped.

---

## 10. Print Tests

### Domain: Browser Print Mode
*   **Expected Behaviour**: The application must format the document correctly for native browser printing (`window.print()`), hiding UI elements like sidebars and buttons.
*   **Regression Risk**: MEDIUM
*   **Verification Steps**:
    1. Trigger Print Mode.
    2. Inspect the print preview dialog.
*   **Acceptance Criteria**: Only the document content is visible. Navigation, action buttons, and sidebars are hidden via `@media print` CSS rules.
