const fs = require('fs');

let file = fs.readFileSync('src/enterprise/document/ksp/bab1/KspBab1Structure.ts', 'utf-8');

const anchor = `  return {
    id: 'bab1-section-root',
    chapterId: 'BAB_I',
    title: 'Karakteristik Satuan Pendidikan',
    blocks
  };
}`;

const injection = `
  // G. Sarana dan Prasarana
  blocks.push({
    id: 'bab1-heading-sarpras',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-sarpras', type: 'TEXT', text: 'G. Sarana dan Prasarana' }]
  });

  blocks.push({
    id: 'bab1-paragraph-sarpras-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-sarpras-opening', type: 'TEXT', text: \`Ketersediaan sarana dan prasarana yang memadai sangat menunjang kelancaran proses pembelajaran. \${profile.schoolName} berupaya menyediakan fasilitas yang mendukung pencapaian tujuan pendidikan.\` }]
  });

  if (payload.infrastructure?.facilities && payload.infrastructure.facilities.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-sarpras-table-title',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-sarpras-table-title', type: 'TEXT', text: 'Tabel Sarana dan Prasarana' }]
    });

    const headerRow: TableRowNode = {
      id: 'bab1-table-sarpras-header',
      type: 'TABLE_ROW',
      cells: [
        { id: 'bab1-table-sarpras-h-1', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'No', id: 'bab1-table-sarpras-h-1-t' }] },
        { id: 'bab1-table-sarpras-h-2', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Nama Fasilitas', id: 'bab1-table-sarpras-h-2-t' }] },
        { id: 'bab1-table-sarpras-h-3', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Jumlah', id: 'bab1-table-sarpras-h-3-t' }] },
        { id: 'bab1-table-sarpras-h-4', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Kondisi', id: 'bab1-table-sarpras-h-4-t' }] }
      ]
    };

    const rows: TableRowNode[] = payload.infrastructure.facilities.map((fac, idx) => ({
      id: \`bab1-table-sarpras-row-\${idx}\`,
      type: 'TABLE_ROW',
      cells: [
        { id: \`bab1-table-sarpras-r-\${idx}-c-1\`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: (idx + 1).toString(), id: \`bab1-table-sarpras-r-\${idx}-c-1-t\` }] },
        { id: \`bab1-table-sarpras-r-\${idx}-c-2\`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: fac.facilityName, id: \`bab1-table-sarpras-r-\${idx}-c-2-t\` }] },
        { id: \`bab1-table-sarpras-r-\${idx}-c-3\`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: fac.quantity.toString(), id: \`bab1-table-sarpras-r-\${idx}-c-3-t\` }] },
        { id: \`bab1-table-sarpras-r-\${idx}-c-4\`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: fac.condition || 'Baik', id: \`bab1-table-sarpras-r-\${idx}-c-4-t\` }] }
      ]
    }));

    const tableBlock: TableBlock = {
      id: 'bab1-table-sarpras',
      type: 'TABLE',
      head: [headerRow],
      body: [...rows]
    };

    blocks.push(tableBlock);
  }

  blocks.push({
    id: 'bab1-paragraph-sarpras-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-sarpras-closing', type: 'TEXT', text: \`Seluruh sarana dan prasarana dikelola dan dipelihara secara berkala untuk memastikan keamanan, kenyamanan, serta fungsionalitasnya dalam mendukung kegiatan kurikuler, kokurikuler, maupun ekstrakurikuler.\` }]
  });

  return {
    id: 'bab1-section-root',
    chapterId: 'BAB_I',
    title: 'Karakteristik Satuan Pendidikan',
    blocks
  };
}`;

file = file.replace(anchor, injection);
fs.writeFileSync('src/enterprise/document/ksp/bab1/KspBab1Structure.ts', file);
