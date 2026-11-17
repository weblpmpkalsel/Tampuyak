# RC-2B.1 Implementation Report

## Actions Taken
- **KspApprovalConfiguration**: Added `educationAuthorityRegion: string` field.
- **KspDocumentAssembler**: Added logic to determine `educationAuthorityRegion` based on `schoolLevel`. For `SMA`, `SMK`, `SLB` it resolves to `province`, otherwise it resolves to `regencyOrCity`.
- **KspApprovalStructure**: Modified the `approval-paragraph-office-province` paragraph to use `config.educationAuthorityRegion` instead of `config.province`.

The implementation ensures that the correct administrative hierarchy is dynamically reflected on the Approval page without polluting the structure builder with business logic.
