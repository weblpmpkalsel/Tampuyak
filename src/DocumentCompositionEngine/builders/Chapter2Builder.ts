import { DocumentChapter, DocumentSection } from '../DocumentModel';
import { generateId, sanitizeAndSummarize } from '../utils';
import { KnowledgeGraph } from '../../SPKG';
import { ReferenceBuilder } from '../ReferenceBuilder';


function sanitizeGuidance(text: string): string {
    if (!text || typeof text !== 'string') return '';
    let s = text.replace(/https?:\/\/[^\s]+/g, '');
    s = s.replace(/(?:Cara|Langkah|Benahi)\s*\d+:/ig, '');
    s = s.replace(/Panduan pelaksanaan:/ig, '');
    s = s.replace(/Manual:/ig, '');
    s = s.replace(/Pelajari lebih lanjut.*/ig, '');
    s = s.replace(/Pilih kegiatan.*/ig, '');
    s = s.replace(/Silakan pilih.*/ig, '');
    s = s.replace(/Anda dapat memilih.*/ig, '');
    s = s.replace(/Untuk panduan.*/ig, '');
    s = s.replace(/\[\[.*?\]\]/g, ''); // remove wiki links
    s = s.replace(/\s+/g, ' ').trim();
    // try to get the first sentence if it's too long
    const match = s.match(/[^.!?]+[.!?]/);
    return match ? match[0].trim() : s;
}

function formatCell(text: any, prefix: string, explanations: string[], maxWords: number = 15): string {
    let rawText = '';
    if (typeof text === 'string') {
        rawText = text;
    } else if (Array.isArray(text)) {
        rawText = text.filter(t => typeof t === 'string').join('; ');
    } else if (text === null || text === undefined || typeof text === 'object') {
        rawText = '';
    } else {
        rawText = String(text);
    }

    let s = rawText ? rawText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : '';

    s = s.replace(/\s*\([Dd]ikelompokkan dari.*?\)\s*/ig, ' ');
    s = s.replace(/\s*\(Grouped from.*?\)\s*/ig, ' ');
    s = s.replace(/\s*Generated from.*?\s*/ig, ' ');
    s = s.replace(/\s*Copied from.*?\s*/ig, ' ');

    const workbookPatterns = [
        /Perencanaan diorientasikan/i,
        /Pada tahapan ini/i,
        /Bapak\/Ibu/i,
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
        if (prefix === 'Skor Prioritas') return 'Tidak terukur';
        return 'Data sedang dalam tahap penyusunan hasil analisis yang memadai.';
    }

    if (prefix === 'Isu Prioritas' || prefix === 'Identifikasi') {
        s = s.replace(/^[A-Z]\.\d+(?:\.\d+)?\s+/i, '');
        if (!s.toLowerCase().includes('rendah') && !s.toLowerCase().includes('kurang') && !s.toLowerCase().includes('belum')) {
            s = `Pencapaian pada aspek ${s.toLowerCase()} masih memerlukan peningkatan.`;
        }
    } else if (prefix === 'Akar Masalah' || prefix === 'Refleksi') {
        s = s.replace(/^[A-Z]\.\d+(?:\.\d+)?\s+/i, '');
        if (s.toLowerCase().startsWith('penguatan')) {
            s = s.replace(/^penguatan\s+/i, '');
            s = `Praktik ${s.toLowerCase()} belum diterapkan secara optimal.`;
        } else if (!s.toLowerCase().includes('belum') && !s.toLowerCase().includes('kurang')) {
            s = `Optimalisasi ${s.toLowerCase()} belum berjalan efektif.`;
        }
    } else if (prefix === 'Sasaran' || prefix === 'Program' || prefix === 'Kegiatan' || prefix === 'Tindakan Benahi') {
        s = s.replace(/^[A-Z]\.\d+(?:\.\d+)?\s+/i, '');
        if (!s.toLowerCase().startsWith('penguatan') && !s.toLowerCase().startsWith('peningkatan') && !s.toLowerCase().startsWith('optimalisasi') && !s.toLowerCase().startsWith('pengembangan')) {
            s = `Peningkatan kualitas ${s.toLowerCase()}`;
        }
    }

    s = s.replace(/\s+/g, ' ').trim();
    if (s.length > 0) {
        s = s.charAt(0).toUpperCase() + s.slice(1);
    }
    
    const sentences = s.split(/(?<=[.!?])\s+/);
    if (sentences.length > 2) {
        s = sentences.slice(0, 2).join(' ');
    }

    const words = s.split(/\s+/);
    if (words.length > maxWords) {
        s = words.slice(0, maxWords).join(' ') + '...';
    }

    return sanitizeGuidance(s) || s;
}


