# INDICATOR ENGINE REPORT

## Architecture
The Indicator Engine is the most granular layer of the Rapor Pendidikan Intelligence Engine (RPIE). It transforms static numerical inputs into rich intelligence objects.

## Data Enrichment
Every indicator object now inherently possesses:
1. **Value & Target:** The raw score against the benchmark.
2. **Gap Matrix:** The mathematical delta (`gap = target - value`).
3. **Color Translation:** Automatic interpretation of 'Hijau', 'Kuning', or 'Merah'.
4. **Evidence String:** Automatically generated literal evidence (e.g., "Data Rapor Pendidikan: Kemampuan Literasi = 45").
5. **Priority Score:** A dynamic calculation `priorityScore = urgency * impact * gap` used by the Priority Engine.
6. **Root Causes & Recommendations:** Deep references to identified issues.

Indicators are no longer just numbers; they are active components that drive the downstream RKT and RKAS generation.
