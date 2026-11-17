# RECOMMENDATION EXTRACTION REPORT

## Recommendation Block Architecture
- **Trigger**: A new Recommendation block is instantiated whenever a valid Indicator ID or Name appears in the primary column (and it's not the header repeating).
- **Extraction Scope**:
  - `Indicator Name` & `ID`
  - `Akar Penyebab`
  - `Benahi` (Recommendation)
  - `Kegiatan` (Improvement Activity)
- **Multi-line Support**: Long texts for `akarPenyebab`, `benahi`, and `kegiatan` often spill into the rows below in Excel. The block engine safely captures and strings these overflow cells into continuous paragraphs before saving the object.
- **Result**: The length of the imported recommendations accurately reflects the logical sections in the worksheet without inflating or deflating the count.