function inferIssueFromProgram(program: string): string {
    if (!program || program.trim() === '-' || program.trim() === 'Data tidak tersedia' || program.trim() === 'Data tidak tersedia') return 'Data tidak tersedia';
    const s = program.toLowerCase();
    if (s.includes('numerasi')) return 'Kemampuan numerasi peserta didik masih rendah.';
    if (s.includes('literasi')) return 'Budaya literasi sekolah masih kurang dan perlu diperkuat.';
    if (s.includes('guru') || s.includes('pelatihan')) return 'Kompetensi pendidik masih belum optimal.';
    if (s.includes('karakter') || s.includes('iklim')) return 'Karakter dan iklim keamanan sekolah masih belum maksimal.';
    if (s.includes('fasilitas') || s.includes('sarana')) return 'Penyediaan sarana dan prasarana pembelajaran belum optimal.';
    if (s.includes('pembelajaran')) return 'Kualitas pembelajaran belum mencapai tingkat yang diharapkan.';
    return 'Pencapaian kinerja institusional masih belum mencapai target.';
}

function inferCauseFromProgram(program: string): string {
    if (!program || program.trim() === '-' || program.trim() === 'Data tidak tersedia' || program.trim() === 'Data tidak tersedia') return 'Data tidak tersedia';
    const s = program.toLowerCase();
    if (s.includes('guru') || s.includes('pelatihan')) return 'Pengembangan profesional guru belum berlangsung secara berkelanjutan.';
    if (s.includes('metode') || s.includes('strategi')) return 'Metode pengajaran belum sepenuhnya adaptif terhadap kebutuhan siswa.';
    if (s.includes('fasilitas') || s.includes('sarana')) return 'Ketersediaan fasilitas pendukung pembelajaran masih belum memadai.';
    if (s.includes('evaluasi') || s.includes('asesmen')) return 'Pemanfaatan hasil asesmen belum optimal dalam merancang pembelajaran.';
    return 'Optimalisasi sumber daya dan metode pembelajaran belum berjalan efektif.';
}

