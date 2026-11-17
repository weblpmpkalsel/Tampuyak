# POLICY VERSIONING REPORT

## Versioning Mechanism
The NEKB introduces a strict versioning framework across all knowledge objects.

## Key Metadata Components
Every module within the NEKB strictly adheres to the `PolicyMetadata` interface, exposing:
- **Policy Version**: Currently set to the `2025.1` baseline.
- **Effective Date**: Ensures synchronization across modules.
- **Source Regulation**: e.g., "Panduan Pengembangan KSP Revisi 2025".
- **Issuing Institution**: "Kemendikdasmen", "BSKAP Kemendikdasmen".
- **Revision History**: Logs of changes to track policy evolution.
- **Status**: Defines whether the module is `ACTIVE`, `DEPRECATED`, or `DRAFT`.

## Forward Compatibility
Tampuyak OS can smoothly migrate from Baseline 2025 to Baseline 2026 simply by updating the versions and statuses in the NEKB, automatically propagating the change across all narrative generating engines without modifying the application logic.
