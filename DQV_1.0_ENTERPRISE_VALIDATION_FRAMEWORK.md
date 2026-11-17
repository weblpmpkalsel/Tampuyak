# DQV-1.0 ENTERPRISE DATA QUALITY VALIDATION FRAMEWORK

## EXECUTIVE SUMMARY
The Enterprise Data Quality Validation Framework establishes a robust, builder-agnostic verification pipeline. It guarantees that all Enterprise Knowledge payloads generated from the Workspace meet official standards before they are assembled and rendered into the KSP document. By implementing this framework, we prevent incomplete, malformed, or contradictory data from polluting Golden Government Documents.

## ARCHITECTURE PIPELINE
The validation engine sits squarely between Knowledge extraction and Document Assembly:

`Workspace -> Knowledge Adapters -> **Validation Engine** -> Quality Report -> Assembler -> Builder -> Preview -> PDF`

### Core Principles
1.  **Read-Only Inspection**: The validation engine strictly inspects the Canonical Knowledge payload (`KspMetadata`). It never mutates the underlying data.
2.  **Builder Independence**: The framework is entirely decoupled from React/UI code. It evaluates the raw structural integrity and semantic quality of the data payload.
3.  **Modular Rule Sets**: Validation rules are strictly categorized by domain (e.g., `BAB_I`, `BAB_II`, `BAB_III`), allowing modular extensibility.

## VALIDATION DOMAINS & RULES

### BAB I: School Characteristics
*   **BAB1-001 (School Characteristics Validation)**
    *   `CRITICAL`: Missing School Name.
    *   `ERROR`: Missing NPSN.

### BAB II: Strategic Direction
*   **BAB2-001 (Vision Quality)**
    *   `WARNING`: Vision is completely empty.
    *   `INFO`: Vision is too short (< 20 characters).
    *   `ERROR`: Contains generic placeholder text ("lorem ipsum" or "data belum tersedia").
*   **BAB2-002 (Mission Quality)**
    *   `WARNING`: Mission array is empty.
    *   `WARNING`: Duplicate mission statements detected.
*   **BAB2-003 (Goals Quality)**
    *   `WARNING`: Goals array is empty.

### BAB III: Curriculum Organization
*   **BAB3-001 (Extracurricular Validation)**
    *   `INFO`: Missing Extracurricular block.
    *   `WARNING`: Extracurricular program list is empty.
    *   `WARNING`: Duplicate extracurricular program names detected.
*   **BAB3-002 (Academic Calendar Validation)**
    *   `WARNING`: Missing Academic Calendar data entirely.
    *   `WARNING`: Events list is empty or contains duplicate activities.
    *   `ERROR`: Activities with missing dates detected.
*   **BAB3-003 (Learning Load Validation)**
    *   `WARNING`: Missing Learning Load data.
    *   `ERROR`: Weekly Learning Load (JP) <= 0.
    *   `ERROR`: Effective weeks <= 0.

### BAB IV: Learning Planning
*   **BAB4-001 (Learning Planning Validation)**
    *   `WARNING`: Missing Learning Planning Policy.

### BAB V: Evaluation
*   **BAB5-001 (Evaluation Validation)**
    *   `WARNING`: Missing Evaluation and Professional Development Policy.

## SEVERITY MATRIX
| Level | Behavior | Description |
| :--- | :--- | :--- |
| **CRITICAL** | Blocks Assembly (Future) | Missing absolute minimum structural data (e.g., School Name). |
| **ERROR** | Flags Document | Invalid values that violate educational standards (e.g., 0 JP). |
| **WARNING** | Flags Component | Empty arrays, missing non-critical sections, duplicated items. |
| **INFO** | Logs for Context | Sub-optimal quality (e.g., short vision statement). |

## QUALITY MATRIX
| Metric | Status | Notes |
| :--- | :--- | :--- |
| **Framework Independence** | PASS | `EnterpriseValidationService` evaluates POJOs independently of the DOM/React. |
| **Immutable Evaluation** | PASS | Rule evaluation strictly returns a `ValidationRuleResult` without mutating the input object. |
| **Domain Coverage** | PASS | Covers BAB I through BAB V. |
| **Extensibility** | PASS | The `EnterpriseValidationRule<T>` interface allows appending new rules arbitrarily. |

## FUTURE EXTENSION STRATEGY
The `EnterpriseValidationService` is designed to be injected into the preview orchestration layer. Before the `assembleKspDocument` function is invoked, the Validation Engine will process the `KspMetadata`. The resulting `ValidationSummary` can be presented to the user via the newly implemented `ValidationReport`, `ValidationBadge`, and `ValidationSummary` components. This pattern is immediately reusable for future documents such as RKJM, RKT, and RKAS by swapping out the rule sets.