function synthesizeSWOT(items: string[], type: string, isEmptyProfile: boolean): string {
    if (isEmptyProfile) {
        return 'Data sedang dalam tahap penyusunan hasil analisis yang memadai.';
    }

    const validItems = items ? items.filter(i => {
        const lower = i.toLowerCase();
        return !lower.includes('data tidak tersedia') && !lower.includes('belum teridentifikasi') && i.trim() !== '-';
    }) : [];

    const text = validItems.join(' ').toLowerCase();

    if (type === 'Kekuatan') {
        if (text.includes('guru') || text.includes('pendidik') || text.includes('kompetensi')) return 'Komitmen dan kompetensi pendidik menjadi modal utama peningkatan mutu sekolah.';
        if (text.includes('literasi') || text.includes('numerasi') || text.includes('akademik')) return 'Kemampuan dasar dan capaian akademik peserta didik menunjukkan tren yang positif.';
        if (text.includes('iklim') || text.includes('karakter') || text.includes('budaya')) return 'Iklim keamanan, kebhinekaan, dan karakter peserta didik merupakan keunggulan sekolah.';
        if (text.includes('fasilitas') || text.includes('sarana') || text.includes('infrastruktur')) return 'Ketersediaan sarana dan prasarana mendukung proses pembelajaran secara optimal.';
        if (text.includes('manajemen') || text.includes('tata kelola') || text.includes('kepala sekolah')) return 'Tata kelola manajerial dan kepemimpinan sekolah berjalan secara efektif.';
        return 'Komitmen kelembagaan dan dedikasi tenaga pendidik menjadi modal utama peningkatan mutu layanan pendidikan.';
    }
    if (type === 'Kelemahan') {
        if (text.includes('numerasi') && text.includes('literasi')) return 'Capaian literasi dan numerasi peserta didik masih berada di bawah target yang diharapkan.';
        if (text.includes('numerasi')) return 'Capaian kemampuan numerasi peserta didik masih memerlukan intervensi peningkatan.';
        if (text.includes('literasi')) return 'Capaian kemampuan literasi peserta didik masih memerlukan intervensi peningkatan.';
        if (text.includes('guru') || text.includes('pembelajaran') || text.includes('metode')) return 'Kualitas praktik pembelajaran dan pengembangan kompetensi guru belum optimal.';
        if (text.includes('karakter') || text.includes('iklim') || text.includes('keamanan')) return 'Iklim keamanan dan penguatan karakter peserta didik masih memerlukan perbaikan.';
        if (text.includes('fasilitas') || text.includes('sarana')) return 'Keterbatasan sarana dan prasarana menjadi kendala dalam proses pembelajaran.';
        return 'Beberapa aspek praktik pembelajaran dan capaian hasil belajar peserta didik masih memerlukan penguatan strategis.';
    }
    if (type === 'Peluang') {
        if (text.includes('dinas') || text.includes('pemerintah') || text.includes('kebijakan')) return 'Tersedia dukungan kebijakan dan program pemerintah yang dapat dioptimalkan untuk mutu pendidikan.';
        if (text.includes('masyarakat') || text.includes('orang tua') || text.includes('komite')) return 'Tingkat partisipasi dan dukungan orang tua serta masyarakat merupakan potensi strategis.';
        if (text.includes('teknologi') || text.includes('digital')) return 'Perkembangan teknologi digital membuka peluang untuk inovasi dan digitalisasi pembelajaran.';
        if (text.includes('mitra') || text.includes('kerja sama') || text.includes('industri')) return 'Peluang kolaborasi dan kemitraan eksternal dapat memperkuat program pengembangan sekolah.';
        return 'Tersedia ruang kolaborasi dengan masyarakat dan dukungan kebijakan pemerintah untuk akselerasi peningkatan mutu.';
    }
    if (type === 'Ancaman') {
        if (text.includes('lingkungan') || text.includes('sosial') || text.includes('geografis')) return 'Kondisi lingkungan sosial atau geografis sekitar memberikan tantangan bagi operasional sekolah.';
        if (text.includes('ekonomi') || text.includes('finansial')) return 'Faktor keterbatasan ekonomi masyarakat dapat memengaruhi tingkat partisipasi dan keberlangsungan program.';
        if (text.includes('kompetisi') || text.includes('persaingan')) return 'Dinamika persaingan mutu antar institusi menuntut sekolah untuk terus berinovasi.';
        if (text.includes('kebijakan') || text.includes('peraturan') || text.includes('regulasi')) return 'Perubahan regulasi dan kebijakan eksternal menuntut adaptasi institusional yang cepat.';
        return 'Perubahan kebijakan pendidikan dan keterbatasan sumber daya berpotensi memengaruhi pencapaian target mutu.';
    }
    return 'Data sedang dalam tahap penyusunan hasil analisis yang memadai.';
}


