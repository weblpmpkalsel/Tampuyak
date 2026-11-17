const fs = require('fs');

function applyChanges() {
    let content = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter2Builder.ts', 'utf8');

    // For Priority mapping (lines 242-249):
    const oldPriority = "const akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : 'Data tidak tersedia';\\n          return {\\n            'Isu Prioritas (Priority Issue)': formatCell(p.name || 'Data tidak tersedia', 'Isu Prioritas', prioritasExplanations, 15),\\n            'Skor Prioritas (Priority Score)': formatCell((p.priorityScore || 0).toString(), 'Skor Prioritas', prioritasExplanations, 10),\\n            'Akar Masalah (Root Cause)': formatCell(akar, 'Akar Masalah', prioritasExplanations, 15)\\n          };";
        
    const newPriority = "let isu = p.name || '';\\n          let akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : '';\\n          const program = analisisData.program && analisisData.program[idx] ? analisisData.program[idx].nama : '';\\n          if (!isu || isu.toLowerCase() === 'data tidak tersedia' || isu === '-') { isu = inferIssueFromProgram(program); }\\n          if (!akar || akar.toLowerCase() === 'data tidak tersedia' || akar === '-') { akar = inferCauseFromProgram(program); }\\n          return {\\n            'Isu Prioritas (Priority Issue)': formatCell(isu, 'Isu Prioritas', prioritasExplanations, 15),\\n            'Skor Prioritas (Priority Score)': formatCell((p.priorityScore || 0).toString(), 'Skor Prioritas', prioritasExplanations, 10),\\n            'Akar Masalah (Root Cause)': formatCell(akar, 'Akar Masalah', prioritasExplanations, 15)\\n          };";
        
    content = content.replace(oldPriority, newPriority);

    // For IRB mapping (lines 296-304):
    const oldIRB = "const akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : 'Data tidak tersedia';\\n           const program = analisisData.program && analisisData.program[idx] ? analisisData.program[idx].nama : 'Data tidak tersedia';\\n           return {\\n             'Identifikasi (Identification)': formatCell(p.name, 'Identifikasi', irbExplanations, 15),\\n             'Refleksi (Reflection)': formatCell(akar, 'Refleksi', irbExplanations, 15),\\n             'Tindakan Benahi (Improvement)': formatCell(program, 'Tindakan Benahi', irbExplanations, 15)\\n           };";

    const newIRB = "let identifikasi = p.name || '';\\n           let akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : '';\\n           const program = analisisData.program && analisisData.program[idx] ? analisisData.program[idx].nama : '';\\n           if (!identifikasi || identifikasi.toLowerCase() === 'data tidak tersedia' || identifikasi === '-') { identifikasi = inferIssueFromProgram(program); }\\n           if (!akar || akar.toLowerCase() === 'data tidak tersedia' || akar === '-') { akar = inferCauseFromProgram(program); }\\n           return {\\n             'Identifikasi (Identification)': formatCell(identifikasi, 'Identifikasi', irbExplanations, 15),\\n             'Refleksi (Reflection)': formatCell(akar, 'Refleksi', irbExplanations, 15),\\n             'Tindakan Benahi (Improvement)': formatCell(program || 'Data tidak tersedia', 'Tindakan Benahi', irbExplanations, 15)\\n           };";

    content = content.replace(oldIRB, newIRB);

    fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter2Builder.ts', content);
    console.log('Successfully updated Chapter2Builder.ts');
}

applyChanges();
