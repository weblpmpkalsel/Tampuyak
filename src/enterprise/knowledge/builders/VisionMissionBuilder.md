# VisionMissionBuilder

## Purpose
The `VisionMissionBuilder` composes the strategic knowledge domain representing the school's Vision, Mission, and Goals. It orchestrates the output from the `VisionMissionService` into a Canonical Knowledge Object suitable for downstream consumption by the Enterprise Composer.

## Input
- `VisionMissionBuilderInput`: Receives the already-processed output (`VisionMissionServiceResult`) from the `VisionMissionService`.

## Output
- `CanonicalKnowledgeObject<VisionMissionKnowledge>`: A strictly domain-oriented payload wrapping the strategic knowledge.

## Responsibilities
- Request canonical strategic knowledge from `VisionMissionService` (via its output).
- Assemble `VisionMissionKnowledge`.
- Return a standard `CanonicalKnowledgeObject`.
- Preserve Knowledge Sources exactly as received (pass-through).
- Act as a pure orchestrator (stateless, pure function).

## Allowed Dependencies
- `VisionMissionService`
- Enterprise Knowledge Contracts (`CanonicalKnowledgeObject`, `KnowledgeSource`)

## Forbidden Dependencies
- **Master Data**: Builders must never access Master Data directly.
- **Validation Logic**: Validation is the responsibility of Knowledge Services.
- **Normalization Logic**: Data cleaning is performed at the service level.
- **Workspace & Publishing**: UI components and document publishing engines must not be referenced here.
- **Template Processor / Document Adapters**: Builders are agnostic to templates.
- **AI Narrative / Generation**: Builders assemble structured data; they do not generate natural language text.

## Dependency Diagram
```text
[VisionMissionService]
            ↓
  VisionMissionBuilderInput
            ↓
  VisionMissionBuilder
            ↓
CanonicalKnowledgeObject<VisionMissionKnowledge>
            ↓
  [Enterprise Composer]
```

## Consumers
- **Enterprise Composer**: Consumes the output to map it into Document Models.

## Future Extensions
- If external strategic metrics are introduced, the Builder will orchestrate the new Service and combine its output here.
- The Builder payload structure can be extended if the strategic context is broadened, but it must always remain domain-oriented.

## Architectural Rules
- **Enterprise Rule 019**: Builder only orchestrates.
- **Enterprise Rule 020**: Builder must not know document chapters. Output must be `VisionMissionKnowledge`.
- **Enterprise Rule 021**: Builder must not know downstream consumers.
- **Enterprise Rule 026**: Builder outputs Knowledge only. Composer produces Canonical Document Structure.
- **Enterprise Rule 029**: Builders may perform structural mapping only. Semantic transformation is forbidden.
