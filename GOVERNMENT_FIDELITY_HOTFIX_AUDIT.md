# GOVERNMENT FIDELITY HOTFIX AUDIT

## 1. MOCK PAYLOADS & HARDCODED NARRATIVES
The following files inject hardcoded AI narratives directly into the document assembly pipeline:

**File: `src/enterprise/document/ksp/KspDocumentAssembler.ts`**
- `rawStrategicPolicy` (line 96): Invents vision ("Mewujudkan peserta didik yang beriman..."), mission, and goals.
- `learningOrgPayload` (line 125): Invents `academicTime` (effectiveWeeks: 36), `stage`, `learningStructures` (team members like 'Bapak Wakil, S.Pd.'), `learningSpaces` (18 classrooms, 'Lab Komputer', '100 Mbps'), `intracurricular`, `cocurricular`, and `extracurricular` data.
- `calendarInput` (line 146): Invents hardcoded calendar events (e.g., '15 Juli 2026 - Masa Pengenalan Lingkungan Sekolah').
- `bab4Payload` (line 176): Invents programs ('Supervisi Akademik'), monitoring activities, evaluation frameworks ('Survei Lingkungan Belajar & Observasi'), reflection mechanisms, follow-up strategies ('IHT Pemanfaatan Platform Merdeka Mengajar'), and professional development plans. Also includes a hardcoded narrative: "Berdasarkan Rapor Pendidikan tahun lalu, literasi dan numerasi menunjukkan tren peningkatan, namun aspek karakter kemandirian masih memerlukan penguatan."

## 2. FALLBACKS & NULL-COALESCING DEFAULTS (|| and ??)
The following files contain fallbacks that invent data when the authoritative source is missing:

**File: `src/enterprise/knowledge/builders/SchoolContextBuilder.ts`**
- `totalStudents: rawObservation.totalStudents || 0`
- `genderDistribution: rawObservation.genderDistribution || { male: 0, female: 0 }`
- `generalCharacteristics: rawObservation.generalCharacteristics || []`
- `dominantLearningNeeds: rawObservation.dominantLearningNeeds || []`

**File: `src/enterprise/document/ksp/bab1/KspBab1Structure.ts`**
- Uses the defaulted `0` values from the builder to generate an AI narrative: 
  *"{schoolName} memiliki jumlah peserta didik sebanyak 0 orang, dengan sebaran gender terdiri dari 0 laki-laki dan 0 perempuan. Secara umum, peserta didik memiliki karakteristik . Kebutuhan belajar yang dominan adalah . Keberagaman karakteristik dan kebutuhan ini menuntut sekolah untuk merancang strategi pembelajaran yang berdiferensiasi guna memastikan setiap individu dapat mencapai potensi maksimalnya."*

**File: `src/enterprise/document/ksp/bab3/KspBab3Structure.ts`**
- `payload.stage.educationStage || '-'`
- `payload.academicTime.effectiveWeeks || 0`
- `payload.academicTime.currentYear || '-'`
- `payload.academicTime.semester || '-'`
- `payload.learningSpaces.classrooms || 0`
- `payload.learningSpaces.laboratories?.join(', ') || '-'`
- `payload.learningSpaces.library || '-'`
- `payload.learningSpaces.ict?.join(', ') || '-'`

**Knowledge Services (`src/enterprise/knowledge/services/*.ts`)**
- `EvaluationService.ts`: `?? 'MANUAL_ENTRY'`, `?? 'unknown'`, `?? ''`, `?? []`
- `AcademicCalendarService.ts`: `?? 0`, `?? ''`, `?? 'unknown'`, `?? []`
- `SchoolProfileService.ts`: `?? ''`
- `VisionMissionService.ts`: `?? ''`, `?? []`, `?? 'MASTER_DATA'`, `?? 'unknown'`
- `LearningOrganizationService.ts`: `?? 0`, `?? ''`, `?? 'unknown'`

## 3. PLACEHOLDER DATA
**File: `src/enterprise/document/ksp/approval/KspApprovalStructure.ts`**
- `config.documentNumber || '....................................'`
- `config.schoolCommitteeName || '..........................'`
- `config.approvalDate || '........................'`
- `config.principalNip || '..........................'`
- `config.supervisorNip || '..........................'`
*(Note: While dot-leaders are standard for physical signature lines, they act as fallbacks bypassing the strict absence protocol.)*

## 4. RISK ASSESSMENT
**HIGH RISK.** The system is actively violating Government Fidelity constraints by inventing student counts (0), gender counts (0, 0), and generating unauthorized narratives regarding Rapor Pendidikan and learning characteristics when authoritative data is absent. Mock payloads in the root assembler bypass all knowledge validation pipelines, ensuring that the generated KSP document always contains fabricated institutional data (vision, mission, facilities, calendar events) rather than returning "Data belum tersedia."

## 5. FILES REQUIRING CLEANUP
1. `src/enterprise/document/ksp/KspDocumentAssembler.ts`
2. `src/enterprise/knowledge/builders/SchoolContextBuilder.ts`
3. `src/enterprise/document/ksp/bab1/KspBab1Structure.ts`
4. `src/enterprise/document/ksp/bab3/KspBab3Structure.ts`
5. `src/enterprise/document/ksp/approval/KspApprovalStructure.ts`
6. `src/enterprise/knowledge/services/EvaluationService.ts`
7. `src/enterprise/knowledge/services/AcademicCalendarService.ts`
8. `src/enterprise/knowledge/services/SchoolProfileService.ts`
9. `src/enterprise/knowledge/services/VisionMissionService.ts`
10. `src/enterprise/knowledge/services/LearningOrganizationService.ts`

## 6. FINAL DECISION
**NO GO**

Extensive hardcoded data and unsafe fallbacks have been identified across the document assembly and knowledge pipelines. A strict cleanup phase is required before production deployment.
