# RC-2.2 ENTERPRISE DATA DICTIONARY

## EXECUTIVE SUMMARY
This Enterprise Data Dictionary serves as the official architectural contract for all TAMPUYAK development. It defines the ownership, usage, lifecycle, and dependencies of every Enterprise Data Domain. This document ensures that every data field has a single source of truth and clear governance rules, eliminating ambiguity and regression risks during future development and integration.

---

## 1. School Identity
- **Description**: Core institutional identifiers such as School Name, NPSN, Address, and Status.
- **Owner**: MASTER DATA
- **Used By**: KSP, RKJM, RKT, RKAS, Dashboard, Analytics
- **Lifecycle**: Permanent
- **Update Authority**: Operator, Headmaster
- **Validation Rules**: Required
- **Dependency**: Reads From: None | Writes To: All Generated Documents
- **Regression Risk**: HIGH

## 2. School Profile
- **Description**: Institutional background and profile information including Principal details, accreditation, and establishment data.
- **Owner**: MASTER DATA
- **Used By**: KSP, RKJM, RKT, RKAS, Dashboard
- **Lifecycle**: Permanent / Annual
- **Update Authority**: Operator, Headmaster
- **Validation Rules**: Required
- **Dependency**: Reads From: None | Writes To: KSP, Administrative Documents
- **Regression Risk**: HIGH

## 3. School Characteristics
- **Description**: Contextual descriptions of the school's environment, location, and specific characteristics used for pedagogical planning.
- **Owner**: WORKSPACE
- **Used By**: KSP
- **Lifecycle**: Annual / Per Document
- **Update Authority**: Headmaster, Teacher
- **Validation Rules**: Optional
- **Dependency**: Reads From: None | Writes To: KSP (BAB I)
- **Regression Risk**: MEDIUM

## 4. Teachers
- **Description**: Data regarding teaching staff, their qualifications, and assignments.
- **Owner**: MASTER DATA
- **Used By**: KSP, RKJM, RKT, RKAS, Analytics
- **Lifecycle**: Annual
- **Update Authority**: Operator
- **Validation Rules**: Required
- **Dependency**: Reads From: None | Writes To: RKAS (Honorarium), KSP
- **Regression Risk**: HIGH

## 5. Educational Staff
- **Description**: Non-teaching staff (Tendik) details, including administration, security, and maintenance personnel.
- **Owner**: MASTER DATA
- **Used By**: RKJM, RKT, RKAS
- **Lifecycle**: Annual
- **Update Authority**: Operator
- **Validation Rules**: Optional
- **Dependency**: Reads From: None | Writes To: RKAS
- **Regression Risk**: MEDIUM

## 6. Students
- **Description**: Student demographics, enrollment numbers, gender distribution, and potential analysis.
- **Owner**: MASTER DATA
- **Used By**: KSP, RKJM, RKT, RKAS, SIMURID, Analytics
- **Lifecycle**: Annual
- **Update Authority**: Operator
- **Validation Rules**: Required
- **Dependency**: Reads From: SIMURID (Future) | Writes To: KSP, RKAS (BOS Funding)
- **Regression Risk**: HIGH

## 7. Committee
- **Description**: Details about the School Committee (Komite Sekolah), including chairperson and contact information.
- **Owner**: MASTER DATA
- **Used By**: KSP, RKJM, RKT, RKAS
- **Lifecycle**: Annual
- **Update Authority**: Operator, Headmaster
- **Validation Rules**: Required
- **Dependency**: Reads From: None | Writes To: Document Signatures, Validation
- **Regression Risk**: MEDIUM

## 8. Facilities
- **Description**: Infrastructure and physical assets (Sarpras) of the school (e.g., classrooms, labs, libraries).
- **Owner**: MASTER DATA
- **Used By**: KSP, RKJM, RKT, RKAS
- **Lifecycle**: Annual
- **Update Authority**: Operator
- **Validation Rules**: Optional
- **Dependency**: Reads From: None | Writes To: RKAS (Maintenance), KSP (Context)
- **Regression Risk**: MEDIUM

## 9. Academic Calendar
- **Description**: The schedule of academic activities, effective weeks, holidays, and school events.
- **Owner**: SHARED
- **Used By**: KSP, RKT, RKAS, Dashboard
- **Lifecycle**: Annual
- **Update Authority**: Headmaster, Operator
- **Validation Rules**: Required
- **Dependency**: Reads From: Education Office Guidelines | Writes To: KSP, RKT
- **Regression Risk**: HIGH

