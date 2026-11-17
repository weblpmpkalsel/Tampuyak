# Enterprise Curriculum Domain (ECD) Architecture Report

## 1. Enterprise Domain Diagram
The Enterprise Curriculum Domain (ECD) is a reusable, knowledge-centric subsystem integrated into TAMPUYAK OS. It shifts away from document-centric paradigms to domain-centric paradigms.

```text
[TAMPUYAK OS Core]
       │
[Knowledge Graph] ──► [Knowledge Resolver] ──► [Knowledge Mapper]
                                                      │
                                          ┌───────────▼───────────┐
                                          │ Enterprise Capability │
                                          │        Layer          │
                                          └───────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐◄── [Enterprise AI Domain]
                                          │      Builders         │
                                          └───────────┬───────────┘
                                                      │
[Regulation Domain] ──► [Policy] ─────────► [Document Adapters]
      │                    │                          │
      ▼                    ▼              ┌───────────▼───────────┐
[Template Def]     [Validation Rules]     │  Canonical Document   │
      │                    │              │        Model          │
      ▼                    ▼              └───────────┬───────────┘
[Publishing Rules] ───────────────────────────────────┤
                                                      │
                                          ┌───────────▼───────────┐
                                          │ Enterprise Document   │
                                          │ Composition Engine    │
                                          └───────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │ Enterprise Workspace  │
                                          └───────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │ Enterprise Publishing │
                                          └───────────────────────┘
```

## 2. Knowledge Domain Diagram
The ECD is built upon discrete, reusable knowledge domains. These domains act as the single source of truth for all curriculum-related artifacts.

- **School Identity Domain**: Core school identity, NPSN, address, metadata.
- **School Context Domain**: Geographic, socio-cultural, and demographic context.
- **Vision Mission Domain**: Strategic goals, vision, mission, and core values.
- **Curriculum Structure Domain**: Intracurricular, co-curricular (P5), extracurricular frameworks.
- **Learning Organization Domain**: Teaching schedules, workload distribution, rombel mapping.
- **Assessment Domain**: Formative and summative assessment guidelines, grading criteria.
- **Professional Development Domain**: Teacher training, mentoring, and capacity building.
- **Academic Calendar Domain**: Educational calendar, holidays, effective weeks.
- **Appendix Domain**: Attachments, SK (Surat Keputusan), instruments.

## 3. Enterprise Capability Layer
Capabilities provide reusable enterprise services abstracting raw Knowledge objects. Builders MUST consume Capabilities, never raw Knowledge objects.

- **Identity Capability**: Provides school identifiers, principals, and metadata.
- **School Profile Capability**: Provides socio-geographic and demographic intelligence.
- **Planning Capability**: Provides strategic goals, vision, mission, and programmatic planning.
- **Curriculum Capability**: Provides intracurricular, co-curricular, and extracurricular frameworks.
- **Learning Organization Capability**: Provides scheduling, workload, and rombel structures.
- **Assessment Capability**: Provides grading, formative, and summative assessment guidelines.
- **Calendar Capability**: Provides academic calendar data and effective week calculations.

## 4. Enterprise AI Domain
The Enterprise AI Domain provides specialized intelligence services consumed by the Builders to generate and refine content.

- **Narrative AI**: Generates cohesive paragraphs from structured data.
- **Improve AI**: Enhances readability, tone, and professional language.
- **Rewrite AI**: Modifies existing text to fit new contexts or constraints.
- **Validation AI**: Checks semantic correctness and adherence to guidelines.
- **Consistency AI**: Ensures tone and terminology remain uniform across the document.
- **Translation AI**: Handles localization or formal language adjustments.

## 5. Dependency Diagram
```text
(Knowledge Graph & Core Data)
        │
        ▼
(Knowledge Resolver & Mapper)
        │
        ▼
(Enterprise Capability Layer)
        │
        ├──► Identity Capability
        ├──► School Profile Capability
        ├──► Planning Capability
        ├──► Curriculum Capability
        ├──► Learning Organization Capability
        ├──► Assessment Capability
        └──► Calendar Capability
                 │
                 ▼
            (Builders) ◄── (Enterprise AI Domain)
                 │
                 ▼
        (Document Adapters) ◄── (Regulation Domain -> Policy, Templates)
                 │
                 ▼
    (Canonical Document Model) ◄── (Enterprise Validation Engine <- Regulation Validation Rules)
                 │
                 ▼
(Enterprise Document Composition Engine)
                 │
                 ▼
       (Enterprise Workspace)
                 │
                 ▼
      (Enterprise Publishing) ◄── (Regulation Publishing Rules)
```

