# PDF Publisher Plugin

## Purpose
Implements the first concrete Publisher Plugin for the Enterprise Publishing Foundation. It transforms agnostic `DocumentArtifact` structures into canonical PDF `PublishingResult` objects, proving the end-to-end publishing pipeline without implementing actual PDF rendering logic or relying on browser APIs.

## Architecture
The PDF Publisher operates strictly as a plugin within the Publishing Framework. It interacts neither with the Workspace nor with Knowledge Services, and it is executed solely by the stateless `PublishingEngine` via the `PublishingService`.

### Service
- **`PublishingService`**: The strict public entry point that the Workspace interacts with to dispatch jobs.

### Engine
- **`PublishingEngine`**: Executes the `PdfPublisher` statelessly.

### Registry
- **`PublishingRegistry`**: Validates the plugin capabilities and registers `PdfPublisher` dynamically.

### Plugin
- **`PdfPublisher`**: The concrete implementation of `DocumentPublisher` for PDF output.

## Input
- `DeepReadonly<DocumentArtifact<any>>`: The strictly immutable output from a Document Adapter.

## Output
- `DeepReadonly<PublishingResult>`: A canonical, immutable representation of the generated PDF job and payload URI.

## Capabilities
- `supportsPDF`: true
- `supportsDOCX`: false
- `supportsPrint`: true
- `supportsPreview`: true
- `supportsStreaming`: true

## Registration Flow
The `PdfPublisher` registers itself with the `PublishingRegistry`, providing its `PublisherMetadata`. The registry validates the metadata and capabilities before storing it (Rule 089).

## Allowed Dependencies
- `DocumentArtifact` and `DeepReadonly`
- `DocumentPublisher`, `PublishingResult`, and `PublisherMetadata` (Publishing Contracts)
- `PublishingRegistry`

## Forbidden Dependencies
- Workspace (Rule 085)
- Knowledge Services
- Knowledge Builders
- Master Data
- Browser APIs (`window`, DOM, canvas, etc.) (Rule 086)
- Direct mutation of the input `DocumentArtifact`

## Architectural Rules
- **Enterprise Rule 083**: Workspace communicates only through `PublishingService`.
- **Enterprise Rule 084**: `PublishingResult` shall be immutable.
- **Enterprise Rule 085**: Publisher Plugins shall never know Workspace.
- **Enterprise Rule 086**: Publisher Plugins shall remain platform agnostic. No browser APIs.
- **Enterprise Rule 087**: `PublishingService` shall resolve publishers through the Registry.
- **Enterprise Rule 088**: Publisher Plugins shall expose metadata (`publisherId`, `version`, `name`, `description`, `supportedMimeTypes`, `capabilities`).
- **Enterprise Rule 089**: `PublishingRegistry` shall validate plugin capabilities before registration.
