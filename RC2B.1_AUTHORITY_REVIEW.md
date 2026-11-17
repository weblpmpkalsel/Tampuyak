# RC-2B.1 GOVERNMENT AUTHORITY REVIEW

## Executive Summary
An audit of the Approval Page authority block reveals a structural mismatch between the Indonesian administrative hierarchy for education and the current Canonical Projection in `KspApprovalStructure.ts`. The current projection statically binds the Head of Education Office position to the `province` field, which is incorrect for Primary and Junior High Schools.

## Hierarchy Audit Findings

In the Indonesian Administrative Hierarchy:
- **PAUD, SD, SMP**: Governed by the City/Regency Education Office (Dinas Pendidikan Kota/Kabupaten).
- **SMA, SMK, SLB**: Governed by the Provincial Education Office (Dinas Pendidikan Provinsi).

### Current State
`KspApprovalStructure.ts` projects the following:
```text
Mengesahkan,
[headOfEducationOfficePosition] (e.g., Kepala Dinas Pendidikan)
[province] (e.g., Kalimantan Selatan)
```

For an SD (like SDN 1 CONTOH in Banjarmasin), this evaluates to:
```text
Kepala Dinas Pendidikan
Kalimantan Selatan
```
This is **INCORRECT**. For an SD, the authority region is the Regency/City (`Kota Banjarmasin` or `Kabupaten ...`).

## Metadata Sufficiency Analysis
The current `KspApprovalConfiguration` interface receives `province` and `regencyOrCity` but hardcodes the use of `province` for the Education Office signature block.

While `KspDocumentAssembler.ts` has access to `metadata.schoolLevel` (e.g., 'SD'), it does not pass it or the derived authority region to the Approval builder.

### Missing Enterprise Fields
To strictly follow Government Fidelity without polluting the projection layer with business logic, the configuration lacks a unified field for the authority's region.
- Missing Field: `educationAuthorityRegion: string` (e.g., "Kota Banjarmasin" or "Provinsi Kalimantan Selatan")

## Recommendations Before Implementation

1. **Avoid Projection Business Logic:** Do not add `if (schoolLevel === 'SD')` inside `KspApprovalStructure.ts`. The Builder must remain a dumb consumer.
2. **Update Configuration:** Add `educationAuthorityRegion: string` to `KspApprovalConfiguration`.
3. **Compute in Assembler (Orchestrator):** In `KspDocumentAssembler.ts`, inject logic to compute the correct region:
   - If `metadata.schoolLevel` is `PAUD`, `SD`, or `SMP` -> assign `metadata.regencyOrCity` to `educationAuthorityRegion`.
   - If `metadata.schoolLevel` is `SMA`, `SMK`, or `SLB` -> assign `metadata.province` to `educationAuthorityRegion`.
4. **Update Builder:** Modify `KspApprovalStructure.ts` to consume `config.educationAuthorityRegion` for the final signature container instead of `config.province`.

This approach guarantees correct Indonesian administrative hierarchy alignment and preserves the purity of the Presentation and Projection layers.
