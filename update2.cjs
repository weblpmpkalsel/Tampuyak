const fs = require("fs");

function updateFile(file, updateFn) {
    let content = fs.readFileSync(file, "utf8");
    content = updateFn(content);
    fs.writeFileSync(file, content);
}

const helper = `
function formatCell(text: string | null | undefined, prefix: string, explanations: string[], maxWords: number = 15): string {
    const sanitized = sanitizeAndSummarize(text, maxWords);
    if (!sanitized || sanitized === '-') return '-';
    const words = sanitized.split(/\\s+/);
    if (words.length <= maxWords) return sanitized;
    explanations.push(\${prefix}: \${sanitized}`);
    return words.slice(0, maxWords).join(' ') + '...';
}
`;

updateFile("src/DocumentCompositionEngine/builders/Chapter2Builder.ts", (content) => {
    if (!content.includes("function formatCell")) {
        content = content.replace("export class Chapter2Builder", helper + "\nexport class Chapter2Builder");
    }
    
    content = content.replace(
        /const prioritasData = analisisData\.prioritas \|| \[];\[s\S]*?sections\.push\(\{[\s\S]*?title: '2\.3 Analisis Prioritas',[\s\S]*?\}\);/g,
        `const prioritasData = analisisData.prioritas || [];
    const prioritasExplanations: string[] = [];
    const prioritasParagraphs = [
      'Berdasarkan pemetaan komprehensif dari Rapor Pendidikan, langkah strategis berikutnya adalah mengerucutkan fokus pada isu-isu prioritas. Fokus pada area kinerja yang menunjukkan kesenjan tertinggi memastikan efisiensi alokasi sumber daya sekolah.',
      'Penetapan sasaran prioritas ini diharapkan dapat memberikan daya ungkit maksimal terhadap transformasi ekosistem pembelajaran.'
    ];
    sections.push({
      id: generateId('DocumentSection'),
      title: '2.3 Analisis Prioritas',
      paragraphs: prioritasParagraphs,
      tables: [{
        title: 'Matriks Isu Prioritas',
        data: prioritasData.length > 0 ? prioritasData.map((p: any, idx: number) => {
          const akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : 'Data tidak tersedia';
          return {
            'Isu Prioritas (Priority Issue)': formatCell(p.name || 'Data tidak tersedia', 'Isu Prioritas', prioritasExplanations, 15),
            'Skor Prioritas (Priority Score)': formatCell((p.priorityScore || 0).toString(), 'Skor Prioritas', prioritasExplanations, 10),
            'Akar Masalah (Root Cause)': formatCell(akar, 'Akar Masalah', prioritasExplanations, 15)
          };
        }) : []
      }],
      references: []
    });
    if (prioritasExplanations.length > 0) {
      prioritasParagraphs.push('Keterangan Tambahan Analisis Prioritas:');
      prioritasParagraphs.push(...prioritasExplanations);
    }`
    );

    content = content.replace(
        /sections\.push\(\{\\s2*id: generateId\('DocumentSection'\),\\s2*title: '2\.4 Analisis SWOT',[s\S]*?\}\);/g,
        `const swotExplanations: string[] = [];
    const swotParagraphs = [
      'Satuan pendidikan melakukan Analisis SWOT guna mengontekstualisasikan temuan dari evaluasi internal dengan pemindaian lingkungan eksternal. Instrumen strategis ini memfasilitasi sekolah untuk memahami posisi dan kapasitas kelembagaan secara utuh.',
      'Setiap elemen SWOT diurai secara sistematis. Kekuatan dan peluang dimaksimalkan sebagai daya ungkit, sementara kelemahan dan ancaman dimitigasi agar tidak menghambat akselerasi peningkatan mutu.'
    ];
    sections.push({
      id: generateId('DocumentSection'),
      title: '2.4 Analisis SWOT',
      paragraphs: swotParagraphs,
      tables: [{
        title: 'Matriks Analisis SWOT',
        data: [{
          'Kekuatan (Strengths)': formatCell((analisisData.kekuatan || []).join('; ') || 'Data tidak tersedia', 'Kekuatan', swotExplanations, 15),
          'kelemahan (Weaknesses)': formatCell((analisisData.kelemahan || []).join('; ') || 'Data tidak tersedia', 'Kelemahan', swotExplanations, 15),
          'Peluang (Opportunities)': formatCell((analisisData.peluang || []).join('; ') || 'Data tidak tersedia', 'Peluang', swotExplanations, 15),
          'Ancaman (Threats)': formatCell((analisisData.tantangan || []).join('; ') || 'Data tidak tersedia', 'Ancaman', swotExplanations, 15)
        }]
      }],
      references: []
    });
    if (swotExplanations.length > 0) {
      swotParagraphs.push('Keterangan Tambahan Analisis SWOT:');
      swotParagraphs.push(...swotExplanations);
    }`
    );

    content = content.replace(
        /sections\.push\(\{\\s2*id: generateId\('DocumentSection'\),\\s2*title: '2\.5 Analisis IRB',[s\S]*?\}\);/g,
        `const irbExplanations: string[] = [];
    const irbParagraphs = [
      'Sebagai jembatan antara evaluasi capaian dan perencanaan program, satuan pendidikan menerapkan kerangka kerja Identifikasi, Refleksi, dan Benahi (IRB). Metodologi ini memastikan penelusuran akar masalah dilakukan secara komprehensif dan objektif.',
      'Melalui sintesis ini, strategi pembenahan dirancang sedemikian rupa agar secara langsung mengatasi kendala utama dan memberikan dampak signifikan pada hasil belajar.'
    ];
    sections.push({
      id: generateId('DocumentSection'),
      title: '2.5 Analisis IRB',
      paragraphs: irbParagraphs,
      tables: [{,
        title: 'Matriks Identifikasi, Refleksi, dan Benahi',
        data: prioritasData.length > 0 ? prioritasData.map((p: any, idx: number) => {
           const akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : 'Data tidak tersedia';
           const program = analisisData.program && analisisData.program[idx] ? analisisData.program[idx].nama : 'Data tidak tersedia';
           return {
             'Identifikasi (Identification)': formatCell(p.name, 'Identifikasi', irbExplanations, 15),
             'Refleksi (Reflection)': formatCell(akar, 'Refleksi', irbExplanations, 15),
             'Tindakan Benahi (Improvement)': formatCell(program, 'Tindakan Benahi', irbExplanations, 15)
           };
        }) : []
      }],
      references: []
    });
    if (irbExplanations.length > 0) {
      irbParagraphs.push('Keterangan Tambahan Analisis IRB:');
      irbParagraphs.push(...irbExplanations);
    }`
    );

    content = content.replace(
        /sections\.push\(\{\\s2*id: generateId\('DocumentSection'\),\s2*title: '2\.6 Prioritas Strategis',[s\S]*?\}\);/g,
        `const stratExplanations: string[] = [];
    const stratParagraphs = [
      'Sintesis dari seluruh tahapan analisis di atas mengerucut pada perumusan Prioritas Strategis. Agenda utama transformasi sekolah dalam jangka menengah ini diorientasikan pada pemenuhan Standar Nasional Pendidikan secara terpadu.',
      'Dengan menetapkan arah yang tegas, satuan pendidikan memiliki acuan (milestone) yang terstruktur untuk menyusun program aksi yang relevan pada tahapan perencanaan berikutnya.'
    ];
    sections.push({
      id: generateId('DocumentSection'),
      title: '2.6 Prioritas Strategis',
      paragraphs: stratParagraphs,
      tables: [{
        title: 'Ringkasan Prioritas Strategis',
        data: (analisisData.tujuan || []).map((t: any, idx: number) => {
           const program = analisisData.program && analisisData.program[idx] ? analisisData.program[idx].nama : 'Data tidak tersedia';
           const indikator = analisisData.indikator && analisisData.indikator[idx] ? analisisData.indikator[idx] : 'Data tidak tersedia';
           return {
             'Sasaran / Prioritas (Objective)': formatCell(t, 'Sasaran', stratExplanations, 15),
             'Program Aksi (Program)': formatCell(program, 'Program', stratExplanations, 15),
             'Indikator Keberhasilan': formatCell(indikator, 'Indikator', stratExplanations, 15)
           };
        })
      }],
      references: []
    });
    if (stratExplanations.length > 0) {
      stratParagraphs.push('Keterangan Tambahan Prioritas Strategis:');
      stratParagraphs.push(...stratExplanations);
    }`
    );
    
    return content;
});

console.log("Chapter2 updated successfully.");