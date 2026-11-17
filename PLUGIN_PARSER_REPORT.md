# PLUGIN PARSER REPORT

## Plugin Architecture
The concept of monolithic parsing is obsolete. Rapor OS utilizes an array of `ParserPlugin` instances to process workbooks.

### Current Implementation
- `SD2025Plugin`: Implements the explicit extraction rules, grid boundaries, and block handlers necessary to ingest the official Kemendikdasmen SD 2025 workbook.
- `UnknownSchemaPlugin`: Provides an adaptive fallback for files that fail to match any known signature, preserving compatibility.

### Extension Protocol
To add support for a new school type (e.g., SMA, SMK, SLB), developers need only create a class implementing `ParserPlugin` and call `SchemaRegistry.register()`.
