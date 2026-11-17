const fs = require('fs');
let content = fs.readFileSync('src/enterprise/document/ksp/bab3/KspBab3Structure.ts', 'utf8');

const searchIntra = `  // Rule 061 & 062: Attachment Gateway
  blocks.push({
    id: 'bab3-attachment-intra',
    type: 'ATTACHMENT',
    uri: 'tampuyak://teacher-gateway/intrakurikuler',
    filename: 'Lampiran_Intrakurikuler_CP_ATP_ModulAjar.pdf',
    mimeType: 'application/pdf'
  });`;

const replaceIntra = `  if (payload.intracurricular) {
    blocks.push({
      id: 'bab3-paragraph-intra-approach',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-intra-approach',
        type: 'TEXT',
        text: \`Pendekatan pembelajaran yang digunakan adalah \${payload.intracurricular.approaches.join(' dan ')}.\`
      }]
    });
    
    if (payload.intracurricular.subjects && payload.intracurricular.subjects.length > 0) {
      const subjectRows = payload.intracurricular.subjects.map((subject, index) => ({
        id: \`bab3-table-row-subject-\${index}\`,
        type: 'TABLE_ROW',
        cells: [
          { id: \`bab3-table-cell-subject-num-\${index}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-subject-num-\${index}\`, type: 'TEXT', text: \`\${index + 1}\` }] },
          { id: \`bab3-table-cell-subject-name-\${index}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-subject-name-\${index}\`, type: 'TEXT', text: subject }] }
        ]
      }));
      
      blocks.push({
        id: 'bab3-table-intra-subjects',
        type: 'TABLE',
        head: [
          {
            id: 'bab3-table-head-intra',
            type: 'TABLE_ROW',
            cells: [
              { id: 'bab3-table-head-cell-intra-1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-intra-1', type: 'TEXT', text: 'No' }] },
              { id: 'bab3-table-head-cell-intra-2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-intra-2', type: 'TEXT', text: 'Mata Pelajaran' }] }
            ]
          }
        ],
        body: subjectRows
      } as any); // Cast as any because TS structure check
    }
  }

  // Rule 061 & 062: Attachment Gateway
  blocks.push({
    id: 'bab3-attachment-intra',
    type: 'ATTACHMENT',
    uri: 'tampuyak://teacher-gateway/intrakurikuler',
    filename: 'Lampiran_Intrakurikuler_CP_ATP_ModulAjar.pdf',
    mimeType: 'application/pdf'
  });`;

if (content.includes(searchIntra)) {
  content = content.replace(searchIntra, replaceIntra);
}

const searchKoku = `  blocks.push({
    id: 'bab3-attachment-koku',
    type: 'ATTACHMENT',
    uri: 'tampuyak://teacher-gateway/kokurikuler',
    filename: 'Lampiran_Modul_Projek_P5.pdf',
    mimeType: 'application/pdf'
  });`;

const replaceKoku = `  if (payload.cocurricular) {
    blocks.push({
      id: 'bab3-paragraph-koku-rule',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-koku-rule',
        type: 'TEXT',
        text: \`Alokasi waktu projek adalah \${payload.cocurricular.allocationRule}. Berikut adalah tema yang dipilih pada tahun ajaran ini:\`
      }]
    });
    
    if (payload.cocurricular.projectThemes && payload.cocurricular.projectThemes.length > 0) {
      const themeItems = payload.cocurricular.projectThemes.map((theme, index) => ({
        id: \`bab3-list-item-theme-\${index}\`,
        type: 'LIST_ITEM',
        nodes: [{ id: \`bab3-text-theme-\${index}\`, type: 'TEXT', text: theme }]
      }));
      
      blocks.push({
        id: 'bab3-list-koku-themes',
        type: 'LIST',
        ordered: true,
        items: themeItems
      } as any);
    }
  }

  blocks.push({
    id: 'bab3-attachment-koku',
    type: 'ATTACHMENT',
    uri: 'tampuyak://teacher-gateway/kokurikuler',
    filename: 'Lampiran_Modul_Projek_P5.pdf',
    mimeType: 'application/pdf'
  });`;

if (content.includes(searchKoku)) {
  content = content.replace(searchKoku, replaceKoku);
}

const searchEkstra = `  blocks.push({
    id: 'bab3-attachment-ekstra',
    type: 'ATTACHMENT',
    uri: 'tampuyak://teacher-gateway/ekstrakurikuler',
    filename: 'Lampiran_Program_Ekstrakurikuler.pdf',
    mimeType: 'application/pdf'
  });`;

