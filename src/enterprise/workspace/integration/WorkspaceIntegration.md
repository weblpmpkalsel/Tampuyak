# Enterprise Workspace Integration

## Purpose
Establishes the strict architectural boundary between the Workspace presentation layer and the underlying document generation engines. The Workspace is responsible only for rendering, navigating, and inspecting documents, entirely decoupled from knowledge retrieval, document composition, and master data.

## Responsibilities
- **Renderer**: Renders the document purely based on the provided artifact.
- **Navigator**: Handles user navigation through the document via stable IDs.
- **Inspector**: Provides a developer mode to inspect the artifact structure and adapter capabilities.
- **Presentation Layer**: Manages ephemeral presentation state without mutating the core document structure.

## Input
- `DocumentArtifact`: The serializable, output JSON structure from a Document Adapter.

## Output
- Ephemeral presentation state and UI rendering (Conceptually, as Workspace is a consumer).

## Allowed Dependencies
- `AdapterRegistry`: To discover and validate adapter capabilities.
- `DocumentArtifact`: The universal input format.
- `AdapterCapabilities`: For feature toggles and UI rendering logic.

## Forbidden Dependencies
- Knowledge Services
- Knowledge Builders
- Master Data
- Enterprise Composer
- Direct Canonical Document mutation logic
- Any format-specific plugins directly (must use Adapter Registry)

## Architectural Rules
- **Enterprise Rule 064**: Use Adapter Registry only.
- **Enterprise Rule 065**: `DocumentArtifact` is deeply immutable.
- **Enterprise Rule 066**: Registry supports future versioned adapters.
- **Enterprise Rule 067**: Capability discovery must come through adapters.
- **Enterprise Rule 068**: Workspace must never mutate `DocumentArtifact`. Presentation state is strictly ephemeral.
- **Enterprise Rule 069**: Navigation must rely on stable IDs (`sectionId`, `blockId`). Never array indices.
- **Enterprise Rule 070**: Provide Developer Inspector Mode to inspect artifacts and capabilities.
- **Enterprise Rule 071**: Capability discovery must come from Adapter capabilities.
- **Enterprise Rule 072**: Workspace shall remain document agnostic. No KSP-specific logic.
