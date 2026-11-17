const fs = require('fs');

let content = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter2Builder.ts', 'utf8');

const themeHelper = `
function getTheme(text: string): string {
    const s = (text || '').toLowerCase();
    if (s.includes('numerasi')) return 'NUMERASI';
    if (s.includes('literasi') || s.includes('membaca')) return 'LITERASI';
    if (s.includes('guru') || s.includes('pelatihan') || s.includes('pendidik') || s.includes('kompetensi') || s.includes('komunitas belajar')) return 'PENGEMBANGAN KOMPETENSI GURU';
    if (s.includes('karakter') || s.includes('iklim') || s.includes('budaya positif') || s.includes('keamanan') || s.includes('perundungan') || s.includes('kekerasan')) return 'PENGUATAN KARAKTER';
    if (s.includes('manajemen') || s.includes('pengelolaan') || s.includes('perencanaan') || s.includes('rkjm') || s.includes('fasilitas') || s.includes('sarana') || s.includes('prasarana') || s.includes('infrastruktur') || s.includes('sumber daya') || s.includes('anggaran') || s.includes('rkas')) return 'TATA KELOLA SEKOLAH';
    if (s.includes('pembelajaran') || s.includes('asesmen') || s.includes('kurikulum')) return 'KUALITAS PEMBELAJARAN';
    return 'PENGEMBANGAN INSTITUSIONAL';
}

function synthesizeTheme(theme: string) {
    switch (theme) {
        case 'NUMERASI':
            return {
                isu: 'Kemampuan numerasi peserta didik masih memerlukan peningkatan.',
                akar: 'Pembelajaran numerasi belum diterapkan secara konsisten.',
                benahi: 'Penguatan program numerasi melalui peningkatan kompetensi guru.',
                sasaran: 'Peningkatan kemampuan numerasi peserta didik secara berkelanjutan.',
                indikator: 'Capaian skor numerasi pada asesmen mengalami peningkatan.'
            };
        case 'LITERASI':
            return {
                isu: 'Budaya literasi sekolah belum berkembang secara optimal.',
                akar: 'Pembiasaan membaca belum berlangsung secara berkelanjutan.',
                benahi: 'Penguatan budaya literasi melalui program pembiasaan membaca.',
                sasaran: 'Peningkatan kemampuan literasi dan minat baca peserta didik.',
                indikator: 'Capaian skor literasi pada asesmen mengalami peningkatan.'
            };
        case 'PENGEMBANGAN KOMPETENSI GURU':
            return {
                isu: 'Kompetensi pendidik masih perlu ditingkatkan.',
                akar: 'Pengembangan profesional belum berjalan secara berkelanjutan.',
                benahi: 'Optimalisasi pelatihan dan komunitas belajar pendidik.',
                sasaran: 'Peningkatan kompetensi pedagogik dan profesional pendidik.',
                indikator: 'Peningkatan persentase guru yang berpartisipasi dalam pelatihan.'
            };
        case 'PENGUATAN KARAKTER':
            return {
                isu: 'Karakter dan iklim keamanan sekolah masih perlu penguatan.',
                akar: 'Nilai-nilai karakter belum terintegrasi penuh dalam budaya sekolah.',
                benahi: 'Penguatan pendidikan karakter dan penciptaan iklim sekolah yang aman.',
                sasaran: 'Terwujudnya iklim sekolah yang aman, inklusif, dan berkarakter.',
                indikator: 'Indeks iklim keamanan dan karakter sekolah meningkat.'
            };
        case 'TATA KELOLA SEKOLAH':
            return {
                isu: 'Tata kelola dan manajerial sekolah belum berjalan optimal.',
                akar: 'Optimalisasi sumber daya dan perencanaan belum terpadu.',
                benahi: 'Peningkatan kapasitas manajerial dan perencanaan berbasis data.',
                sasaran: 'Peningkatan akuntabilitas dan efektivitas tata kelola sekolah.',
                indikator: 'Perencanaan dan pengelolaan sumber daya berjalan efektif.'
            };
        case 'KUALITAS PEMBELAJARAN':
            return {
                isu: 'Kualitas pembelajaran belum mencapai tingkat yang diharapkan.',
                akar: 'Metode pengajaran belum sepenuhnya adaptif terhadap kebutuhan siswa.',
                benahi: 'Optimalisasi metode pembelajaran dan asesmen yang berpusat pada siswa.',
                sasaran: 'Peningkatan kualitas proses pembelajaran yang interaktif dan adaptif.',
                indikator: 'Kualitas praktik pembelajaran dan asesmen meningkat.'
            };
        case 'PENGEMBANGAN INSTITUSIONAL':
        default:
            return {
                isu: 'Pencapaian kinerja institusional masih memerlukan peningkatan.',
                akar: 'Evaluasi dan tindak lanjut program belum dilaksanakan secara konsisten.',
                benahi: 'Peningkatan efektivitas program melalui evaluasi berkelanjutan.',
                sasaran: 'Peningkatan capaian layanan pendidikan berdasarkan indikator kinerja.',
                indikator: 'Pelaksanaan program berjalan sesuai target yang ditetapkan.'
            };
    }
}

function consolidateEvidence(analisisData: any) {
    const themesMap = new Map<string, any>();
    const prioritasData = analisisData.prioritas || [];
    const maxLen = Math.max(
        prioritasData.length,
        analisisData.tujuan ? analisisData.tujuan.length : 0,
        analisisData.program ? analisisData.program.length : 0
    );

    for (let i = 0; i < maxLen; i++) {
        let p = prioritasData[i] || {};
        let t = analisisData.tujuan && analisisData.tujuan[i] ? analisisData.tujuan[i] : null;
        let prog = analisisData.program && analisisData.program[i] ? analisisData.program[i] : null;

        let isu = p.name || '';
        let program = prog ? (typeof prog === 'string' ? prog : prog.nama) : '';
        let sasaran = typeof t === 'string' ? t : (t ? t.name || '' : '');
        let combined = [isu, program, sasaran].join(' ');
        if (!combined.trim() || combined.includes('Data tidak tersedia')) continue;

        let theme = getTheme(combined);
        if (!themesMap.has(theme)) {
            themesMap.set(theme, { theme, skor: p.priorityScore || '-' });
        } else {
            let existing = themesMap.get(theme);
            if (p.priorityScore && existing.skor === '-') existing.skor = p.priorityScore;
        }
    }
    
    return Array.from(themesMap.values()).map(t => {
        return { ...t, ...synthesizeTheme(t.theme) };
    });
}
`;

