# RC-2.1 SOURCE OF TRUTH CERTIFICATION

## EXECUTIVE SUMMARY
This certification defines the official ownership and Source of Truth (SoT) for every enterprise data domain within TAMPUYAK. By evaluating the lifecycle, reusability, and independence of each data domain, this architecture eliminates ambiguity and establishes a clear boundary between Global School Master Data and Document-Specific Workspace Data.

## OWNERSHIP MATRIX

| Data Domain | Official Owner | Rationale |
| :--- | :--- | :--- |
| **School Identity** (Name, NPSN, Address, Status) | **Master Data** | Global identifiers, heavily reused across all documents, rarely changes. |
| **Personnel** (Principal, Teachers, Committee) | **Master Data** | Global entities. Tied to RKAS (salaries/honorarium) and RKT. |
| **Strategic Direction** (Vision, Mission, Goals) | **Shared** | Defined in RKJM (4 years), but contextualized and published annually in KSP. |
| **Characteristics & Context** (Students, Environment) | **Workspace (KSP)** | Highly specific to the annual KSP narrative. Not globally applicable. |
| **Curriculum & Learning** (Structure, Load, Policies) | **Workspace (KSP)** | Core KSP content. Changes annually based on educational phases. |
| **Academic Calendar** | **Shared** | Drives KSP scheduling, but also dictates RKAS spending timelines and RKT activities. |
| **Evaluation & Prof. Dev.** | **Workspace (KSP)** | Pedagogical policies specific to the KSP document version. |

---

## REUSE MATRIX

| Data Domain | Changes Yearly? | Reused by RKJM? | Reused by RKT? | Reused by RKAS? | Independent of KSP? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **School Identity** | No | YES | YES | YES | YES |
| **Personnel** | Sometimes | YES | YES | YES | YES |
| **Strategic Direction** | Seldom | YES | YES | YES | YES |
| **Characteristics** | Yes | No | Sometimes | No | No |
| **Curriculum/Learning** | Yes | No | YES | Sometimes | No |
| **Academic Calendar** | Yes | No | YES | YES | YES |
| **Eval & Prof. Dev.** | Yes | No | YES | No | No |

---

## DEPENDENCY MATRIX

*   **Master Data -> Documents**: RKJM, RKT, RKAS, and KSP **READ-ONLY** from School Identity and Personnel.
*   **Workspace -> Documents**: KSP has **FULL WRITE** access to Characteristics, Curriculum, and Policies.
*   **Shared -> Documents**: 
    *   *Strategic Direction*: RKJM is the primary writer. KSP reads and can branch/contextualize.
    *   *Academic Calendar*: KSP is the primary writer. RKT and RKAS read for activity scheduling.

---

## MIGRATION STRATEGY

To enforce this Source of Truth architecture without breaking existing dependencies, the following strategy will be executed in future phases:

1.  **Isolate Master Data**: In the Enterprise Workspace UI, Category A fields (School Identity, Personnel) will be made **Read-Only**, displaying data from `DEFAULT_SETTINGS.school` and `DEFAULT_SETTINGS.principal`. Users will be directed to the "Data Sekolah" module to edit them.
2.  **Invert Adapter Priority**: The `EnterpriseAdapter` currently prioritizes legacy Master Data over Workspace Data for all fields via `mergeNonEmpty`. This will be modified to prioritize Workspace Data for domains officially owned by the Workspace (e.g., Characteristics, Curriculum).
3.  **State Consolidation**: Redundant fields in `DEFAULT_SETTINGS` (e.g., `identitas.visi` vs `education.vision` vs `enterpriseProfile.vision`) will be merged into the designated Owner.
4.  **Shared Domain Sync**: For Shared domains (Strategic Direction, Academic Calendar), a synchronization mechanism will be introduced so that updates in KSP are reflected globally, or vice versa, based on user consent.

---

## ARCHITECTURAL DECISION

*   **Global School Data** = Single Source of Truth for Institutional Identity and Personnel.
*   **Enterprise Workspace** = Single Source of Truth for Document-Specific Pedagogical Content and Characteristics.
*   **Legacy Data Structures** = Will be phased out in favor of isolated, domain-specific state slices.

**DECISION**: **GO** (Architecture Certified. Awaiting implementation phase).
