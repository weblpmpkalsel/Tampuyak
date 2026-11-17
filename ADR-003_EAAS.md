# ADR-003: Enterprise Administrative Authority Standard (EAAS)

## Status
**APPROVED** (Implementation Deferred until POST KSP GOLD RELEASE)

## Problem Statement
During RC-2 Visual Certification, the Approval Page exposed a structural limitation in how administrative authorities are represented. While current document metadata handles basic fields like "Head of Education Office" and "Region", the architecture lacks a dedicated, unified Enterprise Administrative Authority domain. This domain should formally represent the Office Name, Authority Type, Administrative Region, Official Position, Official Title, Officer Name, and NIP. 

Without a dedicated domain, government titles, office names, and hierarchical rules risk being hardcoded, duplicated, or tightly coupled to individual document builders (e.g., KSP, RKJM, RKT). This fragmentation violates the long-term Enterprise Single Source of Truth vision and degrades government document fidelity when officials or administrative boundaries change.

## Architecture Decision
The project SHALL introduce the Enterprise Administrative Authority Standard (EAAS) to serve as the singular, authoritative source for all government administrative identities and signatory profiles across the system. 

EAAS will be established as a core component of the **Enterprise Knowledge Layer**. Builders and presentation layers will remain pure consumers of this standard, ensuring that administrative hierarchies (e.g., Provincial vs. Regency/City authority) and official titles are centrally managed and strictly enforced across all output documents.

## Alternative Analysis
1. **Status Quo (Pass-Through Metadata):** Continue passing authority details directly from flat metadata payloads into builders. 
   - *Pros:* Low initial effort; no architectural changes required.
   - *Cons:* Leads to duplication across KSP, RKAS, RKT, etc. Business logic for resolving authority levels (e.g., SMA/SMK -> Province vs. SD/SMP -> City) leaks into Assemblers or Builders.
2. **Hardcoded Templates in Presentation Layer:** Embed authority structures directly within the rendering logic based on document type.
   - *Pros:* Immediate visual consistency.
   - *Cons:* Violates the Canonical Model's document-agnostic mandate. Impossible to maintain at scale.
3. **Dedicated EAAS Domain in Knowledge Layer (Chosen):** Formalize the authority as a distinct knowledge domain.
   - *Pros:* Centralized business logic, single source of truth, highly reusable, decoupled from presentation.
   - *Cons:* Requires architectural investment and migration of existing metadata structures.

## Ownership
The EAAS Domain SHALL belong exclusively to the **Enterprise Knowledge Layer**. 
It SHALL NOT belong to or be mutated by the Presentation Layer, Document Builders, Renderer, or Publishing Engine.

## Lifecycle
1. **Creation/Update:** Administrative Authorities are managed centrally (e.g., via a future Admin UI or regional data synchronization) and stored in the Administrative Authority Registry.
2. **Retrieval:** The Assembler queries the Registry based on the school's metadata (e.g., School Level, NPSN).
3. **Injection:** The EAAS data is injected into the Canonical Metadata payload.
4. **Consumption:** Document Builders consume the standardized EAAS payload to construct Canonical Nodes (e.g., GSLS signature blocks).
5. **Rendering:** The Presentation Layer renders the nodes without needing to understand the underlying authority logic.

## Migration Strategy
1. **Phase 1: Dual Support:** Introduce the EAAS domain and registry. Update Assemblers to fetch EAAS data while maintaining fallback support for legacy flat metadata.
2. **Phase 2: Builder Refactoring:** Update all document builders (KSP, Preface, etc.) to strictly consume the EAAS interface payload.
3. **Phase 3: Deprecation:** Remove flat administrative authority fields from the base document configuration interfaces and legacy metadata payloads.

## Future Registry Design
The conceptual domain model for the Administrative Authority Registry will include:
- `Authority Type` (Kabupaten / Kota / Provinsi)
- `Authority Name`
- `Office Name`
- `Official Position`
- `Officer Name`
- `Officer NIP`
- `Jurisdiction`
- `Official Signature Profile`

## Risk Assessment
- **Integration Complexity:** Refactoring the Assembler to resolve EAAS references asynchronously may introduce complexity to the current synchronous document assembly pipeline.
- **Data Migration:** Existing user data containing manually entered authority information must be cleanly migrated or mapped to the new structured registry.
- **Scope Creep:** The EAAS registry must remain focused on document generation requirements and avoid becoming a full-fledged HR or regional management system.

## Deferred Justification
**Technical Debt Register:** TD-KSP-003 (Enterprise Administrative Authority Domain)

Implementation of EAAS is strictly **DEFERRED** until after the KSP GOLD RELEASE. 
The current flat metadata structure, while structurally imperfect, has been stabilized and successfully integrated with the Government Signature Layout Standard (GSLS). Introducing a foundational domain shift at this stage of the KSP Gold release cycle introduces unacceptable regression risk to the Canonical Model and Renderer. KSP Gold must ship with the current stable configuration; EAAS will be implemented as a fast-follow architectural upgrade.
