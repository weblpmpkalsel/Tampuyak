# Enterprise Validation Foundation

## Purpose
The Enterprise Validation Foundation provides the shared validation contracts used by every Enterprise Knowledge Service. This ensures a consistent structure for reporting validation issues, severity levels, and processing metadata across the entire platform.

## Responsibilities
- Define canonical validation statuses (`PASS`, `WARNING`, `ERROR`).
- Define severity levels for individual issues (`INFO`, `WARNING`, `ERROR`, `CRITICAL`).
- Standardize the `ValidationResult` and `ValidationIssue` interfaces.
- Standardize `ProcessingMetadata` for tracking service processing events.

## Allowed Dependencies
- None. These are foundational type definitions for the knowledge service layer.

## Forbidden Dependencies
- Master Data Models
- Knowledge Builders
- Document Adapters
- Workspace Components
- Publishing Engines

## Consumers
- All Knowledge Services (e.g., `SchoolProfileService`, `SchoolContextService`).
- Validation Engine (for higher-level document compliance).
