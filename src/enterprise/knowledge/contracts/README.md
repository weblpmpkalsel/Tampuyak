# Enterprise Knowledge Contracts

## Purpose
The Enterprise Knowledge Contracts define the canonical structures used by every Knowledge Builder across the platform. By standardizing the output of all Builders into Canonical Knowledge Objects, we ensure that Adapters can reliably map knowledge into the Canonical Document Model without dealing with inconsistent data shapes.

## Responsibilities
- Standardize the `CanonicalKnowledgeObject` structure.
- Define `KnowledgeLifecycle` (GENERATED, VALIDATED, APPROVED, FROZEN).
- Standardize `KnowledgeSource` tracking for auditing data provenance (Master Data vs AI vs Manual).
- Provide `KnowledgeConfidence` metrics, crucial for AI-generated insights.
- Encapsulate all of the above in `KnowledgeMetadata`.

## Allowed Dependencies
- None. These are foundational type definitions for the knowledge layer.

## Forbidden Dependencies
- Master Data Models
- Knowledge Services
- Knowledge Builders
- Document Adapters
- Workspace Components
- Publishing Engines

## Consumers
- All Knowledge Builders (e.g., `SchoolContextBuilder`, `VisionMissionBuilder`).
- Document Adapters (consume these objects to produce Document Models).
