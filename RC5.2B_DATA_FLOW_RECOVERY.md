# RC5.2B DATA FLOW RECOVERY

## PIPELINE DIAGRAM
Profile Editor
↓
Workspace State (`settings.identitas`)
↓
Persistence Layer
↓
KspMetadataAdapter (`KspMetadataAdapter.adapt()`)
↓
Assembler (`KspDocumentAssembler.ts`)
↓
VisionMissionService (`processVisionMission()`)
↓
VisionMissionPayload
↓
BAB II Builder (`KspBab2Structure.ts`)
↓
Canonical Document

## TRACE
1. **Profile Editor / Workspace State**
   - **Current Value:** Exists in `settings.identitas` (keys: `visi`, `misi`, `tujuan`)
   - **Expected Value:** Exists in Workspace state.
   - **Object Name:** `settings`
   - **Source File:** `src/Tampuyak.tsx` (DataSekolahView)

2. **KspMetadataAdapter**
   - **Current Value:** `settings?.strategicPolicy || undefined` (Evaluates to `undefined`)
   - **Expected Value:** Populated with data from `settings.identitas`.
   - **Object Name:** `rawStrategicPolicy`
   - **Source File:** `src/ksp/KspMetadataAdapter.ts`

3. **Assembler**
   - **Current Value:** `rawStrategicPolicy` is `undefined`.
   - **Expected Value:** Populated `StrategicPolicyInput` object.
   - **Object Name:** `visionMissionInput.strategicPolicy`
   - **Source File:** `src/enterprise/document/ksp/KspDocumentAssembler.ts`

4. **VisionMissionService**
   - **Current Value:** `normalizePayload(undefined)` returns `{ vision: "", mission: [], goals: [] }`.
   - **Expected Value:** Returns populated `VisionMissionPayload`.
   - **Object Name:** `payload`
   - **Source File:** `src/enterprise/knowledge/services/VisionMissionService.ts`

5. **BAB II Builder**
   - **Current Value:** Receives empty payload, returns "Data belum tersedia."
   - **Expected Value:** Renders exact canonical TEXT blocks with Visi/Misi/Tujuan.
   - **Object Name:** `payload.vision`, `payload.mission`, `payload.goals`
   - **Source File:** `src/enterprise/document/ksp/bab2/KspBab2Structure.ts`

## IDENTIFY
The FIRST location where the value becomes undefined is **KspMetadataAdapter.ts** during the `KspMetadataAdapter.adapt(settings: any)` mapping step.

## BROKEN LAYER
**KspMetadataAdapter** (The boundary between the UI state and the Assembler).

## ROOT CAUSE
The Adapter attempts to read the Vision/Mission data from `settings.strategicPolicy`. However, the Workspace State (defined in `Tampuyak.tsx`) persists this data under the key `settings.identitas` using the Indonesian property names `visi`, `misi`, and `tujuan`. Because of this schema mismatch, the real authoritative data is dropped. 

## AFFECTED FILE
`src/ksp/KspMetadataAdapter.ts`

## AFFECTED PROPERTY
`rawStrategicPolicy` assignment inside the `KspMetadataAdapter.adapt(settings: any)` static method.

## MINIMAL FIX STRATEGY
Update `KspMetadataAdapter.ts` to map `rawStrategicPolicy` using `settings?.identitas`. 
Map `visi` -> `vision`, `misi` -> `mission`, and `tujuan` -> `goals`.
