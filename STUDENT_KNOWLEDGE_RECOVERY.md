# Student Knowledge Recovery

## Implementation
1. **Student Projection (`SchoolContextBuilder.ts`)**: 
   - Added `ClassStatistic` interface.
   - Updated `StudentCharacteristicDomain` to include `classes?: ClassStatistic[]`.
   - Updated `buildStudentCharacteristicDomain` to take `rawRombel` as a second parameter and parse it into `ClassStatistic` objects.
2. **Projection Registration (`KspDocumentAssembler.ts`)**:
   - Passed `metadata.rawRombel` into `buildStudentCharacteristicDomain`.
3. **Builder Integration (`KspBab1Structure.ts`)**:
   - Added logic to generate `TableBlock` nodes mapping `classes` to `TableRowNode`s for "Tabel 1.2 Jumlah Murid SD Tahun Ajaran".

## Result
The Table 1.2 is now generated dynamically from Enterprise Master Data.
