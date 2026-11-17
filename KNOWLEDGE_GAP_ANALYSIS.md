# Knowledge Gap Analysis

This document details every missing projection, builder logic, adapter mapping, and disconnected knowledge component identified during the forensic audit.

## Domain 1: Students & Class Distribution (Peserta Didik & Rombel)
*   **Missing Adapter Mapping**: `KspMetadataAdapter.ts` completely drops the `settings.rombel` array.
*   **Missing Projection**: `StudentCharacteristicDomain` lacks a schema to hold class-level aggregations (e.g., `classes: { name: string, male: number, female: number, total: number }[]`).
*   **Missing Builder Logic**: `KspBab1Structure.ts` (Section B) constructs a demographic text paragraph instead of mapping an array to a Canonical `TableBlock` (Table 1.2).

## Domain 2: Educators & Staff (Guru & Tendik)
*   **Missing Adapter Mapping**: `KspMetadataAdapter.ts` drops both `settings.guru` and `settings.tendik` arrays. It only captures a flat text string from `settings.karakteristik.pendidik`.
*   **Missing Projection**: `EducatorKnowledgeDomain` lacks strongly typed array schemas for `teachers` and `staff` (e.g., arrays containing name, education level, certification status).
*   **Missing Builder Logic**: `KspBab1Structure.ts` (Section C) writes a single sentence about educator characteristics instead of generating tabular demographic data for teachers and education staff.

## Domain 3: Infrastructure & Facilities (Sarana & Prasarana)
*   **Missing Adapter Mapping**: `KspMetadataAdapter.ts` completely drops the `settings.sarpras` object.
*   **Disconnected Projection**: `InfrastructureKnowledgeDomain` is defined in `SchoolContextBuilder.ts`, but it is never populated by the Adapter.
*   **Missing Builder Logic**: `KspBab1Structure.ts` entirely omits the Infrastructure section. There is no heading, paragraph, or table rendered for School Facilities in BAB I.

## Domain 4: School Environment & Local Potential (Lingkungan & Potensi)
*   **Missing Adapter Mapping**: `KspMetadataAdapter.ts` drops the `settings.potensi` array (local wisdom/regional potential data).
*   **Missing Projection**: `CulturalKnowledgeDomain` relies solely on raw text strings (`settings.karakteristik.lingkungan`/`lokasi`) and lacks structured arrays for specific regional potentials.
*   **Missing Builder Logic**: `KspBab1Structure.ts` (Section E & F) relies on string concatenation instead of listing specific structured potentials or community assets.

## Domain 5: Partnerships (Kemitraan & Orang Tua)
*   **Missing Adapter Mapping**: `KspMetadataAdapter.ts` maps `settings.komite` to `schoolCommitteeName` for the Approval Sheet, but drops it from the `PartnershipKnowledgeDomain` payload.
*   **Missing Projection**: `PartnershipKnowledgeDomain` lacks structured properties for Committee Members or specific industry linkages.
*   **Missing Builder Logic**: `KspBab1Structure.ts` (Section D) renders a generic sentence about parents instead of detailing actual partnership structures.