content = content.replace("export class Chapter2Builder", themeHelper + "\nexport class Chapter2Builder");

// Replace Prioritas
const oldPrioritas = `data: (prioritasData.length > 0 ? prioritasData.map((p: any, idx: number) => {
          let isu = p.name || '';
          let akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : '';
          const program = analisisData.program && analisisData.program[idx] ? (typeof analisisData.program[idx] === 'string' ? analisisData.program[idx] : analisisData.program[idx].nama) : '';
          
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
        }) : []).filter((v: any, i: number, a: any[]) => a.findIndex(t => (t['Isu Prioritas (Priority Issue)'] === v['Isu Prioritas (Priority Issue)'] && t['Akar Masalah (Root Cause)'] === v['Akar Masalah (Root Cause)'])) === i)`;

const newPrioritas = `data: (() => {
          const consolidated = consolidateEvidence(analisisData);
          if (consolidated.length === 0) return [];
          return consolidated.map(c => ({
            'Isu Prioritas (Priority Issue)': formatCell(c.isu, 'Isu Prioritas', prioritasExplanations, 15),
            'Skor Prioritas (Priority Score)': formatCell(c.skor.toString(), 'Skor Prioritas', prioritasExplanations, 10),
            'Akar Masalah (Root Cause)': formatCell(c.akar, 'Akar Masalah', prioritasExplanations, 15)
          }));
        })()`;
content = content.replace(oldPrioritas, newPrioritas);

