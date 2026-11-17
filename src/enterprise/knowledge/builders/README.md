# Enterprise Knowledge Builders

## Purpose
Knowledge Builders compose and assemble foundational knowledge from various Enterprise Knowledge Services into overarching Knowledge Domains. They act as pure orchestrators of knowledge.

## Responsibilities
- Request knowledge from services (by accepting their results).
- Combine knowledge into structured payloads.
- Assemble higher-level domain payloads (e.g., `SchoolContextKnowledgePayload`).
- Return standard `CanonicalKnowledgeObject` structures.
- Act purely as orchestrators (stateless, pure functions).

### SchoolContextBuilder
The `SchoolContextBuilder` composes the School Context Knowledge Domain. It accepts results from `SchoolProfileService` and `SchoolContextService` and returns a consolidated `CanonicalKnowledgeObject<SchoolContextKnowledgePayload>`.

## Allowed Dependencies
- **Enterprise Knowledge Services**: `SchoolProfileService`, `SchoolContextService`.
- **Enterprise Knowledge Contracts**: `CanonicalKnowledgeObject`, `KnowledgeSource`.

## Forbidden Dependencies
- **Master Data**: Builders must never access Master Data directly. They must rely on Knowledge Services to provide validated and normalized data.
- **Workspace & Publishing**: UI components and document rendering engines must not be referenced here.
- **Adapters**: Adapters depend on builders, not the other way around.
- **AI Narrative / Generation**: Builders assemble structured data; they do not generate natural language text.
- **Document Chapter Numbers**: Builders produce Knowledge Domains, they are never coupled to document chapter numbers (e.g., BAB I).

## Consumers
- **Enterprise Composer / Document Adapters**: They consume Builder outputs to map them into Document Models or specific chapters.

## Dependency Diagram

```text
[Knowledge Services]
 (SchoolProfileService, SchoolContextService)
            ↓
   SchoolContextBuilder
            ↓
 CanonicalKnowledgeObject<SchoolContextKnowledgePayload>
     + KnowledgeSources
            ↓
[Enterprise Composer / Document Adapters]
```
