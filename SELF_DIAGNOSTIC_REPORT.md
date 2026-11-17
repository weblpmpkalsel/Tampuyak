# SELF DIAGNOSTIC REPORT

## Internal Transparency
Silent failures are strictly prohibited. The engine exposes its decision-making via `==== SELF DIAGNOSTIC ====` blocks.

### Diagnostics Tracked
- **WHY a workbook matched**: Explains the exact logic for selecting the parser plugin.
- **WHY a sheet parsed**: Records the name mapping hit.
- **WHY a sheet skipped**: Outputs explicit warnings if expected data is missing (e.g., "WHY skipped (Laporan Rapor): Sheet not found in workbook.").

This guarantees that extraction anomalies can be instantly traced back to the structural mapping phase rather than debugging abstract variables.
