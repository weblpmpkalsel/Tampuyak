# RKT_PROJECTION_ENGINE_REPORT.md

## 1. Architecture Overview
The RKT Projection Engine acts as a read-only translation layer that extracts data from the locked RKJM Operational Planning structure. It adheres strictly to the single source of truth principle:
1. **Knowledge Graph**: Holds definitions of Programs, Activities, Targets, etc.
2. **Operational Planning & Planning Assignments**: Assigns Activities to specific implementation cycles (Year, Semester, Quarter).
3. **RKT Projection Engine**: Projects these assignments for a specific year, resolving entity details from the Knowledge Graph dynamically.

No data mutation or persistent cloning occurs within the projection engine.

## 2. Projection Flow
1. **Input Parameters**: Receives the target year (e.g., Year 1), the current Operational Activities, their Planning Assignments, the Knowledge Graph, and context tracking metadata (Snapshot ID, User ID).
2. **Filtration**: Scans the Operational Activities list and returns only the entities assigned strictly to `Y[targetYear]`.
3. **Hydration**: Iterates through filtered records and resolves canonical metadata (Program Name, Activity Name, PIC, targets, indicators) dynamically via `KnowledgeGraph.getNode(id)`.
4. **Output Composition**: Constructs a mapped array of `RKTProjection` models to power downstream builders and UI layers.

## 3. Reference Diagram
```text
[Knowledge Graph] (Entities)      [Operational Planning] (Schedules)
          │                                  │
          └─────────────┐  ┌─────────────────┘
                        ▼  ▼
            [RKT Projection Engine] 
            (Filter by Year + Merge Metadata)
                        │
                        ▼
            [RKT Projection Result]
            (Context + Projections)
                        │
                        ▼
               [RKT Document Builder]
```

## 4. Validation Compliance
- **No Duplicates**: The projection engine only filters existing Operational Planning structures based on the target year.
- **Reference Integrity**: Extracted objects retain hard-linked IDs (`strategicObjectiveId`, `programId`, `activityId`, `planningAssignmentId`) matching exactly with the upstream components.
- **Scope Limit**: Enforces single-year boundaries accurately. `Total projections = Operational Activities assigned to Year N`.

## 5. Risk Analysis & Mitigation
- **Missing Knowledge Graph Nodes**: *Risk*: An activity is scheduled but deleted/missing from the KG. *Mitigation*: Fallbacks utilize `OperationalPlanningActivity.metadata` properties to gracefully degrade.
- **Assignment Orphans**: *Risk*: An Operational Activity lacks a fully constructed assignment metadata object. *Mitigation*: Gracefully falls back to defaults (Semester 1, Quarter 1) to ensure visibility instead of total failure.

## 6. Future Compatibility with RKAS
Since the `RKTProjection` maintains `budgetReference` and full traceability (`activityId`, `programId`), the future RKAS module can easily query this same projection output or directly use these reference mappings to pull linked `Budget` node entities out of the Knowledge Graph for synchronized fiscal allocation.
