# ENTERPRISE ARCHITECTURE FINAL SPECIFICATION

**STATUS: FROZEN & APPROVED**

This document serves as the final, immutable contract for the Enterprise Architecture Foundation. No further architectural redesigns are permitted.

---

## 1. EXTENDED ENTERPRISE MASTER DATA

The Master Data foundation is the canonical source for all Enterprise Domains. It operates independently of any document generation, workspace, or publishing mechanism.

### 1.1 School Governance (NEW)
* **Purpose**: Canonical definition of the school's governance structure, regulatory compliance bodies, and decision-making hierarchy.
* **Contains**:
  * Foundation/Yayasan (if private)
  * School Board/Komite Sekolah structure
  * Accreditation Status and Body
  * Regulatory Region (Dinas Pendidikan level)
  * Licensing Information
* **Owner**: Enterprise Administration
* **Editable**: Yes (by Principal/Admin)
* **Validation Rules**: Must contain valid accreditation status; regulatory region must match School Profile province/city.
* **Consumers**: Planning Domain, Curriculum Domain, Quality Domain, Reporting Domain.
* **Future Extension Points**: Multi-school foundation hierarchy mapping.

---

## 2. EXTENDED ENTERPRISE KNOWLEDGE SERVICE LAYER

Knowledge Builders must never consume raw data directly. They must interface through the Knowledge Service Layer.

### 2.1 PolicyService (NEW)
* **Purpose**: Acts as the centralized interface for all Builders to retrieve, validate, and inject Enterprise Policies into their knowledge domains.
* **Responsibilities**:
  * Abstract direct database/storage access to policies.
  * Resolve policy dependencies (e.g., retrieving Strategic Policy for the VisionMissionBuilder).
  * Enforce policy versioning and read-access controls.
* **Inputs**: Policy ID, Version, Context (e.g., KSP, RKJM).
* **Outputs**: Structured Policy Objects (Canonical Form).
* **Validation**: Ensures requested policy is active and finalized for the current Academic Year.
* **Consumers**: All Knowledge Builders (e.g., LearningOrganizationBuilder, AssessmentPolicyBuilder).

---

## 3. EXTENDED ENTERPRISE POLICY CENTER

The Enterprise Policy Center centralizes all operational, cultural, and strategic directives.

### 3.1 Strategic Policy (NEW)
* **Purpose**: The absolute canonical source for the school's high-level direction.
* **Contains**:
  * Vision Statement
  * Mission Statement
  * Core Educational Goals
  * Strategic Priorities (1-year, 4-year horizons)
  * Success Indicators / KPIs
* **Owner**: Principal & School Committee
* **Editable**: Yes (Restricted, typically during annual/quadrennial review)
* **Consumers**: KSP (Curriculum Domain), RKJM (Planning Domain), RKT, RKAS.
* **Dependencies**: School Profile, School Governance, External Mandates (e.g., Profil Pelajar Pancasila).

---

## 4. ENTERPRISE REGISTRY

The Enterprise Registry provides a unified catalog of all entities within the ecosystem, defining their lifecycles and relationships.

| Entity Type | Owner | Purpose | Consumers | Dependencies | Lifecycle | Version |
|---|---|---|---|---|---|---|
| **Master Data** | Enterprise Admin | Immutable ground truth (Profile, Governance, Facilities, etc.) | Knowledge Services | None | Continuous | `1.x.x` |
| **Knowledge** | Knowledge Domain | Reusable conceptual models (e.g., School Context, Curriculum Structure) | Knowledge Builders | Master Data | Annual | `1.x.x` |
| **Policies** | Policy Center | Centralized rules and strategies (Strategic, Assessment, Learning) | Knowledge Services | Master Data | Annual/Quadrennial | `1.x.x` |
| **Attachments** | Validation Engine | Required external proofs and artifacts | Document Adapters, Validation | Knowledge | Document-bound | `1.x.x` |
| **Capabilities** | Capability Layer | Core systemic functions (e.g., Document Composition, Export) | Workspace, Publishing | System | Continuous | `1.x.x` |
| **Builders** | Domain specific | Assembling Knowledge Objects into Document Contexts | Adapters | Services | Continuous | `1.x.x` |
| **Adapters** | Domain specific | Mapping Builder outputs to Canonical Document Models | Composition Engine | Builders | Continuous | `1.x.x` |
| **Workspace Components** | UX Team | User interface for document editing, review, and state management | End Users | Capabilities | Continuous | `1.x.x` |
| **Publishing Components** | UX Team | Exporting Canonical Models to PDF/DOCX | End Users | Capabilities | Continuous | `1.x.x` |
| **Validation Rules** | Validation Engine | Ensuring data completeness, policy alignment, and compliance | Workspace, Dashboard | Master Data | Continuous | `1.x.x` |

---

## 5. ENTERPRISE ASSET CATALOG

The Asset Catalog serves as the navigational map of the frozen architecture.

* **[Foundation]** Master Data (Profile, Organization, Facilities, Community, Academic Year, Governance)
* **[Policy]** Enterprise Policy Center (Strategic, Learning, Assessment, Professional Development, Support, Culture, Digital)
* **[Service]** Knowledge Service Layer (ProfileService, OrganizationService, FacilitiesService, CommunityService, CalendarService, PolicyService)
* **[Construction]** Knowledge Builders (SchoolContextBuilder, VisionMissionBuilder, LearningOrganizationBuilder, AssessmentPolicyBuilder, etc.)
* **[Mapping]** Document Adapters (KSP Adapter, RKJM Adapter, RKT Adapter)
* **[Core]** Canonical Document Model
* **[Engine]** Enterprise Document Composition Engine
* **[Engine]** Enterprise Validation Engine
* **[UI]** Enterprise Workspace
* **[UI]** KSP Readiness Dashboard
* **[Output]** Enterprise Publishing

---
**STATUS: FROZEN. IMPLEMENTATION PHASE AUTHORIZED.**
