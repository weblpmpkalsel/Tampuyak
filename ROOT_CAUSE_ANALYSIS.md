# Root Cause Analysis: Missing Table 1.2

## Classification
The failure to generate Table 1.2 in the KSP document is a multi-layered architectural defect classified as:
1. **Broken Mapping**: The master data (`settings.rombel`) is dropped by `KspMetadataAdapter.ts`.
2. **Missing Projection**: `SchoolContextBuilder.ts` does not define a schema for class-level demographic aggregates.
3. **Missing Builder**: `KspBab1Structure.ts` lacks the logic to instantiate a `TableBlock` for Table 1.2, opting instead for a fallback text paragraph.

## Detailed Breakdown

### 1. Data Loss at the Adapter Boundary
In `src/ksp/KspMetadataAdapter.ts`, the `adapt` function extracts overall totals from `settings.pesertaDidik` into `rawStudents`, but the `settings.rombel` array is completely ignored. This severs the pipeline early, preventing any downstream component from knowing about individual classes.

### 2. Incomplete Knowledge Domain Projection
In `src/enterprise/knowledge/builders/SchoolContextBuilder.ts`, the `StudentCharacteristicDomain` interface is defined as:
```typescript
export interface StudentCharacteristicDomain {
  totalStudents?: number;
  genderDistribution?: { male: number; female: number };
  // ...
}
```
There is no representation for class-level aggregation (e.g., an array of classes with male/female counts).

### 3. Builder Omission
In `src/enterprise/document/ksp/bab1/KspBab1Structure.ts`, the logic for "B. Karakteristik Peserta Didik" checks if `students` data exists. If so, it constructs a string:
```typescript
let popStr = `Secara demografis, sekolah memiliki jumlah peserta didik sebanyak ${students.totalStudents} orang dengan sebaran gender...`;
```
It pushes a `PARAGRAPH` block to the AST instead of constructing a `TableBlock`. Because the Canonical Renderer is dynamic and driven purely by the AST, the table cannot render without the builder producing the correct AST nodes.
