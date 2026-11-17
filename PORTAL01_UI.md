# PORTAL-01 UI/UX Standards

## Design Philosophy
The enterprise portal is designed to be modern, professional, and government-friendly. It focuses on clarity, speed, and trust.

## Visual Language
- **Typography**: Uses the default sans-serif Tailwind stack (Inter-like) for optimal legibility on all devices.
- **Color Palette**: 
  - Primary Action: Slate-900 (Text) & Blue-600 (Buttons)
  - Backgrounds: Slate-50 for depth, White for foreground elements.
  - Success/Warning/Error: Standard Emerald, Amber, and Red palettes used sparingly for state indications.
- **Spacing**: Generous padding (`py-12`, `py-20`) to prevent visual clutter and ensure mobile touch targets are accessible.
- **Imagery**: Uses the standardized Tampuyak mascot logo for brand consistency.
- **Animations**: Minimal. Relies on standard browser transitions (`transition-colors`) for hover states. No heavy JS animations are used, ensuring rapid load times.

## Responsiveness
- **Mobile First**: All forms and layouts stack vertically by default.
- **Tablet/Desktop**: Grids expand (`md:grid-cols-2`, `lg:grid-cols-4`) to utilize wider viewports effectively.
- **Navigation**: Adapts to screen sizes, keeping essential CTA buttons visible while simplifying the header on smaller screens.
