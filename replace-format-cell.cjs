const fs = require('fs');
const path = require('path');

const newFunction = `function formatCell(text: string | null | undefined, prefix: string, explanations: string[], maxWords: number = 15): string {
    let s = text ? text.replace(/\\n/g, ' ').replace(/\\s+/g, ' ').trim() : '';

    s = s.replace(/\\s*\\([Dd]ikelompokkan dari.*?\\)\\s*/ig, ' ');
    s = s.replace(/\\s*\\(Grouped from.*?\\)\\s*/ig, ' ');
    s = s.replace(/\\s*Generated from.*?\\s*/ig, ' ');
    s = s.replace(/\\s*Copied from.*?\\s*/ig, ' ');

    const workbookPatterns = [
        /Perencanaan diorientasikan/i,
        /Pada tahapan ini/i,
        /Bapak\\/Ibu/i,
        /Silakan/i,
        /Pertimbangkan/i,
        /Renungkan/i,
        /Gunakan hasil/i,
        /Anda dapat/i,
        /Pilih/i,
        /Klik/i,
        /Panduan/i,
        /Sebagai referensi/i,
        /Contoh pengisian/i,
        /Isilah/i,
        /diisi dengan/i,
        /merujuk pada/i,
        /Bagaimana/i,
        /Apakah/i
    ];

    let isWorkbookWording = false;
    for (const pattern of workbookPatterns) {
        if (pattern.test(s)) {
            isWorkbookWording = true;
            break;
        }
    }

    if (!s || s === '-' || s.toLowerCase() === 'data tidak tersedia' || s.toLowerCase() === 'belum ditetapkan' || isWorkbookWording) {
        if (prefix === 'Kekuatan') return 'Belum teridentifikasi faktor kekuatan berdasarkan hasil analisis.';
        if (prefix === 'Kelemahan') return 'Belum teridentifikasi faktor kelemahan berdasarkan hasil analisis.';
        if (prefix === 'Peluang') return 'Belum tersedia bukti yang memadai untuk menyimpulkan faktor peluang.';
        if (prefix === 'Ancaman') return 'Belum tersedia bukti yang memadai untuk menyimpulkan faktor ancaman.';
        if (prefix === 'Isu Prioritas' || prefix === 'Identifikasi') return 'Belum teridentifikasi isu prioritas yang memerlukan intervensi.';
        if (prefix === 'Akar Masalah' || prefix === 'Refleksi') return 'Akar permasalahan belum dapat disimpulkan secara definitif.';
        if (prefix === 'Tindakan Benahi' || prefix === 'Program' || prefix === 'Kegiatan') return 'Belum terdapat rumusan tindakan strategis yang ditetapkan.';
        if (prefix === 'Sasaran') return 'Sasaran strategis belum ditetapkan dalam kerangka perencanaan.';
        if (prefix === 'Indikator') return 'Parameter keberhasilan belum diformulasikan.';
        if (prefix === 'Target') return 'Target pencapaian belum diproyeksikan.';
        if (prefix === 'Skor Prioritas') return 'Tidak terukur';
        if (prefix === 'Jadwal') return 'Linimasa pelaksanaan belum diproyeksikan.';
        if (prefix === 'Penanggung Jawab') return 'Unit pelaksana belum dialokasikan.';
        if (prefix === 'Risiko') return 'Faktor risiko operasional belum dipetakan.';
        if (prefix === 'Mitigasi') return 'Skenario mitigasi belum diformulasikan.';
        if (prefix === 'Sumber Dana') return 'Skema pendanaan belum diidentifikasi.';
        if (prefix === 'Tahun' || prefix === 'Tahun Pelaksanaan (Implementation Year)' || /^Tahun \\d/.test(prefix)) return 'Alokasi waktu belum ditetapkan.';
        if (prefix === 'Output') return 'Spesifikasi output belum dirumuskan.';
        return 'Belum teridentifikasi berdasarkan hasil analisis.';
    }

    if (prefix === 'Isu Prioritas' || prefix === 'Identifikasi') {
        s = s.replace(/^[A-Z]\\.\\d+(?:\\.\\d+)?\\s+/i, '');
        if (!s.toLowerCase().includes('rendah') && !s.toLowerCase().includes('kurang') && !s.toLowerCase().includes('belum')) {
            s = \`Pencapaian pada aspek \${s.toLowerCase()} masih memerlukan peningkatan.\`;
        }
    } else if (prefix === 'Akar Masalah' || prefix === 'Refleksi') {
        s = s.replace(/^[A-Z]\\.\\d+(?:\\.\\d+)?\\s+/i, '');
        if (s.toLowerCase().startsWith('penguatan')) {
            s = s.replace(/^penguatan\\s+/i, '');
            s = \`Praktik \${s.toLowerCase()} belum diterapkan secara optimal.\`;
        } else if (!s.toLowerCase().includes('belum') && !s.toLowerCase().includes('kurang')) {
            s = \`Optimalisasi \${s.toLowerCase()} belum berjalan efektif.\`;
        }
    } else if (prefix === 'Sasaran' || prefix === 'Program' || prefix === 'Kegiatan' || prefix === 'Tindakan Benahi') {
        s = s.replace(/^[A-Z]\\.\\d+(?:\\.\\d+)?\\s+/i, '');
        if (!s.toLowerCase().startsWith('penguatan') && !s.toLowerCase().startsWith('peningkatan') && !s.toLowerCase().startsWith('optimalisasi') && !s.toLowerCase().startsWith('pengembangan')) {
            s = \`Peningkatan kualitas \${s.toLowerCase()}\`;
        }
    }

    s = s.replace(/\\s+/g, ' ').trim();
    if (s.length > 0) {
        s = s.charAt(0).toUpperCase() + s.slice(1);
    }
    
    const sentences = s.split(/(?<=[.!?])\\s+/);
    if (sentences.length > 2) {
        s = sentences.slice(0, 2).join(' ');
    }

    const words = s.split(/\\s+/);
    if (words.length > maxWords) {
        s = words.slice(0, maxWords).join(' ') + '...';
    }

    return s;
}`;

const files = [
    'src/DocumentCompositionEngine/builders/Chapter2Builder.ts',
    'src/DocumentCompositionEngine/builders/Chapter3Builder.ts',
    'src/DocumentCompositionEngine/builders/Chapter4Builder.ts'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    const startIdx = content.indexOf('function formatCell');
    const endIdxStr = 'export class Chapter';
    const endIdx = content.indexOf(endIdxStr);

    if (startIdx !== -1 && endIdx !== -1) {
        content = content.substring(0, startIdx) + newFunction + '\n\n' + content.substring(endIdx);
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    } else {
        console.log('Could not find formatCell in ' + file);
    }
});
