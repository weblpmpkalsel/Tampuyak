# Projection Dependency Matrix

This matrix maps the required flow from the raw data fields exported by the Metadata Adapter into the structured Knowledge Domains.

| Metadata Adapter Field | Target Knowledge Domain | Target Interface Property | Transformation Logic Required |
| :--- | :--- | :--- | :--- |
| `rawRombel` | `StudentCharacteristicDomain` | `classes` | Map array of objects to `ClassStatistic` shape, calculate per-class totals if missing. |
| `rawTeachers` | `EducatorKnowledgeDomain` | `teachers` | Map array of objects to `EducatorStatistic` shape, extracting name, education level, certification. |
| `rawEducationStaff` | `EducatorKnowledgeDomain` | `educationStaff` | Map array of objects to `EducatorStatistic` shape, extracting name, role/position. |
| `rawFacilities` | `InfrastructureKnowledgeDomain` | `facilities` | Map key-value pairs (e.g. `ruangKelas: 12`) to array of `FacilityStatistic` objects. |
| `rawCommittee` | `PartnershipKnowledgeDomain` | `committeeName`, `committeeContact` | Extract flat fields and array elements from committee object. |
| `rawPotential` | `CulturalKnowledgeDomain` | `regionalPotentials`, `localWisdoms` | Extract arrays for `daerah` and `kearifanLokal`. |
| `rawSpecialPrograms` | `SpecialProgramKnowledgeDomain` | `programs` | Direct mapping of the special programs array. |
