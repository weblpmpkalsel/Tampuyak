# EA-1.0 ENTERPRISE ARCHITECTURE REFERENCE

## EXECUTIVE SUMMARY
This document serves as the official Enterprise Reference Manual for TAMPUYAK. It visualizes the entire platform architecture across various layers, pipelines, and domains. The objective is to provide future developers with a comprehensive understanding of the enterprise ecosystem without requiring them to read the underlying source code.

---

## DIAGRAM 1: SYSTEM OVERVIEW

```text
 [ MASTER DATA ]
       │
       ▼
 [ Mirror Service ]
       │
       ▼
 [ Mirror Inspector ]
       │
       ▼
 [ Validation Engine ]
       │
       ▼
 [ Enterprise Workspace ]
       │
       ▼
 [ Enterprise Adapter ]
       │
       ▼
 [ Metadata Adapter ]
       │
       ▼
 [ Document Assembler ]
       │
       ▼
 [ Knowledge Domain ]
       │
       ▼
 [ Document Builder ]
       │
       ▼
 [ Preview | PDF | Print ]
```

*   **Purpose**: Shows the end-to-end macro architecture of TAMPUYAK, from data origin to physical output.
*   **Responsibilities**: Defines the sequence of data transformation and enforcement.
*   **Dependencies**: Each layer depends strictly on the output of the layer immediately preceding it.
*   **Consumers**: All document generation pipelines (KSP, RKJM, etc.) consume this flow.

---

## DIAGRAM 2: SOURCE OF TRUTH

```text
┌──────────────────────┐    ┌──────────────────────┐
│     MASTER DATA      │    │      WORKSPACE       │
│ - School Identity    │    │ - Characteristics    │
│ - Personnel          │    │ - Curriculum         │
│ - Facilities         │    │ - Policies           │
└──────────┬───────────┘    └──────────┬───────────┘
           │                           │
           ▼                           ▼
┌──────────────────────────────────────────────┐
│                SHARED DOMAIN                 │
│ - Vision, Mission, Goals (Strategic)         │
│ - Academic Calendar                          │
└──────────────────────────────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────────────────────────────────┐
│              SYSTEM GENERATED                │
│ - Final Documents (PDF/JSON)                 │
│ - Analytics & Dashboard Metrics              │
└──────────────────────────────────────────────┘
```

*   **Purpose**: Establishes the authoritative boundaries for data ownership.
*   **Responsibilities**: Prevents data duplication and ensures the correct module owns the data lifecycle.
*   **Dependencies**: Shared domain relies on both Master Data and Workspace contextualization.
*   **Consumers**: All UI modules and builders read from these designated authorities based on the Data Dictionary.

---

## DIAGRAM 3: DOCUMENT PIPELINE

```text
 [ Workspace ]  (User Input & Editor)
       │
       ▼
 [ Validation ] (Compliance & Rules Checking)
       │
       ▼
 [ Metadata ]   (Raw Data Normalization)
       │
       ▼
 [ Assembler ]  (Structuring & Dependency Injection)
       │
       ▼
 [ Knowledge ]  (Domain Logic & Schema Enforcement)
       │
       ▼
 [ Builder ]    (Document Generation & Formatting)
       │
       ▼
 [ Preview ] ──▶ [ PDF ] ──▶ [ Print ]
```

*   **Purpose**: Traces the lifecycle of a document from user input to physical artifact.
*   **Responsibilities**: Separates concerns (Validation vs Structure vs Rendering).
*   **Dependencies**: Downstream layers require normalized payloads from upstream adapters.
*   **Consumers**: Document Generation Engine (KSP, RKJM, RKT, RKAS).

---

## DIAGRAM 4: ENTERPRISE MODULE MAP

```text
       ┌─────────────┐
       │ Master Data │
       └──────┬──────┘
              │
  ┌───────────┼───────────┐
  ▼           ▼           ▼
┌────┐     ┌─────┐     ┌─────┐
│KSP │     │RKJM │     │RKT/ │
│    │     │     │     │RKAS │
└─┬──┘     └──┬──┘     └──┬──┘
  │           │           │
  └───────────┼───────────┘
              ▼
    ┌───────────────────┐
    │ Knowledge Packs   │
    └─────────┬─────────┘
              │
      ┌───────┴───────┐
      ▼               ▼
 ┌─────────┐    ┌──────────┐
 │Analytics│    │ Dashboard│
 └─────────┘    └──────────┘
```
*(Validation, Mirror, and SIMURID operate globally alongside Master Data and Modules)*

*   **Purpose**: Illustrates module interconnectivity.
*   **Responsibilities**: Defines the modular boundaries and integration points.
*   **Dependencies**: Output modules depend on Master Data and Knowledge Packs.
*   **Consumers**: Application Routing and Module Loading systems.

---

## DIAGRAM 5: DATA FLOW

