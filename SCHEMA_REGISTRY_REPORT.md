# SCHEMA REGISTRY REPORT

## Schema Management
Rapor OS relies on a `SchemaRegistry` to categorize and handle varying versions of official workbooks dynamically.

### Capabilities
- **Schema ID**: Each distinct format is assigned a unique identifier (e.g., `SD_2025_V1`).
- **Lifecycle Tracking**: Schemas can be flagged as `Supported`, `Deprecated`, `Experimental`, or `Unknown`.
- **Dynamic Routing**: Instead of hardcoded logic, the registry checks `plugin.matches(map)` to route the workbook to the correct parsing plugin.

### Future Resilience
When a new format (e.g., `SMP_2026`) is released, the core engine remains completely untouched. A new plugin is simply injected into the registry.
