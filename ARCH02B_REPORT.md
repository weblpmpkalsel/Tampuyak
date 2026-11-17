## A. Domain Audit: Should Intracurricular Knowledge Store Subjects?

**Conclusion:** No. Storing standard subjects inside the school's `IntracurricularKnowledge` is a domain modeling error. Standard subjects belong exclusively to the **Curriculum Structure (Government Domain)**, not the **KSP (School Domain)**.

## B. Comparison & Analysis

1. **Current Design (Subject[]):**
   The current architecture forces the end-user (the school) to manually recreate the entire national curriculum structure from scratch by typing out every subject, weekly hour, and annual hour into a flat array. 

2. **Official KSP Templates & Government Regulations (Permendikbudristek):**
   Under Kurikulum Merdeka (e.g., Permendikbudristek No. 12 Tahun 2024), the structure of intrakurikuler (the list of mandatory subjects and their minimum time allocations per phase) is **strictly prescribed by the government**. 
   - A school does not invent the subjects or their baseline hours.
   - The school's KSP only dictates **how** those subjects are organized (the Learning Approach) and **what** local content (Muatan Lokal) is added.

## C. Domain Boundaries

- **Curriculum Structure (Government Domain):** Owns the list of mandatory subjects, phases, and baseline annual/weekly hours. This should be a static, read-only knowledge base in the system.
- **Intracurricular Knowledge (School Domain / KSP):** Owns the *execution strategy* of that structure at the school level.

## D. Proposed Simplest Architecture

The simplest architecture removes `Subject[]` entirely from user-editable state.

**1. Static Government Reference (Read-Only)**
The system should contain a hardcoded/static lookup for standard curriculum structures based on the school's level (e.g., SD Fase A, SMP Fase D).

**2. IntracurricularKnowledge (KSP Domain)**
The payload should only store the school's specific organizational choices:

```typescript
export class IntracurricularKnowledge {
  public readonly payload: {
    // How the school organizes the schedule (Mata Pelajaran, Tematik, Terintegrasi, Blok)
    readonly learningApproach: string; 
    
    // Any school-specific local content added on top of the national standard
    readonly muatanLokal: ReadonlyArray<{
      readonly subjectName: string;
      readonly weeklyHours: number;
      readonly notes: string;
    }>;
    
    // Optional: How the school distributes the flexible hours
    readonly scheduleStrategy: string;
  };
}
```

**3. Document Generation (`KspBab3Structure.ts`)**
When generating BAB III, the engine merges the two domains:
- It fetches the static Government Curriculum Structure for the school's Phase/Level.
- It injects the school's `learningApproach`.
- It appends the school's `muatanLokal` subjects to the table.
- It generates the final document perfectly aligned with regulations, with zero manual data entry required for standard subjects.

## E. Benefits
- **Zero Configuration:** Users no longer have to manually type 15+ standard subjects.
- **100% Regulatory Compliance:** The tables will always perfectly match the Kemendikbudristek decrees because they are generated from a verified static source.
- **Eliminates the "Empty Phase" UI problem:** The UI only needs a simple dropdown for "Learning Approach" and an optional list for "Muatan Lokal".