// Replace IRB
const oldIRB = `data: (prioritasData.length > 0 ? prioritasData.map((p: any, idx: number) => {
           let identifikasi = p.name || '';
           let akar = analisisData.akarPenyebab ? analisisData.akarPenyebab.split('; ')[idx] || analisisData.akarPenyebab : '';
           const program = analisisData.program && analisisData.program[idx] ? (typeof analisisData.program[idx] === 'string' ? analisisData.program[idx] : analisisData.program[idx].nama) : '';
           
           if (!identifikasi || identifikasi.toLowerCase() === 'data tidak tersedia' || identifikasi === '-') {
              identifikasi = inferIssueFromProgram(program);
           }
           if (!akar || akar.toLowerCase() === 'data tidak tersedia' || akar === '-') {
              akar = inferCauseFromProgram(program);
           }
           return {
             'Identifikasi (Identification)': formatCell(identifikasi, 'Identifikasi', irbExplanations, 15),
             'Refleksi (Reflection)': formatCell(akar, 'Refleksi', irbExplanations, 15),
             'Tindakan Benahi (Improvement)': formatCell(program || '', 'Tindakan Benahi', irbExplanations, 15)
           };
        }) : []).filter((v: any, i: number, a: any[]) => a.findIndex(t => (t['Identifikasi (Identification)'] === v['Identifikasi (Identification)'] && t['Refleksi (Reflection)'] === v['Refleksi (Reflection)'] && t['Tindakan Benahi (Improvement)'] === v['Tindakan Benahi (Improvement)'])) === i)`;

const newIRB = `data: (() => {
          const consolidated = consolidateEvidence(analisisData);
          if (consolidated.length === 0) return [];
          return consolidated.map(c => ({
            'Identifikasi (Identification)': formatCell(c.isu, 'Identifikasi', irbExplanations, 15),
             'Refleksi (Reflection)': formatCell(c.akar, 'Refleksi', irbExplanations, 15),
             'Tindakan Benahi (Improvement)': formatCell(c.benahi, 'Tindakan Benahi', irbExplanations, 15)
          }));
        })()`;
content = content.replace(oldIRB, newIRB);

// Replace Strategis
const oldStrat = `data: ((analisisData.tujuan || []).map((t: any, idx: number) => {
           const program = analisisData.program && analisisData.program[idx] ? (typeof analisisData.program[idx] === 'string' ? analisisData.program[idx] : analisisData.program[idx].nama) : '';
           let indikator = analisisData.indikator && analisisData.indikator[idx] ? analisisData.indikator[idx] : '';
           if (!indikator || indikator === 'Data tidak tersedia' || indikator === '-') {
               indikator = 'Pelaksanaan program berjalan sesuai target yang ditetapkan.';
           }
           let sasaran = typeof t === 'string' ? t : (t.name || '');
           if (!sasaran || sasaran === 'Data tidak tersedia' || sasaran === '-') {
               sasaran = 'Peningkatan capaian layanan pendidikan berdasarkan indikator kinerja.';
           }

           return {
             'Sasaran / Prioritas (Objective)': formatCell(sasaran, 'Sasaran', stratExplanations, 15),
             'Program Aksi (Program)': formatCell(program || '', 'Program', stratExplanations, 15),
             'Indikator Keberhasilan': formatCell(indikator, 'Indikator', stratExplanations, 15)
           };
        }) as any[]).filter((v: any, i: number, a: any[]) => a.findIndex(t => (t['Sasaran / Prioritas (Objective)'] === v['Sasaran / Prioritas (Objective)'] && t['Program Aksi (Program)'] === v['Program Aksi (Program)'])) === i)`;

const newStrat = `data: (() => {
          const consolidated = consolidateEvidence(analisisData);
          if (consolidated.length === 0) return [];
          return consolidated.map(c => ({
             'Sasaran / Prioritas (Objective)': formatCell(c.sasaran, 'Sasaran', stratExplanations, 15),
             'Program Aksi (Program)': formatCell(c.benahi, 'Program', stratExplanations, 15),
             'Indikator Keberhasilan': formatCell(c.indikator, 'Indikator', stratExplanations, 15)
          }));
        })()`;
content = content.replace(oldStrat, newStrat);

fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter2Builder.ts', content);
console.log('Chapter 2 modified successfully');
