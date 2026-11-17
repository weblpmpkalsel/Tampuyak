# Enterprise Publishing Foundation

## Purpose
Establishes a standardized, decoupled framework for transforming immutable `DocumentArtifact` instances into finalized output formats (e.g., PDF, DOCX, Print) without implementing specific output logic at the foundation level.

## Architecture
The foundation enforces strict boundaries where the presentation layers and adapters remain agnostic to publishing mechanisms. The Publishing Framework acts solely on the serialized artifact to generate output files or streams.

## Registry
- **`PublishingRegistry`**: Manages dynamic registration and discovery of publisher plugins, supporting versioning (Rule 079).

## Engine
- **`PublishingEngine`**: A stateless execution engine that coordinates a `DocumentPublisher` to process a `DocumentArtifact` (Rule 080).

## Contracts
- **`DocumentPublisher`**: Interface that all future publishers must implement.
- **`PublishingResult`**: Standardized output structure containing job and payload metadata.
- **`PublisherCapabilities`**: Mandatory capability declarations for each publisher.

## Input
- `DocumentArtifact`: The serializable, deeply immutable output from a Document Adapter (Rule 074).

## Output
- `PublishingResult`: An object containing the URI or reference to the generated format payload.

## Capabilities
- `supportsPDF`: boolean
- `supportsDOCX`: boolean
- `supportsPrint`: boolean
- `supportsPreview`: boolean
- `supportsStreaming`: boolean

## Allowed Dependencies
- `DocumentArtifact` (from Adapter Contracts)
- `DeepReadonly` utility types

## Forbidden Dependencies
- Workspace (Rule 076, 082)
- Knowledge Services
- Knowledge Builders
- Master Data
- Canonical Document mutation logic

## Future Publishers
- PDF Publisher
- DOCX Publisher
- KSP Specific Publishers

## Architectural Rules
- **Enterprise Rule 073**: Publisher Registry.
- **Enterprise Rule 074**: Publisher input only `DocumentArtifact`.
- **Enterprise Rule 075**: Publisher must never mutate `DocumentArtifact`.
- **Enterprise Rule 076**: Workspace shall never know Publishers.
- **Enterprise Rule 077**: Publisher capability declaration.
- **Enterprise Rule 078**: Publishers must never mutate `DocumentArtifact` (re-enforces 075 via strict typings).
- **Enterprise Rule 079**: Publishing Registry shall support publisher versioning.
- **Enterprise Rule 080**: Publishing Engine shall be stateless.
- **Enterprise Rule 081**: Publishers shall declare capabilities (`supportsPDF`, `supportsDOCX`, `supportsPrint`, `supportsPreview`, `supportsStreaming`).
- **Enterprise Rule 082**: Workspace shall never know Publishers. It shall communicate only with the Publishing Service.