const replaceEkstra = `  if (payload.extracurricular) {
    const ekstraRows = [];
    if (payload.extracurricular.mandatory) {
      payload.extracurricular.mandatory.forEach((ex, idx) => {
        ekstraRows.push({
          id: \`bab3-table-row-ex-man-\${idx}\`,
          type: 'TABLE_ROW',
          cells: [
            { id: \`bab3-table-cell-ex-man-type-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-ex-man-type-\${idx}\`, type: 'TEXT', text: 'Wajib' }] },
            { id: \`bab3-table-cell-ex-man-name-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-ex-man-name-\${idx}\`, type: 'TEXT', text: ex }] }
          ]
        });
      });
    }
    if (payload.extracurricular.optional) {
      payload.extracurricular.optional.forEach((ex, idx) => {
        ekstraRows.push({
          id: \`bab3-table-row-ex-opt-\${idx}\`,
          type: 'TABLE_ROW',
          cells: [
            { id: \`bab3-table-cell-ex-opt-type-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-ex-opt-type-\${idx}\`, type: 'TEXT', text: 'Pilihan' }] },
            { id: \`bab3-table-cell-ex-opt-name-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-text-ex-opt-name-\${idx}\`, type: 'TEXT', text: ex }] }
          ]
        });
      });
    }
    if (ekstraRows.length > 0) {
      blocks.push({
        id: 'bab3-table-ekstra',
        type: 'TABLE',
        head: [
          {
            id: 'bab3-table-head-ekstra',
            type: 'TABLE_ROW',
            cells: [
              { id: 'bab3-table-head-cell-ekstra-1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-ekstra-1', type: 'TEXT', text: 'Kategori' }] },
              { id: 'bab3-table-head-cell-ekstra-2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-ekstra-2', type: 'TEXT', text: 'Nama Program' }] }
            ]
          }
        ],
        body: ekstraRows
      } as any);
    }
  }

  blocks.push({
    id: 'bab3-attachment-ekstra',
    type: 'ATTACHMENT',
    uri: 'tampuyak://teacher-gateway/ekstrakurikuler',
    filename: 'Lampiran_Program_Ekstrakurikuler.pdf',
    mimeType: 'application/pdf'
  });`;

if (content.includes(searchEkstra)) {
  content = content.replace(searchEkstra, replaceEkstra);
}

const searchWaktu = `  // D. Pengaturan Beban Belajar
  blocks.push({
    id: 'bab3-heading-waktu',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab3-text-heading-waktu', type: 'TEXT', text: 'Pengaturan Beban Belajar' }]
  });
  blocks.push({
    id: 'bab3-paragraph-waktu-1',
    type: 'PARAGRAPH',
    nodes: [{
       id: 'bab3-text-waktu-1',
       type: 'TEXT',
       text: \`Alokasi waktu dan beban belajar didistribusikan ke dalam \${payload.academicTime.effectiveWeeks || 0} minggu efektif pada Tahun Pelajaran \${payload.academicTime.currentYear || '-'} Semester \${payload.academicTime.semester || '-'}.\`
     }]
  });`;

const replaceWaktu = `  // D. Pengaturan Beban Belajar
  blocks.push({
    id: 'bab3-heading-waktu',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab3-text-heading-waktu', type: 'TEXT', text: 'Pengaturan Beban Belajar' }]
  });
  blocks.push({
    id: 'bab3-paragraph-waktu-1',
    type: 'PARAGRAPH',
    nodes: [{
       id: 'bab3-text-waktu-1',
       type: 'TEXT',
       text: \`Alokasi waktu dan beban belajar didistribusikan ke dalam \${payload.academicTime.effectiveWeeks || 0} minggu efektif pada Tahun Pelajaran \${payload.academicTime.currentYear || '-'} Semester \${payload.academicTime.semester || '-'}.\`
     }]
  });
  
  // Learning Load Table
  blocks.push({
    id: 'bab3-table-beban-belajar',
    type: 'TABLE',
    head: [
      {
        id: 'bab3-table-head-beban',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab3-table-head-cell-beban-1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-beban-1', type: 'TEXT', text: 'Komponen' }] },
          { id: 'bab3-table-head-cell-beban-2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-head-cell-beban-2', type: 'TEXT', text: 'Alokasi Waktu' }] }
        ]
      }
    ],
    body: [
      {
        id: 'bab3-table-row-beban-1',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab3-table-cell-beban-1-1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-beban-1-1', type: 'TEXT', text: 'Minggu Efektif' }] },
          { id: 'bab3-table-cell-beban-1-2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-beban-1-2', type: 'TEXT', text: \`\${payload.academicTime.effectiveWeeks} Minggu\` }] }
        ]
      },
      {
        id: 'bab3-table-row-beban-2',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab3-table-cell-beban-2-1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-beban-2-1', type: 'TEXT', text: 'Semester' }] },
          { id: 'bab3-table-cell-beban-2-2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-text-beban-2-2', type: 'TEXT', text: \`\${payload.academicTime.semester}\` }] }
        ]
      }
    ]
  } as any);`;

if (content.includes(searchWaktu)) {
  content = content.replace(searchWaktu, replaceWaktu);
}

fs.writeFileSync('src/enterprise/document/ksp/bab3/KspBab3Structure.ts', content);
console.log('patched KspBab3Structure');
