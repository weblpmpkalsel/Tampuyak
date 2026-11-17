# WORKBOOK FORENSIC REPORT

## Forensic Scan Implementation
`EducationReportParser.scanWorkbook` has been implemented to evaluate the workbook structure prior to data extraction.

### Trace Output Format
During the file upload, the console will explicitly output the Workbook Forensic Map:

```text
==== WORKBOOK FORENSIC MAPPER ====
Sheet 1
Name: 2. LAPORAN RAPOR
Visible: Visible
Merged Cells: 0
Tables: 1
Rows: 12-88
Cols: 1-15
Parser: parseLaporanRapor()
-------------------------------------
...
```

## Deterministic Data Quality
This forensic mapping guarantees that:
1. The system understands when an empty space is genuinely the end of the table vs. an empty block inside the table boundaries.
2. Hidden configuration sheets are mapped but safely ignored.
3. Overlaps are resolved prior to object allocation.
