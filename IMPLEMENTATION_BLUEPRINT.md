# M2.7 STRATEGIC IMPLEMENTATION BLUEPRINT

## Executive Summary
This blueprint defines the safe execution path for implementing the Strategic Knowledge Layer (Vision, Mission, Goals) into the Enterprise Document model. It focuses on integrating these domains without violating Zero Regression and while maintaining strict architectural boundaries.

## Scope
The following components are strictly in-scope for the M2.8 implementation:
- Vision Knowledge integration
- Mission Knowledge integration
- Goals Knowledge integration
- Builder Integration (consuming the knowledge)
- Assembler Integration (orchestrating the knowledge)
- Document Projection (mapping to Canonical Blocks)

*Everything else (Universal Renderer, Publishing Engine, Front Matter, Regulatory Knowledge, School Knowledge, etc.) remains strictly LOCKED.*

## Architecture & Implementation Order
**Recommended Sequence: Option B (Single Integrated Sprint)**
Because Vision, Mission, and Goals are currently coupled in the `VisionMissionPayload`, modifying them sequentially (Option A) introduces intermediate broken states where the Assembler and Builder signatures misalign, causing severe regression. Option B executes the changes across the Service, Assembler, and Builder simultaneously, ensuring atomic commits that preserve Zero Regression.

*Justification:*
- **Zero Regression**: Prevents broken builds between partial implementations.
- **Architecture Stability**: Keeps the Orchestrator (Assembler) and Consumer (Builder) in sync.
- **Testing Cost**: Reduces redundant testing cycles.
- **Regression Risk**: Minimizes the window of instability.

## Dependency Diagram
`School Knowledge (Context)`
  ↓
`Vision Knowledge (Aspiration)`
  ↓
`Mission Knowledge (Action)`
  ↓
`Goals Knowledge (Targets)`
  ↓
`Document Projection (Canonical BAB II)`

## File Impact Matrix
**Files to Modify:**
- `src/enterprise/knowledge/builders/VisionMissionBuilder.ts`
  - *Purpose*: Constructs the strategic knowledge payload.
  - *Responsibility*: Builder layer.
  - *Reason for modification*: To align the payload generation with the strict strategic domains.
  - *Risk Level*: MEDIUM
- `src/enterprise/knowledge/services/VisionMissionService.ts`
  - *Purpose*: Service layer for processing strategic data.
  - *Responsibility*: Validation and normalization.
  - *Reason for modification*: Ensure inputs meet the rigorous definitions of Vision, Mission, and Goals.
  - *Risk Level*: LOW
- `src/enterprise/document/ksp/KspDocumentAssembler.ts`
  - *Purpose*: Orchestrates all knowledge domains.
  - *Responsibility*: Assembler layer.
  - *Reason for modification*: To compose and pass the strategic payloads to the BAB II builder.
  - *Risk Level*: MEDIUM
- `src/enterprise/document/ksp/bab2/KspBab2Structure.ts`
  - *Purpose*: Constructs the BAB II section.
  - *Responsibility*: Document Projection.
  - *Reason for modification*: To project the knowledge into Canonical Blocks.
  - *Risk Level*: HIGH

**LOCKED Files:**
- All Renderer components (`src/infrastructure/renderer/*`)
- Publishing engines
- Workspace integrations
- Planning engines
- Front Matter builders
- School Knowledge and Regulatory Knowledge builders

## Assembler Integration Plan
The `KspDocumentAssembler` will retain its role as the pure Orchestrator. It will compose:
`School Knowledge` + `Regulatory Knowledge` + `Vision Knowledge` + `Mission Knowledge` + `Goals Knowledge`.
The Assembler will fetch the monolithic `VisionMissionPayload` (as TD-KSP-002 is deferred) and pass it to the BAB II Builder. It will never generate, infer, or alter the strategic knowledge.

