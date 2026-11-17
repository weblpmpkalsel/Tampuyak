const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

let lines = code.split('\n');
const start = lines.findIndex(l => l.includes('const WorkspaceAnalisisView = '));
if (start !== -1) {
    for (let i = start; i < lines.length; i++) {
        if (lines[i].includes('  return (')) {
            if (lines[i+1].includes('<div className="space-y-6')) {
                if (!lines[i+2].includes('PageHelp')) {
                    lines.splice(i+2, 0, '      <PageHelp title="Analisis Prioritas" description="Halaman untuk menganalisis capaian rapor dan menentukan program strategis." importance="Menjadi fondasi program kerja yang akan dituangkan dalam RKJM dan RKT." nextStep="Evaluasi rekomendasi program dan setujui jika sesuai dengan visi sekolah." />');
                }
            }
            break;
        }
    }
}

fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
console.log('Saved');
