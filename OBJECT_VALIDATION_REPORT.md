# OBJECT VALIDATION REPORT

## Evidence of Correctness
The console now explicitly outputs detailed validation matches for every imported sheet.

### Recommendation Validation
- Scans `2.2 REKOMENDASI PRIORITAS`.
- Extracts `objectsFound`.
- Evaluates `metadata.recommendationsImported`.
- Fails if `objectsFound > 0 && imported === 0`.

### RKT Validation
- Scans `3. LEMBAR KERJA RKT`.
- Tracks RKT blocks detected.
- Evaluates `metadata.rktImported`.
- Mismatch between detected and imported triggers `STATUS: FAIL (Mismatch)`.

### ARKAS Validation
- Scans `4. LEMBAR KERJA ARKAS`.
- Tracks budget items detected.
- Evaluates `metadata.rkasImported`.
- Mismatch between detected and imported triggers `STATUS: FAIL (Mismatch)`.

No worksheet is permitted to silently lose objects.
