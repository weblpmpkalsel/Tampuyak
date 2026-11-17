# Traceability Guide

## Core Concept
Every planning item, budget allocation, and evaluation metric in Tampuyak OS must trace back to a verifiable root cause and forward to a final outcome. 

## The Lineage Chain
1. **Root Cause:** Master Rapor Pendidikan (Identified Gap).
2. **Priority:** Prioritas Rekomendasi (Diagnosis Engine).
3. **Strategic Objective:** RKJM (4-Year Goal).
4. **Annual Program:** RKT (Yearly Action Plan).
5. **Budget Allocation:** RKAS (Linked to Official Master RKAS Code).
6. **Implementation:** Evidence of execution.
7. **Monitoring:** Progress assessment.
8. **Evaluation:** Final outcomes and feedback to the next cycle.

## Implementation Rules
- Every RKJM Objective must reference a Root Cause (Rapor ID).
- Every RKT Program must reference an RKJM Objective ID.
- Every RKAS item must reference an RKT Program ID and a Master RKAS Code.
- Every Monitoring/Implementation record must reference an RKAS ID.

## Verification
The Traceability Engine traverses these foreign keys. If a chain is broken (e.g., an RKAS item lacks a Master RKAS Code or RKT reference), the Data Certification Engine will block the final release of the document, flagging it as an "Orphaned Allocation."
