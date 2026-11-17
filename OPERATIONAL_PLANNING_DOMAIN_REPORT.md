# RKJM ENGINE PHASE 2.5.2 - OPERATIONAL PLANNING DOMAIN

## 1. Architecture Review
The new Operational Planning Domain successfully decouples strategic intent (the *what* and *why*) from operational scheduling (the *when* and *how*). By leaving `AnnualPlanningActivity` untouched, the core Knowledge Graph and Annual Planning engines remain stable. The new operational structures reference strategic entities instead of duplicating them, preserving the single source of truth.

## 2. Strategic vs Operational Domain Diagram
```text
[Strategic Domain]
AnnualPlanningActivity
- Strategic Goal
- Program Target
- Performance Indicator
- Budget Reference
      ^
      | (Referenced via activityReferenceId)
      |
[Operational Domain]
OperationalPlanningActivity
- Planning Year
- Semester / Quarter
- Priority
- Execution Reference
```

## 3. OperationalPlanningActivity Model
`OperationalPlanningActivity` stores strict metadata about scheduling and status:
- **Keys**: `operationalPlanningId`, `activityReferenceId`, `programReferenceId`
- **Timing**: `planningYear`, `semester`, `quarter`, `sequence`
- **Execution context**: `priority`, `dependencyReferences`, `recommendationReferences`, `executionReference`, `status`
- **Extra**: `metadata`

## 4. Relationship Diagram
```text
KnowledgeGraph (Core SSOT)
       ↓
AnnualPlanningEngine (Strategic Generation)
       ↓ (Emits AnnualPlanningActivity)
OperationalPlanningEngine (Orchestration)
       ↓ (OperationalPlanningMapper creates wrappers)
OperationalPlanningActivity (Wraps AnnualPlanningActivity reference with time context)
       ↓
Execution Engine
       ↓
Operational Views / Documents
```

## 5. Reference Strategy
Instead of duplicating program descriptions or indicators, `OperationalPlanningActivity` uses `activityReferenceId` and `programReferenceId` to point directly to existing entities within the strategic domain (`AnnualPlanningActivity`). Downstream consumers look up these references to render cohesive views.

## 6. Mapping Strategy
`OperationalPlanningMapper` is responsible for converting structural metadata (like `PlanningDistribution`) into explicit `OperationalPlanningActivity` records. It acts as the bridge connecting high-level orchestration directives to concrete operational assignments.

## 7. Future Integration Strategy
Future consumers (such as RKT Generators, Chapter 4 Builders, or Timeline Engines) will query `OperationalPlanningActivity` to determine *when* an activity occurs, then follow its `activityReferenceId` to determine *what* the activity is. This eliminates the structural limitation of bucketing (where an activity is just placed in a 'Y1' folder).

## 8. Backward Compatibility Analysis
This is a purely additive architectural phase. No existing domain models, APIs, or data structures were altered. Legacy consumers that read from structural arrays (`annualPlans.Y1`) remain unaffected while the new Operational Domain is initialized.

## 9. Risk Analysis
- **System Stability Risk**: **Zero**. Existing features do not use the new models yet.
- **Data Duplication Risk**: **Zero**. Explicit references are used rather than copied content.
- **Next Steps**: The new models are ready for integration into the distribution pipeline.

## 10. Files Created
- `/src/planning/OperationalPlanningActivity.ts`
- `/src/planning/OperationalPlanningMapper.ts`
- `/src/planning/OperationalPlanningReference.ts`

## 11. Files Modified
- None.
