# DOMAIN LANGUAGE ALIGNMENT
## TAMPUYAK OS - SUPERVISION MODULE

### 1. CORE PRINCIPLE
Tampuyak OS utilizes an **Administrative-First Ubiquitous Language**. The system is operated by School Executives and Assessors. The interface language must reflect data entry, tracking, and management, rather than self-service personal actions.

### 2. TERMINOLOGY SHIFTS (DEPRECATED -> ALIGNED)

| Concept | Deprecated (Self-Service) | Aligned (Administrative) |
|---|---|---|
| **Identity** | "Tugasku", "Dashboard Saya" | "Rekam Jejak Guru", "Data Supervisi" |
| **Document Submission** | "Unggah Modul", "Kirim Refleksi" | "Input Perangkat Ajar", "Simpan Refleksi" |
| **Coaching Response** | "Tanggapi Coaching" | "Catat Respon Guru" |
| **RTL Tracking** | "Tugas RTL Saya", "Kirim Laporan" | "Tracking RTL Guru", "Simpan Laporan" |
| **Evidence** | "Unggah Bukti" | "Input Bukti" |
| **Actor** | "Anda (Teacher)" | "Guru (Subject)" |

### 3. COMPONENT NAMING CONVENTIONS
- Views that summarize a specific teacher's journey are suffixed with `Record` (e.g., `SupervisionTeacherRecord`).
- Views that execute a specific phase of the workflow are suffixed with `Session` (e.g., `SupervisionObservationSession`).
- There are no components prefixed or suffixed with `Portal`, `My`, or `SelfService`.

### 4. FUTURE DEVELOPMENT GUIDELINES
When implementing new features for the Supervision Module:
1. **Never use first-person pronouns** (Saya, Aku) in the UI unless explicitly quoting a teacher's recorded statement.
2. **Always frame actions as data entry.** "The Assessor records X on behalf of the Teacher."
3. **Maintain the Subject-Observer boundary.** The Teacher is the Subject. The User is the Observer.
