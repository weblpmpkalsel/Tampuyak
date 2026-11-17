# Quality Assurance (GWE) Report

## Overview
This report details the QA mechanisms built into the Government Writing Engine (GWE) to ensure continuous, high-quality narrative generation.

## QA Pipelines
1. **Source Data Verification:** GWE refuses to generate text if the upstream JSON from the Tampuyak Intelligence Engine (TIE) is missing critical nodes (e.g., trying to write an intervention narrative without an RKAS code).
2. **Context-Awareness Check:** Validates that the generated narrative explicitly references at least one School DNA characteristic.
3. **Citation Validation:** Ensures that any mention of a policy or standard is accompanied by the corresponding official identifier (e.g., Permendikbudristek No., SNP chapter) sourced from the MEP.

## Fallback Mechanisms
If the GWE detects a failure in narrative construction (e.g., it cannot find a matching library pattern), it falls back to a highly structured, literal interpretation of the data rather than hallucinating or producing broken text.

## Final Certification
**PASS** - QA pipelines are active and effectively guarding the output quality of the Government Writing Engine.
