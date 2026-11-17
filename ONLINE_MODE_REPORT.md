# Online Mode (LLM Integration) Report

## Architecture
Online mode activates when a user configures an external LLM provider (e.g., OpenAI, Gemini, Claude, Local LLM). 

## Separation of Concerns
- **TIE (The Brain):** Generates the JSON decision tree. The LLM **never** decides which RKAS code to use, which SNP applies, or what the priority is.
- **LLM (The Writer):** Acts purely as a presentation and narrative layer.

## The Narrative Pipeline
1. TIE outputs structured JSON.
2. The Document Composer constructs a prompt containing the JSON and narrative guidelines (e.g., "Write a formal paragraph for the RKJM background based on this JSON").
3. The LLM returns a polished, professional narrative.
4. The narrative is inserted into the document.

## Safeguards
If the LLM hallucinates an RKAS code or regulation that is not in the JSON, the Document Composer's validation engine strips it out or rejects the generation, falling back to the deterministic TIE output.

## Final Certification
**PASS** - Online mode successfully utilizes LLMs strictly for narrative enhancement, preserving the integrity of the deterministic business intelligence.
