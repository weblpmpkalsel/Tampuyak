# Rule Engine Report

## Architecture
The Rule Engine acts as the gateway between raw data (Rapor Pendidikan) and the Root Cause Engine. It uses deterministic thresholds and logic gates to trigger subsequent analyses.

## Implemented Logic
- **Thresholding:** Evaluates indicators against national benchmarks (e.g., `IF nilai < 70 THEN trigger_gap_analysis`).
- **Contextual Filtering:** Applies modifiers based on school context (e.g., if the school lacks a library, interventions requiring one are penalized in confidence).
- **Dependency Traversal:** Once a rule fires, it automatically fetches linked data from the Master Education Platform (SNP, Regulations, RKAS).

## Explainability
The Rule Engine tags every fired rule with an explanation:
- *Condition Met:* "Literasi Score (55) < Target (70)"
- *Action Taken:* "Triggered Root Cause Analysis for A.1"
- *Linked Master Data:* "MasterRapor.A.1"

## Final Certification
**PASS** - The Rule Engine deterministically and accurately evaluates input data against established benchmarks.
