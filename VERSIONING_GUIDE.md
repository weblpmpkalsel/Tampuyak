# Versioning Guide

## Philosophy
Master data in Tampuyak OS is immutable once published and associated with an active academic year. The system uses a forward-only versioning strategy to ensure historical integrity.

## Academic Year Binding
Every academic year in Tampuyak OS binds to a specific version timestamp of the Master Education Platform.
- Example: Academic Year 2024/2025 binds to MEP Version `v2024.1`.
- When regulations change in mid-2025 (creating `v2025.1`), documents authored in the 2024/2025 context continue to be validated against `v2024.1` rules.

## Updating Data (The Knowledge Update Engine)
Administrators do NOT manually overwrite database records.
1. Admin uploads a new official document (e.g., Permendikbud PDF).
2. The engine parses the document and creates a diff against the current active state.
3. The engine generates a draft of the new Master Data state (e.g., added RKAS codes, deprecated chapters).
4. Upon approval, a new MEP Version is minted (e.g., `v2025.1`).
5. The previous version status transitions from `ACTIVE` to `ARCHIVED`.

## Deprecation Handling
- Entities (like an RKAS code) are never deleted.
- If a code is removed in a newer version, its status is set to `ARCHIVED` in the new version snapshot.
- Queries for active codes in the new version will exclude the archived record, but historical queries will still resolve correctly.
