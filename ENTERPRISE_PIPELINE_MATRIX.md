# Enterprise Pipeline Matrix

This document provides a visualization of the end-to-end data pipeline for the Enterprise Knowledge architecture, highlighting exactly where the pipeline succeeds and where it breaks.

## End-to-End Pipeline Visualization

```text
[ ENTERPRISE MASTER DATA (UI State in Tampuyak.tsx) ]
  ├── settings.school (✅)
  ├── settings.principal (✅)
  ├── settings.pesertaDidik (✅)
  ├── settings.rombel (❌ DROPPED)
  ├── settings.guru (❌ DROPPED)
  ├── settings.tendik (❌ DROPPED)
  ├── settings.sarpras (❌ DROPPED)
  ├── settings.potensi (❌ DROPPED)
  ├── settings.komite (❌ DROPPED for BAB 1)
  └── settings.identitas/learningLoad/policy/etc (✅)
          │
          ▼
[ METADATA ADAPTER (KspMetadataAdapter.ts) ]
  ├── Maps .school -> schoolName, etc (✅)
  ├── Maps .pesertaDidik -> rawStudents (Totals only) (⚠️ Partial)
  ├── Ignores .rombel (❌ Broken Pipeline)
  ├── Ignores .guru & .tendik (❌ Broken Pipeline)
  ├── Ignores .sarpras & .potensi (❌ Broken Pipeline)
  └── Maps complex payloads (identitas, policy) (✅)
          │
          ▼
[ KNOWLEDGE PROJECTION BUILDER (SchoolContextBuilder.ts) ]
  ├── SchoolProfileDomain (✅ Populated)
  ├── StudentCharacteristicDomain (⚠️ Partial: Missing class aggregations)
  ├── EducatorKnowledgeDomain (⚠️ Partial: Uses flat string, missing arrays)
  ├── InfrastructureKnowledgeDomain (❌ Empty/Not provided by Adapter)
  ├── PartnershipKnowledgeDomain (⚠️ Partial: Missing Komite)
  └── CulturalKnowledgeDomain (⚠️ Partial: Missing Potensi array)
          │
          ▼
[ DOCUMENT BUILDER (KspBab1Structure.ts) ]
  ├── Translates SchoolProfileDomain -> Text Blocks (✅)
  ├── Translates StudentCharacteristicDomain -> Paragraph (⚠️ Missing TableBlock)
  ├── Translates EducatorKnowledgeDomain -> Paragraph (⚠️ Missing TableBlock)
  ├── Translates InfrastructureKnowledgeDomain -> (❌ Omitted from BAB 1)
  ├── Translates PartnershipKnowledgeDomain -> Paragraph (⚠️ Missing details)
  └── Translates CulturalKnowledgeDomain -> Paragraph (⚠️ Missing details)
          │
          ▼
[ CANONICAL AST (CanonicalDocumentTypes.ts) ]
  ├── DocumentSection (✅)
  ├── HeadingBlock (✅)
  ├── ParagraphBlock (✅)
  ├── TableBlock (❌ Never instantiated for BAB 1 demographics)
  └── ListBlock (✅)
          │
          ▼
[ RENDERER (CanonicalRenderer.tsx) ]
  ├── Renders Paragraphs correctly (✅)
  ├── Cannot render Table 1.2 (❌ AST Node does not exist)
  └── Renders other tables (e.g., Curriculum) correctly (✅)
```

## Architectural Bottleneck Analysis
The architecture utilizes a strict, one-way data flow. The **Canonical Renderer** is agnostic to the domain data; it only knows how to paint AST nodes (`TableBlock`, `ParagraphBlock`). The **Document Builder** (`KspBab1Structure.ts`) is responsible for instantiating these AST nodes based on the **Knowledge Projections** it receives. 

Because the **Metadata Adapter** drops the raw arrays (Rombel, Guru, Tendik, Sarpras) before they reach the Knowledge Builder, the Document Builder never receives the data required to build a `TableBlock`. The pipeline must be patched at the Adapter and Projection levels before the Builder can construct the tables.
