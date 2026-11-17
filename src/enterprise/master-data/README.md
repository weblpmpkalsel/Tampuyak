# Enterprise Master Data Foundation

## Purpose
The Enterprise Master Data Foundation serves as the canonical source of truth for all Enterprise Domains (Planning, Curriculum, Monitoring, Quality, etc.). It abstracts fundamental school information away from document generation, workspace interactions, and publishing mechanisms.

## Ownership
Enterprise Administration

## Dependency Rules

### Allowed Dependencies
- None. Master Data sits at the absolute foundation of the Enterprise Architecture. It depends on nothing.

### Forbidden Dependencies
Master Data must **NEVER** import or depend on:
- Knowledge Services
- Knowledge Builders
- Document Adapters
- Workspace Components
- Publishing Engines
- AI Modules
- Validation Engines (complex cross-entity logic)
- UI/Rendering libraries (React, HTML, JSX, CSS)
- Document Formats (PDF, DOCX)

## Consumers
- Knowledge Services (e.g., `SchoolProfileService`, `SchoolContextService`, `VisionMissionService`)

## Future Services
These services will consume the Master Data objects defined here:
- `SchoolProfileService`
- `OrganizationService`
- `FacilitiesService`
- `CommunityService`
- `AcademicCalendarService`
- `PolicyService`

## Lifecycle
All Master Data definitions and catalog entries follow the strict Enterprise Versioning Lifecycle:
Draft -> Reviewed -> Approved -> Frozen

## Examples
- **School Profile**: NPSN, NSS, Address, Principal.
- **Academic Year**: Current Year, Semester, Effective Weeks.

## Future Extensions
- Policy Registry (Moved to Enterprise Policy Center)
- Advanced Governance structures (e.g., Multi-school foundation hierarchy mapping)
- Integration metadata for Dapodik (Supported ONLY as an optional import plugin, NEVER as a mandatory dependency)
