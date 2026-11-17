# ELEMENT ENGINE REPORT

## Architecture
The Element Engine acts as the bridge between high-level Dimensions and granular Indicators.

## Implementation Details
- Indicators are automatically grouped into `Element` arrays based on their hierarchical ID prefixes (e.g., `A.1.1` maps to element `A.1`).
- This hierarchy mimics the official semantic structure of Rapor Pendidikan.
- Elements serve as the primary grouping mechanism for Root Cause Analysis (Identifikasi & Refleksi).
- Elements prevent the system from flattening the data, preserving the logical groupings intended by the Ministry of Education.
