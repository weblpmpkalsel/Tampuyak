# ENGINEERING CONSTITUTION v1.0
**Project:** TAMPUYAK OS - Enterprise Publishing Platform

---

## BAB I: Vision

**1.1. Canonical Enterprise Publishing Platform**
The Enterprise Publishing Platform MUST serve as the singular, unified foundation for generating, rendering, and printing all official documents within Tampuyak OS. The vision is to completely decouple domain knowledge from presentation logic. 

**1.2. Core Focus Areas**
- **Satu Renderer:** Hanya ada satu mesin rendering utama (CanonicalRenderer) yang melayani seluruh jenis dokumen.
- **Satu Model Dokumen:** Seluruh aplikasi menghasilkan satu format dokumen standar (CanonicalDocument).
- **Satu Geometri:** Pengaturan margin, dimensi halaman, dan orientasi dipusatkan pada satu mesin (PageGeometry).
- **Satu Pagination:** Pemotongan halaman (page break) dan alur dokumen dikelola secara terpusat (PaginationEngine).
- **Satu Table Engine:** Logika tabel kompleks ditangani oleh satu subsistem (TableEngine).

---

## BAB II: Architectural Principles

**Principle 1: Single Source of Truth**
- **Rule:** There MUST NOT be more than one source of truth for Geometry, Pagination, Table Layout, and the Renderer itself.
- **Rationale:** Duplication of layout logic leads to visual inconsistencies across different document types (e.g., RKJM vs. RKT).

**Principle 2: Renderer is Domain Agnostic**
- **Rule:** The Renderer MUST NOT have any knowledge of specific domains such as RKJM, RKT, RKAS, KSP, Adiwiyata, or BOS. The Renderer SHALL ONLY process `CanonicalDocument`, `Section`, `Block`, `Node`, and `LayoutStyle`.
- **Rationale:** Domain-specific renderers scale poorly. A domain-agnostic renderer ensures that adding a new document type requires zero changes to the rendering engine.

**Principle 3: Adapter Owns Translation**
- **Rule:** ALL domain knowledge MUST reside entirely within the Adapter layer.
- **Rationale:** The Adapter translates domain models (e.g., RkjmModel) into the agnostic CanonicalDocument format.

**Principle 4: Business Rules Never Enter Renderer**
- **Rule:** The Renderer MUST NOT contain business rules, validation logic, domain inference, or string parsing logic.
- **Rationale:** Business logic in the view layer causes tight coupling, making the platform fragile and difficult to test.

---

## BAB III: Canonical Document Rules

**3.1. Official Contract**
- **Rule:** `CanonicalDocument` SHALL act as the official and only contract between the domain/builder layer and the presentation layer.

**3.2. Renderer Restrictions**
- **Rule:** The Renderer MUST ONLY read the `CanonicalDocument`. Under no circumstances SHALL the renderer read the raw Domain Model directly.
- **Non-Compliant:** `if (document.type === 'RKJM') { renderRkjm(); }`
- **Compliant:** `return <BlockRenderer block={canonicalBlock} />`

**3.3. Builder Responsibilities**
- **Rule:** Builders and Adapters MUST produce a fully resolved `CanonicalDocument` prior to passing it to the Renderer.

---

## BAB IV: Rendering Rules

**4.1. Scope of Renderer**
- **Rule:** The Renderer SHALL ONLY perform Render, Layout, and Paint operations.

**4.2. Prohibited Actions in Renderer**
- **Rule:** The Renderer MUST NOT parse headings, perform string matching, infer domain contexts, or determine business logic.
- **Non-Compliant:** `if (block.text === 'Rencana Kegiatan') { style = 'bold'; }`
- **Compliant:** `if (block.layoutStyle === 'PROGRAM_CARD_TITLE') { applyTitleStyle(); }`
- **Rationale:** String matching is brittle. Changing a label in the domain model should not break the renderer.

---

## BAB V: Pagination Rules

**5.1. Centralized Pagination Engine**
- **Rule:** The `PaginationEngine` SHALL be the sole authority for determining Page Breaks, Page Numbers, Blank Page Handling, and Overflow Decisions.

**5.2. Prohibition of Scattered Page Breaks**
- **Rule:** Developers MUST NOT scatter `pageBreakBefore` or CSS break properties arbitrarily across various UI components.
- **Rationale:** Decentralized pagination leads to unpredictable blank pages (e.g., "Cover Jump" or "BAB Jump").

---

## BAB VI: Geometry Rules

**6.1. Centralized Page Geometry**
- **Rule:** `PageGeometry` SHALL be the sole source for defining Portrait/Landscape orientations, Margins, Padding, and the Printable Area.

**6.2. Hardcoded Values Prohibition**
- **Rule:** All physical measurements (cm, mm, pt) MUST be located in one centralized configuration file or geometry engine. They MUST NOT be hardcoded in React components.

---

## BAB VII: Table Rules

**7.1. Centralized Table Engine**
- **Rule:** The `TableEngine` SHALL exclusively manage Column Width, Repeat Header logic, Wrap Text, Cell Padding, Borders, and Landscape Strategy for tables.

