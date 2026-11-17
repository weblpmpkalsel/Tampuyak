# Enterprise UAT Audit: Intrakurikuler "Draft" Badge

## Executive Summary
This audit investigates the presence of a "Draft" badge persisting within the Intrakurikuler section/workflow, based on the findings from user acceptance testing.

The audit consisted of an exhaustive, read-only trace of the `CurriculumHubModule`, `IntracurricularKnowledge`, `Tampuyak.tsx`, the `EnterpriseDocumentViewer`, and the `KspDocumentAssembler`.

## Audit Findings

### 1. Intrakurikuler Workflow (`CurriculumHubModule.tsx`)
The primary UI for the Intrakurikuler workflow is located in `src/enterprise/workspace/modules/CurriculumHubModule.tsx`. 
- **Finding:** The `CurriculumHubModule` **does not** contain any hardcoded "Draft" strings, nor does it contain a `<Badge>` component rendering a draft status for the Intrakurikuler section.
- **State Mechanism:** The Intrakurikuler state relies on `IntracurricularKnowledge.ts`. Validation returns either `PASS` or `ERROR` (rendered as "Kesalahan Validasi"). It does not return "Draft".
- **Conclusion:** The badge is not hardcoded in the Intrakurikuler UI module.

### 2. Document Status Inheritance (`Tampuyak.tsx` & `WorkspaceToolbar.tsx`)
The term "Draf" (and "Draft") is pervasively used as a global state string for document lifecycles across the application.
- **Finding:** In the main application state (`Tampuyak.tsx`), documents initialize with `status: "Draf"`.
- **Finding:** The global workspace toolbar renders a badge based on the document's top-level state:
  ```tsx
  <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${meta.status === 'Draf' ? 'bg-amber-100 text-amber-800' : ...}`}>
    {meta.status}
  </span>
  ```
- **Conclusion:** If the user is seeing a "Draf" badge while editing Intrakurikuler data, they are likely seeing the inherited **global document status** in the top navigation bar, not a badge specific to the Intrakurikuler module.

### 3. KSP Document Assembler (`KspDocumentAssembler.ts`)
When the KSP document is compiled for preview or printing, the system builds an `EnterpriseDocumentModel`.
- **Finding:** The KSP assembler hardcodes `lifecycle: 'Draft'` into various foundational metadata objects (e.g., `SchoolProfile`, `SchoolGovernance`, `AcademicYear`) during compilation:
  ```typescript
  metadata: { id: '', version: '1.0', owner: '', lifecycle: 'Draft', domain: 'AcademicYear', ... }
  ```
- **Conclusion:** While this hardcodes the metadata to 'Draft', this metadata is not directly rendered as a badge in the `EnterpriseDocumentViewer`.

### 4. Enterprise Document Library (`EnterpriseDocumentDetails.tsx` / `EnterpriseDocumentCard.tsx`)
If the user is viewing the generated KSP document within the Enterprise Document Library:
- **Finding:** The components `EnterpriseDocumentDetails.tsx` and `EnterpriseDocumentCard.tsx` forcefully render a yellow DRAFT badge if the overall document status is `DRAFT`:
  ```tsx
  document.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
  ```
- **Conclusion:** The document library maps the global document status to a literal "DRAFT" badge.

## Root Cause Determination

The "Draft" badge is **state-driven** and **inherited from the global document lifecycle**, rather than being an obsolete, hardcoded artifact within the Intrakurikuler module itself.

Because the KSP Document (or the global workspace session) is in a "Draf" / "DRAFT" state, the global toolbars and document viewers render the draft badge. The Intrakurikuler module (`CurriculumHubModule`) simply lives within this larger, draft-status wrapper. 

**Next Steps for Implementation (If Required):**
If the requirement is to remove or graduate the Intrakurikuler section from "Draft" status, the global document state engine (`DocumentSynchronizationEngine` or the `Tampuyak` root state) must transition the `meta.status` from "Draf" to "Disetujui" / "Final". The Intrakurikuler UI itself does not require source code modification to remove the badge.
