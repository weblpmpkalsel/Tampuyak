# RC5.4 WORKSPACE EVOLUTION ARCHITECTURE

## 1. FUTURE WORKSPACE SITEMAP (NAVIGATION TREE)
The future Workspace is reorganized around Knowledge Domains to ensure every paragraph in the KSP document has exactly one editable source, without duplication.

1. **Dashboard Data** (Overview & Health)
2. **Profil & Identitas** (School Data, Vision, Mission, Goals)
3. **Karakteristik & Lingkungan** (Location, Student Pedagogy, Partnerships, Local Potential)
4. **Tahun Pelajaran & Kalender** (Academic Year, Events, Effective Weeks)
5. **Pejabat & Tim Penyusun** (Signatories, KSP Drafting Team, Approval Metadata)
6. **Pengorganisasian Pembelajaran** (Intracurricular, Cocurricular, Extracurricular)
7. **Evaluasi & Pendampingan** (Monitoring, Reflection, Follow-up, Professional Dev)
8. **Sarana Prasarana** (Learning Spaces, Infrastructure)
9. **Guru & Tenaga Kependidikan** (Educators, Staff)
10. **Rombel & Anggaran** (Classes, Budget Parameters)

---

## 2. KNOWLEDGE DOMAIN MAPPING

### 2.1 Profil & Identitas
- **Purpose**: Manage foundational school identity, vision, mission, and objectives.
- **Knowledge Owner**: Kepala Sekolah
- **Stored Metadata**: `settings.school`, `settings.identitas`
- **Consumed By**: `SchoolProfileBuilder`, `VisionMissionBuilder`
- **Document Chapter**: Cover, Preface, BAB I, BAB II

### 2.2 Karakteristik & Lingkungan
- **Purpose**: Manage environmental context, student pedagogical characteristics, and local potential.
- **Knowledge Owner**: Tim Penyusun KSP, Guru BK
- **Stored Metadata**: `settings.karakteristik`, `settings.pesertaDidik`, `settings.potensi`
- **Consumed By**: `SchoolContextBuilder`
- **Document Chapter**: BAB I

### 2.3 Tahun Pelajaran & Kalender
- **Purpose**: Configure academic time boundaries and structural events.
- **Knowledge Owner**: Wakasek Kurikulum
- **Stored Metadata**: `settings.academicYears`, `settings.calendar` *(New)*
- **Consumed By**: `AcademicCalendarBuilder`
- **Document Chapter**: BAB III

### 2.4 Pejabat & Tim Penyusun
- **Purpose**: Track personnel responsible for authorizing and drafting the document.
- **Knowledge Owner**: Kepala Tata Usaha, Kepala Sekolah
- **Stored Metadata**: `settings.principal`, `settings.komite`, `settings.pengawas`, `settings.approval` *(New)*, `settings.draftingTeam` *(New)*
- **Consumed By**: `ApprovalBuilder`, `TeamBuilder`, `LearningOrganizationBuilder`
- **Document Chapter**: Approval Page, Team Page, Preface, BAB III

### 2.5 Pengorganisasian Pembelajaran
- **Purpose**: Map intra, co, and extra-curricular frameworks and workload distribution.
- **Knowledge Owner**: Tim Pengembang Kurikulum
- **Stored Metadata**: `settings.curriculum` *(New)*
- **Consumed By**: `LearningOrganizationBuilder`
- **Document Chapter**: BAB III

### 2.6 Evaluasi & Pendampingan
- **Purpose**: Plan monitoring, reflection, and professional development strategies.
- **Knowledge Owner**: Kepala Sekolah, Pengawas
- **Stored Metadata**: `settings.evaluation` *(New)*
- **Consumed By**: `Bab4Builder` (Direct mapping via Adapter)
- **Document Chapter**: BAB IV

---

## 3. INPUT COVERAGE MATRIX

