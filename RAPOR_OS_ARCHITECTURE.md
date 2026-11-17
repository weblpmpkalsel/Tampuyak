# RAPOR OS ARCHITECTURE

## Architectural Paradigm Shift
Tampuyak has evolved from a simple Excel parsing utility into a comprehensive **Workbook Intelligence Platform** dubbed "Rapor OS".

### Core Pipeline
1. **Workbook**: The raw Excel file upload.
2. **Discovery Engine**: Unpacks the workbook entirely, generating a spatial map (visible sheets, ranges, names).
3. **Schema Engine**: Interprets the spatial map against known signatures in the Registry.
4. **Relationship Engine**: Links disparate parsed blocks (Indicators -> Recommendations -> Planning -> Budget) rather than treating them as isolated arrays.
5. **Canonical Model**: Standardizes all extracted rows into uniform structured objects.
6. **Planning & Document Engine**: Prepares the uniform objects for rendering and export.

By strictly enforcing this pipeline, the engine achieves absolute decoupling of reading mechanics from structural interpretation.
