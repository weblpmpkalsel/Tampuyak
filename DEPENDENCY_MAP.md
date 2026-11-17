# Dependency Map

This document outlines how master data entities depend on each other and cascade updates.

## Core Dependency Graph

### 1. Regulation Dependency
`Master Regulation` is the root dependency.
- **Impacts:** Master Document Templates, Master RKAS, Master SNP, Certification Rules.
- **Trigger:** When a regulation is updated, the Knowledge Update Engine flags dependent RKAS codes and templates for review.

### 2. SNP Dependency
`Master SNP` depends on `Master Regulation`.
- **Impacts:** Master RKAS, Rapor Pendidikan Indicators.
- **Trigger:** Changes in SNP require re-mapping of RKAS codes and Rapor indicators.

### 3. Rapor Pendidikan Dependency
`Master Rapor Pendidikan` depends on `Master SNP`.
- **Impacts:** Rapor Analysis, Priority Setting, Root Cause Analysis.
- **Trigger:** Changes dictate the AI Recommendation Engine's suggested RKJM objectives and RKAS codes.

### 4. RKAS Dependency
`Master RKAS` depends on `Master SNP` and `Master Regulation`.
- **Impacts:** RKAS Derivation, RKT Programs, Budget Components, Implementation, Monitoring.
- **Trigger:** If an RKAS code is deprecated by a new regulation, all active drafts referencing it trigger a validation warning.

### 5. Document Template Dependency
`Master Document Library` depends on `Master Regulation` and `Master Certification Rules`.
- **Impacts:** Document Generation, PDF Export, Print Validation.
- **Trigger:** If mandatory chapters change, the Data Coverage Engine recalculates completeness scores.