| KSP Requirement | Workspace Page | Stored Metadata | Status |
| :--- | :--- | :--- | :--- |
| **Cover & Preface** | Profil & Identitas | `settings.school` | Existing |
| **Approval Data** | Pejabat & Tim Penyusun | `settings.approval` | *Planned* |
| **Drafting Team** | Pejabat & Tim Penyusun | `settings.draftingTeam` | *Planned* |
| **Vision & Mission** | Profil & Identitas | `settings.identitas` | Existing |
| **Student Stats** | Karakteristik & Lingkungan | `settings.pesertaDidik` | Existing |
| **Student Pedagogy** | Karakteristik & Lingkungan | `settings.karakteristik` | *Planned* |
| **Local Potential** | Karakteristik & Lingkungan | `settings.potensi` | Existing |
| **Partnerships** | Karakteristik & Lingkungan | `settings.kemitraan` | *Planned* |
| **Curriculum Org** | Pengorganisasian Pembelajaran | `settings.curriculum` | *Planned* |
| **Calendar** | Tahun Pelajaran & Kalender | `settings.calendar` | *Planned* |
| **Evaluation Plans** | Evaluasi & Pendampingan | `settings.evaluation` | *Planned* |

---

## 4. DOCUMENT DEPENDENCY MATRIX

| Workspace Metadata (Source of Truth) | Canonical Builder | Document Chapter |
| :--- | :--- | :--- |
| `settings.school` | `SchoolProfileBuilder` | Cover, Preface, BAB I |
| `settings.approval` | `ApprovalSectionBuilder` | Lembar Pengesahan |
| `settings.draftingTeam` | `TeamSectionBuilder`, `LearningOrgBuilder` | Tim Penyusun, BAB III |
| `settings.identitas` | `VisionMissionBuilder` | BAB II |
| `settings.karakteristik` | `SchoolContextBuilder` | BAB I |
| `settings.pesertaDidik` | `SchoolContextBuilder` | BAB I |
| `settings.calendar` | `AcademicCalendarBuilder` | BAB III |
| `settings.curriculum` | `LearningOrganizationBuilder` | BAB III |
| `settings.sarpras` | `LearningOrganizationBuilder` | BAB III |
| `settings.evaluation` | *Passthrough via Adapter* | BAB IV |

---

## 5. MIGRATION PLAN

### Strategy: Additive Expansion
1. **State Preservation**: Existing `settings` properties (`school`, `identitas`, `karakteristik`) will NOT be mutated or renamed.
2. **New Domains**: Introduce new isolated domains in the state tree: `settings.calendar`, `settings.curriculum`, `settings.evaluation`, `settings.approval`, `settings.draftingTeam`.
3. **Default Hydration**: New domains initialize as `undefined` or empty arrays to prevent breaking existing profiles.
4. **Adapter Evolution**: `KspMetadataAdapter` acts as the translation layer, safely mapping new domains into the Enterprise Knowledge Payload.

### Backward Compatibility
- Thanks to the **Partial Knowledge Projection** (RC5.2E) implemented in the Builders, the Enterprise Document Assembler safely falls back to `"Belum diisi."` or `"Data belum tersedia."` when these new fields are empty in legacy workspaces. 

---

## 6. IMPLEMENTATION PRIORITY

1. **PRIORITY 1: Front Matter & BAB I Completeness**
   - Add Approval Metadata, Drafting Team, and Pedagogical Characteristics.
   - *Impact*: Completes the Front Matter and BAB I without any mock data gaps.
2. **PRIORITY 2: Pengorganisasian Pembelajaran (BAB III)**
   - Add Curriculum Organization and Academic Calendar tabs.
   - *Impact*: Replaces massive missing sections in BAB III.
3. **PRIORITY 3: Evaluasi & Pendampingan (BAB IV)**
   - Add Evaluation, Monitoring, and Professional Development tabs.
   - *Impact*: Completes the final chapter of the document.

==================================================
## FINAL DECISION
**GO**

The Workspace Evolution Architecture is sound. It respects the existing Master Data state, aligns perfectly with the Enterprise Knowledge Services, guarantees a single source of truth, and provides a clear, backward-compatible path to 100% document coverage.