function extractAdministrativeContext(rawText: string) {
    const text = (rawText || '').toLowerCase();
    let priority = 'Pengembangan Mutu Layanan';
    if (text.match(/literasi|membaca|perpustakaan/)) priority = 'Peningkatan Literasi';
    else if (text.match(/numerasi|matematika|berhitung/)) priority = 'Peningkatan Numerasi';
    else if (text.match(/karakter|iklim|keamanan|perundungan|kekerasan/)) priority = 'Penguatan Karakter dan Iklim Sekolah';
    else if (text.match(/kualitas|pembelajaran|metode|guru|pendidik/)) priority = 'Kualitas Pembelajaran dan Kompetensi Pendidik';

    let rootCause = 'Kapasitas struktural dan kultural belum optimal';
    if (text.match(/guru|pendidik|kepala sekolah/)) rootCause = 'Kompetensi sumber daya manusia perlu ditingkatkan';
    else if (text.match(/fasilitas|sarana|prasarana|alat/)) rootCause = 'Ketersediaan infrastruktur pendukung belum memadai';
    else if (text.match(/metode|kurikulum|asesmen/)) rootCause = 'Pendekatan pedagogis belum sepenuhnya berpusat pada siswa';
    else if (text.match(/anggaran|biaya|dana/)) rootCause = 'Alokasi sumber daya finansial memerlukan optimalisasi';

    let desiredOutcome = 'Terwujudnya peningkatan Standar Nasional Pendidikan';
    if (priority === 'Peningkatan Literasi') desiredOutcome = 'Peningkatan kecakapan literasi peserta didik';
    else if (priority === 'Peningkatan Numerasi') desiredOutcome = 'Peningkatan daya nalar dan numerasi peserta didik';
    else if (priority === 'Penguatan Karakter dan Iklim Sekolah') desiredOutcome = 'Terciptanya lingkungan belajar yang inklusif dan aman';
    else if (priority === 'Kualitas Pembelajaran dan Kompetensi Pendidik') desiredOutcome = 'Peningkatan efektivitas proses belajar mengajar';

    return {
        priority,
        rootCause,
        evidence: 'Evaluasi Diri Sekolah dan Rapor Pendidikan',
        desiredOutcome
    };
}

function generateAdministrativeNarrative(contexts: any[]) {
    if (contexts.length === 0) return [
        'Melalui penelaahan berbasis bukti terhadap Evaluasi Diri Sekolah, satuan pendidikan telah mengidentifikasi area strategis yang membutuhkan intervensi terarah. Agenda prioritas dirumuskan untuk merespons dinamika kebutuhan peserta didik.',
        'Dari hasil analisis diagnostik, komite perencanaan menyimpulkan bahwa hambatan bersumber pada kapasitas struktural. Identifikasi objektif ini memberikan landasan untuk penyusunan strategi penyelesaian masalah.',
        'Sebagai tindak lanjut, kerangka program aksi diorientasikan pada pembenahan layanan. Keseluruhan perencanaan merepresentasikan komitmen institusional dalam mewujudkan layanan bermutu.'
    ];
    
    const uniquePriorities = Array.from(new Set(contexts.map(c => c.priority)));
    const uniqueCauses = Array.from(new Set(contexts.map(c => c.rootCause)));
    const uniqueOutcomes = Array.from(new Set(contexts.map(c => c.desiredOutcome)));
    
    return [
        `Melalui penelaahan berbasis bukti terhadap ${contexts[0].evidence}, satuan pendidikan telah mengidentifikasi beberapa area strategis yang membutuhkan intervensi terarah. Agenda prioritas utama yang telah ditetapkan meliputi ${uniquePriorities.join(', ')}. Fokus kebijakan ini dirumuskan semata-mata untuk merespons dinamika kebutuhan peserta didik serta memastikan keselarasan dengan peta jalan pendidikan daerah.`,
        `Dari hasil analisis diagnostik terhadap area prioritas tersebut, komite perencanaan sekolah menyimpulkan bahwa hambatan utama bersumber pada faktor-faktor mendasar, yaitu ${uniqueCauses.join(' dan ')}. Identifikasi kendala yang objektif ini memberikan landasan yang kuat bagi manajemen sekolah dalam menyusun strategi penyelesaian masalah yang tidak bersifat reaktif, melainkan struktural dan preventif.`,
        `Sebagai tindak lanjut dari pemetaan masalah tersebut, kerangka program aksi jangka menengah diorientasikan pada serangkaian inisiatif pembenahan. Intervensi yang dirancang secara spesifik bertujuan untuk mencapai ${uniqueOutcomes.join(', ')}. Keseluruhan postur perencanaan ini merepresentasikan komitmen institusional sekolah dalam mewujudkan layanan pendidikan yang berkeadilan, bermutu, dan relevan dengan tantangan masa depan.`
    ];
}

