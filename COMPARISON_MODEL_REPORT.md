# COMPARISON MODEL REPORT

## 1. Description
The `ComparisonData` interface adds semantic depth to the numerical benchmark values that were previously flat numbers within the RPIE dimension object.

## 2. Structure
- `ranking`: Absolute positional rank.
- `percentile`: Relative percentile placement.
- `description`: Narrative description of the comparison.
- `explanation`: Contextual insights (e.g., "Meningkat dibandingkan rerata daerah").

Each dimension now holds explicit district, provincial, and national comparison objects.
