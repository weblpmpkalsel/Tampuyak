# EvaluationService

## Purpose
The `EvaluationService` provides canonical evaluation knowledge. It abstracts the sources of evaluation policies and mechanisms, ensuring that the rest of the application consumes a validated, normalized, and immutable `CanonicalKnowledgeObject<EvaluationPayload>`.

## Responsibilities
- Focus strictly on the Evaluation domain (excluding Professional Development).
- Normalize evaluation policy inputs through technical cleanup.
- Validate structural completeness of the evaluation definition.
- Calculate a structural completeness score without qualitative assessment.
- Output an immutable `CanonicalKnowledgeObject<EvaluationPayload>`.
- Inject processing metadata, validation results, and traceability information.

## Input
- `EvaluationInput`: Accepts canonical Master Data (e.g., `SchoolOrganization`, `AcademicYear`) and `EvaluationPolicyInput` (a temporary upstream contract for evaluation structures).

## Output
- `EvaluationServiceResult`: Contains the `CanonicalKnowledgeObject<EvaluationPayload>`, validation results, a completeness score, and processing metadata.

## Allowed Dependencies
- Enterprise Master Data (`SchoolOrganization`, `AcademicYear`)
- Enterprise Knowledge Contracts (`CanonicalKnowledgeObject`, `ValidationResult`, `ProcessingMetadata`)
- Local temporary upstream contracts (`EvaluationPolicyInput`)

## Forbidden Dependencies
- **Knowledge Builders**: Services must never depend on Builders (this reverses the dependency flow).
- **Document Adapters / Enterprise Composer**
- **Workspace Components** (UI)
- **Publishing Engines**
- **Document Formats** (PDF, DOCX)
- **Semantic Enrichment**: No AI narration, generation, or qualitative data mutation.

## Normalization Rules
- Technical cleanup only (e.g., whitespace trimming).
- Empty or whitespace-only array elements are filtered out.
- Original inputs are not mutated.

## Validation Rules
- Checks for the presence of `evaluationMechanisms`, `schedule`, and `responsibleParties`.
- Calculates a structural completeness score (0-100) based purely on the presence of these fields, representing structural completeness, not qualitative value.

## Dependency Diagram
```text
[Master Data Models]          [Evaluation Policy Input]
(Organization,                        (Temporary)
 AcademicYear)
        \                             /
         \                           /
          \                         /
           ↓                       ↓
             EvaluationService
                       ↓
   CanonicalKnowledgeObject<EvaluationPayload>
             + ValidationResult
             + ProcessingMetadata
             + SourceVersions
             + CompletenessScore
                       ↓
              [Knowledge Builders]
```

## Future Upstream Sources
- `EvaluationPolicyInput` is currently a temporary upstream contract. In future sprints, this will be replaced and fed by a canonical `PolicyService`.
- Professional Development will be handled by a completely separate future service.

## Architectural Rules
- **Enterprise Rule 036**: Services may perform technical normalization only. Semantic enrichment is forbidden.
- Source Classifications must adhere to standardized values: `MASTER_DATA`, `POLICY_CENTER`, `MANUAL_ENTRY`.
