# Enterprise Canonical Document Model

## Purpose
The Enterprise Canonical Document Model provides a single, universal, document-agnostic representation for all enterprise documents. It strictly decouples document structure and semantic content from presentation and rendering (such as HTML, PDF, or DOCX).

## Input and Output
- **Input**: The model is populated based on the output of the Composition Manifest (composed domains mapped to sections).
- **Output**: Generates a standard `CanonicalDocument` containing the entire text, structural layout, and metadata, serving as the single source of truth for presentation rendering.

## Hierarchy
The model enforces a strict structural hierarchy:
`CanonicalDocument` -> `Section` -> `Block` -> `Node`

## Block Types Supported
- `Heading`
- `Paragraph`
- `Table`
- `List`
- `Image`
- `Attachment`
- `Container`

## Architectural Rules Enforced

- **Enterprise Rule 044**: The model must remain document agnostic. No document-specific structures (e.g., no "SchoolProfileDocument" or "EvaluationReport", only generic `CanonicalDocument`).
- **Enterprise Rule 045**: The structure captures intent, flow, and grouping, not rendering logic.
- **Enterprise Rule 046**: Input must be derived strictly from the Enterprise Composition process.
- **Enterprise Rule 047**: Output serves as the single generic source of truth for all downstream renderers.
- **Enterprise Rule 048**: No presentation attributes. The model must not contain HTML, CSS, Tailwind classes, PDF properties, print layouts, color codes, or font sizes.
- **Enterprise Rule 049**: Every component in the hierarchy (Document, Section, Block, Node) shall have a stable, unique identifier (`id`).
- **Enterprise Rule 050**: The Canonical Document is deeply immutable. Editing and state mutations belong exclusively to the Workspace Presentation Override Layer. The architecture strictly forbids modifying the instantiated canonical model directly.

## Design Pattern
The model is implemented using TypeScript discriminated unions (`DocumentBlock`, `DocumentNode`) heavily employing `readonly` modifiers to satisfy Rule 050 (immutability) natively at compile-time.
