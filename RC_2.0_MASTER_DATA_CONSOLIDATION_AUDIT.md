# RC-2.0 MASTER DATA CONSOLIDATION AUDIT

## EXECUTIVE SUMMARY
This audit identifies data duplication between the canonical School Master Data (legacy `DEFAULT_SETTINGS`) and the Enterprise Workspace modules. The goal is to map the data flow and provide a migration blueprint to establish a Single Source of Truth without altering the current codebase.

## FIELD INVENTORY & DUPLICATION MATRIX

| Field Name | Enterprise Workspace (Source) | School Master Data (Legacy Source) | Current Consumers |
| :--- | :--- | :--- | :--- |
| **School Name** | `enterpriseProfile.identity.name` | `school.name` | KSP, RKJM, RKT, RKAS |
| **NPSN** | `enterpriseProfile.identity.npsn` | `school.npsn` | KSP, RKJM, RKT, RKAS |
| **Address** | `enterpriseProfile.identity.address` | `school.address` | KSP, RKJM, RKT, RKAS |
| **School Status** | `enterpriseProfile.identity.status` | `school.status` | KSP, RKJM, RKT, RKAS |
| **Principal Name** | `enterpriseProfile.identity.principalName` | `principal.name` | KSP, RKJM, RKT, RKAS |
| **Vision** | `enterpriseProfile.vision` | `identitas.visi`, `education.vision` | KSP, RKJM, RKT |
| **Mission** | `enterpriseProfile.mission` | `identitas.misi`, `education.mission`| KSP, RKJM, RKT |
| **Goals** | `enterpriseProfile.goals` | `identitas.tujuan`, `education.goals` | KSP, RKJM, RKT |
| **Student Characteristics**| `enterpriseProfile.characteristics.pesertaDidik`| `karakteristik.pesertaDidik` | KSP |
| **Environmental Context** | `enterpriseProfile.characteristics.lingkungan`| `karakteristik.lingkungan` | KSP |
| **Location Context** | `enterpriseProfile.characteristics.lokasi` | `karakteristik.lokasi` | KSP |
| **Teacher Characteristics**| `enterpriseProfile.characteristics.pendidik` | `karakteristik.guru` | KSP |
| **Parent Characteristics** | `enterpriseProfile.characteristics.orangTua` | `karakteristik.orangTua` | KSP |
| **Academic Calendar** | `curriculum.academicCalendar` / `academicCalendar` | `kalenderPendidikan`, `education.calendar` | KSP |

---

## CLASSIFICATION & RECOMMENDED OWNERSHIP

### CATEGORY A: Institution Master Data
Data that defines the school structurally. It should be consistent across RKJM, RKT, RKAS, and KSP.

| Field Name | Recommended Ownership | Regression Risk |
| :--- | :--- | :--- |
| School Name | **KEEP IN MASTER** | MEDIUM |
| NPSN | **KEEP IN MASTER** | MEDIUM |
| Address | **KEEP IN MASTER** | MEDIUM |
| School Status | **KEEP IN MASTER** | MEDIUM |
| Principal Name | **KEEP IN MASTER** | MEDIUM |
| Teacher / Parent Char. | **SHARED** (Master initialized, doc overridden) | HIGH |

### CATEGORY B: Document Specific Data
Data that can change per document version or year (e.g., KSP specific).

| Field Name | Recommended Ownership | Regression Risk |
| :--- | :--- | :--- |
| Vision | **KEEP IN WORKSPACE** | HIGH |
| Mission | **KEEP IN WORKSPACE** | HIGH |
| Goals | **KEEP IN WORKSPACE** | HIGH |
| Student Characteristics | **KEEP IN WORKSPACE** | HIGH |
| Environmental Context | **KEEP IN WORKSPACE** | HIGH |
| Location Context | **KEEP IN WORKSPACE** | HIGH |

### CATEGORY C: Shared Configuration
Highly complex data structures.

| Field Name | Recommended Ownership | Regression Risk |
| :--- | :--- | :--- |
| Academic Calendar | **SHARED** | HIGH |
| Learning Load | **SHARED** | HIGH |
| Curriculum Structure | **SHARED** | HIGH |

---

## DEPENDENCY TRACE (DATA FLOW)

**1. Identity & Master Data (Name, NPSN, Address)**
`Workspace (enterpriseProfile.identity)` 
↓ `Adapter (EnterpriseProfileAdapter)` -> Overwritten by Legacy `school` in `EnterpriseAdapter.mergeNonEmpty`
↓ `Metadata (KspMetadataAdapter.adapt)`
↓ `Assembler (KspDocumentAssembler -> schoolProfileInput)`
↓ `Knowledge (SchoolProfileBuilder)`
↓ `Builder (Document Generator)`
↓ `Preview & PDF`

**2. Vision, Mission, Goals (Strategic Policy)**
`Workspace (enterpriseProfile.vision/mission/goals)`
↓ `Adapter (EnterpriseProfileAdapter)` -> Merged with `identitas`
↓ `Metadata (KspMetadataAdapter -> rawStrategicPolicy)`
↓ `Assembler (KspDocumentAssembler -> strategicPolicyInput)`
↓ `Knowledge (StrategicPolicyBuilder)`
↓ `Builder (Document Generator)`
↓ `Preview & PDF`

**3. Characteristics (Student, Environment, Location)**
`Workspace (enterpriseProfile.characteristics)`
↓ `Adapter (EnterpriseProfileAdapter)` -> Merged with `karakteristik`
↓ `Metadata (KspMetadataAdapter -> rawStudents, rawCharacteristics)`
↓ `Assembler (KspDocumentAssembler -> characteristicsInput)`
↓ `Knowledge (CharacteristicsBuilder)`
↓ `Builder (Document Generator)`
↓ `Preview & PDF`

**4. Academic Calendar**
`Workspace (academicCalendar)`
↓ `Adapter (EnterpriseAdapter)` -> Merged `curriculum.academicCalendar || kalenderPendidikan`
↓ `Metadata (KspMetadataAdapter -> rawAcademicCalendar)`
↓ `Assembler (KspDocumentAssembler -> calendarInput)`
↓ `Knowledge (AcademicCalendarBuilder)`
↓ `Builder (Document Generator)`
↓ `Preview & PDF`

---

## REGRESSION RISK MATRIX
*   **HIGH RISK**: `Vision`, `Mission`, `Goals`, `Characteristics`. The Enterprise Adapter explicitly prioritizes legacy data via `EnterpriseAdapter.mergeNonEmpty(legacy, modern)` by looping through `legacy` and overwriting `modern`. Removing these from Master Data without updating the Adapter logic will break the Document Assembler, causing it to render empty fields in the Preview and PDF.
*   **MEDIUM RISK**: `School Name`, `NPSN`, `Principal Name`. These are heavily used in headers, footers, and validation rules across multiple documents (RKJM, RKT, RKAS).

## MIGRATION ROADMAP
1.  **Phase 1**: Update `EnterpriseAdapter` to invert priority for Document Specific Data (modern overrides legacy).
2.  **Phase 2**: Refactor `KspMetadataAdapter` to pull exclusively from Enterprise Workspace state for Category B.
3.  **Phase 3**: Remove redundant fields from `DEFAULT_SETTINGS` (`identitas`, `education.vision`).
4.  **Phase 4**: Centralize Category A fields into a readonly Context in the Workspace UI, forcing users to edit them in School Data (Data Sekolah).

**DECISION**: **GO** (Blueprint complete. Awaiting execution approval).