function generateStrategicNarrative(contexts: any[]) {
    if (contexts.length === 0) return [
        'Berdasarkan sintesis data evaluasi, agenda strategis dikerucutkan pada penetapan prioritas peningkatan layanan.',
        'Penetapan sasaran prioritas ini diharapkan menghadirkan daya ungkit yang maksimal terhadap perbaikan ekosistem pendidikan dan komitmen kolektif.'
    ];
    
    const uniquePriorities = Array.from(new Set(contexts.map(c => c.priority)));
    
    return [
        `Berdasarkan sintesis data evaluasi secara menyeluruh, agenda strategis berikutnya adalah mengerucutkan fokus pada penetapan isu-isu prioritas. Satuan pendidikan memfokuskan sumber dayanya pada penanganan masalah mendasar terkait ${uniquePriorities.join(', ')}. Proses rasionalisasi ini dilakukan guna memastikan bahwa kerangka kerja transformasi lebih efisien dan tepat sasaran.`,
        'Penetapan sasaran prioritas ini diharapkan menghadirkan daya ungkit yang maksimal terhadap perbaikan ekosistem layanan pendidikan. Pilihan prioritas ini menjadi landasan rumusan intervensi strategis dan komitmen kolektif seluruh warga sekolah untuk memobilisasi kapasitas organisasional secara optimal.'
    ];
}

function generateFinalNarrative(contexts: any[]) {
    if (contexts.length === 0) return [
        'Sintesis dari tahapan evaluasi bermuara pada perumusan prioritas strategis kelembagaan jangka menengah. Agenda utama diorientasikan pada peningkatan layanan.',
        'Dengan menetapkan arah kebijakan yang taktis, satuan pendidikan merancang program aksi spesifik.'
    ];
    
    const uniqueOutcomes = Array.from(new Set(contexts.map(c => c.desiredOutcome)));
    
    return [
        `Sintesis dari tahapan evaluasi dan analisis diagnostik di atas bermuara pada perumusan prioritas strategis kelembagaan jangka menengah. Agenda utama transformasi sekolah ini secara khusus diorientasikan pada ${uniqueOutcomes.join(', ')}. Setiap butir sasaran yang ditetapkan telah melalui uji kelayakan, baik dari aspek urgensi maupun keselarasan dengan visi misi satuan pendidikan.`,
        'Dengan menetapkan arah kebijakan yang taktis, satuan pendidikan merancang program aksi spesifik yang terpusat pada penguatan manajerial dan akademik. Prioritas strategis ini berfungsi sebagai panduan utama bagi manajemen sekolah dalam mengalokasikan sumber daya secara proporsional. Keseluruhan postur perencanaan ini diharapkan mampu mengorkestrasi setiap unit kerja untuk mewujudkan layanan pendidikan yang bermutu prima secara sistematis dan terukur.'
    ];
}

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

    let maxScore = 0;

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
        
        // Extract raw score safely
        let rawScore: number | '-' = '-';
        if (typeof p.priorityScore === 'number') {
            rawScore = p.priorityScore;
        } else if (typeof p.priorityScore === 'string' && !isNaN(Number(p.priorityScore))) {
            rawScore = Number(p.priorityScore);
        }
        
        if (typeof rawScore === 'number' && rawScore > maxScore) {
            maxScore = rawScore;
        }

        if (!themesMap.has(theme)) {
            themesMap.set(theme, { theme, skor: rawScore });
        } else {
            let existing = themesMap.get(theme);
            if (rawScore !== '-' && existing.skor === '-') {
                existing.skor = rawScore;
            } else if (rawScore !== '-' && typeof existing.skor === 'number' && rawScore > existing.skor) {
                existing.skor = rawScore;
            }
        }
    }
    
    return Array.from(themesMap.values()).map(t => {
        let normalizedSkor = '-';
        if (typeof t.skor === 'number' && maxScore > 0) {
            const norm = Math.round((t.skor / maxScore) * 100);
            let label = '';
            if (norm >= 80) label = 'Tinggi';
            else if (norm >= 60) label = 'Sedang';
            else label = 'Rendah';
            normalizedSkor = `${norm} (${label})`;
        } else if (typeof t.skor === 'number' && maxScore === 0) {
            normalizedSkor = `0 (Rendah)`;
        }
        
        return { ...t, ...synthesizeTheme(t.theme), skor: normalizedSkor };
    });
}

