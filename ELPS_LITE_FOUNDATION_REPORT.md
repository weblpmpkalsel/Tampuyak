# Enterprise Layout Profile System (ELPS) - Lite Foundation

## Objective
Establish the foundation of the Enterprise Layout Profile System (ELPS) to allow lightweight, government-compliant layout adjustments without mutating the underlying document structure.

## Architecture & Data Flow
The ELPS introduces a unidirectional layout configuration that bypasses the Builders and Knowledge Layer entirely.

**Data Flow:**
`Layout Profile (State in Workspace) -> Presentation Context -> CanonicalRenderer -> React CSS/Styles -> Preview (and eventually PDF Publisher)`

- **Builders:** Do NOT read layout profiles. The Canonical Document remains immutable and purely semantic.
- **Renderer:** Intercepts the Layout Profile Context and dynamically adjusts specific inline constraints based on the active profile.

## Layout Profile Specification
The profile object is strictly typed and limited to the following five approved properties:
1. `coverLogoScale` (number): Adjusts the `<img/>` scaling property for the cover.
2. `coverTopOffset` (number): Modifies the top padding of the cover page in cm.
3. `approvalSignatureHeight` (number): Defines the height of the signature void block (`.gsls-signature-space`) in cm.
4. `approvalColumnGap` (number): Defines the horizontal gutter space between signature blocks (`.gsls-signature-grid`) in cm.
5. `paragraphSpacing` (number): Defines the `margin-bottom` of standard justified paragraphs in pt.

## Files Modified
1. **`src/enterprise/workspace/preview/LayoutProfile.ts` (New)**
   - Created the `LayoutProfile` interface and `LayoutProfileContext` to distribute the profile safely without prop-drilling through every renderer layer.
2. **`src/enterprise/workspace/preview/CanonicalRenderer.tsx`**
   - Bound the `LayoutProfileContext.Provider`.
   - Updated `SectionRenderer` to calculate `coverTopOffset`.
   - Updated `BlockRenderer` to inject inline styles for `coverLogoScale`, `approvalSignatureHeight`, `approvalColumnGap`, and `paragraphSpacing`.
3. **`src/enterprise/workspace/preview/KspPreviewWorkspace.tsx`**
   - Introduced a new `LAYOUT` tab on the right Inspector panel.
   - Wired an interactive layout settings form directly to the renderer's real-time state for immediate visual feedback.

## Renderer Integration
- The `.gsls-signature-space` respects explicit height settings from the profile while retaining fallback behavior.
- `.gdds-p` paragraph styles receive dynamic `marginBottom` overriding without affecting the protected `.gsls-role-block` or `.gsls-identity-block` layouts.

## Regression Verification
- **Immutable Document:** The core `CanonicalDocumentTypes.ts` and `KspDocumentAssembler.ts` remain completely isolated from layout parameters.
- **GDDS Integrity:** The adjustments are constrained (e.g. `margin-bottom` vs full margin overrides) to prevent users from breaking the overarching Indonesian government document compliance.
- Build and Lint processes pass with no errors.

## Future Expansion Plan
- Migrate `LayoutProfile` persistence to a backend state or local storage bound to the user's Enterprise ID.
- Provide constrained "Theme Profiles" (e.g., *Dense A4*, *Relaxed A4*) to abstract the numeric sliders into pre-certified template selections.
- Add support for `.gsls-role-block` specific typography scaling if requested by regional education offices.

## Conclusion
**GO.**
The ELPS Lite Foundation successfully provides strict, isolated layout adjustments directly to the Presentation Layer while preserving 100% of the Knowledge and Canonical Model's data integrity.
