# EvaluationBuilder

## Purpose
The `EvaluationBuilder` composes the canonical evaluation knowledge domain. It orchestrates the output from the `EvaluationService` into a Canonical Knowledge Object suitable for downstream consumption by the Enterprise Composer.

## Input
- `EvaluationBuilderInput`: Receives the already-processed output (`EvaluationServiceResult`) from the `EvaluationService`.

## Output
- `CanonicalKnowledgeObject<EvaluationKnowledge>`: A strictly domain-oriented payload wrapping the evaluation knowledge.

## Responsibilities
- Receive canonical service output from `EvaluationService`.
- Perform structural mapping only.
- Preserve Knowledge Sources exactly as received (pass-through).
- Return an immutable standard `CanonicalKnowledgeObject`.
- Act as a pure orchestrator (stateless, pure function).

## Allowed Dependencies
- `EvaluationService`
- Enterprise Knowledge Contracts (`CanonicalKnowledgeObject`)

## Forbidden Dependencies
- **Master Data**: Builders must never access Master Data directly.
- **Validation Logic**: Validation is the responsibility of Knowledge Services.
- **Normalization Logic**: Data cleaning is performed at the service level.
- **Business Rules**: No business logic should reside in the builder.
- **Workspace & Publishing**: UI components and document publishing engines must not be referenced here.
- **Template Processor / Document Adapters / Enterprise Composer**: Builders are agnostic to templates, chapters, and consumers.
- **AI Narrative / Generation**: Builders assemble structured data; they do not generate natural language text.
- **Other Builders**: Builders must remain isolated and not depend on one another.

## Consumers
- **Enterprise Composer**: Consumes the output to map it into Document Models.

## Dependency Diagram
```text
[EvaluationService]
            ↓
 EvaluationBuilderInput
            ↓
 EvaluationBuilder
            ↓
CanonicalKnowledgeObject<EvaluationKnowledge>
            ↓
  [Enterprise Composer]
```

## Design Pattern
- **Pass-through Builder**: The Builder strictly acts as a pass-through layer for the canonical service output, preserving all identifiers, sources, validation, and processing metadata without semantic mutation. Builders may only replace the mapped domain payload.

## Future Extensions / Future Compatibility
- If additional evaluation dimensions are required, the payload structure may be extended, provided it maintains strict domain orientation.
- Adapting to future versions of `EvaluationService` should only require minor mapping adjustments without affecting downstream consumers.

## Architectural Rules / Enterprise Rules Applied
- **Enterprise Rule 019**: Builder only orchestrates.
- **Enterprise Rule 020**: Builder must not know document chapters. Output must be `EvaluationKnowledge`.
- **Enterprise Rule 021**: Builder must not know downstream consumers.
- **Enterprise Rule 029**: Builders may perform structural mapping only. Semantic transformation is forbidden.
- **Enterprise Rule 030**: Builders must not access Master Data directly.
- **Enterprise Rule 031**: Builders must not be aware of document publishing, UI, or AI narrative.
- **Enterprise Rule 032**: Builders must never generate new identifiers. Identifiers originate only from Services or Enterprise Contracts.
- **Enterprise Rule 033**: Output must be immutable.
- **Enterprise Rule 034**: Pure orchestration. Stateless. No business rules.
- **Enterprise Rule 037**: Builder isolation must be maintained.
- **Enterprise Rule 038**: Builders must not be aware of other builders.
- **Enterprise Rule 039**: Canonical Pass-Through. Builders must preserve the `CanonicalKnowledgeObject` produced by Services. Builders may only replace the mapped domain payload. Metadata, Identifiers, Knowledge Sources, Validation, and Processing Metadata must remain unchanged.
