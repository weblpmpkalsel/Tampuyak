# Enterprise Knowledge Service Layer

## Purpose
The Enterprise Knowledge Service Layer abstracts direct database and Master Data access from the rest of the application. Services provide validated, normalized, and strictly versioned Knowledge Objects to be consumed by Knowledge Builders.

## Responsibilities
- Load canonical Master Data.
- Validate required fields and constraints.
- Normalize canonical values.
- Provide immutable canonical output.
- Inject processing metadata (timestamps, service versions, source versions).

## Allowed Dependencies
- **Master Data Models**: Services may import models from `enterprise/master-data/`.

## Forbidden Dependencies
- **EnterpriseMasterDataRegistry**: Services must consume only the Master Data object directly, avoiding registry dependencies.
- **Knowledge Builders**: Services must never depend on Builders (this reverses the dependency flow).
- **Document Adapters**
- **Workspace Components** (UI)
- **Publishing Engines**
- **Document Formats**

## Consumers
- **Knowledge Builders**: Builders (e.g., `SchoolContextBuilder`) consume these services to assemble larger Knowledge Objects for Document Adapters.

## Dependency Flow Diagram

```text
Master Data Models
       ↓
SchoolProfileService
       ↓
Canonical Output
       ↓
Knowledge Builders
```

## Examples
- **SchoolProfileService**: Validates the presence of `NPSN`, `schoolName`, and `principal`. Normalizes whitespace. Outputs a `CanonicalSchoolProfileOutput` with processing metadata.

## Future Extensions
- `SchoolContextService`: Aggregates profile, facilities, community, and organization.
- `VisionMissionService`: Abstract access to Strategic Policy (Vision, Mission, Goals).
- `LearningOrganizationService`
- `PolicyService`

## School Context Service

The `SchoolContextService` provides validated and normalized contextual knowledge about the school environment. It consumes canonical Master Data and produces an immutable `CanonicalKnowledgeObject<SchoolContextPayload>`.

### Data Flow & Responsibilities
- **Aggregate**: Combines Profile, Community, Facilities, Organization, Governance, and Academic Year.
- **Validate**: Checks contextual completeness without mutating data.
- **Normalize**: Ensures data consistency while keeping master data structures intact.
- **Traceability**: Tracks originating Master Data versions.

### Complete Dependency Diagram

```text
[Master Data Models]
 (Profile, Community, Facilities, Organization, Governance, AcademicYear)
            ↓
    SchoolContextService
            ↓
 CanonicalKnowledgeObject<SchoolContextPayload>
 + ValidationResult
 + ProcessingMetadata
 + SourceVersions
            ↓
   [Knowledge Builders]
```

### Forbidden Dependencies
This service does not generate documents, perform AI narrative generation, or integrate with Workspace/Publishing layers.

## Vision Mission Service

The `VisionMissionService` provides the canonical strategic direction of the school. It processes structured strategic knowledge from Master Data or Policy Centers and prepares an immutable strategic payload.

### Data Flow & Responsibilities
- **Normalize**: Performs technical cleanup (e.g., whitespace trimming) on strategic statements without semantic alteration.
- **Validate**: Enforces structural integrity of Vision, Mission, and Goals.
- **Provide**: Returns an immutable `CanonicalKnowledgeObject<VisionMissionPayload>`.
- **Traceability**: Classifies sources accurately (e.g., `MASTER_DATA`, `POLICY_CENTER`, `MANUAL_ENTRY`).

### Complete Dependency Diagram

```text
[Master Data Models]          [Strategic Policy]
 (Profile, Governance,         (Vision, Mission,
  AcademicYear)                     Goals)
        \                             /
         \                           /
          \                         /
           ↓                       ↓
             VisionMissionService
                       ↓
   CanonicalKnowledgeObject<VisionMissionPayload>
             + ValidationResult
             + ProcessingMetadata
             + SourceVersions
                       ↓
              [Knowledge Builders]
```

### Forbidden Dependencies
This service is strictly foundational. It does not generate narratives, does not create documents, and is unaware of any overarching document models (like KSP).

## Learning Organization Service

The `LearningOrganizationService` provides the canonical organizational structure of learning within the school. It represents the organization of learning, abstracting away purely HR or administrative structures, and outputs an immutable `CanonicalKnowledgeObject<LearningOrganizationPayload>`.

### Data Flow & Responsibilities
- **Aggregate**: Combines elements from Organization (curriculum teams), Facilities (learning spaces), Academic Year (time allocation), and Profile (education stage).
- **Normalize**: Extracts and normalizes purely learning-focused structures while keeping raw data structures intact.
- **Validate**: Checks structural completeness of the learning organization (0-100 score based on completeness) without qualitative analysis.
- **Traceability**: Classifies source information correctly (e.g., `MASTER_DATA`).

### Complete Dependency Diagram

```text
[Master Data Models]
 (Profile, Organization, AcademicYear, Facilities, Governance)
            \
             \
              \
               ↓
     LearningOrganizationService
               ↓
   CanonicalKnowledgeObject<LearningOrganizationPayload>
     + ValidationResult
     + ProcessingMetadata
     + SourceVersions
     + CompletenessScore
               ↓
      [Knowledge Builders]
```

### Forbidden Dependencies
This service does not generate documents, perform qualitative evaluation or AI narrative generation, and does not integrate with Workspace/Publishing layers or Document Models.
