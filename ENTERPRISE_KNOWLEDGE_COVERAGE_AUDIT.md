# Enterprise Knowledge Coverage Audit

## Objective
A comprehensive forensic audit of the Enterprise Knowledge Pipeline for the Kurikulum Satuan Pendidikan (KSP) document. This audit maps the flow of data from the user interface (Enterprise Master Data) through the Metadata Adapter, Knowledge Projections, Document Builders, Canonical AST, and final Renderer.

## Coverage Matrix

| Knowledge Section | Expected Source | Master Data Exists? | Metadata Adapter | Knowledge Projection | Document Builder | Canonical AST | Renderer | PDF Output | Classification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Cover Page** | School Profile, Region | YES (`settings.school`, `settings.administrasi`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **Approval Sheet** | Principal, Supervisor, Office Head | YES (`settings.principal`, `settings.pengawas`, etc) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **Drafting Team** | Drafting Team | YES (`settings.draftingTeam`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **Preface** | School Profile, Principal | YES (`settings.school`, `settings.principal`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB I: Landasan** | Regulatory Knowledge | N/A (Hardcoded payload) | N/A | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB I: Peserta Didik** | Students, Rombel | YES (`settings.pesertaDidik`, `settings.rombel`) | PARTIAL (Rombel DROPPED) | PARTIAL (No class aggregates) | PARTIAL (Paragraph only) | MISSING (No TableBlock) | MISSING | PARTIAL | ⚠️ WARNING |
| **BAB I: Pendidik** | Guru, Tendik, Characteristics | YES (`settings.guru`, `settings.tendik`, `karakteristik`) | PARTIAL (Guru/Tendik DROPPED) | PARTIAL (Text string only) | PARTIAL (Paragraph only) | MISSING (No TableBlock) | MISSING | PARTIAL | ⚠️ WARNING |
| **BAB I: Orang Tua** | Komite, Characteristics | YES (`settings.komite`, `settings.karakteristik.orangTua`) | PARTIAL (Komite DROPPED) | PARTIAL (Text string only) | PARTIAL (Paragraph only) | MISSING (No TableBlock) | MISSING | PARTIAL | ⚠️ WARNING |
| **BAB I: Lingkungan** | Potensi, Characteristics | YES (`settings.potensi`, `settings.karakteristik.lingkungan`) | PARTIAL (Potensi DROPPED) | PARTIAL (Text string only) | PARTIAL (Paragraph only) | MISSING (No TableBlock) | MISSING | PARTIAL | ⚠️ WARNING |
| **BAB I: Sarpras** | Infrastructure | YES (`settings.sarpras`) | MISSING | PARTIAL (Defined but empty) | MISSING (No BAB I section) | MISSING | MISSING | NO | ❌ BROKEN |
| **BAB I: Lokasi** | Characteristics | YES (`settings.karakteristik.lokasi`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB II: Visi** | Strategic Planning | YES (`settings.identitas.visi`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB II: Misi** | Strategic Planning | YES (`settings.identitas.misi`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB II: Tujuan** | Strategic Planning | YES (`settings.identitas.tujuan`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB III: Struktur Kurikulum** | Learning Load, Org | YES (`settings.learningLoad`, `organization`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB III: Kalender** | Academic Calendar | YES (`settings.academicCalendar`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB IV: Perencanaan** | Learning Policy | YES (`settings.learningPolicy`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |
| **BAB V: Evaluasi** | Evaluation Mechanisms | YES (`settings.evaluation`) | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | ✅ OK |

## Executive Summary
The primary breakdown in the Enterprise Knowledge Pipeline occurs strictly within **BAB I (Karakteristik Satuan Pendidikan)**. While the application successfully collects rich tabular data (Rombel, Guru, Tendik, Sarpras, Potensi) in the `WorkspaceState` via the `Tampuyak.tsx` UI, this data is systematically **dropped by the `KspMetadataAdapter.ts`** before it can reach the Knowledge Projections. Consequently, the Document Builder (`KspBab1Structure.ts`) is starved of structural data, forcing it to render fallback text paragraphs instead of rich data tables (e.g., Table 1.2, Teacher Demographics, Infrastructure tables).

All other chapters (BAB II - V, Cover, Approval, Frontmatter) are functioning nominally with an unbroken pipeline.
