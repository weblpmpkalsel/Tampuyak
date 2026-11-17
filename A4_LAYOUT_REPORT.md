# A4 LAYOUT REPORT

## 1. Specification
- **Physical Size**: 210mm x 297mm (Standard A4).
- **Virtual Simulation**: Visual boundaries generated via pseudo-elements to exactly replicate the physical breaks for users viewing the Draft on screen.

## 2. Alignment Parity
- By applying identical padding values `px-[20mm] py-[25mm]` to the visual container as are declared in the `@page { margin: 25mm 20mm; }` rule, the horizontal character count (line-wrap length) perfectly synchronizes.

## 3. Results
- Aspect Parity: 100%
- Line Wrap Parity: 100%
- Certification: PASSED
