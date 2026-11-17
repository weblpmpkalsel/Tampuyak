# Template Definition Foundation

## Purpose
Template Definitions describe how Knowledge Domains are assembled into enterprise documents. The Composer consumes these Template Definitions to know how to structure the document. Builders remain entirely decoupled and never know about templates or document structures.

## Responsibilities
- **Define document sections**: Outlines the structural chapters of the document.
- **Define ordering**: Ensures sections are correctly ordered.
- **Define required/optional sections**: Specifies which Knowledge Domains are mandatory and which are optional.
- **Define dependencies**: Outlines any inter-section dependencies.
- **Generate Composition Manifest**: Evaluates available Knowledge Domains against the Template Definition to produce an assembly manifest.

## Allowed Dependencies
- Core language structures and types.

## Forbidden Dependencies
- **Master Data**: Templates are unaware of raw data structures.
- **Knowledge Services**: Templates do not interact with services.
- **Knowledge Builders**: Templates consume domains, not the builders that create them.
- **Workspace & Publishing**: Templates do not render UI or publish documents.
- **Validation**: No data validation is performed here.

## Data Flow
```text
[Knowledge Domains] + [Template Definition]
                     ↓
             TemplateProcessor
                     ↓
           CompositionManifest
                     ↓
           [Enterprise Composer]
```
