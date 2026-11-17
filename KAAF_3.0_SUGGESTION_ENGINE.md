# KAAF 3.0: Enterprise Suggestion Engine

## 1. Architecture
The Enterprise Suggestion Engine is the third layer of the KAAF architecture. It sits above the Context Engine and serves as the primary API for any future Workspace UI. The engine provides curated writing recommendations based on contextual relevance, transforming raw `KnowledgeItem` data into ready-to-use `SuggestionResult` objects.

The Suggestion Engine strictly enforces deterministic rules, meaning recommendations are consistent given the same input context. There is no AI text synthesis, no random ordering, and it remains completely decoupled from Document Builders.

## 2. Component Diagram
```mermaid
flowchart TD
    subgraph KAAF Layer 1: Knowledge Pack Foundation
        Repo[KnowledgePackRepository]
    end

    subgraph KAAF Layer 2: Knowledge Context Engine
        Matcher[KnowledgeMatcher]
        CEngine[KnowledgeContextEngine]
    end

    subgraph KAAF Layer 3: Enterprise Suggestion Engine
        SService[SuggestionService]
        SEngine[SuggestionEngine]
        Strategy[SuggestionStrategy]
    end

    subgraph Future: Workspace UI
        Editor[Document Editor]
    end

    Repo --> SService
    SService --> SEngine
    SEngine --> CEngine
    CEngine --> Matcher
    CEngine --> Strategy
    Strategy --> SEngine
    SEngine -->|SuggestionResult[]| SService
    SService -->|API| Editor
```

## 3. Data Flow
1. The future UI calls `SuggestionService` with a `SuggestionRequest` containing the desired `category`, `context`, and optional filters.
2. `SuggestionService` fetches raw `KnowledgeItem` arrays from the `KnowledgePackRepository`.
3. `SuggestionEngine` passes these items to the `KnowledgeContextEngine` for evaluation and ranking.
4. Once ranked, the `SuggestionEngine` applies the active `SuggestionStrategy`.
5. The `SuggestionStrategy` filters out items failing strict requirements (like Source filters) and maps the internal `KnowledgeRanking` object into a clean `SuggestionResult` for the frontend.

## 4. API Design
The `SuggestionService` exposes multiple methods for varying UI needs:
*   **`getSuggestions(request, limit)`**: Core method to retrieve `N` suggestions based on the provided context.
*   **`getTopSuggestions(request)`**: Returns only the top 3 highest-confidence suggestions.
*   **`getCategorySuggestions(category, request)`**: Quickly queries an entire category without redefining the context structure.
*   **`getAlternativeSuggestions(request, currentSuggestionId)`**: Retrieves suggestions excluding the currently viewed/selected item, perfect for a "Show me something else" button.
*   **`getRelatedSuggestions(request, tags)`**: Temporarily injects additional tags into the context to broaden the search, useful for "Similar to this" features.

## 5. Extension Strategy
The engine utilizes a Strategy Pattern (`SuggestionStrategy`). The `DefaultSuggestionStrategy` handles standard transformation and filtering. If an enterprise requires custom summarization logic, strict priority filtering, or alternative data mapping in the future, a new strategy can be injected into the `SuggestionEngine` without modifying the core context evaluation logic.

## 6. Regression Verification
- Developed purely within `src/enterprise/knowledge/suggestion/`.
- No UI components or Document Assemblers were modified.
- Successfully imported dependencies from KAAF 1.0 (Packs) and KAAF 2.0 (Context Engine).
- Linting and build processes passed.

## 7. GO / NO GO
**GO**
The Enterprise Suggestion Engine is complete and successfully bridges the gap between the static Knowledge Pack Foundation and future interactive Workspace components. It provides a robust, predictable API for retrieving contextual writing recommendations.
