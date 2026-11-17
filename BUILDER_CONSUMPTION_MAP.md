# Builder Consumption Map

This map outlines how the `KspBab1Structure.ts` document builder will consume the newly designed Knowledge Projections to produce the final Canonical AST.

| Knowledge Projection | Schema Property | Builder Action (AST Generation) | Target Output (Document Section) |
| :--- | :--- | :--- | :--- |
| `StudentCharacteristicDomain` | `classes` | Generate `TableBlock` with `TableRowNode` for each class, summing columns. | Table 1.2: Jumlah Murid SD Tahun Ajaran |
| `EducatorKnowledgeDomain` | `teachers`, `educationStaff` | Generate one or two `TableBlock`s listing educator profiles. | Tabel Demografi Guru dan Tendik |
| `InfrastructureKnowledgeDomain` | `facilities` | Generate `TableBlock` listing facility names and quantities. | Tabel Sarana dan Prasarana (New Section) |
| `PartnershipKnowledgeDomain` | `committeeName`, `committeeMembers` | Generate `ListBlock` detailing committee structure. | Karakteristik Orang Tua/Wali |
| `CulturalKnowledgeDomain` | `regionalPotentials`, `localWisdoms` | Generate `ListBlock` of regional potentials and wisdoms. | Karakteristik Lingkungan |
| `SpecialProgramKnowledgeDomain` | `programs` | Generate `TableBlock` or `ListBlock` of special programs. | Program Unggulan |

## AST Construction Requirements
To fulfill these consumption mappings, the Builder (`KspBab1Structure.ts`) must:
1. Verify the existence of the projected array (e.g., `payload.students.classes`).
2. Instantiate a `TableBlock` with appropriate column headers.
3. Map over the array to generate `TableRowNode` and `TableCellNode` objects.
4. Append the `TableBlock` to the `DocumentSection` blocks array.
