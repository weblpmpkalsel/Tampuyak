# Incident Resolution: "Duplicate ID detected: IND-A.1"

## Root Cause
When a user uploads a real-world workbook (Rapor Pendidikan), certain indicators (like `A.1`) often appear across multiple sheets (e.g., in "Seluruh Capaian" and "Prioritas Rekomendasi"). 
Prior to the RC-09 fix, the parser fallback assigned unique incremental IDs (`IND-1`, `IND-2`), so duplicates were technically stored as distinct records, preventing graph collision.
With RC-09 implemented, the parser correctly extracted `A.1` from both sheets, pushing `{id: "A.1"}` multiple times into the `indicators` array. When `KnowledgeGraphEngine.build()` processed the array, it created `IND-A.1` twice, triggering a strict uniqueness validation error (`Duplicate ID detected: IND-A.1`), causing the upload to abort.

## Implementation Fix
- Applied a deduplication layer directly within `CanonicalParser.parse`. 
- When an indicator is parsed, we now check if `id` (e.g., `A.1`) already exists in the `indicators` array.
- If it exists, the parser intelligently merges any missing fields (like `score`, `trend`, `rank`) rather than blindly pushing a duplicate object.
- This guarantees the graph only ever receives one pristine canonical representation per indicator, completely resolving the Duplicate ID crash while preserving all data.

## Verification
- Upload test passes safely without halting.
- `A.1` remains stable across the ecosystem (Dashboard, Priority Engine).
- Synthetic IDs (`IND-*`) correctly increment based on absolute length, guaranteeing no downstream collisions.
