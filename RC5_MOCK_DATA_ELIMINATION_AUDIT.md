# KSP GOLD RC-5: MOCK DATA ELIMINATION AUDIT

## 1. COMPLETE INVENTORY

### A. KspDocumentAssembler.ts (Mock Payloads)
| File | Line | Displayed Content | Current Source | Expected Source | Replacement Strategy | Classification |
|---|---|---|---|---|---|---|
| `KspDocumentAssembler.ts` | 96 | "Mewujudkan peserta didik yang beriman..." (Vision, Mission, Goals) | Hardcoded `rawStrategicPolicy` | `VisionMissionService` | Fetch authoritative payload; if missing, throw error or return empty block. | **Mock Data** |
| `KspDocumentAssembler.ts` | 125 | 36 weeks, 18 Classrooms, Lab Komputer, 100 Mbps | Hardcoded `learningOrgPayload` | `LearningOrganizationService` | Dynamically fetch from school facility data. | **Mock Data** |
| `KspDocumentAssembler.ts` | 146 | "15 Juli 2026 MPLS", "17 Agustus Kemerdekaan RI", etc. | Hardcoded `calendarInput` | `AcademicCalendarService` | Dynamically fetch from Academic Calendar Engine. | **Mock Data** |
| `KspDocumentAssembler.ts` | 176 | "Berdasarkan Rapor Pendidikan tahun lalu...", Supervisi Akademik, IHT, dll. | Hardcoded `bab4Payload` | `EvaluationService` & `PlanningEngine` | Orchestrate from authentic evaluation and planning services. | **Mock Data** |

### B. Builders & Structures (Fallbacks & Narratives)
| File | Line | Displayed Content | Current Source | Expected Source | Replacement Strategy | Classification |
|---|---|---|---|---|---|---|
| `SchoolContextBuilder.ts` | 17-20 | `0`, `[]` (Student counts, Needs) | Null-coalescing `|| 0` | Master Data / Observation | Make fields nullable instead of injecting `0`. | **Fallback** |
| `KspBab1Structure.ts` | 63 | AI Narrative with "0 siswa, 0 laki-laki, 0 perempuan" | Template Literal using defaulted 0s | `Bab1KnowledgePayload` | Do not render narrative if data is empty/zero; render "Data belum tersedia." | **Legacy Testing / Fallback** |
| `KspBab3Structure.ts` | 60, 250, 320 | `-`, `0` | Null-coalescing `|| '-'`, `|| 0` | `LearningOrganizationKnowledge` | If missing, render "Data belum tersedia" instead of dashes. | **Fallback** |

### C. Services (Null-Coalescing Defaults)
| File | Line | Displayed Content | Current Source | Expected Source | Replacement Strategy | Classification |
|---|---|---|---|---|---|---|
| `EvaluationService.ts` | 145-167 | `'MANUAL_ENTRY'`, `'unknown'` | `?? 'unknown'` | Authoritative Metadata | Return actual metadata or fail validation. | **Fallback** |
| `AcademicCalendarService.ts` | 29-82 | `0`, `[]`, `'unknown'` | `?? 0`, `?? []` | Calendar Metadata | Remove defaults; propagate nulls to Builder. | **Fallback** |
| `VisionMissionService.ts` | 93-114 | `''`, `[]`, `'MASTER_DATA'`, `'unknown'` | `?? ''` | Policy Origin | Propagate nulls; do not mask missing data. | **Fallback** |
| `LearningOrganizationService.ts`| 80-193 | `0`, `''`, `'unknown'` | `?? 0` | Facilities Data | Propagate nulls; do not mask missing data. | **Fallback** |

### D. Approval / Frontmatter (Placeholders)
| File | Line | Displayed Content | Current Source | Expected Source | Replacement Strategy | Classification |
|---|---|---|---|---|---|---|
| `KspApprovalStructure.ts` | 34-133 | `....................................` | `|| '....'` | Configuration | While dot-leaders are standard for printed signature sheets, ensure they are explicitly defined as print-ready empty states, not generic fallbacks. | **Placeholder** |


## 2. RISK LEVEL
**CRITICAL / HIGH RISK.** 
The Assembler is currently acting as a mock data generator rather than an orchestrator. If this code goes to production, every KSP document generated will contain identical, fictional information regardless of the actual school context. This breaks the primary mandate of Government Fidelity and Source of Truth ownership.

## 3. MIGRATION STRATEGY
1. **Purge Mock Data:** Remove all hardcoded objects (`rawStrategicPolicy`, `learningOrgPayload`, `calendarInput`, `bab4Payload`) from `KspDocumentAssembler.ts`.
2. **Propagate Nullability:** Update Services and Builders to allow `undefined` or `null` instead of forcing `0`, `[]`, or `'unknown'`.
3. **Graceful Degradation:** Update `KspBab*Structure.ts` files to explicitly check for missing data and render `"Data belum tersedia."` instead of injecting fallback values into templates.
4. **Wire Authentic Services:** Ensure `KspDocumentAssembler.ts` actually queries the necessary services/adapters to retrieve the real metadata.

## 4. PRIORITY ORDER
1. Clean up `KspDocumentAssembler.ts` (Remove all mock payloads).
2. Clean up Null-Coalescing in `src/enterprise/knowledge/services/*.ts`.
3. Clean up `SchoolContextBuilder.ts` fallbacks.
4. Update `KspBab*Structure.ts` to handle missing data gracefully.

==================================================
## FINAL DECISION
**NO GO**

The system is currently plagued with mock data and fallbacks. The migration strategy defined above must be implemented in the next sprint before RC-5 can be finalized.
