# Recovered Knowledge Matrix

This matrix tracks the state of the Enterprise Knowledge Pipeline after the Metadata Adapter Recovery implementation. 

| Knowledge Section | Master Data | Metadata Adapter | Knowledge Projection | Document Builder | Canonical AST | PDF Output | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BAB I: Peserta Didik (Table 1.2)** | YES | ✅ RECOVERED | MISSING | MISSING | MISSING | NO | ⚠️ STALLED AT PROJECTION |
| **BAB I: Pendidik (Teachers)** | YES | ✅ RECOVERED | MISSING | MISSING | MISSING | NO | ⚠️ STALLED AT PROJECTION |
| **BAB I: Tenaga Kependidikan (Staff)**| YES | ✅ RECOVERED | MISSING | MISSING | MISSING | NO | ⚠️ STALLED AT PROJECTION |
| **BAB I: Sarana & Prasarana** | YES | ✅ RECOVERED | MISSING | MISSING | MISSING | NO | ⚠️ STALLED AT PROJECTION |
| **BAB I: Potensi Daerah** | YES | ✅ RECOVERED | MISSING | MISSING | MISSING | NO | ⚠️ STALLED AT PROJECTION |
| **BAB I: Kemitraan (Komite)** | YES | ✅ RECOVERED | MISSING | MISSING | MISSING | NO | ⚠️ STALLED AT PROJECTION |

## Status Summary
* **Metadata Adapter**: Successfully recovered. The adapter now maps `rawRombel`, `rawTeachers`, `rawEducationStaff`, `rawFacilities`, `rawPotential`, `rawCommittee`, and `rawSpecialPrograms` into the canonical `KspMetadata` transport object.
* **Knowledge Projection & Builders**: Unchanged. The Builder layer must now be updated to consume these newly exposed fields. 