## 10. Extracurricular
- **Description**: Mandatory and optional extracurricular programs offered by the school, including routines and target habits.
- **Owner**: WORKSPACE
- **Used By**: KSP, RKT, RKAS, SIMURID
- **Lifecycle**: Annual
- **Update Authority**: Headmaster, Teacher
- **Validation Rules**: Optional
- **Dependency**: Reads From: None | Writes To: KSP, RKAS (Funding)
- **Regression Risk**: MEDIUM

## 11. Curriculum Structure
- **Description**: The organization of phases, educational levels, approaches (e.g., Kurikulum Merdeka), and subject distributions.
- **Owner**: WORKSPACE
- **Used By**: KSP
- **Lifecycle**: Annual
- **Update Authority**: Headmaster, Teacher
- **Validation Rules**: Required
- **Dependency**: Reads From: National Standards | Writes To: KSP (BAB III)
- **Regression Risk**: HIGH

## 12. Learning Load
- **Description**: Allocation of learning hours (weekly, annual, effective weeks) across intracurricular and cocurricular activities.
- **Owner**: WORKSPACE
- **Used By**: KSP
- **Lifecycle**: Annual
- **Update Authority**: Headmaster
- **Validation Rules**: Calculated / Required
- **Dependency**: Reads From: Academic Calendar | Writes To: KSP (BAB III)
- **Regression Risk**: HIGH

## 13. Vision
- **Description**: The long-term aspirational statement of the school.
- **Owner**: SHARED
- **Used By**: KSP, RKJM, RKT
- **Lifecycle**: Permanent / 4-Year Cycle
- **Update Authority**: Headmaster
- **Validation Rules**: Required
- **Dependency**: Reads From: Master Data (RKJM) | Writes To: KSP, RKT
- **Regression Risk**: HIGH

## 14. Mission
- **Description**: The actionable steps the school takes to achieve its Vision.
- **Owner**: SHARED
- **Used By**: KSP, RKJM, RKT
- **Lifecycle**: Permanent / 4-Year Cycle
- **Update Authority**: Headmaster
- **Validation Rules**: Required
- **Dependency**: Reads From: Master Data (RKJM) | Writes To: KSP, RKT
- **Regression Risk**: HIGH

## 15. Goals
- **Description**: Short, medium, and long-term objectives derived from the Mission.
- **Owner**: SHARED
- **Used By**: KSP, RKJM, RKT, RKAS
- **Lifecycle**: Annual / 4-Year Cycle
- **Update Authority**: Headmaster
- **Validation Rules**: Required
- **Dependency**: Reads From: Master Data (RKJM) | Writes To: KSP, RKAS (Targets)
- **Regression Risk**: HIGH

## 16. Learning Policy
- **Description**: Pedagogical guidelines, assessment rules, inclusion policies, and differentiation strategies.
- **Owner**: WORKSPACE
- **Used By**: KSP
- **Lifecycle**: Annual
- **Update Authority**: Headmaster, Teacher
- **Validation Rules**: Optional
- **Dependency**: Reads From: None | Writes To: KSP (BAB IV)
- **Regression Risk**: MEDIUM

## 17. Evaluation Policy
- **Description**: Mechanisms for academic supervision, continuous improvement, and curriculum evaluation.
- **Owner**: WORKSPACE
- **Used By**: KSP
- **Lifecycle**: Annual
- **Update Authority**: Headmaster
- **Validation Rules**: Optional
- **Dependency**: Reads From: None | Writes To: KSP (BAB V)
- **Regression Risk**: MEDIUM

## 18. Professional Development
- **Description**: Plans and policies for teacher training, mentoring, and capability enhancement.
- **Owner**: WORKSPACE
- **Used By**: KSP, RKAS, RKT
- **Lifecycle**: Annual
- **Update Authority**: Headmaster
- **Validation Rules**: Optional
- **Dependency**: Reads From: None | Writes To: KSP, RKT, RKAS (Funding)
- **Regression Risk**: MEDIUM

## 19. Attachments
- **Description**: Supporting documents, evidence, SKs (Surat Keputusan), and external appendices appended to generated documents.
- **Owner**: WORKSPACE
- **Used By**: KSP, RKJM, RKT, RKAS
- **Lifecycle**: Per Document
- **Update Authority**: Operator, Headmaster
- **Validation Rules**: Optional
- **Dependency**: Reads From: External Uploads | Writes To: PDF Generation
- **Regression Risk**: LOW

## 20. Generated Documents
- **Description**: The final, compiled artifacts (PDFs, JSON states) representing the official output (KSP, RKJM, etc.).
- **Owner**: SYSTEM
- **Used By**: Dashboard, Analytics, Other
- **Lifecycle**: Generated
- **Update Authority**: System
- **Validation Rules**: Generated
- **Dependency**: Reads From: All Domains | Writes To: File Storage / Output Stream
- **Regression Risk**: HIGH
