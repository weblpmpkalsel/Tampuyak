const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

let lines = code.split('\n');

// For DataSekolahView
const dataSekolahStart = lines.findIndex(l => l.includes('const DataSekolahView = '));
if (dataSekolahStart !== -1) {
    for (let i = dataSekolahStart; i < lines.length; i++) {
        if (lines[i].includes('      {/* Main Content Area */}')) {
            // The next line is <div className="flex-1 overflow-x-hidden p-6 md:p-8">
            // The line after that should be where we insert PageHelp
            if (lines[i+1].includes('<div className="flex-1 overflow-x-hidden')) {
                if (!lines[i+2].includes('PageHelp')) {
                    lines.splice(i+2, 0, '        <PageHelp title="Data Sekolah" description="Pusat pengaturan profil, identitas, sarana prasarana, dan tenaga pendidik." importance="Menjadi sumber data utama bagi seluruh dokumen yang akan dihasilkan secara otomatis." nextStep="Lengkapi seluruh informasi secara akurat pada setiap tab." />');
                }
            }
            break;
        }
    }
}

// For RaporPendidikanView
const raporStart = lines.findIndex(l => l.includes('const RaporPendidikanView = '));
if (raporStart !== -1) {
    for (let i = raporStart; i < lines.length; i++) {
        if (lines[i].includes('  return (')) {
            if (lines[i+1].includes('<div className="space-y-8 animate-in')) {
                if (!lines[i+2].includes('PageHelp')) {
                    lines.splice(i+2, 0, '      <PageHelp title="Rapor Pendidikan" description="Halaman untuk memasukkan dan menyinkronkan hasil Evaluasi Diri Sekolah atau Rapor Pendidikan." importance="Merupakan dasar evaluasi untuk menentukan program prioritas sekolah secara tepat." nextStep="Unggah data rapor pendidikan terbaru Anda dan kunci data jika sudah sesuai." />');
                }
            }
            break;
        }
    }
}

// For DecisionEngineView
const decisionStart = lines.findIndex(l => l.includes('const DecisionEngineView = '));
if (decisionStart !== -1) {
    for (let i = decisionStart; i < lines.length; i++) {
        if (lines[i].includes('  return (')) {
            if (lines[i+1].includes('<div className="space-y-6 animate-in')) {
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
