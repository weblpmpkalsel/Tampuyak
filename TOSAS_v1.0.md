# TAMPUYAK OS Architecture Specification (TOSAS)
**Version:** 1.0
**Phase:** 2.2.5 (Enterprise Safe Mode)
**Status:** FOUNDATION STABLE

---

## Executive Summary
Tampuyak OS is an enterprise-grade school planning platform. This specification (TOSAS v1.0) serves as the authoritative architectural constitution for the entire platform. It outlines the foundational constraints, engine catalogs, layered architectures, domain models, and strict guidelines for all future development phases. Any subsequent module development MUST strictly adhere to the principles outlined in this document.

---

## 1. Vision, Mission, Design Philosophy

**Vision**
To provide an immutable, intelligent, and highly scalable enterprise platform that transforms school planning from static documents into dynamic, operational execution workflows.

**Mission**
To establish a strict architectural boundary between strategic planning (RKJM), operational planning (RKT), intelligence (AI), policy (Business Rules), and presentation, ensuring a Single Source of Truth that scales without degradation.

**Design Philosophy**
- Strict separation of concerns across Knowledge, Operational, Policy, Intelligence, Execution, and Presentation layers.
- Data immutability at the foundation.
- AI as an advisory layer, never an authoritative modifying layer.
- Modular, plugin-based architecture for all future extensions.

---

## 2. Core Principles

- **Single Source of Truth:** The RKJM KnowledgeGraph is the absolute and unmodifiable origin of all planning data.
- **Working Copy:** Annual Planning operates strictly as a Working Copy. Modifying operations occur here and NEVER bleed back into the RKJM.
- **Immutable RKJM:** The core strategic plan cannot be altered by downstream engines.
- **Operational Database:** The Annual Planning Engine serves as the core operational layer connecting RKJM with Timeline, Budget, and Monitoring.
- **Business Rules First:** The Business Rules Engine determines the policies. Logic resides here, and future AI must conform to these rules.
- **AI as Decision Support:** AI generates suggestions, but human approval is strictly mandatory before data is committed.
- **Presentation Independence:** Core logic, rules, and data models must not depend on UI rendering (DOM, React, Viewers).
- **Backward Compatibility:** All new engines must be strictly additive and backward compatible with previously generated documents and models.

---

## 3. System Architecture (Layer Diagram)

Tampuyak OS follows a highly structured, layered architecture to prevent circular dependencies and enforce strict responsibility boundaries.

1. **Knowledge Layer (L0):** `KnowledgeGraph`, `RKJM Engine`. Stores immutable strategic foundations.
2. **Operational Layer (L1):** `AnnualPlanningEngine`, `AnnualPlanningModel`. The working copy mapping RKJM to actionable annual data.
3. **Policy Layer (L2):** `BusinessRulesEngine`, `RuleRegistry`. Authoritative business rules evaluating operational data validity.
4. **Intelligence Layer (L3):** (Future) `Planning Intelligence Platform`, `Policy Advisor`. AI-driven decision support and recommendation generation.
5. **Execution Layer (L4):** (Future) `Timeline Engine`, `Monitoring Engine`, `Execution Engine`, `RKAS Engine`. Operational state tracking and execution workflows.
6. **Document Layer (L5):** (Future) `RKT Builder`, `RKAS Builder`, `Document Generator`, `PDF/DOCX/Print Engines`. Artifact composition based on L0-L4 data.
7. **Presentation Layer (L6):** (Future) `Dashboard Engine`, UI Components, Views.

---

## 4. Domain Model (Domain Diagram)

The core entities operating across the operational foundation:

- **Strategic Goal & Program:** Defined in RKJM, mapped via `rkjmSourceId`.
- **Activity & Sub-Activity:** Core execution units within a specific `Academic Year`.
- **Timeline:** Temporal metadata (`month`, `quarter`, `semester`, `startDate`, `targetDate`, `completionDate`, `dependencies`, `calendarTags`).
- **Priority:** Scoring and metadata ensuring alignment with high-level strategic objectives.
- **Budget Reference:** Link to financial requirements (`budgetId`, `estimatedBudget`, `fundingSource`, `budgetStatus`, `budgetCategory`).
- **Responsibility:** Ownership assignment (`responsibleUnit`, `responsiblePerson`, `supportingTeam`, `approvalRole`).
- **Monitoring & Execution Record:** Progress tracking (`progress`, `evidence`, `risk`, `issue`, `recommendation`, `completionStatus`).
- **Metadata & Versioning:** `schemaVersion`, `generatedBy`, `modifiedFlag`, `sourceHash`, `currentVersion`.

---

## 5. Engine Catalog

### Current Foundation Engines
- **KnowledgeGraph:** The central node graph storing the Single Source of Truth (RKJM).
- **AnnualPlanningEngine:** Provisions and synchronizes operational Working Copies without modifying the KnowledgeGraph.
- **BusinessRulesEngine:** Evaluates operational data against deterministic conditions, returning validation summaries.

### Future Engines (Planned)
- **Planning Intelligence Platform:** AI-driven support for expanding activities into tasks and schedules.
- **Timeline Engine:** Calculates and manages scheduling constraints, dependencies, and critical paths.
- **Execution Engine:** Manages state transitions, approvals, and completion workflows.
- **Monitoring Engine:** Aggregates progress, evidence, and risk factors for active plans.
- **Dashboard Engine:** Consolidates insights into visual enterprise metrics and health status.
- **Analytics Engine:** Generates trend reports, compliance analytics, and cross-year operational insights.
- **Document Generator:** Composes physical document nodes from operational state.
- **RKAS Engine:** Refines budget references into structured financial calculations and ledger entries.
- **Policy Advisor:** AI assistant that provides actionable insights to resolve Business Rule failures.

