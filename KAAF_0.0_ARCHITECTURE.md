# KAAF 0.0: Knowledge Assisted Authoring Framework Architecture

## 1. Vision
Users should never start writing from a blank page. The Enterprise Knowledge Assisted Authoring Framework (KAAF) guides users through complex documentation tasks using curated, officially vetted knowledge packs, while preserving complete editorial freedom over the final output. The framework aims to eliminate "writer's block" and ensure adherence to Government Fidelity standards by offering contextual, tailored suggestions.

## 2. Architecture
The architecture is completely decoupled from the Document Builders. KAAF operates strictly in the Authoring/Workspace UI layer. It acts as an intelligent bridge between static Knowledge Packs and the User Workspace State.

Key architectural layers:
1. **Knowledge Store**: Static JSON/TypeScript knowledge packs representing official regulations and curated best practices (e.g., Kemendikdasmen 2026, Dinas Provinsi).
2. **Context Engine**: Evaluates the user's current `EnterpriseProfile` (location, school level, characteristics) to filter and rank the most applicable knowledge packs.
3. **Suggestion Assistant UI**: A reusable React component that displays recommendations and allows users to insert curated text directly into their text areas.
4. **Workspace State**: The standard enterprise state (e.g., `updateSetting`) that persists the user's accepted and modified text.
5. **Document Pipeline**: Remains completely unchanged. Builders continue to read directly from the Workspace State.

## 3. Component Diagram

```mermaid
flowchart TD
    subgraph Knowledge Base
        KP1[Knowledge Pack: KSP 2026]
        KP2[Knowledge Pack: RKAS 2026]
        KPn[Knowledge Pack: Adiwiyata]
    end

    subgraph Context Engine
        UserCtx[User Context: Location, Level, Traits]
        Filter[Contextual Filter & Ranker]
    end

    subgraph User Interface (Workspace)
        KA_UI[Knowledge Assistant Component]
        Editor[Text Editor / Input Field]
    end

    subgraph Persistence & Output
        State[Workspace State / settings]
        DocBuilder[Document Assembler]
        PDF[PDF Output]
    end

    KP1 --> Filter
    KP2 --> Filter
    UserCtx --> Filter
    Filter -->|Filtered Suggestions| KA_UI
    KA_UI -->|Insert| Editor
    Editor -->|Save| State
    State --> DocBuilder
    DocBuilder --> PDF
```

## 4. JSON Schema Proposal
Knowledge packs will follow a strict, version-controlled schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "KnowledgePackSchema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "version": { "type": "string" },
    "domain": { "type": "string", "description": "e.g., KSP, RKJM, RKT" },
    "referenceSource": { "type": "string", "description": "e.g., Panduan KOSP Kemendikdasmen 2026" },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "category": { "type": "string", "description": "e.g., Visi, Misi, Karakteristik" },
          "tags": { "type": "array", "items": { "type": "string" } },
          "recommendedText": { "type": "string" },
          "applicableContexts": {
            "type": "object",
            "properties": {
              "levels": { "type": "array", "items": { "type": "string" } },
              "locations": { "type": "array", "items": { "type": "string" } },
              "studentNeeds": { "type": "array", "items": { "type": "string" } }
            }
          }
        },
        "required": ["id", "title", "recommendedText"]
      }
    }
  }
}
```

## 5. Context Filtering Strategy
The `Context Engine` will employ a multi-factor scoring system:
1. **Hard Constraints (Must Match)**: e.g., `applicableContexts.levels` must include the school's current `schoolLevel` (e.g., "SD"). If not, the suggestion is hidden.
2. **Soft Constraints (Boost Score)**: e.g., `applicableContexts.locations` matching the school's location (e.g., "Pesisir"). Items matching more soft constraints are ranked higher.
3. **Keyword Matching**: Comparing `tags` against the user's `studentProfile.learningChallenges` or `enterpriseProfile.characteristics` to surface highly specific pedagogical strategies.

## 6. Reuse Strategy
- **Headless Hooks**: `useKnowledgeAssistant(domain, context)` will encapsulate the filtering and retrieval logic, allowing developers to build custom UIs if needed.
- **UI Components**: `<KnowledgeSuggestionPanel />` will be a standard drop-in component used in KSP, RKJM, RKT, etc. It accepts an `onInsert` callback.
- **Zero Coupling to Output**: Because the KAAF only outputs standard text strings into the user's editor, it never touches `KspMetadataAdapter`, `SchoolContextBuilder`, or `DocumentAssembler`.

## 7. Future Roadmap
- **Phase 1**: Static JSON Packs for KSP (Vision, Mission, Characteristics) mapped to basic demographics.
- **Phase 2**: LLM-Assisted Generation (sending context + knowledge pack constraints to AI for dynamic sentence tailoring).
- **Phase 3**: Extensibility for Regional APIs (fetching specific Dinas Pendidikan recommendations dynamically).
- **Phase 4**: Community/Enterprise Knowledge Sharing (schools sharing their best practice packs across the SIMURID network).
