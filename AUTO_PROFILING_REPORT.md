# AUTO PROFILING REPORT

## Pre-Flight Assessment
Every uploaded workbook undergoes an Auto Profiling sequence before parsing initiates. 

### Output Stream
The console issues an `==== AUTO PROFILING ====` block containing:
- **Schema ID**: Explicitly named (e.g., `SD_2025_V1` or `UNKNOWN_SCHEMA`).
- **Compatibility Status**: Indicates support level (`Supported`, `Unknown`, etc.).
- **Confidence Rating**: Indicates the expected extraction success rate (`High`, `Low`).
- **Warnings**: Flags missing features or potential anomalies.

### Impact
If a completely unmapped file is uploaded, Rapor OS generates an Unknown Schema Profile and shifts to an adaptive import, preventing immediate fatal rejection while communicating risk.
