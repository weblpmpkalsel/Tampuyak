# ENTERPRISE GOVERNANCE

**PROJECT**: TAMPUYAK OS
**DOMAIN**: ENTERPRISE GOVERNANCE
**SPRINT**: 0.5
**STATUS**: FROZEN & APPROVED

This document defines the permanent engineering rules of TAMPUYAK OS. After this document is approved, NO MORE ARCHITECTURE DOCUMENTS SHALL BE CREATED. Implementation begins after this sprint.

---

## SECTION 1: ENTERPRISE DEPENDENCY RULES

The following is the **ONLY** allowed dependency direction in the Enterprise Architecture:

Enterprise Master Data
↓
Knowledge Services
↓
Knowledge Builders
↓
Document Adapters
↓
Canonical Document Model
↓
Enterprise Composition Engine
↓
Enterprise Workspace
↓
Enterprise Publishing

**Forbidden Dependency Examples:**
* Builder → Master Data
* Workspace → Master Data
* Publishing → Knowledge Services
* Adapter → Master Data
* Builder → Builder
* Service → Builder

---

## SECTION 2: ENTERPRISE RESPONSIBILITY RULES

The responsibility of every layer is strictly defined:

* **Master Data**: Stores canonical enterprise information.
* **Knowledge Services**: Provide validated enterprise knowledge.
* **Knowledge Builders**: Create reusable Knowledge Objects.
* **Document Adapters**: Translate Knowledge Objects into Document Nodes.
* **Composition Engine**: Build Canonical Documents.
* **Workspace**: Presentation only.
* **Publishing**: Serialization only.

---

## SECTION 3: NAMING CONVENTION

Strict naming conventions must be followed.

**Examples:**
* SchoolProfileService
* SchoolContextService
* LearningPolicyService
* VisionMissionBuilder
* LearningOrganizationBuilder
* EvaluationPolicyBuilder
* KSPAdapter
* RKJMAdapter
* MasterDataRegistry
* PolicyRegistry
* KnowledgeRegistry
* EnterpriseWorkspace
* EnterprisePublishing

---

## SECTION 4: FOLDER CONVENTION

Enterprise code must reside in the specified directory structure. No generic folders are allowed.

**Allowed Folders:**
* `enterprise/`
* `master-data/`
* `knowledge/`
* `services/`
* `builders/`
* `adapters/`
* `workspace/`
* `publishing/`
* `validation/`
* `registry/`
* `policy/`

**Forbidden Folders (Do Not Create):**
* `utils/`
* `helpers/`
* `misc/`
* `temp/`
* `new/`
* `old/`
* `backup/`

---

## SECTION 5: ONE RESPONSIBILITY RULE

* Every **Service** has one responsibility.
* Every **Builder** has one responsibility.
* Every **Adapter** has one responsibility.
* Every **Registry** has one responsibility.
* Every **Policy** has one responsibility.

---

## SECTION 6: CANONICAL OUTPUT RULE

Builders **MUST NEVER** output:
* React
* HTML
* JSX
* PDF
* DOCX
* CSS

They output **only** Canonical Knowledge Objects.
Adapters transform them into Canonical Document Model.

---

## SECTION 7: WORKSPACE RULE

Workspace must **never** know about:
* Master Data
* Knowledge Services
* Builders
* Policies

It consumes **only** Canonical Document Model.

---

## SECTION 8: PUBLISHING RULE

Publishing must **never** know about specific document types natively:
* KSP
* RKJM
* RKAS
* SPMI
* Accreditation

Publishing consumes **only** Canonical Document Model.

---

## SECTION 9: VERSIONING RULE

Every architecture artifact follows this strict lifecycle:

Draft
↓
Reviewed
↓
Approved
↓
Frozen

---

## SECTION 10: DEFINITION OF DONE

Every Sprint must satisfy the following before Sprint Status is marked as **COMPLETE**:

* Project builds successfully
* No compile errors
* No regression
* Architecture unchanged
* Dependency rules respected
* Naming rules respected
* Workspace unaffected
* Publishing unaffected
* Manual testing completed
* Acceptance criteria passed
* Rollback plan verified

---

## SECTION 11: ENTERPRISE REVIEW CHECKLIST

* Compile: **PASS**
* Regression: **PASS**
* Architecture: **PASS**
* Dependency: **PASS**
* Naming: **PASS**
* Performance: **PASS**
* Workspace: **PASS**
* Publishing: **PASS**
* Validation: **PASS**

---

## SECTION 12: IMPLEMENTATION LOCK

After approval of this document, implementation may begin.

* No more architecture redesign.
* No more compliance redesign.
* No more registry redesign.

Only implementation.
