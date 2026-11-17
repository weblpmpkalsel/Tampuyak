const fs = require("fs");
let content = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter4Builder.ts', 'utf8');

const helper = `
function formatCell(text: string | null | undefined, prefix: string, explanations: string[], maxWords: number = 15): string {
    const { sanitizeAndSummarize } = require('../utils');
    const sanitized = sanitizeAndSummarize(text, maxWords);
    if (!sanitized || sanitized === '-') return '-';
    const words = sanitized.split(/\s+/);
    if (words.length <= maxWords) return sanitized;
    explanations.push(prefix + ': ' + sanitized);
    return words.slice(0, maxWords).join(' ') + '...';
}
`;

if (!content.includes('function formatCell')) {
    content = content.replace('export class Chapter4Builder', helper + '\nexport class Chapter4Builder');
}

content = content.replace(
    /const budgetParagraphs = \[/,
    'const budgetExplanations: string[] = [];\n    const budgetParagraphs = ['
);

content = content.replace(
    /budgetTableData\.push\(\{\s*'Program \(Program\)': sanitizeAndSummarize\(bud\.program \|\| '-', 25\),[\s\S]*?\}\);/g,
    `budgetTableData.push({
            'Program (Program)': formatCell(bud.program || '-', 'Program', budgetExplanations, 15),
            'Kegiatan (Activity)': formatCell(bud.activity || '-', 'Kegiatan', budgetExplanations, 15),
            'Sumber Dana (Funding Source)': formatCell(bud.fundingSource || 'BOS Reguler', 'Sumber Dana', budgetExplanations, 15),
            'Tahun Pelaksanaan (Implementation Year)': formatCell(bud.schedule || 'Tahun 1', 'Tahun', budgetExplanations, 15),
            'Estimasi Anggaran (Estimated Budget)': amountDisplay
         });`
);

content = content.replace(
    /budgetTableData\.push\(\{\s*'Program \(Program\)': sanitizeAndSummarize\(act\.program \|\| '-', 25\),[\s\S]*?\}\);/g,
    `budgetTableData.push({
            'Program (Program)': formatCell(act.program || '-', 'Program', budgetExplanations, 15),
            'Kegiatan (Activity)': formatCell(act.activity || act.name || '-', 'Kegiatan', budgetExplanations, 15),
            'Sumber Dana (Funding Source)': '-',
            'Tahun Pelaksanaan (Implementation Year)': formatCell(act.schedule || '-', 'Tahun', budgetExplanations, 15),
            'Estimasi Anggaran (Estimated Budget)': 'Belum ditetapkan'
         });`
);

content = content.replace(
    /title: 'Proyeksi Anggaran',\s*paragraphs: budgetParagraphs,/,
    `title: 'Proyeksi Anggaran',
      paragraphs: [...budgetParagraphs, ...(budgetExplanations.length > 0 ? ['Keterangan Tambahan Anggaran:', ...budgetExplanations] : [])],`
);

fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter4Builder.ts', content);
console.log('Chapter 4 Builder successfully updated!');
