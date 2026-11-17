# SWOT ENGINE REPORT

## Architecture
The SWOT Engine operates as an overlay processor on top of the Indicator Engine.

## Algorithmic Sorting
- **Strengths (S):** All indicators categorized as 'Hijau'. Sorted by highest value.
- **Weaknesses (W):** All indicators categorized as 'Kuning' or 'Merah'. Sorted by `priorityScore` (highest urgency and gap).
- **Opportunities (O):** Indicators flagged as 'Kuning' but possessing an upward trend ('Naik').
- **Threats (T):** Indicators flagged as 'Kuning' or 'Merah' possessing a downward trend ('Turun').

## Impact
SWOT analysis is no longer a manual qualitative exercise. It is a mathematically derived matrix, dynamically updating as Rapor Pendidikan data is ingested or modified.
