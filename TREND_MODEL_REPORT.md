# TREND MODEL REPORT

## 1. Description
A dedicated `TrendData` interface was introduced into the RPIE system.

## 2. Structure
- `status`: 'Improving' | 'Declining' | 'Stable' | 'Unknown'
- `trendValue`: Number representation of the magnitude of change
- `trendDirection`: Narrative string
- `trendExplanation`: Explanation for analytical purposes

This allows the UI and export systems to distinguish between the absolute score status and its temporal trajectory.