**7.2. Renderer Table Manipulation**
- **Rule:** The Renderer MUST NOT manually dictate table strategies. It SHALL ONLY consume the properties provided by the TableEngine via the CanonicalDocument.

---

## BAB VIII: LayoutStyle Rules

**8.1. Official Visual Language**
- **Rule:** `LayoutStyle` SHALL serve as the official visual language bridging the Adapter and the Renderer.

**8.2. Permitted Layout Styles**
- **Rule:** The system SHALL define specific layouts such as: `TEXT`, `TABLE`, `GRID`, `CARD`, `PROGRAM_CARD`, `SIGNATURE_GRID`, `INFOBOX`, `TIMELINE`, `MATRIX`.
- **Rationale:** By using layout styles, the Adapter can dictate how a block looks without writing CSS, and the Renderer applies CSS without knowing what the block means.

**8.3. Separation of Concerns**
- **Rule:** The Adapter MUST determine the `LayoutStyle`. The Renderer MUST read and apply the `LayoutStyle`.

---

## BAB IX: Dependency Rules

**9.1. Unidirectional Dependency Flow**
- **Rule:** Dependencies MUST flow in a single direction: Domain → Adapter → CanonicalDocument → CanonicalRenderer → Print.

**9.2. No Circular Dependencies**
- **Rule:** There MUST NOT be reverse flows. The Renderer MUST NOT call or import the Adapter.
- **Rationale:** A reverse dependency breaks the domain-agnostic nature of the Renderer.

---

## BAB X: Engineering Rules

**10.1. Feature Development Lifecycle**
- **Rule:** Every new feature MUST follow this strict sequence: 
  Architecture Review → Specification → Implementation Contract → Implementation → Build → UAT → Release Gate → Production.
- **Rationale:** Jumping straight to coding leads to technical debt and architectural violations.

---

## BAB XI: Definition of Done

**11.1. Completion Criteria**
- **Rule:** A feature is considered "Done" ONLY IF it passes all of the following:
  - Build PASS
  - TypeScript PASS
  - Preview PASS
  - Print Preview PASS
  - PDF PASS
  - UAT PASS
  - Release Gate PASS

---

## BAB XII: Technical Debt Rules

**12.1. Debt Management**
- **Rule:** Technical Debt MUST be documented, assigned a severity level, have a specific owner, and include a target resolution date/checkpoint.
- **Rationale:** Hidden technical debt rots the codebase. It MUST NOT be concealed.

---

## BAB XIII: Deprecation Policy

**13.1. Legacy Status**
- **Rule:** `EnterpriseDocumentViewer` is officially marked as **LEGACY**.

**13.2. Investment Restrictions**
- **Rule:** The LEGACY viewer MUST NOT receive new features or enhancements. It SHALL ONLY receive critical bug fixes and security fixes. All new engineering investments MUST be directed to `CanonicalRenderer`.

---

## BAB XIV: Coding Rules

**14.1. Prohibited String Matching**
- **Rule:** Developers MUST NOT use string matching methods such as `if(text.includes(...))`, `startsWith(...)`, `endsWith(...)`, or `if(title=="...")` to determine UI layouts.

**14.2. Mandated Properties**
- **Rule:** Developers MUST use `layoutStyle`, `blockType`, and explicit `metadata` attached to the `CanonicalDocument` blocks to control rendering.
- **Non-Compliant:** `if (block.text.startsWith('Output:')) { renderMetrics(); }`
- **Compliant:** `if (block.layoutStyle === 'METRICS_GRID') { renderMetrics(); }`

---

## BAB XV: Release Governance

**15.1. Sprint Completion**
- **Rule:** No Sprint is considered complete until it has passed the Release Candidate Gate.

---

## BAB XVI: Architecture Decision Record (ADR)

**16.1. Architectural Changes**
- **Rule:** Every architectural change MUST have an accompanying ADR.
- **Rationale:** You MUST NOT alter the architecture merely through a code commit. History and reasoning must be preserved.

---

## BAB XVII: Backward Compatibility

**17.1. Migration Strategies**
- **Rule:** All migrations MUST utilize the Adapter Pattern, Strangler Fig pattern, and have a clear Rollback Strategy.
- **Rationale:** Big Bang Rewrites are strictly prohibited due to unacceptable operational risks.

---

## BAB XVIII: Future Extension

**18.1. Scalability Proof**
- **Rule:** The architecture MUST demonstrate the ability to support RKJM, RKT, RKAS, KSP, BOS, Adiwiyata, Evaluasi Diri Sekolah, and other government documents *without modifying the CanonicalRenderer*.

---

## BAB XIX: Governance

**19.1. Supreme Authority**
- **Rule:** This document serves as the Engineering Constitution. Changes to these rules MUST ONLY be made through a formal Architecture Review and ADR process.

---

# FINAL DECLARATION

ENGINEERING CONSTITUTION v1.0 menjadi standar resmi Enterprise Publishing Platform Tampuyak OS. Seluruh implementasi di masa depan wajib mematuhi konstitusi ini. Pelanggaran terhadap aturan konstitusi harus diperlakukan sebagai Architecture Violation dan ditinjau melalui Architecture Decision Record (ADR) sebelum dapat diterima.
