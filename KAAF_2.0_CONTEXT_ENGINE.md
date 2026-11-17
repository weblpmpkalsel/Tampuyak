# KAAF 2.0: Knowledge Context Engine

## 1. Vision & Objective
The Knowledge Context Engine provides a highly deterministic, rules-based recommendation system to serve the most relevant Knowledge Items to the user based on their specific contextual profile (e.g., school type, location, learning phase, etc.). This engine contains absolutely no AI, ensuring 100% predictable ranking and suggestion curation that strictly adheres to Government Fidelity and enterprise guidelines.

## 2. Architecture
The Context Engine is located in `src/enterprise/knowledge/engine/` and acts as a pure functional evaluator over arrays of `KnowledgeItem`. It interfaces seamlessly with the `KnowledgePackService`.

```
src/enterprise/knowledge/engine/
├── KnowledgeScore.ts          # Interface defining the breakdown of matches, misses, and base score
├── KnowledgeRanking.ts        # Maps a KnowledgeItem to its KnowledgeScore for sorting
├── KnowledgeMatcher.ts        # The core rule engine that evaluates a single item against the EvaluationContext
├── KnowledgeContextEngine.ts  # Orchestrator that applies the Matcher across arrays and ranks the results
└── index.ts                   # Public API barrel file
```

## 3. Evaluation Context Constraints
The matching engine evaluates the following contexts:
*   **Education Level** (e.g., SD, SMP, SMA)
*   **School Type** (e.g., Umum, Kejuruan, Luar Biasa)
*   **Location** (e.g., Perkotaan, Pedesaan, Pesisir)
*   **Province** / Region
*   **Learning Phase** (e.g., Fase A, Fase B)
*   **Tags** (Keyword intersections)
*   **Government Version** (e.g., 2026 Curriculum)
*   **School Characteristics** (General traits matching)
*   **Student Characteristics** (Demographics and learning needs)

## 4. Matching Logic (Deterministic Scoring)
The `KnowledgeMatcher` calculates relevance by separating requirements into two tiers:

**1. Hard Constraints (Must Pass):**
If a Knowledge Item specifies `educationLevel`, `phase`, or `governmentVersion`, the `EvaluationContext` *must* match. Failure to match a declared hard constraint immediately flags the item as `hardConstraintFailed: true`, meaning it will be completely excluded from the ranking regardless of its score.

**2. Soft Constraints (Score Boosters):**
*   **Location / Type / Region**: Exact matches yield score boosts (e.g., +20 for location, +30 for region).
*   **Tags**: Cross-referenced against the context's tags, school characteristics, and student characteristics. Each intersecting tag adds a multiplier boost (e.g., +10 per matching tag).
*   **Priority**: A baseline heuristic (`item.priority`) breaks ties and enforces official recommendations over fallback best practices.

## 5. Engine Pipeline
The `KnowledgeContextEngine` exposes three main capabilities:
1.  **`match(items, context)`**: Passes all items through the `KnowledgeMatcher` to generate an array of `KnowledgeRanking` details (scores, matches, misses).
2.  **`rank(rankings)`**: Filters out any item that failed a hard constraint and sorts the remainder in descending order by `score`. Tie-breakers default to the item's `priority`.
3.  **`topSuggestions(items, context, limit)`**: Combines `match()` and `rank()` into a single utility method, returning the top `N` `KnowledgeItem` objects perfectly suited to the active context.

## 6. Integration
The `KnowledgePackService` has been upgraded to instantiate the `KnowledgeContextEngine`. When a module requests data via `match(category, context)`, the Service retrieves all items in the requested category from the `KnowledgePackRepository` and delegates the array to the `KnowledgeContextEngine` to receive the top recommendations.

## 7. GO / NO GO
**GO**
The Enterprise Knowledge Context Engine is complete, strictly typed, fully deterministic, and successfully isolated from all presentation and AI logic. Any UI component can now easily request curated text arrays based purely on a JSON contextual payload.
