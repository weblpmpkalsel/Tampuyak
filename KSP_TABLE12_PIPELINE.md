# Table 1.2 Data Pipeline Status

This document maps the expected data flow for Table 1.2 (Jumlah Murid SD Tahun Ajaran) against the actual implementation.

## Expected Pipeline
1. **Source**: Rombel & Student Data (UI / Local State)
2. **Adapter**: Maps Rombel arrays to KSP Metadata
3. **Knowledge Builder**: Projects Rombel data into Aggregated Class Statistics (Male, Female, Total per Class)
4. **Document Builder**: `KspBab1Structure.ts` iterates over the projection and generates a `TableBlock` with `TableRowNode` and `TableCellNode`.
5. **Renderer**: `CanonicalRenderer.tsx` draws the HTML table from the AST.

## Actual Pipeline Status
1. **Source**: ✅ `settings.rombel` exists in `Tampuyak.tsx`.
2. **Adapter**: ❌ `KspMetadataAdapter.ts` maps `pesertaDidik` but drops `rombel`.
3. **Knowledge Builder**: ❌ `StudentCharacteristicDomain` lacks properties for class aggregates.
4. **Document Builder**: ❌ `KspBab1Structure.ts` generates a demographic `PARAGRAPH` instead of a `TableBlock`.
5. **Renderer**: ⚪ Skipped (AST node does not exist, so it is never reached).