## Builder Integration Plan
Builders will remain pure Consumers. They will:
1. Receive Knowledge (e.g., Vision, Mission, Goals).
2. Map Knowledge into structural elements.
3. Generate Canonical Blocks (`PARAGRAPH`, `LIST`, `QUOTE`).

Builders will never generate narrative text, infer missing information, rewrite knowledge, or interpret goals.

## Canonical Projection Plan
- **Vision**: Projected as a prominent `QUOTE` or `PARAGRAPH` block.
- **Mission**: Projected as an ordered or unordered `LIST` block.
- **Goals**: Projected as a `LIST` block, ensuring measurability is preserved.
No Renderer changes are allowed. No new Canonical Block types will be created; existing structural blocks are sufficient.

## Testing Matrix
- **TypeScript Compile**: `tsc --noEmit`
- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Preview Rendering**: Visual check in the UI.
- **PDF Rendering**: Verify PDF generation output.
- **TOC Verification**: Ensure BAB II appears correctly in the Table of Contents.
- **Government Fidelity Review**: Verify no AI hallucination alters the original strategic inputs.
- **Regression Review**: Verify BAB I, BAB III, etc., remain unaffected.

## Rollback Plan
If implementation fails (e.g., build failure or regression detected):
1. **Files**: Revert `VisionMissionBuilder.ts`, `VisionMissionService.ts`, `KspDocumentAssembler.ts`, and `KspBab2Structure.ts` to their pre-M2.8 states.
2. **Commits**: Discard the changes to return to the M2.7 Gold Checkpoint baseline.
3. **Boundaries**: Ensure the rollback restores the exact boundaries documented in M2.7.
4. **Recovery Strategy**: Analyze the failure point in an isolated context before attempting re-implementation.

## Technical Debt Review
- **TD-KSP-001**: Rename `SchoolContextKnowledgePayload` -> `SchoolKnowledgePayload`.
  - *Status*: DEFERRED. Implementation must not rename these files.
- **TD-KSP-002**: Decompose `VisionMissionPayload` into discrete domains.
  - *Status*: DEFERRED. Implementation will operate within the existing `VisionMissionPayload` structure to avoid compounding regression risks. The implementation must not accidentally attempt to solve this during the M2.8 sprint, nor worsen it by adding unrelated fields.

## Architecture Readiness Review
- **Knowledge Layer**: Ready.
- **Assembler**: Ready.
- **Builders**: Ready.
- **Canonical Domain**: Ready.
- **Publishing**: Ready.
- **Renderer**: Ready.
All layers remain compatible with the planned projection strategy.

## Risk Matrix
- **Architecture Risk**: LOW (using established patterns).
- **Regression Risk**: MEDIUM (touching Assembler and BAB II Builder). Mitigated by Option B (Atomic Sprint).
- **Knowledge Risk**: LOW (pure passthrough).
- **Testing Risk**: LOW (standard pipeline).
- **Government Fidelity Risk**: LOW (no AI rewriting).
- **Maintenance Risk**: MEDIUM (carrying TD-KSP-002). Mitigated by explicit tracking.

## Definition of Done
The M2.8 Sprint is COMPLETE only when:
- [ ] Vision implemented
- [ ] Mission implemented
- [ ] Goals implemented
- [ ] Builders remain Consumers
- [ ] Assembler remains Orchestrator
- [ ] Canonical Model unchanged
- [ ] Renderer untouched
- [ ] Publishing untouched
- [ ] Lint PASS
- [ ] Build PASS
- [ ] Preview PASS
- [ ] PDF PASS
- [ ] TOC PASS
- [ ] Government Fidelity PASS
- [ ] Zero Regression PASS

## Final Recommendation
**GO**

*Justification*: The blueprint clearly scopes the boundaries, explicitly defers known technical debt to prevent scope creep, and utilizes an atomic single-sprint integration (Option B) to guarantee Zero Regression across the Orchestrator and Consumer layers. The architecture is fully ready for execution.
