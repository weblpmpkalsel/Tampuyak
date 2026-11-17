# RAW STUDENT TRACE

## PIPELINE
Profile Workspace
↓
KspMetadataAdapter
↓
Assembler
↓
Builder
↓
Canonical Document

## STAGE 1: Profile Workspace
**Current Value:**
`settings.pesertaDidik`: `{ total: [number], lakiLaki: [number], perempuan: [number], jumlahRombel: [number] }`
`settings.karakteristik.pesertaDidik`: `"[string]"`
**Expected Value:** Data exists.
**Object Shape:** UI State representation.

## STAGE 2: KspMetadataAdapter
**Current Value:**
`rawStudents`: 
```json
{
  "totalStudents": [number],
  "genderDistribution": { "male": [number], "female": [number] },
  "generalCharacteristics": ["[string]"]
}
```
*(Notice that `dominantLearningNeeds` is missing / undefined)*
**Expected Value:** `rawStudents` should contain all fields required by the builder, including `dominantLearningNeeds`.
**Object Shape:** `StudentCharacteristicDomain` partial mapping.

## STAGE 3: Assembler
**Current Value:**
`SchoolContextKnowledgePayload.students`: 
```json
{
  "totalStudents": [number],
  "genderDistribution": { "male": [number], "female": [number] },
  "generalCharacteristics": ["[string]"],
  "dominantLearningNeeds": undefined
}
```
**Expected Value:** Payload should be fully populated.
**Object Shape:** `StudentCharacteristicDomain` inside `SchoolContextKnowledgePayload`.

## STAGE 4: Builder
**Current Value:**
`payload.students.dominantLearningNeeds` is `undefined`. The builder (`KspBab1Structure.ts`) runs the condition:
`if (students && students.totalStudents !== undefined && students.genderDistribution && students.generalCharacteristics && students.dominantLearningNeeds)`
Because `dominantLearningNeeds` is `undefined`, the condition fails and falls back to: `"Data belum tersedia."`
**Expected Value:** Condition passes and renders the student characteristics text block.
**Object Shape:** `StudentCharacteristicDomain`

## BROKEN MAPPING / ROOT CAUSE
The FIRST stage where the object mapping breaks is **Stage 2 (KspMetadataAdapter)**. 
The Adapter maps `totalStudents`, `genderDistribution`, and `generalCharacteristics`, but completely omits mapping `dominantLearningNeeds`.
Since `dominantLearningNeeds` becomes `undefined`, it fails the strict existence check in the Builder (Stage 4), causing the entire paragraph to fall back to `"Data belum tersedia."` even though the other fields actually contain data.

## MINIMAL FIX STRATEGY
In `KspMetadataAdapter.ts`, provide a mapping or a safe default for `dominantLearningNeeds` within `rawStudents`, such as mapping it from `settings.karakteristik` or providing a default array (e.g. `["pembelajaran berdiferensiasi"]`), or alternatively loosen the strict check in `KspBab1Structure.ts` if `dominantLearningNeeds` is truly optional.
