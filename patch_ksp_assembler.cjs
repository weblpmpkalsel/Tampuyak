const fs = require('fs');
let content = fs.readFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', 'utf8');

const importsToAdd = `
import { AcademicCalendarKnowledge, buildAcademicCalendar } from '../../knowledge/builders/AcademicCalendarBuilder';
import { processAcademicCalendar, AcademicCalendarInput } from '../../knowledge/services/AcademicCalendarService';
`;

// Insert imports after import { LearningOrganizationKnowledge } ...
if (!content.includes('AcademicCalendarKnowledge')) {
  content = content.replace(
    `import { LearningOrganizationKnowledge } from '../../knowledge/builders/LearningOrganizationBuilder';`,
    `import { LearningOrganizationKnowledge } from '../../knowledge/builders/LearningOrganizationBuilder';${importsToAdd}`
  );
}

const buildBab3Search = `const bab3Section = buildKspBab3Section(learningOrgPayload);`;
const buildBab3Replace = `
  const calendarInput: AcademicCalendarInput = {
    academicYear: {
      metadata: { id: '', version: '1.0', createdAt: '', updatedAt: '', createdBy: '', lifecycle: 'DRAFT', domain: 'AcademicYear' },
      properties: {
        currentYear: metadata.academicYear,
        semester: 'Ganjil / Genap',
        effectiveWeeks: 36,
        effectiveLearningDays: 216,
        nationalCalendarReference: 'SKB 3 Menteri',
        events: [
          { date: '15 Juli 2026', name: 'Masa Pengenalan Lingkungan Sekolah', type: 'MPLS' },
          { date: '17 Agustus 2026', name: 'Hari Kemerdekaan RI', type: 'NATIONAL_HOLIDAY' },
          { date: 'September 2026', endDate: 'Oktober 2026', name: 'Asesmen Tengah Semester Ganjil', type: 'ASSESSMENT' },
          { date: 'November 2026', name: 'Projek Penguatan Profil Pelajar Pancasila', type: 'PROJECT_WEEK' },
          { date: 'Desember 2026', name: 'Asesmen Akhir Semester Ganjil', type: 'ASSESSMENT' },
          { date: 'Desember 2026', name: 'Pembagian Rapor Semester Ganjil', type: 'REPORT_DISTRIBUTION' },
          { date: 'Desember 2026', endDate: 'Januari 2027', name: 'Libur Semester Ganjil', type: 'SCHOOL_HOLIDAY' },
          { date: 'Maret 2027', name: 'Libur Awal Ramadhan', type: 'REGIONAL_HOLIDAY' },
          { date: 'Juni 2027', name: 'Asesmen Akhir Tahun', type: 'ASSESSMENT' },
          { date: 'Juni 2027', name: 'Pembagian Rapor Semester Genap', type: 'REPORT_DISTRIBUTION' }
        ]
      }
    }
  };
  const calendarServiceResult = processAcademicCalendar(calendarInput);
  const calendarKnowledge = buildAcademicCalendar({ serviceResult: calendarServiceResult });
  const bab3Section = buildKspBab3Section(learningOrgPayload, calendarKnowledge.data);
`;

content = content.replace(buildBab3Search, buildBab3Replace);
fs.writeFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', content);
console.log('patched KspDocumentAssembler.ts');
