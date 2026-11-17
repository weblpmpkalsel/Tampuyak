const fs = require('fs');
const files = [
  'src/DocumentCompositionEngine/builders/Chapter2Builder.ts',
  'src/DocumentCompositionEngine/builders/Chapter3Builder.ts',
  'src/DocumentCompositionEngine/builders/Chapter4Builder.ts'
];

const newFormatCell = `function formatCell(text: string | null | undefined, prefix: string, explanations: string[], maxWords: number = 25): string {
    if (!text) return '-';
    let s = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    if (!s || s === '-') return '-';

    const stopWords = [
        'Pada tahapan ini', 'Bapak/Ibu', 'Silakan', 'Gunakan hasil', 'Pertimbangkan', 
        'Diskusikan', 'Renungkan', 'Anda dapat', 'Pilih', 'Klik', 'Panduan', 
        'Sebagai referensi', 'Contoh pengisian', 'Isilah', 'diisi dengan', 'merujuk pada'
    ];
    
    let sentences = s.split(/(?<=\.)\s+/);
    sentences = sentences.filter(sentence => {
        const lower = sentence.toLowerCase();
        return !stopWords.some(stop => lower.includes(stop.toLowerCase()));
    });
    
    s = sentences.join(' ');

    s = s.replace(/Hal ini bertujuan agar (.*?)(?=\.|\n|$)/ig, 'Kebijakan ini ditujukan untuk ');
    s = s.replace(/Pengembangan ini bertujuan (.*?)(?=\.|\n|$)/ig, 'Penguatan difokuskan untuk ');
    s = s.replace(/Perencanaan perlu terjadi (.*?)(?=\.|\n|$)/ig, 'Perencanaan diorientasikan pada ');

    s = s.replace(/Apakah (.*?)\?/ig, (match, p1) => {
        return p1.charAt(0).toUpperCase() + p1.slice(1) + ' perlu mendapat penguatan untuk mendukung target mutu.';
    });
    s = s.replace(/Bagaimana (.*?)\?/ig, (match, p1) => {
        return 'Mekanisme ' + p1 + ' akan dievaluasi dan disempurnakan.';
    });
    s = s.replace(/([A-Za-z0-9\s,]+)\?/g, (match, p1) => {
        return 'Aspek ' + p1 + ' menjadi area fokus perbaikan.';
    });

    s = s.replace(/\s+/g, ' ').trim();
    if (s.length > 0) s = s.charAt(0).toUpperCase() + s.slice(1);
    
    if (!s || s === '.') return '-';
    
    const { sanitizeAndSummarize } = require('../utils');
    s = sanitizeAndSummarize(s, 1000);

    const words = s.split(/\s+/);
    if (words.length <= maxWords) return s;
    return words.slice(0, maxWords).join(' ') + '...';
}`;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Using a more robust replace for the function
    const fnStart = content.indexOf('function formatCell');
    const fnEnd = content.indexOf('export class ');
    if (fnStart > -1 && fnEnd > -1) {
        content = content.substring(0, fnStart) + newFormatCell + '\n\n' + content.substring(fnEnd);
    }
    
    // Also replace the instructional empty state in Chapter 3
    if (f.includes('Chapter3Builder')) {
        content = content.replace(/paragraphs: \['Silakan selesaikan proses Perencanaan Berbasis Data untuk menghasilkan Sasaran Strategis\.'\]/, "paragraphs: ['Dokumen perencanaan belum memuat Sasaran Strategis karena proses sinkronisasi Perencanaan Berbasis Data (PBD) dengan arsitektur perencanaan jangka menengah belum sepenuhnya ditetapkan.']");
    }

    fs.writeFileSync(f, content);
});
console.log('Semantic filters applied successfully');
