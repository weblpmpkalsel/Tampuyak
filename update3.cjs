const fs = require("fs");
let content = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter3Builder.ts', 'utf8');

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
    content = content.replace('export class Chapter3Builder', helper + '\nexport class Chapter3Builder');
}

// Ensure the arrays are declared before they are used!
content = content.replace(
    /const programTables: any\[\] = \[\];\s*const indicatorData: any\[\] = \[\];\s*const riskData: any\[\] = \[\];/,
    `const programTables: any[] = [];
    const indicatorData: any[] = [];
    const riskData: any[] = [];
    const programExplanations: string[] = [];
    const indicatorExplanations: string[] = [];
    const riskExplanations: string[] = [];`
);

content = content.replace(
    /programTables\.push\(\{\s*title: 'Program: ' \+ progName,[\s\S]*?\}\);/,
    `programTables.push({
             title: 'Program: ' + progName,
             data: activities.map(a => ({
               'Kegiatan (Activity)': formatCell(a.activity || a.subActivity || a.name || '-', 'Kegiatan', programExplanations, 15),
               'Deskripsi / Output': formatCell(a.description || a.output || '-', 'Output', programExplanations, 15),
               'Jadwal Pelaksanaan': formatCell(a.schedule || '-', 'Jadwal', programExplanations, 15),
               'Penanggung Jawab': formatCell(a.personResponsible || obj.responsibleUnit || '-', 'Penanggung Jawab', programExplanations, 15)
             }))
           });`
);

content = content.replace(
    /indicatorData\.push\(\{\s*'Program Strategis \(Strategic Program\)': sanitizeAndSummarize\(progName, 15\),[\s\S]*?\}\);/,
    `indicatorData.push({
             'Program Strategis (Strategic Program)': formatCell(progName, 'Program', indicatorExplanations, 15),
             'Indikator Kinerja Utama (Key Performance Indicator)': formatCell(obj.performanceIndicator || obj.successIndicator || 'Pelaksanaan tercapai 100%', 'Indikator', indicatorExplanations, 15),
             'Target Kualitatif / Kuantitatif (Target)': formatCell(obj.targetY4 || obj.target || 'Tercapai', 'Target', indicatorExplanations, 15)
           });`
);

content = content.replace(
    /riskData\.push\(\{\s*'Risiko Operasional \(Operational Risk\)': sanitizeAndSummarize\(obj\.risk, 15\),[\s\S]*?\}\);/,
    `riskData.push({
           'Risiko Operasional (Operational Risk)': formatCell(obj.risk, 'Risiko', riskExplanations, 15),
           'Dampak (Impact)': 'Berpotensi menghambat pencapaian target strategis',
           'Strategi Mitigasi (Mitigation Strategy)': formatCell(obj.mitigation, 'Mitigasi', riskExplanations, 15)
         });`
);

// Add explanations to section paragraphs
content = content.replace(
    /title: '3\.2 Program Strategis',\s*paragraphs: \[[\s\S]*?\]/,
    `title: '3.2 Program Strategis',
      paragraphs: [
        'Untuk menerjemahkan sasaran strategis ke dalam tindakan operasional, dirumuskan serangkaian program dan kegiatan berjenjang. Program-program ini dirancang dengan mempertimbangkan kapasitas sumber daya sekolah serta potensi dampaknya terhadap peningkatan kualitas layanan pendidikan.',
        ...(programExplanations.length > 0 ? ['Keterangan Tambahan Program Strategis:', ...programExplanations] : [])
      ]`
);

content = content.replace(
    /title: '3\.3 Target dan Indikator Keberhasilan',\s*paragraphs: \[[\s\S]*?\]/,
    `title: '3.3 Target dan Indikator Keberhasilan',
        paragraphs: [
          'Pengukuran keberhasilan pelaksanaan program didasarkan pada indikator kinerja utama dan target capaian yang spesifik, relevan, dan terukur (SMART). Pemetaan indikator ini menjadi acuan evaluasi berkala.',
          ...(indicatorExplanations.length > 0 ? ['Keterangan Tambahan Indikator:', ...indicatorExplanations] : [])
        ]`
);

content = content.replace(
    /title: '3\.4 Manajemen Risiko dan Strategi Mitigasi',\s*paragraphs: \[[\s\S]*?\]/,
    `title: '3.4 Manajemen Risiko dan Strategi Mitigasi',
        paragraphs: [
          'Dalam pelaksanaan program jangka menengah, diidentifikasi berbagai potensi risiko yang dapat menghambat pencapaian tujuan. Untuk mengamankan implementasi program, satuan pendidikan telah menyusun skenario mitigasi risiko yang komprehensif.',
          ...(riskExplanations.length > 0 ? ['Keterangan Tambahan Manajemen Risiko:', ...riskExplanations] : [])
        ]`
);

fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter3Builder.ts', content);
console.log('Chapter 3 Builder successfully updated!');
