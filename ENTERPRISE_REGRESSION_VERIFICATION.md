# Enterprise Regression Verification

## Objective
To verify the state of the Enterprise Knowledge Pipeline following the Metadata Adapter recovery, checking whether the newly propagated master data reaches the final generated output.

## Knowledge Section Verification

| Knowledge Section | Master Data Exists | Metadata Adapter | Projection | Builder | Canonical AST | Renderer | Generated | Regression Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **School Profile** | YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | Recovered / OK |
| **Principal** | YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | Recovered / OK |
| **Teachers** | YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **Education Staff** | YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **Students (Totals)** | YES | CONNECTED | CONNECTED | PARTIAL | PARTIAL | CONNECTED | YES | OK (Paragraph) |
| **Rombel / Class Stats** | YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **Facilities / Infra** | YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **Curriculum** | YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | OK |
| **Teaching Load** | YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | OK |
| **Subject Allocation**| YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | OK |
| **School Calendar** | YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | OK |
| **Intracurricular** | YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | OK |
| **Co-curricular** | YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | OK |
| **Extracurricular** | YES | CONNECTED | CONNECTED | CONNECTED | CONNECTED | CONNECTED | YES | OK |
| **Partnership** | YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **Achievements** | YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **Community** | YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **School Environment**| YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **Special Programs** | YES | CONNECTED | MISSING | MISSING | MISSING | MISSING | NO | Still Broken |
| **Quality Indicators**| NO | NOT USED | NOT USED | NOT USED | NOT USED | NOT USED | NO | Not Used |
| **Rapor Pendidikan** | NO | NOT USED | NOT USED | NOT USED | NOT USED | NOT USED | NO | Not Used |

## Analysis
The Metadata Adapter recovery successfully bridged the gap between the `WorkspaceState` and the canonical `KspMetadata` transport. However, because the Builder and Projection layers have not been explicitly updated to ingest these newly populated fields (`rawRombel`, `rawTeachers`, `rawEducationStaff`, `rawFacilities`, `rawPotential`, `rawCommittee`, `rawSpecialPrograms`), the data remains stalled at the projection boundary.
