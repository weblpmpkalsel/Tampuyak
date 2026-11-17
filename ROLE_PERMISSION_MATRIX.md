# ENTERPRISE ROLE PERMISSION MATRIX
## SUPERVISION MODULE

### Core Roles Definition
- **HEADMASTER (Kepala Sekolah):** Supreme owner of the school's supervision program. Full read/write/approve access.
- **TEACHER (Guru):** The subject of the supervision. Limited to self-service views and uploads.
- **OPERATOR (Admin Sekolah):** Administrative assistant. Can monitor and print, but cannot evaluate.
- **SUPERVISOR (Pengawas Pembina):** External district supervisor. Can cross-observe, verify, and publish.
- **ASSESSOR (Asesor/Guru Senior):** Delegated observer. Can conduct observations but cannot alter program configuration.

---

### UI Component Permission Matrix

| Component / Screen | HEADMASTER | TEACHER | OPERATOR | SUPERVISOR | ASSESSOR |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SupervisionTeacherView** (Teacher Dashboard) | - | Read | - | - | - |
| **Program Wizard** | Create/Update | ❌ | Read | Read | ❌ |
| **Teacher Assignment** | Create/Update | ❌ | Read | Read | Read |
| **Instrument Library** | Read/Update | ❌ | Read | Read/Update | Read |
| **Scheduling Engine** | Create/Update | Read (Self) | Read | Read | Read |
| **Pre-Observation** | Read/Approve | Upload | Read | Read/Approve | Read/Approve |
| **Observation Session** | Write | Read (After) | ❌ | Write | Write |
| **Post-Observation** | Write | Read/Acknowledge | ❌ | Write | Write |
| **RTL (Tindak Lanjut)** | Write | Read/Acknowledge | ❌ | Write | Write |
| **Executive Dashboard** | Read | ❌ | Read | Read | Read |
| **Publishing Engine** | Approve/Export | ❌ | Export | Approve/Export | ❌ |
| **Analytics / Tracking** | Read | ❌ | Read | Read | ❌ |

---

### Action Permission Matrix

| Action Type | HEADMASTER | TEACHER | OPERATOR | SUPERVISOR | ASSESSOR |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Read (General)** | All | Self Only | All | All (Cross-School)| Assigned Only |
| **Write (Configuration)** | Yes | No | No | Yes (Templates) | No |
| **Update (Schedules)** | Yes | No | No | Yes | No |
| **Delete (Programs)** | Yes | No | No | No | No |
| **Export/Print** | Yes | Yes (Self) | Yes | Yes | Yes (Assigned) |
| **Approve/Publish** | Yes | No | No | Yes | No |
