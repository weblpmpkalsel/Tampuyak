# DEFECT TRACKING SYSTEM REPORT

## 1. System Architecture
The defect tracking system is built directly into the UI (via the QA Panel overlay) and utilizes the browser's `localStorage` to persist defect data per document (`tampuyak.qa.[docId]`).

## 2. Tracked Attributes
Each defect/finding captures the following data points:
- **Status:** PASS | WARN | FAIL
- **Severity:** Low | Medium | High | Critical
- **Findings & Comments:** Open text field for the reviewer to describe the issue.

## 3. Persistent Storage
All findings are saved automatically as they are entered and will persist across browser reloads. The reviewer may export the findings to a JSON file at any time using the "Export QA Findings" button at the bottom of the QA panel.
