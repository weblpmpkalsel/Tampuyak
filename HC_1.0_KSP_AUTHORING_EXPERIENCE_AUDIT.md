# HC_1.0_KSP_AUTHORING_EXPERIENCE_AUDIT.md

## 1. Complete UX Matrix

| Module / Screen | Current Input Type | Input Requirement | UX Status |
| :--- | :--- | :--- | :--- |
| **School Identity** | `input` (text), `textarea` | Manual entry of basic metadata (Name, NPSN, Address) | 🟡 YELLOW |
| **Vision** | `textarea` | Blank page; requires original drafting | 🔴 RED |
| **Mission** | `input` (array) | Blank page; requires original drafting | 🔴 RED |
| **Goals** | `input` (array) | Blank page; requires original drafting | 🔴 RED |
| **Student Characteristics** | `textarea` | Blank page; requires original drafting | 🔴 RED |
| **Teacher Characteristics** | `textarea` | Blank page; requires original drafting | 🔴 RED |
| **Parent Characteristics** | `textarea` | Blank page; requires original drafting | 🔴 RED |
| **School Environment** | `textarea` | Blank page; requires original drafting | 🔴 RED |
| **Learning Organization** | `textarea` | Blank page; requires defining philosophy, principles, strategy | 🔴 RED |
| **Learning Load** | `input` (text/number) | Manual calculation and entry of hours/weeks | 🔴 RED |
| **Intracurricular** | `input` (array) | Manual typing of standard subjects and approaches | 🔴 RED |
| **Cocurricular** | `input`, `textarea` | Blank page; manual drafting of program identity and activities | 🔴 RED |
| **Student Pedagogical Profile** | `textarea` | Blank page; manual drafting of needs, potential, challenges | 🔴 RED |
| **Evaluation** | `placeholder` | Not yet implemented | 🔴 RED |
| **Professional Development** | `placeholder` | Not yet implemented | 🔴 RED |
| **Administrative Metadata** | `placeholder` | Not yet implemented | 🔴 RED |

## 2. Blank Page Index

The following sections currently force the Headmaster to start from a completely blank canvas (empty `<textarea>` or `<input>` fields), creating high cognitive load:

1. **Vision, Mission, Goals (VMT)**
2. **School Characteristics (Student, Environment, Educator, Parent)**
3. **Student Pedagogical Profile (Learning Needs, Potential, Challenges)**
4. **Learning Organization (Philosophy, Principles, Strategies)**
5. **Intracurricular Subjects** (Requires manual entry of standardized national subjects)
6. **Cocurricular Activities** (Requires manual drafting of P5 activities)

## 3. Guided Authoring Candidates (Design Proposals)

To eliminate the blank-page syndrome, we propose the following guided authoring patterns for RED modules:

### A. Visi, Misi, Tujuan (VMT)
* **Guided Pattern:** **Context Wizard & Suggestion Chips**
* **Concept:** Instead of a blank textarea, offer a guided wizard. "What are the core values of your school?" (e.g., Religious, Technology-driven, Environmental). Based on selections, provide a list of AI/Knowledge Pack-generated Vision statements. For Mission and Goals, offer a checklist of standard objectives that align with the chosen Vision, allowing the headmaster to select and customize rather than draft from scratch.

### B. Karakteristik (Characteristics & Pedagogical Profile)
* **Guided Pattern:** **Multi-Select Checklists & Taxonomy Integrations**
* **Concept:** Replace the massive textareas with structured selections based on the Enterprise Taxonomies. 
  * *Location/Environment:* "Select your school's location type" (Dropdown: Rural, Urban, Coastal).
  * *Students:* "Select predominant learning styles" (Checkboxes: Visual, Auditory, Kinesthetic).
  * The system then auto-generates a cohesive narrative paragraph based on these selections, which the user can then edit.

### C. Learning Organization
* **Guided Pattern:** **Templates & Reference Examples**
* **Concept:** Provide 3-4 standardized templates (e.g., "Block System", "Subject-Based", "Integrated"). When a headmaster selects a template, it pre-fills the Educational Philosophy, Learning Principles, and Implementation Strategy with best-practice boilerplate that they can tweak.

### D. Intracurricular & Learning Load
* **Guided Pattern:** **Data Grid with Standardized Presets**
* **Concept:** Since Intracurricular subjects are heavily regulated by the government, users should not be typing "Matematika" manually. Use a "Subject Picker" that pulls from a national curriculum database. Learning load hours should be auto-calculated based on Phase and Subject, with the ability to override, rather than requiring manual data entry for every cell.

### E. Cocurricular
* **Guided Pattern:** **Project Library / Blueprint Selector**
* **Concept:** Provide a library of standard P5 (Projek Penguatan Profil Pelajar Pancasila) themes. Selecting "Gaya Hidup Berkelanjutan" (Sustainable Lifestyle) should automatically populate standard objectives, assessment strategies, and common activities, transforming data entry into a curation task.

## 4. Priority Ranking

1. **High Priority (High Friction, Low Complexity to Fix):**
   * Characteristics & Pedagogical Profile (Can immediately leverage the new Enterprise Taxonomies).
   * Intracurricular Subjects (Replace text inputs with select/dropdowns of standard subjects).
2. **Medium Priority (High Friction, Medium Complexity):**
   * Visi, Misi, Tujuan (Requires logic to link values to generated statements).
   * Cocurricular (Requires building a small library of P5 templates).
3. **Low Priority (Lower Friction or High Complexity):**
   * Learning Organization (Requires defining distinct organizational templates).
   * Learning Load (Requires auto-calculation logic).

## 5. Quick Wins

* **Taxonomy Dropdowns:** Immediately convert "School Environment" and "Student Characteristics" to use the recently standardized `SchoolLocationTaxonomy` and `LearningNeedTaxonomy` as selectable tags instead of blank textareas.
* **Intracurricular Subject Dropdown:** Change the `<input type="text">` for Subject Name to a `<select>` pre-populated with standard Phase-appropriate subjects.
* **VMT Placeholders:** Update the placeholder text in the VMT textareas to include concrete examples (e.g., `placeholder="e.g., 'Terwujudnya lulusan yang beriman, bertakwa, dan berwawasan global'"`), providing immediate, zero-code guidance.

## 6. Hosting Readiness Score

**Current UX Readiness for Production: 30%**
While the backend Knowledge Context Engine and Enterprise Taxonomies are robust, the UI layer is currently acting as a simple, passive data-entry tool. It does not yet leverage the platform's intelligence to assist the user. The platform is functionally complete but experientially lacking for a Headmaster.

## 7. Recommended Sprint Order

1. **Sprint 1: The Taxonomy UI Bindings** (Connect existing Taxonomies to Characteristics and Pedagogical screens via multi-selects).
2. **Sprint 2: The Curriculum Presets** (Implement Subject Picker for Intracurricular and auto-calculations for Learning Load).
3. **Sprint 3: The VMT Engine** (Build the Context Wizard and suggestion UI for Vision, Mission, and Goals).
4. **Sprint 4: The Project Library** (Build the Cocurricular P5 template selector).
5. **Sprint 5: Future Modules** (Flesh out Evaluation, PD, and Admin Metadata using guided patterns from day one).
