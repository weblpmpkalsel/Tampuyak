const fs = require('fs');

function applyChanges() {
    let content = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter2Builder.ts', 'utf8');

    // For Priority mapping (lines 242-249):
    const oldPriority = \`data: prioritasData.length > 0 ? prioritasData.map((p: any, idx: number) => {
          const akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : 'Data tidak tersedia';
          return {
            'Isu Prioritas (Priority Issue)': formatCell(p.name || 'Data tidak tersedia', 'Isu Prioritas', prioritasExplanations, 15),
            'Skor Prioritas (Priority Score)': formatCell((p.priorityScore || 0).toString(), 'Skor Prioritas', prioritasExplanations, 10),
            'Akar Masalah (Root Cause)': formatCell(akar, 'Akar Masalah', prioritasExplanations, 15)
          };
        }) : []\`;
        
    const newPriority = \`data: prioritasData.length > 0 ? prioritasData.map((p: any, idx: number) => {
          let isu = p.name || '';
          let akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : '';
          const program = analisisData.program && analisisData.program[idx] ? analisisData.program[idx].nama : '';
          
          if (!isu || isu.toLowerCase() === 'data tidak tersedia' || isu === '-') {
              isu = inferIssueFromProgram(program);
          }
          if (!akar || akar.toLowerCase() === 'data tidak tersedia' || akar === '-') {
              akar = inferCauseFromProgram(program);
          }
          return {
            'Isu Prioritas (Priority Issue)': formatCell(isu, 'Isu Prioritas', prioritasExplanations, 15),
            'Skor Prioritas (Priority Score)': formatCell((p.priorityScore || 0).toString(), 'Skor Prioritas', prioritasExplanations, 10),
            'Akar Masalah (Root Cause)': formatCell(akar, 'Akar Masalah', prioritasExplanations, 15)
          };
        }) : []\`;
        
    content = content.replace(oldPriority, newPriority);

    // For IRB mapping (lines 296-304):
    const oldIRB = \`data: prioritasData.length > 0 ? prioritasData.map((p: any, idx: number) => {
           const akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : 'Data tidak tersedia';
           const program = analisisData.program && analisisData.program[idx] ? analisisData.program[idx].nama : 'Data tidak tersedia';
           return {
             'Identifikasi (Identification)': formatCell(p.name, 'Identifikasi', irbExplanations, 15),
             'Refleksi (Reflection)': formatCell(akar, 'Refleksi', irbExplanations, 15),
             'Tindakan Benahi (Improvement)': formatCell(program, 'Tindakan Benahi', irbExplanations, 15)
           };
        }) : []\`;

    const newIRB = \`data: prioritasData.length > 0 ? prioritasData.map((p: any, idx: number) => {
           let identifikasi = p.name || '';
           let akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : '';
           const program = analisisData.program && analisisData.program[idx] ? analisisData.program[idx].nama : '';
           
           if (!identifikasi || identifikasi.toLowerCase() === 'data tidak tersedia' || identifikasi === '-') {
              identifikasi = inferIssueFromProgram(program);
           }
           if (!akar || akar.toLowerCase() === 'data tidak tersedia' || akar === '-') {
              akar = inferCauseFromProgram(program);
           }
           
           return {
             'Identifikasi (Identification)': formatCell(identifikasi, 'Identifikasi', irbExplanations, 15),
             'Refleksi (Reflection)': formatCell(akar, 'Refleksi', irbExplanations, 15),
             'Tindakan Benahi (Improvement)': formatCell(program, 'Tindakan Benahi', irbExplanations, 15)
           };
        }) : []\`;

    content = content.replace(oldIRB, newIRB);

    fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter2Builder.ts', content);
    console.log('Successfully updated Chapter2Builder.ts');
}

applyChanges();
