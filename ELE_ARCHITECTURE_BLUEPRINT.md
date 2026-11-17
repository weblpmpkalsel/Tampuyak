# Enterprise Layout Engine (ELE) Architecture Blueprint

## Executive Summary
This document defines the target architecture for the Enterprise Layout Engine (ELE). The ELE will succeed the current ELPS Lite Foundation, providing a scalable, hierarchical layout resolution mechanism that mediates between the `CanonicalRenderer` and layout configurations, ensuring strict separation of concerns and robust profile management.

## Current ELPS Assessment
The ELPS Lite Foundation successfully proved that layout customization can be entirely isolated from the Knowledge Layer and Canonical Document. However, the current implementation couples the `CanonicalRenderer` directly to the active `LayoutProfile` via a simple React Context. While effective for prototyping, this direct coupling lacks the abstraction necessary to resolve complex, cascading profile hierarchies (e.g., government defaults overridden by school-wide profiles, overridden by document-specific adjustments).

## Future ELE Architecture
The Enterprise Layout Engine (ELE) introduces a dedicated resolution layer. It acts as an intermediate evaluator that merges multiple layout profiles into a single `ResolvedLayoutContext` consumed by the Presentation Layer. 

### Responsibilities
- **Renderer:** Strictly responsible for mapping `CanonicalDocument` blocks to DOM elements. Consumes the resolved layout values blindly.
- **Enterprise Layout Engine (ELE):** Responsible for executing the profile merge logic, applying constraints, resolving conflicts, and exposing a static layout object to the Renderer.
- **Layout Profiles:** Pure data structures storing configuration values. Contains zero rendering logic.

### Data Flow
```text
Knowledge Layer 
      ↓
   Builders 
      ↓
Canonical Document         [Profile Hierarchy]
      ↓                            ↓
===================================================
||                  Renderer                     ||
||                     ↓                         ||
||         Enterprise Layout Engine (ELE)        ||
||                     ↓                         ||
||          Layout Profile Resolution            ||
===================================================
      ↓                            ↓
   Preview                        PDF
```

### Profile Hierarchy
The ELE will resolve layout values using a strict cascading hierarchy (highest priority at the bottom):
1. **Government Default (Immutable):** Baseline GDDS and GSLS standard values.
2. **Workspace Profile (School-wide Defaults):** Configurations set by the Regional Education Office or School Principal.
3. **Document Profile:** Specific overrides saved within a single KSP document.
4. **Temporary Preview Overrides:** Real-time adjustments made via the Preview Inspector (not yet saved).
5. **-> Resolved Layout:** The final computed layout object provided to the Renderer.

## Future Features Evaluated
- **Presets:** Support for pre-certified layout templates (e.g., "Dense A4", "Relaxed A4").
- **Import/Export:** Profiles can be serialized to JSON for sharing between schools or districts.
- **School-wide Defaults:** Admins can lock certain workspace profiles to enforce consistency.
- **Print/PDF Specific Overrides:** Context-aware resolution (e.g., overriding margins only when the target is PDF).
- **Read-only Government Profiles:** Immutable base profiles that guarantee fallback safety.

## Migration Strategy
1. Introduce the `EnterpriseLayoutEngine` class/hook to handle merging logic.
2. Refactor `LayoutProfileContext` to provide the `ResolvedLayout` output from the ELE rather than the raw state.
3. Shift the current `defaultLayoutProfile` into the immutable "Government Default" tier.
4. Integrate the Workspace Inspector to modify only the "Temporary Preview Overrides" tier until a save action promotes it to the "Document Profile" tier.

## Backward Compatibility
The ELE will be fully backward compatible. The `CanonicalDocument` schema remains untouched. Existing documents without saved profiles will implicitly fall back to the Government Default, ensuring zero visual disruption.

## Risk Assessment
- **Performance:** Deep merging of profiles on every keystroke/slider adjustment could cause React render lag. 
  - *Mitigation:* Memoize the resolved layout object and debounce the ELE resolution function during active slider dragging.
- **Constraint Violations:** Users might create a profile that breaks government standards.
  - *Mitigation:* The ELE must enforce hard boundaries (e.g., `approvalSignatureHeight` min/max limits) during the resolution phase.

## Implementation Roadmap
- **Phase 1:** Build the `EnterpriseLayoutEngine` logic and hierarchical merge strategies (isolated from UI).
- **Phase 2:** Refactor the Workspace Preview to consume the ELE output.
- **Phase 3:** Introduce serialization, allowing users to save their temporary overrides to the Document Profile.
- **Phase 4:** Introduce administrative Workspace Profiles and Theme Presets.

==================================================
## FINAL DECISION
**READY**

The ELE Architecture Blueprint is robust, safely decoupled from the Knowledge Layer, and ready for future roadmap scheduling.