export class Chapter2Builder {
  private referenceBuilder = new ReferenceBuilder();

  public build(kg: KnowledgeGraph, settings: any = {}): DocumentChapter {

    const analisisData = settings?.analisis?.data || {};
    const swotCount = (analisisData.kekuatan?.length || 0) + (analisisData.kelemahan?.length || 0) + (analisisData.peluang?.length || 0) + (analisisData.tantangan?.length || 0);
    const irbCount = analisisData.prioritas?.length || 0;
    const objCount = analisisData.tujuan?.length || 0;
    const progCount = analisisData.program?.length || 0;
    const actCount = analisisData.kegiatan?.length || 0;
    
    let budgetCount = 0;
    const rp = settings?.relationalPlanning;
    if (rp && rp.annualPlans) {
       ['Y1', 'Y2', 'Y3', 'Y4'].forEach(y => {
          budgetCount += (rp.annualPlans[y]?.rkas?.length || 0);
       });
    }

    (/* console.log removed */ (..._args: any[]) => {})("===================================");
    (/* console.log removed */ (..._args: any[]) => {})("PLANNINGRESULT AUDIT");
    (/* console.log removed */ (..._args: any[]) => {})("===================================");
    (/* console.log removed */ (..._args: any[]) => {})(`PlanningResult.swot ${swotCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`PlanningResult.irb ${irbCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`PlanningResult.objectives ${objCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`PlanningResult.programs ${progCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`PlanningResult.activities ${actCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`PlanningResult.budgets ${budgetCount}`);
    (/* console.log removed */ (..._args: any[]) => {})("===================================");
    (/* console.log removed */ (..._args: any[]) => {})("CHAPTER BINDING");
    (/* console.log removed */ (..._args: any[]) => {})("===================================");
    (/* console.log removed */ (..._args: any[]) => {})(`2.3 received ${irbCount} records`);
    (/* console.log removed */ (..._args: any[]) => {})(`2.4 received ${swotCount} records`);
    (/* console.log removed */ (..._args: any[]) => {})(`2.5 received ${irbCount} records`);
    (/* console.log removed */ (..._args: any[]) => {})(`2.6 received ${objCount} records`);

    const sections: DocumentSection[] = [];
    const allReferences: string[] = [];
    const rp_local = settings?.relationalPlanning || {};
    const canonicalObjectives = (rp_local.objectives || []).map((o: any) => o.strategicObjective).filter(Boolean);
    const canonicalPrograms = (rp_local.programs || []).map((p: any) => p.programName).filter(Boolean);
    
    // 2.1 Kondisi Umum Sekolah
    sections.push({
      id: generateId('DocumentSection'),
      title: '2.1 Kondisi Umum Sekolah',
      paragraphs: [
        'Penyusunan dokumen Rencana Kerja Jangka Menengah (RKJM) ini diawali dengan pelaksanaan evaluasi kelembagaan guna memetakan capaian pemenuhan Standar Nasional Pendidikan.',
        'Profil capaian ini berfungsi sebagai navigasi strategis yang memberikan gambaran utuh mengenai posisi kelembagaan.'
      ],
      references: []
    });

    // 2.2 Ringkasan Hasil Rapor Pendidikan
    const rpParagraphs = [];
    if (canonicalObjectives.length > 0) {
        rpParagraphs.push(`Evaluasi Rapor Pendidikan difokuskan pada pencapaian sasaran ${canonicalObjectives.slice(0, 3).join(', ')}.`);
        rpParagraphs.push('Tinjauan reflektif ini membuktikan bahwa perbaikan berkelanjutan membutuhkan intervensi terstruktur.');
    } else {
        rpParagraphs.push('Evaluasi internal difokuskan untuk membedah determinan pencapaian mutu saat ini.');
        rpParagraphs.push('Hasil evaluasi memberikan implikasi strategis krusial bagi penentuan arah kebijakan sekolah.');
    }

    sections.push({
      id: generateId('DocumentSection'),
      title: '2.2 Ringkasan Hasil Rapor Pendidikan',
      paragraphs: rpParagraphs,
      tables: [],
      references: []
    });

    // 2.3 Analisis Prioritas
    const prioritasExplanations: string[] = [];
    const prioritasParagraphs: string[] = [];
    if (canonicalObjectives.length > 0) {
        prioritasParagraphs.push(`Agenda strategis dikerucutkan pada penetapan sasaran prioritas RKJM, yaitu ${canonicalObjectives.join(', ')}.`);
    } else {
        prioritasParagraphs.push('Agenda strategis dikerucutkan pada penetapan isu-isu prioritas transformasi.');
    }
    prioritasParagraphs.push('Keterangan: Skor prioritas merupakan hasil normalisasi berdasarkan tingkat kesenjangan dan urgensi.');

    sections.push({
      id: generateId('DocumentSection'),
      title: '2.3 Analisis Prioritas',
      paragraphs: prioritasParagraphs,
      tables: [{
        title: 'Matriks Isu Prioritas',
        data: (() => {
          const consolidated = consolidateEvidence(analisisData);
          if (consolidated.length === 0) return [];
          return consolidated.map(c => ({
            'Isu Prioritas': formatCell(c.isu, 'Isu Prioritas', prioritasExplanations, 15),
            'Skor Prioritas': formatCell(c.skor.toString(), 'Skor Prioritas', prioritasExplanations, 10),
            'Akar Masalah': formatCell(c.akar, 'Akar Masalah', prioritasExplanations, 15)
          }));
        })()
      }],
      references: []
    });

    // 2.4 Analisis SWOT
    const swotExplanations: string[] = [];
    sections.push({
      id: generateId('DocumentSection'),
      title: '2.4 Analisis SWOT',
      paragraphs: [
        'Satuan pendidikan mengadopsi kerangka Analisis SWOT untuk memfasilitasi pemetaan kapasitas institusional secara objektif.',
        'Setiap elemen SWOT disintesis guna merumuskan strategi adaptif demi ketahanan kelembagaan.'
      ],
      tables: [{
        title: 'Matriks Analisis SWOT',
        data: (() => {
           const prioritasLen = analisisData.prioritas ? analisisData.prioritas.length : 0;
           const kekuatanLen = analisisData.kekuatan ? analisisData.kekuatan.length : 0;
           const kelemahanLen = analisisData.kelemahan ? analisisData.kelemahan.length : 0;
           const isEmptyProfile = prioritasLen === 0 && kekuatanLen === 0 && kelemahanLen === 0;
           return [{
             'Kekuatan (Strengths)': formatCell(synthesizeSWOT((analisisData.kekuatan || []).map((s:any) => typeof s === 'string' ? s : s.name || ''), 'Kekuatan', isEmptyProfile), 'Kekuatan', swotExplanations, 15),
             'Kelemahan (Weaknesses)': formatCell(synthesizeSWOT((analisisData.kelemahan || []).map((s:any) => typeof s === 'string' ? s : s.name || ''), 'Kelemahan', isEmptyProfile), 'Kelemahan', swotExplanations, 15),
             'Peluang (Opportunities)': formatCell(synthesizeSWOT((analisisData.peluang || []).map((s:any) => typeof s === 'string' ? s : s.name || ''), 'Peluang', isEmptyProfile), 'Peluang', swotExplanations, 15),
             'Ancaman (Threats)': formatCell(synthesizeSWOT((analisisData.tantangan || []).map((s:any) => typeof s === 'string' ? s : s.name || ''), 'Ancaman', isEmptyProfile), 'Ancaman', swotExplanations, 15)
           }];
        })()
      }],
      references: []
    });

    // 2.5 Analisis IRB
    const irbExplanations: string[] = [];
    const irbParagraphs: string[] = [];
    
    if (canonicalPrograms.length > 0) {
        irbParagraphs.push(`Melalui siklus Identifikasi, Refleksi, dan Benahi (IRB), satuan pendidikan merancang program aksi mencakup ${canonicalPrograms.join(', ')}.`);
    } else {
        irbParagraphs.push('Siklus Identifikasi, Refleksi, dan Benahi (IRB) digunakan untuk merumuskan kerangka pembenahan substansial.');
    }
    irbParagraphs.push('Rangkaian intervensi dirancang untuk membangun kapasitas jangka panjang dan perbaikan kualitas pembelajaran.');

    sections.push({
      id: generateId('DocumentSection'),
      title: '2.5 Analisis IRB',
      paragraphs: irbParagraphs,
      tables: [{
        title: 'Matriks Identifikasi, Refleksi, dan Benahi',
        data: (() => {
          const consolidatedIRB = consolidateEvidence(analisisData);
          if (consolidatedIRB.length === 0) return [];
          return consolidatedIRB.map(c => ({
            'Identifikasi (Identification)': formatCell(c.isu, 'Identifikasi', irbExplanations, 15),
             'Refleksi (Reflection)': formatCell(c.akar, 'Refleksi', irbExplanations, 15),
             'Tindakan Benahi (Improvement)': formatCell(c.benahi, 'Tindakan Benahi', irbExplanations, 15)
          }));
        })()
      }],
      references: []
    });

    // 2.6 Prioritas Strategis
    const stratExplanations: string[] = [];
    const stratParagraphs: string[] = [];
    
    if (canonicalObjectives.length > 0) {
        stratParagraphs.push(`Sintesis evaluasi bermuara pada penetapan Prioritas Strategis kelembagaan yang diorientasikan pada ${canonicalObjectives.join(' dan ')}.`);
    } else {
        stratParagraphs.push('Prioritas Strategis kelembagaan diorientasikan pada pemenuhan Standar Nasional Pendidikan.');
    }
    stratParagraphs.push('Postur perencanaan ini diharapkan mampu mengorkestrasi setiap unit kerja untuk mewujudkan layanan prima.');
    
    sections.push({
      id: generateId('DocumentSection'),
      title: '2.6 Prioritas Strategis',
      paragraphs: stratParagraphs,
      tables: [{
        title: 'Ringkasan Prioritas Strategis',
        data: (() => {
          const consolidated = consolidateEvidence(analisisData);
          if (consolidated.length === 0) return [];
          return consolidated.map(c => ({
             'Sasaran / Prioritas (Objective)': formatCell(c.sasaran, 'Sasaran', stratExplanations, 15),
             'Program Aksi (Program)': formatCell(c.benahi, 'Program', stratExplanations, 15),
             'Indikator Keberhasilan': formatCell(c.indikator, 'Indikator', stratExplanations, 15)
          }));
        })()
      }],
      references: []
    });

    // 2.7 Kesimpulan BAB II
    sections.push({
      id: generateId('DocumentSection'),
      title: '2.7 Kesimpulan Bab II',
      paragraphs: [
        'Arsitektur perencanaan strategis satuan pendidikan ini dibangun di atas fondasi data yang kuat.',
        'Sintesis diagnostik menjadi rujukan mendesain intervensi pada Bab III dan Bab IV.'
      ],
      references: []
    });

    
    return {
      id: generateId('DocumentChapter'),
      title: 'BAB II: Analisis Kondisi Sekolah',
      sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: allReferences,
      metadata: { generated: true }
    };
  }
}



