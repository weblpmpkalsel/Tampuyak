# WORKSPACE SEPARATION REPORT

## Architecture Changes
The application rendering has been strictly partitioned into three isolated contexts:
- **WORKSPACE MODE**: Contains operator forms, navigation sidebars, steppers, and interactive UI.
- **AUDIT MODE**: Dedicated coverage metrics, completeness checks, and data layer validations that appear ONLY in the 'Sertifikasi Data' tab.
- **DOCUMENT MODE**: Contains ONLY official content (narrative paragraphs, administrative tables, headers, signatures). All audit and workspace UI are explicitly excluded from this layer.

## Implementation Details
Separation is enforced structurally within `Tampuyak.tsx`. Print cascading stylesheets (`@media print`) and Tailwind's `print:hidden` precisely omit the sidebar (`<aside>`), global steppers, headers (`<header>`), action toolbars, and diagnostic panels during print execution.
