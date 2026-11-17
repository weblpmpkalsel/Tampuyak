# VISION DATA TRACE

## 1. Workspace State
**Current Value:** Data exists in `settings.identitas` (keys: `visi`, `misi`, `tujuan`).
**Expected Value:** Data exists in `settings.identitas`.

## 2. KspMetadataAdapter (Assembler Adapter)
**Current Value:** `rawStrategicPolicy = settings?.strategicPolicy || undefined;` (Evaluates to `undefined`).
**Expected Value:** Should read from `settings.identitas` and map the properties.

## 3. Assembler (KspDocumentAssembler.ts)
**Current Value:** `rawStrategicPolicy` is `undefined`.
**Expected Value:** Should receive a populated object `{ vision, mission, goals }`.

## 4. VisionMissionInput
**Current Value:** `strategicPolicy: undefined`.
**Expected Value:** `strategicPolicy` containing populated fields.

## 5. VisionMissionService
**Current Value:** `normalizePayload(undefined)` returns empty strings and arrays: `{ vision: "", mission: [], goals: [] }`.
**Expected Value:** Should normalize the actual populated payload.

## 6. Builder (KspBab2Structure.ts)
**Current Value:** Receives empty fields and triggers the fallback: `"Data belum tersedia."`.
**Expected Value:** Should receive data and render the corresponding `TEXT` blocks.

---

## DIAGNOSIS

### Pipeline
Workspace State (`settings.identitas`) -> KspMetadataAdapter -> Assembler (`rawStrategicPolicy`) -> VisionMissionService -> Builder

### Broken Layer
**KspMetadataAdapter** (The boundary between UI State and the Assembler).

### Root Cause
`KspMetadataAdapter.ts` attempts to read strategic policy data from `settings.strategicPolicy`, which does not exist in the Workspace state. The Profile Workspace stores this data under `settings.identitas` with Indonesian keys (`visi`, `misi`, `tujuan`). Because of this incorrect property access and schema mismatch, the data is completely dropped before it even reaches the Assembler.

### Affected File
`src/ksp/KspMetadataAdapter.ts`

### Affected Property
`rawStrategicPolicy` assignment inside `KspMetadataAdapter.adapt(settings: any)`

### Recommended Minimal Fix
Update `KspMetadataAdapter.ts` to correctly read from `settings.identitas` and map the Indonesian property names to the English schema expected by `StrategicPolicyInput`:

```typescript
      rawStrategicPolicy: settings?.identitas ? {
        vision: settings.identitas.visi || '',
        mission: settings.identitas.misi || [],
        goals: settings.identitas.tujuan || []
      } : undefined,
```