## 6. Document Adapter Diagram
Document Adapters consume standard outputs from the Builders (guided by the Regulation Domain) and map them into a **Canonical Document Model**. The Composition Engine strictly consumes this Canonical Model.

```text
[Domain Builders] 
       │
       ├─► [KSP Adapter] ───────────────► (KSP Canonical Model)
       │
       ├─► [Calendar Adapter] ──────────► (Calendar Canonical Model)
       │
       ├─► [ATP Adapter] ───────────────► (ATP Canonical Model)
       │
       ├─► [Prota/Promes Adapter] ──────► (Prota/Promes Canonical Model)
       │
       └─► [Modul Ajar Adapter] ────────► (Modul Ajar Canonical Model)
                                                │
                                                ▼
                            [Enterprise Document Composition Engine]
```

## 7. Expanded Regulation Layer
The Regulation Domain ensures the ECD remains compliant with shifting government policies without requiring rewrites of the underlying Builders or Capabilities.

- **Regulation**: The root regulatory framework (e.g., Kurikulum Merdeka).
- **Policy**: Specific ministerial decrees (e.g., Permendikbudristek No. 12 Tahun 2024).
- **Template**: Maps policies to specific document structures and required components.
- **Validation Rules**: Dynamic rulesets injected into the Enterprise Validation Engine to ensure the generated Canonical Document Model is legally compliant.
- **Publishing Rules**: Constraints regarding formatting, signatures, and appendix requirements during export.

## 8. Folder Architecture
```text
src/
└── enterprise/
    ├── ai/                        # Enterprise AI Domain
    │   ├── narrative/
    │   ├── improve/
    │   ├── validation/
    │   └── consistency/
    │
    └── curriculum/
        ├── domains/               # Knowledge Domains
        │
        ├── capabilities/          # Enterprise Capability Layer
        │   ├── IdentityCapability/
        │   ├── CurriculumCapability/
        │   └── PlanningCapability/
        │
        ├── regulation/            # Expanded Regulation Domain
        │   ├── policies/
        │   ├── templates/
        │   ├── validation/
        │   └── publishing/
        │
        ├── adapters/              # Document Adapters
        │   ├── KspAdapter/
        │   └── CalendarAdapter/
        │
        ├── models/                # Canonical Document Models
        │   └── CanonicalDocumentModel.ts
        │
        ├── services/              # Domain Services & Mappers
        │   ├── KnowledgeResolver/
        │   └── KnowledgeMapper/
        │
        └── builders/              # Component Builders
```

## 9. Migration Strategy
**Objective**: Evolve into the Enterprise Curriculum Domain without modifying locked systems (RKJM, RKT, RKAS, Planning Engine, Recommendation Engine, Budget Engine, Knowledge Graph, Enterprise Workspace, Enterprise Publishing).

1. **Non-Invasive Knowledge Resolution**: The Knowledge Resolver will read from the existing Knowledge Graph without modifying its schema.
2. **Capability Abstraction**: Existing data access patterns will be migrated behind the new Enterprise Capability Layer. Builders will only interact with Capabilities.
3. **Canonical Model Composition**: The Document Adapters will output a strictly defined `Canonical Document Model`. The `Enterprise Document Composition Engine` remains untouched, as it already knows how to render the Canonical nodes.
4. **Validation Engine Reusability**: The existing `EnterpriseValidationEngine` will receive Regulation-specific `Validation Rules` during the adapter phase, leaving the core validation execution logic untouched.
5. **Workspace and Publishing Agnosticism**: Because the Document Adapters emit Canonical Document Models via the Composition Engine, the Enterprise Workspace and Enterprise Publishing layers will render and export the Curriculum documents exactly as they do RKJM, RKT, and RKAS.
6. **Parallel Execution**: The ECD will be built in the new `src/enterprise/` directory and connected as a new module, preventing any disruptions to the existing locked domains.
