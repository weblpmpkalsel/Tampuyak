# GDC-3.5 ENTERPRISE DOCUMENT STYLE GUIDE

## EXECUTIVE SUMMARY
This document establishes the universal Enterprise Publishing Style for all official school policy documents (KSP, RKJM, RKT, RKAS) generated within the TAMPUYAK platform. By adhering to this unified style guide, the platform ensures that every generated document maintains rigorous government fidelity, structural consistency, and an authoritative, professional tone.

## 1. TYPOGRAPHY RULES
*   **Semantic Over Visual:** The document generation engine relies strictly on semantic nodes (`TEXT`, `HEADING`, `PARAGRAPH`). No explicit fonts, sizes, or CSS classes are hardcoded in the document structures.
*   **Rendering Agnostic:** The UI renderer handles all typography. The output must support seamless translation across Preview (Web), Print, and PDF views without formatting degradation.
*   **Neutral Tone:** Text strings must avoid emojis, colloquialisms, and developer placeholders (e.g., "TODO", "Lorem Ipsum").

## 2. HEADING RULES
*   **Chapter Title (Level 1):** Reserved exclusively for the main chapter title. Displayed in ALL CAPS (e.g., `PERENCANAAN PEMBELAJARAN`).
*   **Subsections (Level 2):** Numbered using uppercase alphabetical characters followed by a period and title case (e.g., `A. Prinsip Pembelajaran`).
*   **Sub-subsections (Level 3+):** Allowed when structurally necessary, following numeric indexing (e.g., `1. Asesmen Formatif`), though Level 2 + Pattern is preferred for brevity.

## 3. NARRATIVE PATTERN
Every major subsection (Level 2) MUST follow the **Golden Narrative Pattern**:
1.  **Opening Narrative:** A formal introduction explaining the purpose and philosophical alignment of the section.
2.  **Policy Narrative:** The official school policy statement, mapping directly to the `Knowledge Payload`.
3.  **Implementation Strategy:** A transitional paragraph explaining *how* the policy is executed (e.g., "Pelaksanaan pendekatan ini diintegrasikan ke dalam...").
4.  **Supporting Data (List/Table):** Iterated data points (e.g., arrays of principles, mechanisms, or structured tables).
5.  **Closing Narrative:** A conclusive summary detailing the expected outcome or continuous improvement mechanism.

## 4. TABLE PATTERN
*   **Semantic Construction:** Built using `TABLE`, `TABLE_ROW`, and `TABLE_CELL` nodes containing `TEXT` elements.
*   **Header Row:** Must clearly identify the data columns (e.g., `Area Monitoring`, `Fokus Evaluasi`, `Rencana Tindak Lanjut`).
*   **Professional Spacing:** Tables should not contain excessively verbose text to ensure clean rendering in PDF/Print.

## 5. ATTACHMENT PATTERN
To enforce the boundary between school policy and individual teacher administration, all operational artifacts (e.g., Modul Ajar, ATP, Performance Reviews) MUST be excluded from the main document body and relegated to Attachments:
*   **Heading:** `Lampiran [Nama Kategori Dokumen]` (Level 2)
*   **Standard Disclaimer:** `Format dan rekaman [Jenis Dokumen] dikelola terpisah sebagai administrasi pendidik melalui integrasi sistem manajemen.`
*   **Block Type:** `ATTACHMENT` with proper `uri` (e.g., `tampuyak://teacher-gateway/...`), `filename`, and `mimeType`.

## 6. GOVERNMENT TERMINOLOGY CATALOG
All documents MUST use the following official Kemendikdasmen terminology exclusively:
*   **Deep Learning:** Pembelajaran Mendalam (Meaningful, Mindful, Joyful Learning).
*   **Curriculum Goals:** Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP).
*   **Lesson Planning:** Modul Ajar (DO NOT USE "RPP").
*   **Assessment:** Asesmen Formatif, Asesmen Sumatif.
*   **Community of Practice:** Kelompok Kerja Guru (KKG), Musyawarah Guru Mata Pelajaran (MGMP), Komunitas Belajar.
*   **Quality Assurance:** Evaluasi Diri Sekolah (EDS), Sistem Penjaminan Mutu Internal (SPMI).
*   **Collaboration:** Tri Pusat Pendidikan (Kemitraan antara sekolah, keluarga, dan masyarakat).
*   **No Obsolete Terms:** Strictly avoid KI/KD, KKM, or legacy K13 terminologies.

## 7. CROSS-CHAPTER CONSISTENCY MATRIX
| Metric | BAB III | BAB IV | BAB V | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Heading Hierarchy** | Compliant (H1 -> H2) | Compliant (H1 -> H2) | Compliant (H1 -> H2) | PASS |
| **Golden Narrative Pattern**| Adhered | Adhered | Adhered | PASS |
| **Teacher Artifact Exclusion**| N/A | Adhered (Attachment) | Adhered (Attachment) | PASS |
| **Government Terminology** | Verified | Verified | Verified | PASS |
| **Semantic Object Types** | Verified | Verified | Verified (incl. TableBlock) | PASS |

## 8. FINAL DECISION
**GO** - The Enterprise Document Style has been successfully standardized and certified across BAB III, IV, and V. This style is now MANDATORY for all Tampuyak official document generation pipelines.
