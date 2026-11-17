# Enterprise Metadata Adapter Recovery

## Objective
To extend the Enterprise Metadata Adapter (`src/ksp/KspMetadataAdapter.ts`) to act as the single canonical normalization layer for ALL Enterprise Knowledge, preserving all missing master data arrays before they are lost in the pipeline.

## Implementation Scope
The `KspMetadata` interface and the `KspMetadataAdapter.adapt` mapping function were successfully extended to capture the following previously dropped master data:
1. **Rombel / Class Statistics**: Preserved as `rawRombel` from `settings.rombel`.
2. **Teachers**: Preserved as `rawTeachers` from `settings.guru`.
3. **Education Staff**: Preserved as `rawEducationStaff` from `settings.tendik`.
4. **Facilities & Infrastructure**: Preserved as `rawFacilities` from `settings.sarpras`.
5. **School Environment & Community Potentials**: Preserved as `rawPotential` from `settings.potensi`.
6. **Partnerships & Committee**: Preserved as `rawCommittee` from `settings.komite`.
7. **Special Programs & Achievements**: Preserved as `rawSpecialPrograms` from `settings.programUnggulan`.

## Architectural Enforcement
- **Preserved Existing Behavior**: All original mappings (such as `rawStudents` resolving totals from `pesertaDidik`) were strictly maintained to ensure no regression.
- **Strict Boundary Restraint**: The implementation target was strictly limited to the Metadata Adapter. The Builder, Canonical AST, and Renderer were completely untouched per the checkpoint constraints.

## Result
The Enterprise Metadata Adapter is now fully structurally sound and successfully propagates the complete graph of Enterprise Master Data to the subsequent pipeline layer.
