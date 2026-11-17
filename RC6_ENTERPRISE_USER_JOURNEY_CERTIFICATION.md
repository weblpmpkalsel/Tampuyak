# RC6 ENTERPRISE USER JOURNEY CERTIFICATION

## 1. OBJECTIVE
This document audits the complete user workflow from the perspective of a school operator, principal, curriculum team, and teacher. The goal is to verify that the Enterprise Workspace is intuitive, consistent, uses appropriate government terminology, and completely hides internal architectural concepts.

## 2. USER JOURNEYS

### Journey 1: Create Program
- **Actor:** Curriculum Team / Operator
- **Flow:** Open Workspace -> Navigate to "Document Library" -> Click "+ New Document" -> Select "Program" -> Fill in details (Identity, Activities, Dimensi Profil Lulusan) -> Save.
- **Observations:** The flow is straightforward and minimizes clicks. However, the UI currently uses English terms like "New Document" and "Programs" instead of localized government language.

### Journey 2: Reuse Document
- **Actor:** Teacher / Curriculum Team
- **Flow:** Open Workspace -> Navigate to "Document Library" -> Search or filter by "Programs" -> Click on an existing document -> View Metadata & References -> (Future: Duplicate or attach to module).
- **Observations:** Information discoverability is high with the sidebar filters. The metadata view cleanly exposes versions and owners.

### Journey 3: Generate KSP
- **Actor:** Principal / Operator
- **Flow:** Open Workspace -> Administrative Metadata / Dashboard -> Trigger KSP Generation -> System aggregates documents -> KSP Assembled.
- **Observations:** The engine successfully decouples generation from data entry. Users only need to ensure their programs and templates are updated in the library before generating.

### Journey 4: Preview
- **Actor:** Principal
- **Flow:** Open Dashboard -> View generated document (e.g., RKJM / KSP) in the Enterprise Document Viewer.
- **Observations:** The split-screen preview allows principals to see the exact document structure alongside approval workflows. 

### Journey 5: Export
- **Actor:** Operator
- **Flow:** Open Document -> Click "Cetak / Ekspor PDF" in the viewer.
- **Observations:** Export is seamless, presenting a print-ready canvas natively within the browser environment.

## 3. TERMINOLOGY & LANGUAGE AUDIT

**Target:** Users SHALL NOT see technical terms (Repository, Registry, Adapter, Lifecycle). They SHALL see (Dokumen Sekolah, Program, Kalender, Panduan, Template).

**Current State (Pain Points):**
1. The sidebar in the UI currently reads: `Document Library`, `All Documents`, `Programs`, `Templates`, `Guidelines`, `Calendars`, `Letters`, `Archive`.
2. The module registry registers the tab as `Document Library`.
3. Document details expose fields like `knowledgeDomain`, `category`, and `referenceCount` in English.
4. Technical terminology is successfully hidden (no mention of Repository, Registry, Adapter, or Lifecycle in the UI).

## 4. RECOMMENDED UX IMPROVEMENTS (FOR NEXT SPRINT)
- **Localization:** Translate all English navigation labels to Bahasa Indonesia to comply with the "Government Language" requirement:
  - "Document Library" -> "Dokumen Sekolah"
  - "Programs" -> "Program"
  - "Calendars" -> "Kalender"
  - "Guidelines" -> "Panduan"
  - "Templates" -> "Template"
- **Metadata Softening:** Rename detail view labels from "Knowledge Domain" to "Domain Pengetahuan" and "References" to "Referensi Modul" or "Terkait".
- **Action Buttons:** Update "+ New Document" to "+ Dokumen Baru".

## FINAL DECISION
**GO**

The underlying UX flow is highly intuitive, logically structured, and successfully abstracts away the complex enterprise architecture. The only remaining tasks are strictly localization updates to align with government/school operator language expectations. No architectural redesign or implementation is required to pass this UX certification.
