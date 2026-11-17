# RC-3.1 ENTERPRISE MIRROR INSPECTOR

## EXECUTIVE SUMMARY
This document outlines the implementation of the Enterprise Mirror Inspector. It is a strictly read-only administrative interface designed to safely evaluate data synchronization between Master Data and Workspace Data without performing any writes, merges, or auto-fixes. This ensures complete data safety while providing visibility into the migration status.

## ARCHITECTURE & DISPLAY
The `EnterpriseMirrorInspector` component provides a dashboard-style summary:

1.  **High-Level Metrics**:
    *   **Total Domains**: Total number of domains monitored by the Mirror Service.
    *   **Synchronized**: Count of domains completely matching.
    *   **Conflicted**: Count of domains where Master and Workspace diverge.

2.  **Domain Breakdown**:
    For each domain tracked by the `EnterpriseMirrorService`, the inspector displays:
    *   **Domain Name** (e.g., School Identity, Students)
    *   **Status Badge**: `IDENTICAL` (emerald) or `CONFLICT` (amber).
    
3.  **Conflict Detail Viewer**:
    If a domain has a conflict, a detailed comparison table is revealed, containing:
    *   **Field Name**: The specific attribute with the mismatch (e.g., `name`, `npsn`).
    *   **Master Value**: Displayed in red/rose to indicate the legacy value.
    *   **Workspace Value**: Displayed in blue/indigo to indicate the new enterprise value.
    *   **Status**: Indicates `DIFFERENT`, `MASTER_NEWER`, or `WORKSPACE_NEWER` based on the conflict rules.

## SAFETY CONSTRAINTS ENFORCED
*   **NO MERGE**: The UI only receives data; it lacks any functionality or callbacks to push data.
*   **NO AUTO FIX**: Discrepancies are purely flagged.
*   **NO WRITE**: The application state (via `setSettings` or `updateSetting`) is completely isolated from this component.

## IMPLEMENTATION DETAILS
*   **Component**: `src/enterprise/mirror/EnterpriseMirrorInspector.tsx`
*   **Service**: Relies on `EnterpriseMirrorService.runMirrorAudit(settings)` for snapshot generation.
*   **Hooks**: Utilizes `useEffect` to trigger a re-audit when `settings` change, guaranteeing a real-time, read-only reflection.

## SUCCESS METRICS
Administrators can now safely view discrepancies between the underlying Master Data (legacy) and the Enterprise Workspace payload, fulfilling the objective of evaluating the migration footprint with zero risk of regression.

**DECISION**: **GO** - Mirror Inspector successfully implemented as a read-only audit tool.
