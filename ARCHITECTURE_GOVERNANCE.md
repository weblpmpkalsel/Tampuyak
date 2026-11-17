# TAMPUYAK OS ARCHITECTURE GOVERNANCE (TOSAS CONSTITUTION)

## 1. SYSTEM PHILOSOPHY
The core principle of Tampuyak OS is a strict downward flow of business logic:
**Strategic Planning → Operational Planning → Execution → Presentation**

Business logic always flows downward. Presentation layers (Views, Document Builders) never own or create business logic.

## 2. DOMAIN OWNERSHIP
- **KnowledgeGraph**: Owns Strategic Knowledge
- **AnnualPlanningActivity**: Owns Strategic Planning
- **OperationalPlanningActivity**: Owns Operational Planning
- **PlanningAssignment**: Owns Planning Year decisions
- **Execution**: Owns Real-world execution
- **Operational Views**: Own Read Models
- **Document Builders**: Own Presentation only

## 3. IMMUTABILITY RULES
- **KnowledgeGraph**: Immutable
- **AnnualPlanningActivity**: Immutable after synchronization
- **OperationalPlanningActivity**: Mutable only through Planning Assignment
- **Execution**: Mutable only through Execution Engine
- **annualPlans**: Generated structure only. Never edited manually.

## 4. SINGLE SOURCE OF TRUTH
- **KnowledgeGraph**: Strategic Source
- **AnnualPlanning**: Strategic Planning Source
- **PlanningAssignment**: Planning Decision Source
- **OperationalPlanningActivity**: Operational Planning Source
- **Execution**: Execution Source
- **Operational Views**: Read Source
- **Documents**: Presentation only

## 5. FORBIDDEN ACTIONS
Document Builders must **NEVER**:
- Determine Planning Year
- Determine Priority
- Determine Dependencies
- Determine Budget
- Determine Execution

Builders only render the data they are provided.

## 6. SERVICE RESPONSIBILITIES
- **PlanningAssignmentService**: The *only* component allowed to determine the Planning Year.
- **PlanningDistribution**: The *only* component allowed to populate `annualPlans` buckets.
- **ExecutionEngine**: The *only* component allowed to change execution state.
- **Document Builders**: Strictly Read Only.

## 7. DEPENDENCY FLOW
Dependencies strictly flow downward. No upward dependencies are permitted.
KnowledgeGraph
↓
AnnualPlanning
↓
PlanningAssignment
↓
OperationalPlanningActivity
↓
PlanningDistribution
↓
annualPlans
↓
Document Builders
↓
PDF / DOCX / Print

## 8. VERSION GOVERNANCE
Every domain must support:
- Version
- Schema Version
- Source Version
- Audit Metadata

No silent overwrites are permitted.

## 9. EVENT GOVERNANCE
All domain mutations must occur through dedicated services. Direct mutation is prohibited. Future modules must publish events. No module may directly mutate the state of another module.

## 10. EXTENSION PRINCIPLE
Future features (Timeline, Dashboard, Monitoring, Analytics, RKAS, AI Planning, Calendar) must **extend** existing domains. Never duplicate existing domains or their data.

## 11. BACKWARD COMPATIBILITY
Every future phase must preserve the Core Platform without requiring a redesign. Architecture growth must be purely additive.

## 12. ARCHITECTURE PRINCIPLES
- Separation of Concerns
- Single Responsibility
- Single Source of Truth
- Immutable Strategic Layer
- Operational Isolation
- Execution Isolation
- Presentation Independence
- Provider Independence
- Enterprise Safe Mode

## Future Development Guidelines
Any future enhancement or integration must consult this Constitution prior to implementation to ensure it does not violate these established boundaries and data flows. Risk analysis for any new module must verify 100% compliance with these ownership and dependency rules.
