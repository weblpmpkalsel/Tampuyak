# Master Education Platform Architecture

## Executive Summary
The Master Education Platform (MEP) is the foundational data layer of Tampuyak OS. It centralizes all business rules, government regulations, educational standards, official activity codes, and document templates into a single, version-controlled repository. 

## Architectural Principles
1. **Separation of Concerns:** Application logic only processes state and renders views. It never contains business rules or hardcoded regulations.
2. **Master Data Supremacy:** Every regulation, activity code, standard, and template must be retrieved from the MEP.
3. **Immutability of History:** Historical regulations and versions are archived and retained. Active academic years bind to specific regulation versions.
4. **Knowledge Access:** Modules interact with the MEP exclusively via the Knowledge API.

## Core Modules
- **Master RKAS (ARKAS):** Official activity codes, funding sources, and component categories.
- **Master National Education Standards (SNP):** The 8 national standards, quality indicators, and objectives.
- **Master Rapor Pendidikan:** Education Report indicators and improvement strategies.
- **Master Regulation Library:** Permendikbudristek, BOS guidelines, and policy documents.
- **Master Document Library:** Versioned templates for RKJM, RKT, RKAS, and KSP.
- **Master Support Databases:** Workflows, priorities, risks, positions, and academic years.

## Sub-Engines
- **Knowledge Update Engine:** Wizard for ingesting, parsing, diffing, and deploying new regulations from official PDFs.
- **Dependency Engine:** Maps relationships (e.g., Regulation -> RKAS Code -> RKT Module).
- **Knowledge Search Engine:** Universal semantic search across all master databases.
- **AI Recommendation Engine:** Provides contextual suggestions (e.g., suggesting RKAS codes based on selected SNP).
- **Traceability Engine:** Provides end-to-end lineage from Root Cause (Rapor) down to Evaluation.