---

## 6. Engine Dependency Diagram

```text
[ Presentation Layer ] (Depends on all below, modifies none)
          │
[ Document Layer ]     (Depends on Execution, Operational, Knowledge)
          │
[ Execution Layer ]    (Depends on Intelligence, Policy, Operational)
          │
[ Intelligence Layer ] (Depends on Policy, Operational, Knowledge)
          │
[ Policy Layer ]       (Depends on Operational) - BusinessRulesEngine
          │
[ Operational Layer ]  (Depends on Knowledge)   - AnnualPlanningEngine
          │
[ Knowledge Layer ]    (Zero dependencies)      - KnowledgeGraph / RKJM
```

**Strict Rule:** Higher layers may consume lower layers. Lower layers must NEVER depend on or have knowledge of higher layers.

---

## 7. Data Flow Diagram

End-to-end operational execution path:

1. **Source:** `RKJM` (Immutable Strategic Source)
2. **Provision:** `Annual Planning Workspace` (Working Copy generation via Hash Synchronization)
3. **Validate:** `Business Rules` (Deterministic Policy Evaluation)
4. **Suggest:** `Planning Intelligence Platform` (AI Proposal generation)
5. **Schedule:** `Timeline` (Temporal constraint mapping)
6. **Track:** `Execution` & `Monitoring` (Progress updates, evidence collection)
7. **Visualize:** `Dashboard` (Real-time operational health)
8. **Publish:** `Documents` & `Reports` (RKT/RKAS generation)

---

## 8. AI Architecture Principles

- **No Direct Modification:** AI engines must never directly mutate the Operational Database or KnowledgeGraph.
- **Suggestion Only:** AI generates proposals in standard JSON formats.
- **Human Approval Mandatory:** Users must explicitly review and accept an AI suggestion before it is committed to the Working Copy.
- **Rule First:** Business Rules must execute and validate state before and after AI suggestions. AI cannot bypass the Policy Layer.
- **Provider Independence:** The core application must abstract AI interactions so that models (Gemini, Claude, OpenAI, Local) can be hot-swapped.

---

## 9. Provider Architecture

To maintain Provider Independence, an abstraction layer must be used:
- **`IAIProvider` Interface:** Exposes standard methods (`generateSuggestion`, `analyzeRisk`, `proposeTimeline`).
- **Provider Implementations:** `GeminiProvider`, `OpenAIProvider`, `OllamaProvider` implement the interface.
- Core intelligence engines rely ONLY on `IAIProvider`, never on specific SDKs.

---

## 10. JSON Contracts

Conceptual representations of AI/Execution exchanges:
- **Planning Suggestion:** `{ "activityId": string, "proposedTasks": [], "rationale": string }`
- **Timeline Suggestion:** `{ "activityId": string, "optimalStartDate": string, "dependencies": [] }`
- **Validation Result:** `{ "ruleId": string, "status": "Passed|Failed", "recommendation": string }`

---

## 11. Versioning Strategy

- **Schema Version:** Tracks data model shape (e.g., v1.0.0 for Phase 2.1 AnnualPlanningModel).
- **Engine Version:** Software version of the execution logic.
- **Workspace Version:** Tracks incremental human/AI edits on the Annual Planning working copy.
- **Rule Version:** Tracks updates to specific business policy logic over time.
- **Compatibility Strategy:** Any change to schema requires an additive transformation; destructive migrations are prohibited.

---

## 12. Security Principles

- **Read-Only KnowledgeGraph:** Downstream systems have read-only access to strategic data.
- **Immutable RKJM:** RKJM hashes ensure data integrity.
- **Audit Trail:** Every modification to the Working Copy tracks `updatedAt` and `updatedBy`.
- **Approval Workflow:** Strict separation between 'Draft' state and 'Approved' state.
- **Future Authentication:** System supports integration with identity providers for Role-Based Access Control (RBAC).

---

## 13. Extension Principles

- **Plugin Architecture:** Future engines must be implemented as distinct, modular services.
- **No Foundation Changes:** Adding a new module must not require modifying L0, L1, or L2 core files.
- **Event-Driven hooks:** Future extensions should utilize interfaces and event listeners rather than hardcoded service calls.

---

## 14. Naming Standards

- **Files:** PascalCase for Classes/Interfaces (`BusinessRulesEngine.ts`), camelCase for utilities.
- **Models:** Postfixed with `Model` or exact domain name (`AnnualPlanningModel`, `BusinessRule`).
- **Interfaces:** Standard PascalCase (avoiding `I` prefix unless necessary for provider abstractions like `IAIProvider`).
- **Engines:** Postfixed with `Engine` (`ExecutionEngine`).
- **Events:** Verb-Noun past-tense (`ActivityUpdated`, `RuleFailed`).

---

## 15. Development Roadmap

- **Phase 2.3:** Planning Intelligence Platform
- **Phase 2.4:** Timeline Engine
- **Phase 2.5:** Execution Engine
- **Phase 2.6:** Monitoring Engine
- **Phase 2.7:** Executive Dashboard
- **Phase 2.8:** Document Generator (RKT Builders)
- **Phase 2.9:** RKAS Engine
- **Phase 3:** Analytics Platform

---
**Approved by Tampuyak OS Enterprise Architecture Board**
*Phase 2.2.5 - End of Document*
