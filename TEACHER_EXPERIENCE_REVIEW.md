# TEACHER EXPERIENCE ARCHITECTURE REVIEW
## SUPERVISION MODULE (RC-02B)

### 1. OBJECTIVE
To architect the complete self-service portal for Teachers involved in the Supervision process, ensuring an intuitive, isolated, and highly focused user experience that strictly enforces RBAC boundaries.

### 2. EXISTING COMPONENT EVALUATION (`SupervisionTeacherView.tsx`)
**Current State:**
The existing `SupervisionTeacherView` acts as a static mock wireframe. It successfully demonstrates the conceptual lifecycle (Pre-Observation, Observation, Coaching, RTL) but lacks data-binding and a true dynamic timeline architecture.

**Deficiencies in Current Mock:**
- **Data Binding:** `loadData` is empty. It hardcodes a single schedule card rather than mapping dynamic assignments.
- **Empty States:** Does not gracefully handle scenarios where the teacher has zero assigned supervisions.
- **Status Context:** All action buttons (Upload Module, Reflection, Coaching, RTL) are visible simultaneously, regardless of the actual `SupervisionStatus`.
- **History:** No mechanism to view past supervision cycles or historical performance.

### 3. VERIFICATION OF ISOLATION BOUNDARIES (PASS)
- The Teacher Experience is strictly isolated from the Administrative (Academic) View.
- **Verified Restrictions:** A Teacher will NEVER see or access the Program Wizard, Instrument Library, Scheduling Engine, Executive Dashboard, Analytics, or Publishing modules. `RoleGuard` prevents mounting, and there are no links routing from the Teacher Dashboard to Admin views.

### 4. ARCHITECTURAL RECOMMENDATIONS FOR IMPLEMENTATION

#### A. Layout & Navigation
- **Single-Column Focus:** Maintain the `max-w-5xl mx-auto` single-column layout to eliminate distractions and keep the focus purely on actionable tasks.
- **Header:** Include a personalized greeting and clear instructions on pending actions.

#### B. The Supervision Timeline Card
Instead of a flat list of buttons, the Teacher Dashboard should render a single **Active Schedule Card** for the current cycle, structured as a vertical timeline:
1. **Tahap 1: Pra-Observasi (Preparation)**
   - Status indicator: Pending / Submitted / Approved.
   - Action: Upload Teaching Module & Initial Reflection.
2. **Tahap 2: Observasi Kelas (Execution)**
   - Status indicator: Scheduled / In Progress / Completed.
   - Action: View schedule details (Time, Date, Assessor).
3. **Tahap 3: Pasca-Observasi (Coaching)**
   - Status indicator: Pending Feedback / Action Required / Completed.
   - Action: Read assessor feedback and submit teacher response.
4. **Tahap 4: Rencana Tindak Lanjut (RTL)**
   - Status indicator: Planning / In Progress / Verified.
   - Action: Open RTL Dashboard to upload evidence and track progress.

#### C. Status-Driven UI (Conditional Rendering)
Action buttons must be strictly gated by the `SupervisionStatus`:
- If `status === SCHEDULED`, only show "Upload Modul" and "Isi Refleksi".
- If `status === OBSERVATION`, disable preparation buttons and show "Sedang Berlangsung".
- If `status === POST_OBSERVATION`, unlock "Tanggapi Coaching".
- If `status === RTL`, unlock the RTL Dashboard.

#### D. Empty States & Notifications
- **Empty State:** If no active schedule exists, render a clean illustration with the message: "Tidak ada jadwal supervisi aktif saat ini. Anda akan menerima notifikasi jika Kepala Sekolah menugaskan jadwal baru."
- **Alerts:** Use the `AlertCircle` component (as in the mock) to prominently display direct notes from the Assessor or Headmaster at the top of the card.

#### E. Historical Archive
- Implement a secondary tab or section below the Active Schedule called "Riwayat Supervisi".
- This section should render completed supervisions (`status === COMPLETED`) as read-only, minimized cards, allowing teachers to review past feedback and RTL achievements for continuous self-reflection.

### 5. NEXT STEPS
Do not modify source code yet. This architectural review establishes the blueprint for the dynamic implementation phase.
