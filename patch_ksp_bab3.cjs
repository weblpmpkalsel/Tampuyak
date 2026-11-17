const fs = require('fs');
let content = fs.readFileSync('src/enterprise/document/ksp/bab3/KspBab3Structure.ts', 'utf8');

const importStatement = `import { AcademicCalendarKnowledge } from '../../../knowledge/builders/AcademicCalendarBuilder';\n`;
if (!content.includes('AcademicCalendarKnowledge')) {
  content = content.replace(
    `import { LearningOrganizationKnowledge } from '../../../knowledge/builders/LearningOrganizationBuilder';`,
    `import { LearningOrganizationKnowledge } from '../../../knowledge/builders/LearningOrganizationBuilder';\n${importStatement}`
  );
}

const searchBuildFunc = `export function buildKspBab3Section(payload: LearningOrganizationKnowledge): DocumentSection {`;
const replaceBuildFunc = `export function buildKspBab3Section(payload: LearningOrganizationKnowledge, calendarPayload?: AcademicCalendarKnowledge): DocumentSection {`;
content = content.replace(searchBuildFunc, replaceBuildFunc);

const searchCalendar = `  return {
    id: 'bab3-section-root',
    chapterId: 'BAB_III',
    title: 'Pengorganisasian Pembelajaran',
    blocks
  };`;

const replaceCalendar = `  if (calendarPayload) {
    blocks.push({
      id: 'bab3-heading-kalender',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-kalender', type: 'TEXT', text: 'Kalender Akademik' }]
    });

    blocks.push({
      id: 'bab3-paragraph-kalender-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-kalender-1',
        type: 'TEXT',
        text: \`Kalender akademik Tahun Pelajaran \${calendarPayload.academicYear} disusun untuk mengalokasikan waktu pembelajaran, meliputi \${calendarPayload.effectiveWeeks} minggu efektif dan \${calendarPayload.effectiveLearningDays} hari belajar efektif. Berikut adalah rincian agenda dan kegiatan selama tahun pelajaran:\`
      }]
    });

    if (calendarPayload.events && calendarPayload.events.length > 0) {
      const eventRows = calendarPayload.events.map((event, index) => {
        let dateText = event.date;
        if (event.endDate && event.endDate !== event.date) {
          dateText = \`\${event.date} - \${event.endDate}\`;
        }
        
        // Translating event type to readable ID text if needed, but we can just use event.name and event.type
        let typeText = 'Kegiatan';
        switch(event.type) {
          case 'NATIONAL_HOLIDAY': typeText = 'Libur Nasional'; break;
          case 'REGIONAL_HOLIDAY': typeText = 'Libur Daerah'; break;
          case 'SCHOOL_HOLIDAY': typeText = 'Libur Sekolah'; break;
          case 'ASSESSMENT': typeText = 'Penilaian/Asesmen'; break;
          case 'PROJECT_WEEK': typeText = 'Minggu P5'; break;
          case 'REPORT_DISTRIBUTION': typeText = 'Pembagian Rapor'; break;
          case 'SEMESTER_BOUNDARY': typeText = 'Awal/Akhir Semester'; break;
          case 'MPLS': typeText = 'MPLS'; break;
          case 'SCHOOL_EVENT': typeText = 'Kegiatan Sekolah'; break;
        }

        return {
          id: \`bab3-table-row-cal-ev-\${index}\`,
          type: 'TABLE_ROW',
          cells: [
            { id: \`bab3-table-cell-cal-ev-date-\${index}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-cal-ev-date-\${index}\`, type: 'TEXT', text: dateText }] },
            { id: \`bab3-table-cell-cal-ev-name-\${index}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-cal-ev-name-\${index}\`, type: 'TEXT', text: event.name }] },
            { id: \`bab3-table-cell-cal-ev-type-\${index}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-cal-ev-type-\${index}\`, type: 'TEXT', text: typeText }] }
          ]
        };
      });

      blocks.push({
        id: 'bab3-table-kalender',
        type: 'TABLE',
        head: [
          {
            id: 'bab3-table-head-kalender',
            type: 'TABLE_ROW',
            cells: [
              { id: 'bab3-table-head-cell-kalender-1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-kalender-1', type: 'TEXT', text: 'Tanggal/Waktu' }] },
              { id: 'bab3-table-head-cell-kalender-2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-kalender-2', type: 'TEXT', text: 'Uraian Kegiatan' }] },
              { id: 'bab3-table-head-cell-kalender-3', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-kalender-3', type: 'TEXT', text: 'Keterangan' }] }
            ]
          }
        ],
        body: eventRows
      } as any);
    }
  }

  return {
    id: 'bab3-section-root',
    chapterId: 'BAB_III',
    title: 'Pengorganisasian Pembelajaran',
    blocks
  };`;

content = content.replace(searchCalendar, replaceCalendar);
fs.writeFileSync('src/enterprise/document/ksp/bab3/KspBab3Structure.ts', content);
console.log('patched KspBab3Structure');
