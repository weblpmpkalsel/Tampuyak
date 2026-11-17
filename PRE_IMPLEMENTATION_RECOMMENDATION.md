# PRE-IMPLEMENTATION RECOMMENDATION: DOMAIN RENAMING

## Analysis
The request to rename `SchoolContextKnowledgePayload` to `SchoolKnowledgePayload` aligns perfectly with Enterprise Rule 070 (School Knowledge is an independent Enterprise Domain).

A search of the codebase reveals that the name `SchoolContextKnowledgePayload` is localized to:
1. `src/enterprise/knowledge/builders/SchoolContextBuilder.ts` (Definition)
2. `src/enterprise/document/ksp/KspDocumentAssembler.ts` (Instantiation)
3. `src/enterprise/document/ksp/bab1/KspBab1Structure.ts` (Consumption)
4. Markdown documentation (`README.md`, `Bab1ImplementationReport.md`)

## Recommendation: DEFER AS TECHNICAL DEBT

I recommend **deferring** the rename and documenting it as Technical Debt for the future Enterprise Knowledge Layer migration. 

### Justification
1. **Semantic Cascading**: Renaming *only* the payload to `SchoolKnowledgePayload` while leaving the builder named `SchoolContextBuilder` and the underlying service named `SchoolContextService` creates a semantic mismatch within the domain layer.
2. **Chain Reaction**: To do this cleanly, we would need to rename:
   - `SchoolContextBuilder.ts` -> `SchoolKnowledgeBuilder.ts`
   - `SchoolContextBuilderInput` -> `SchoolKnowledgeBuilderInput`
   - `SchoolContextService` -> `SchoolKnowledgeService`
   - `KspDocumentAssembler.ts` import paths.
3. **Zero Regression Priority**: The prompt strictly states "Zero Regression has higher priority than implementation speed" and "Do not refactor unrelated code." Renaming the underlying services and files to maintain semantic consistency constitutes refactoring unrelated code and introduces unnecessary regression risk at this exact checkpoint.

### Proposed Action
- **Do not execute the rename** during this BAB I Builder implementation sprint.
- **Log Technical Debt**: Add a formal technical debt note that `SchoolContext*` terminology must be migrated to `SchoolKnowledge*` when the true School Knowledge Registry is established.
- **Proceed** with the core School Knowledge Domain implementation (data structure additions) using the existing `SchoolContextKnowledgePayload` nomenclature to guarantee zero regression on the current locked architecture.

Awaiting your GO / NO GO decision on whether to execute the full semantic rename or accept the Technical Debt recommendation.
