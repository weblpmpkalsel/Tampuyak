# Knowledge Projection Catalog

This catalog details the design of every missing Knowledge Projection required to bridge the recovered Enterprise Master Data in the Metadata Adapter with the downstream Document Builders.

## 1. Class Statistics Projection
*   **Projection Name**: `StudentCharacteristicDomain`
*   **Input Master Data**: `rawRombel` (array of classes), `rawStudents`
*   **Output Schema**:
    ```typescript
    interface ClassStatistic {
      className: string;
      maleCount: number;
      femaleCount: number;
      totalCount: number;
    }
    export interface StudentCharacteristicDomain {
      totalStudents?: number;
      genderDistribution?: { male: number; female: number };
      generalCharacteristics?: string[];
      dominantLearningNeeds?: string[];
      clinicalBarriers?: string[];
      talentsAndInterests?: string[];
      classes?: ClassStatistic[]; // NEW
    }
    ```
*   **Consuming Builder**: `KspBab1Structure.ts`
*   **Expected Document Sections**: BAB I - B. Karakteristik Peserta Didik (Table 1.2: Jumlah Murid SD Tahun Ajaran)

## 2. Educator & Staff Projection
*   **Projection Name**: `EducatorKnowledgeDomain`
*   **Input Master Data**: `rawTeachers` (array of Guru), `rawEducationStaff` (array of Tendik), `rawCharacteristics.pendidik`
*   **Output Schema**:
    ```typescript
    interface EducatorStatistic {
      name: string;
      educationLevel: string;
      certificationStatus: string;
      position: string;
    }
    export interface EducatorKnowledgeDomain {
      totalTeachers?: number;
      certifications?: string[];
      leadershipHierarchy?: string[];
      specializedStaff?: string[];
      generalCharacteristics?: string[];
      teachers?: EducatorStatistic[]; // NEW
      educationStaff?: EducatorStatistic[]; // NEW
    }
    ```
*   **Consuming Builder**: `KspBab1Structure.ts`
*   **Expected Document Sections**: BAB I - C. Karakteristik Guru dan Tenaga Kependidikan

## 3. Infrastructure & Facilities Projection
*   **Projection Name**: `InfrastructureKnowledgeDomain`
*   **Input Master Data**: `rawFacilities` (object with counts for ruangKelas, perpustakaan, dll)
*   **Output Schema**:
    ```typescript
    interface FacilityStatistic {
      facilityName: string;
      quantity: number;
      condition?: string;
    }
    export interface InfrastructureKnowledgeDomain {
      totalClassrooms: number;
      specializedLabs: string[];
      internetBandwidth: string;
      accessibilityFeatures?: string[];
      facilities?: FacilityStatistic[]; // NEW
    }
    ```
*   **Consuming Builder**: `KspBab1Structure.ts`
*   **Expected Document Sections**: BAB I - G. Sarana dan Prasarana (New Section to be added)

## 4. Partnerships Projection
*   **Projection Name**: `PartnershipKnowledgeDomain`
*   **Input Master Data**: `rawCommittee`, `rawCharacteristics.orangTua`
*   **Output Schema**:
    ```typescript
    export interface PartnershipKnowledgeDomain {
      parentCommunities?: string[];
      industryLinkages?: string[];
      localGovernmentPartners?: string[];
      generalCharacteristics?: string[];
      committeeName?: string; // NEW
      committeeContact?: string; // NEW
      committeeMembers?: { name: string, role: string }[]; // NEW
    }
    ```
*   **Consuming Builder**: `KspBab1Structure.ts`
*   **Expected Document Sections**: BAB I - D. Karakteristik Orang Tua/Wali

## 5. Cultural & Potentials Projection
*   **Projection Name**: `CulturalKnowledgeDomain`
*   **Input Master Data**: `rawPotential` (daerah, kearifanLokal), `rawCharacteristics.lingkungan`, `rawCharacteristics.lokasi`
*   **Output Schema**:
    ```typescript
    export interface CulturalKnowledgeDomain {
      localWisdomTraditions?: string[];
      prevailingRegionalCharacteristics?: string[];
      environmentalFactors?: string[];
      regionalPotentials?: string[]; // NEW
      localWisdoms?: string[]; // NEW
    }
    ```
*   **Consuming Builder**: `KspBab1Structure.ts`
*   **Expected Document Sections**: BAB I - E. Karakteristik Lingkungan Satuan Pendidikan / F. Lokasi Satuan Pendidikan

## 6. Special Programs Projection
*   **Projection Name**: `SpecialProgramKnowledgeDomain`
*   **Input Master Data**: `rawSpecialPrograms`
*   **Output Schema**:
    ```typescript
    export interface SpecialProgramKnowledgeDomain {
      programs: { name: string, description: string, target: string }[];
    }
    ```
*   **Consuming Builder**: `KspBab1Structure.ts` or `KspBab3Structure.ts`
*   **Expected Document Sections**: BAB I (Karakteristik) or BAB III (Pengorganisasian Pembelajaran)