```text
READ FLOW:
Database -> App State -> Mirror Service -> Workspace -> UI

WRITE FLOW:
UI -> Workspace -> Validation Engine -> State Mutation -> Database

MIRROR FLOW:
Master Data <--> Workspace Data -> Mirror Inspector (Diff Engine)

VALIDATION FLOW:
UI Input -> Real-time DQV Engine -> Pass/Warn/Fail Flags

PUBLISHING FLOW:
Final State -> Assembler -> Builder -> Preview Engine -> Print Engine
```

*   **Purpose**: Documents data movement directions and specific operational channels.
*   **Responsibilities**: Clarifies how state transitions occur across different operational modes.
*   **Dependencies**: Requires a unified global state (Settings).
*   **Consumers**: State management utilities, debugging, and audit services.

---

## DIAGRAM 6: OWNERSHIP MAP

```text
[ MASTER ]
- School Identity (Name, NPSN, Address)
- School Profile (Status, Principal)
- Personnel (Teachers, Tendik)
- Students (Demographics)
- Committee
- Facilities

[ SHARED ]
- Vision
- Mission
- Goals
- Academic Calendar

[ WORKSPACE ]
- School Characteristics (Students, Environment, Location)
- Curriculum Structure
- Learning Load
- Extracurricular
- Learning Policy
- Evaluation Policy
- Professional Development
- Attachments

[ SYSTEM ]
- Generated Documents (KSP, RKJM, RKAS, RKT PDF/JSON)
- Analytics
- Compliance Scores
```

*   **Purpose**: Explicitly assigns data domains to authoritative owners.
*   **Responsibilities**: Serves as the architectural contract for CRUD operations.
*   **Dependencies**: UI elements must map inputs to the designated owner.
*   **Consumers**: Adapters, Reducers, and Validation Rules.

---

## DIAGRAM 7: LAYERED ARCHITECTURE

```text
 ┌──────────────────────────────────────────────┐
 │ PRESENTATION (React UI, Dashboard, Preview)  │
 ├──────────────────────────────────────────────┤
 │ WORKSPACE (Forms, Editors, Inspectors)       │
 ├──────────────────────────────────────────────┤
 │ APPLICATION (Validation, Mirror, Adapters)   │
 ├──────────────────────────────────────────────┤
 │ KNOWLEDGE (Builders, Assemblers, Schemas)    │
 ├──────────────────────────────────────────────┤
 │ PUBLISHING (PDF Export, Print Engine)        │
 ├──────────────────────────────────────────────┤
 │ INFRASTRUCTURE (Storage, Global State)       │
 └──────────────────────────────────────────────┘
```

*   **Purpose**: Displays the vertical technology stack separation.
*   **Responsibilities**: Enforces strict separation of concerns (e.g., UI should not contain Business/Knowledge logic).
*   **Dependencies**: Upper layers depend on lower layers.
*   **Consumers**: System Architects and Core Developers.

---

## DIAGRAM 8: MIGRATION ROADMAP

```text
 [ 1. Legacy ] (Current tangled state)
       │
       ▼
 [ 2. Mirror ] (Silent comparison in background)
       │
       ▼
 [ 3. Inspector ] (Admin UI to view diffs)
       │
       ▼
 [ 4. Validation ] (Ensuring data integrity)
       │
       ▼
 [ 5. Source of Truth Switch ] (Adapters invert priority)
       │
       ▼
 [ 6. Legacy Removal ] (Cleanup of unused fields)
```

*   **Purpose**: Defines the safe path from legacy architecture to full Enterprise architecture.
*   **Responsibilities**: Ensures zero-regression transition for existing users.
*   **Dependencies**: Sequential execution. No step can be skipped.
*   **Consumers**: Engineering Managers and Migration Scripts.

---

## ENTERPRISE TERMINOLOGY

*   **Knowledge Domain**: A strict, typed model representing a specific educational concept (e.g., Curriculum Structure, Learning Load). It contains the business rules and logic.
*   **Builder**: A deterministic function/class that takes a raw payload and outputs a validated, structured Canonical Knowledge Object ready for rendering.
*   **Assembler**: An orchestrator that gathers multiple pieces of raw data, normalizes them, and feeds them to the correct Builders to assemble a complete document structure.
*   **Mirror**: A background service (`EnterpriseMirrorService`) that compares legacy Master Data with modern Workspace Data without modifying either, used for safe migration.
*   **Inspector**: A read-only UI (`EnterpriseMirrorInspector`) for administrators to view synchronization status and conflicts detected by the Mirror.
*   **Workspace**: The modern, domain-specific working environment (e.g., KSP Workspace) where users author document-specific content.
*   **Master Data**: The global, cross-document source of truth for institutional entities (School Identity, Personnel, Facilities).
*   **Shared Domain**: Data domains (like Vision/Mission or Academic Calendar) that are authored in one context but heavily utilized and adapted in others.
*   **Validation**: The engine (`DQV`) that checks data against business rules (Kemendikbudristek compliance) and returns Pass/Warn/Fail states.
*   **Publishing**: The final phase where assembled Knowledge Domains are rendered into physical artifacts (Live Preview, PDF, Print).
*   **Source of Truth (SoT)**: The designated, authoritative location and owner for a specific piece of data, dictating where it should be edited and stored.

