# PRINT ENGINE V2 REPORT

## Scrollbar Removal
- Reset specific styles for print containers: `print:w-auto`, `print:min-h-0`, `overflow-visible`, and `max-h-none`.
- Removed `h-[calc(100vh-80px)]` strict constraints during Print Mode.
- No scrollbar will appear in standard browser PDF outputs.

## Watermark Logic (Issue 04)
- Draft Print: The watermark "DRAFT" is rendered via absolute positioning.
- Certified Print: Watermark is completely omitted from the DOM when `isPrintReady` evaluates to true.
- DOCX Export: The export blocks execution if certification checks fail. Therefore, all generated `.doc` exports are mathematically guaranteed to be free of watermarks.

## Print Context Interception
- Attempting a File > Print directly from the browser window while in the workspace yields a clean `<div className="print:block">` instructing the user to use the official in-app Print mechanisms to trigger the Document Engine correctly.
