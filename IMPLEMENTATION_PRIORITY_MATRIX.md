# Implementation Priority Matrix

This matrix categorizes the required fixes based on their criticality, implementation impact, and the sequence in which they must be resolved. 

## Priority 1: CRITICAL (Core Data Pipeline Extension)
**Impact**: Fixes the root cause for all BAB I missing tabular data (Table 1.2, Teachers, Staff). Resolves multiple knowledge gaps simultaneously.
*   **Task 1.1**: Update `KspMetadataAdapter.ts` to extract `settings.rombel`, `settings.guru`, `settings.tendik`, and `settings.sarpras` into `KspMetadata`.
*   **Task 1.2**: Update `KspDocumentAssembler.ts` to pass these new raw arrays into the `SchoolContextBuilder.ts` initialization.
*   **Task 1.3**: Expand the interfaces in `SchoolContextBuilder.ts` (`StudentCharacteristicDomain`, `EducatorKnowledgeDomain`, `InfrastructureKnowledgeDomain`) to support strongly typed arrays for classes, teachers, staff, and facilities.

## Priority 2: HIGH (Document Builder Tabular Logic)
**Impact**: Unlocks the rendering of Table 1.2 and Educator demographics in the PDF output.
*   **Task 2.1**: Rewrite Section B in `KspBab1Structure.ts` to iterate over the new `classes` array in `StudentCharacteristicDomain` and construct a Canonical `TableBlock` (Table 1.2).
*   **Task 2.2**: Rewrite Section C in `KspBab1Structure.ts` to iterate over the new `teachers` and `staff` arrays in `EducatorKnowledgeDomain` and construct a Canonical `TableBlock` for Educator demographics.

## Priority 3: MEDIUM (Infrastructure & Facilities Re-introduction)
**Impact**: Restores missing BAB I sections regarding school assets and infrastructure.
*   **Task 3.1**: Add a new Section (e.g., Section G. Sarana dan Prasarana) to `KspBab1Structure.ts`.
*   **Task 3.2**: Construct a Canonical `TableBlock` detailing the facilities (Classrooms, Labs, Library, etc.) using the newly projected `InfrastructureKnowledgeDomain`.

## Priority 4: LOW (Partnerships & Environmental Potentials)
**Impact**: Enhances the richness of the existing text paragraphs, though not strictly required for compliance.
*   **Task 4.1**: Update `KspMetadataAdapter.ts` to map `settings.potensi` and `settings.komite`.
*   **Task 4.2**: Update `CulturalKnowledgeDomain` and `PartnershipKnowledgeDomain` to accept these arrays.
*   **Task 4.3**: Enhance Sections D and E in `KspBab1Structure.ts` to render `ListBlock` nodes detailing specific local potentials and committee structures.

---
**Note for Implementation**: Do not attempt to fix the `CanonicalRenderer.tsx`. The renderer is functioning perfectly as a pure AST engine. All implementation efforts must be focused strictly on the Adapter, Projection, and Builder layers.
