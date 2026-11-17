# ENTERPRISE DATA PROJECTION MAP
## ACADEMIC SUPERVISION MODULE

### 1. THE READ-ONLY PROJECTION PRINCIPLE
To maintain modularity and avoid tight coupling, the Academic Supervision module does not manage enterprise master data. Instead, it relies on **Read-Only Projections** from the core Tampuyak OS modules. The Supervision module must NEVER mutate these projections.

### 2. PROJECTION MAPPING

| Source Module | Projected Entity | Supervision Usage Context | Strict Rule |
|---|---|---|---|
| **User/Auth Service** | `Teacher (User)` | Selected as the "Subject" of an Observation during the Teacher Assignment phase. | Read-Only. Cannot create or edit users. |
| **User/Auth Service** | `Assessor/Headmaster` | Recorded as the "Observer" in observation and coaching logs. | Read-Only. |
| **Organization Service** | `School Profile` | Used for generating PDF reports, headers, and contextual metadata. | Read-Only. |
| **Academic Calendar** | `Academic Year & Semester` | Used to scope the `SupervisionPlan` and enforce scheduling boundaries. | Read-Only. Plan cannot exist outside calendar boundaries. |
| **Strategic Planning** | `RKT (Annual Plan)` | References strategic objectives to determine the focus of the Supervision Plan. | Read-Only. |
| **Curriculum Engine** | `KSP Paradigms` | Baseline pedagogical standards used to filter or select relevant `Instruments`. | Read-Only. |

### 3. IMPLEMENTATION STRATEGY
During the DI refactoring, the `SupervisionApplicationService` will accept interfaces like `IUserService` or `IOrganizationService`. The real implementation of these interfaces will act as Adapters, fetching data from Tampuyak's global services and mapping them into isolated Snapshot objects (e.g., `TeacherSnapshot`) used entirely within the Supervision domain.
