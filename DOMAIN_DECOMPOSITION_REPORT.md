# PRE-IMPLEMENTATION: DOMAIN DECOMPOSITION EVALUATION

## 1. Rule 086 Violation Analysis
While Rule 086 was not explicitly defined in the prior prompts, its implicit enterprise definition based on the surrounding rules (Rule 070, Rule 083) is that **"Distinct knowledge entities with different lifecycles must not be coupled in monolithic payloads."**

The current `VisionMissionPayload` violates this principle. A school's Vision (the aspirational destination) has a 4-8 year lifecycle. A school's Mission (the strategic actions) and Goals (the measurable outcomes) have 1-3 year operational lifecycles. Coupling them into a single payload forces the system to re-validate and process the Vision every time an annual Goal changes, which violates strict Domain-Driven Design (DDD) boundaries.

## 2. Alternatives Comparison

### Alternative A: Keep `VisionMissionPayload`
- **Architecture**: Monolithic service and builder. Easy to pass around but brittle to domain-specific schema changes.
- **DDD**: **FAIL**. Couples independent lifecycles.
- **Future Registry**: **FAIL**. Forces the future registry to return a monolithic object rather than allowing discrete micro-registry queries (`getVision()`, `getMission()`).
- **Zero Regression**: **PASS**. Requires no code changes today, guaranteeing zero breakage.

### Alternative B: Split into `VisionKnowledgePayload` and `MissionKnowledgePayload`
- **Architecture**: Highly modular. The Assembler takes responsibility for fetching each domain independently.
- **DDD**: **PASS**. Perfect alignment. Each domain has its own schema, validation rules, and lifecycle.
- **Future Registry**: **PASS**. Perfectly maps to future discrete endpoint fetching.
- **Zero Regression**: **FAIL (Immediate Risk)**. Splitting the domains requires a cascading refactor of `VisionMissionService`, `VisionMissionBuilder`, `KspDocumentAssembler`, and the `KspBab2Structure` builder, introducing a high risk of regression in the rendering layer.

## 3. Enterprise Recommendation
**Alternative B** is unequivocally the preferred enterprise architecture. It is the only path that supports an authoritative, decoupled Knowledge Registry. 

However, enforcing this decomposition *right now* requires refactoring consuming code (`buildKspBab2Section`), violating the strict mandate that "Zero Regression has higher priority than semantic perfection" and that we should not perform opportunistic refactoring outside the targeted domain.

## 4. Technical Debt Registration
Because immediate decomposition introduces unacceptable regression risk across the Service, Builder, and Assembler layers, the structural split is deferred and officially registered.

**Technical Debt Registered: TD-KSP-002**
- **Title**: Decompose `VisionMissionPayload` into discrete Knowledge Domains.
- **Description**: Separate the monolithic `VisionMissionPayload` into `VisionKnowledgePayload`, `MissionKnowledgePayload`, and `GoalsKnowledgePayload`.
- **Affected Layers**: `VisionMissionService`, `VisionMissionBuilder`, `KspDocumentAssembler`, `KspBab2Structure`.
- **Resolution Strategy**: Must be executed in a dedicated refactoring sprint where BAB II rendering tests are explicitly scoped to catch mapping regressions.

No implementation will be performed during this evaluation.
