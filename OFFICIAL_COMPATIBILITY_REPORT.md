# OFFICIAL COMPATIBILITY REPORT

Future compatibility is ensured via:
- Semantic matching for worksheet names (ignores capitalization, spaces, prefixes).
- Semantic scanning for data tables (locates the header row dynamically rather than assuming Row 1).
- Fallback Compatibility Mode for older Rapor forms or heavily modified files, falling back to regex sweeps.
- Error suppression: Detailed warnings are provided on what is missing rather than simply throwing "Invalid file".
