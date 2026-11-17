# KSP Adapter

## Purpose
Provides the first concrete enterprise adapter plugin to translate agnostic `CanonicalDocument` structures into KSP-specific representations, preparing the document for consumers without coupling to rendering or presentation layers.

## Responsibilities
- Validates and adapts the incoming Canonical Document for KSP workflows.
- Preserves canonical identifiers and document order.
- Interfaces with the Adapter Registry for dynamic discovery.

## Input
`CanonicalDocument`

## Output
`DocumentArtifact<CanonicalDocument>`

## Capabilities
- `supportsPrint`: true
- `supportsPDF`: true
- `supportsDOCX`: true
- `supportsWorkspace`: true
- `supportsAnnotations`: true

## Registration
Registered dynamically via the `AdapterRegistry`. Do not instantiate `KspAdapter` directly.

## Allowed Dependencies
- Enterprise Adapter Contracts
- Enterprise Adapter Engine
- Canonical Document Types

## Forbidden Dependencies
- Knowledge Services
- Knowledge Builders
- Workspace
- Publishing
- Master Data
- Presentation Outputs (HTML, CSS, PDF, DOCX)

## Future Consumers
- KSP Workspace Presenter
- KSP PDF Generator
- KSP Document Exporter

## Architectural Rules
- **Enterprise Rule 057**: Register through Adapter Registry. Do not instantiate adapters directly.
- **Enterprise Rule 058**: Return canonical `DocumentArtifact`. Do not create KSP-specific artifact contracts.
- **Enterprise Rule 059**: Declare adapter capabilities.
- **Enterprise Rule 060**: No Workspace coupling.
- **Enterprise Rule 061**: Adapters must never generate HTML, PDF, DOCX, or presentation output.
- **Enterprise Rule 062**: Adapters must preserve the document order established by the Canonical Document.
- **Enterprise Rule 063**: Every adapter must declare its capabilities (`supportsPrint`, `supportsPDF`, `supportsDOCX`, `supportsWorkspace`, `supportsAnnotations`).
