const fs = require('fs');
let content = fs.readFileSync('src/enterprise/master-data/AcademicYear.model.ts', 'utf8');

const replacement = `import { MasterDataEntity } from './MasterDataTypes';

export interface CalendarEvent {
  date: string; // ISO or human readable like "15 Juli 2026"
  endDate?: string;
  name: string;
  type: 'NATIONAL_HOLIDAY' | 'REGIONAL_HOLIDAY' | 'SCHOOL_HOLIDAY' | 'ASSESSMENT' | 'PROJECT_WEEK' | 'REPORT_DISTRIBUTION' | 'SCHOOL_EVENT' | 'SEMESTER_BOUNDARY' | 'MPLS';
}

/**
 * Canonical properties for Academic Year
 */
export interface AcademicYearProperties {
  currentYear: string;
  semester: string;
  effectiveWeeks: number;
  effectiveLearningDays: number;
  nationalCalendarReference: string;
  events?: CalendarEvent[];
}

/**
 * AcademicYear Master Data Object
 */
export type AcademicYear = MasterDataEntity<AcademicYearProperties>;
`;

fs.writeFileSync('src/enterprise/master-data/AcademicYear.model.ts', replacement);
console.log("Patched AcademicYear.model.ts");
