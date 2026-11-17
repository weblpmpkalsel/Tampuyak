# FINANCIAL TRACEABILITY REPORT

## Traceability Pipeline
Every budget item generated in the RKAS now enforces strict horizontal tracing:

- **Budget Line** (Amount, Source, Account Code)
  ↓ maps to
- **Annual Program (RKT)** (e.g. Pelatihan Literasi)
  ↓ maps to
- **Strategic Objective (RKJM)** (e.g. Peningkatan Mutu Guru)

## Implementation
- The Budget Rendering Engine automatically looks up parent RKT and parent RKJM entities via ID referencing.
- Objective targets are printed directly underneath the Budget Item in the financial matrix, ensuring financial auditors can instantly determine *why* a budget exists.
- Orphan activities are technically impossible due to the structural mapping enforced by the rendering engine.
