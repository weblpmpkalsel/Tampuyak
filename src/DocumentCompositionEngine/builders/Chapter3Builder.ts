import { DocumentChapter, DocumentSection } from '../DocumentModel';
import { generateId } from '../utils';
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
    const match = s.match(/[^.!?]+[.!?]/);
    return match ? match[0].trim() : s;
}

function synthesizeObjective(text: string): string {
    const s = (text || '').toLowerCase();
    if (s.includes('numerasi')) return 'Meningkatkan kemampuan numerasi peserta didik.';
    if (s.includes('literasi') || s.includes('membaca')) return 'Mengembangkan budaya literasi sekolah.';
    if (s.includes('guru') || s.includes('pelatihan') || s.includes('pendidik') || s.includes('kompetensi')) return 'Meningkatkan kompetensi pedagogik dan profesional pendidik.';
    if (s.includes('karakter') || s.includes('iklim') || s.includes('budaya positif') || s.includes('kekerasan')) return 'Memperkuat pendidikan karakter dan iklim sekolah.';
    if (s.includes('manajemen') || s.includes('pengelolaan') || s.includes('perencanaan') || s.includes('fasilitas') || s.includes('sarana')) return 'Memperkuat tata kelola dan manajerial sekolah.';
    if (s.includes('pembelajaran') || s.includes('asesmen')) return 'Meningkatkan kualitas proses pembelajaran dan asesmen.';
    return 'Meningkatkan mutu layanan pendidikan sekolah.';
}

function synthesizeProgram(text: string): string {
    const s = (text || '').toLowerCase();
    if (s.includes('numerasi')) return 'Penguatan Numerasi';
    if (s.includes('literasi') || s.includes('membaca')) return 'Penguatan Literasi';
    if (s.includes('guru') || s.includes('pelatihan') || s.includes('pendidik') || s.includes('kompetensi')) return 'Pelatihan Guru';
    if (s.includes('karakter') || s.includes('iklim') || s.includes('budaya positif') || s.includes('kekerasan')) return 'Budaya Positif';
    if (s.includes('manajemen') || s.includes('pengelolaan') || s.includes('perencanaan') || s.includes('fasilitas') || s.includes('sarana')) return 'Tata Kelola Kelembagaan';
    if (s.includes('pembelajaran') || s.includes('asesmen')) return 'Kualitas Pembelajaran';
    return 'Pengembangan Kelembagaan';
}

function synthesizeIndicator(text: string): string {
    const s = (text || '').toLowerCase();
    if (s.includes('numerasi')) return 'Skor rata-rata capaian numerasi peserta didik meningkat.';
    if (s.includes('literasi') || s.includes('membaca')) return 'Skor rata-rata capaian literasi peserta didik meningkat.';
    if (s.includes('guru') || s.includes('pelatihan') || s.includes('pendidik') || s.includes('kompetensi')) return 'Persentase pendidik yang berpartisipasi dalam pelatihan meningkat.';
    if (s.includes('karakter') || s.includes('iklim') || s.includes('budaya positif') || s.includes('kekerasan')) return 'Indeks karakter dan iklim keamanan sekolah meningkat.';
    if (s.includes('manajemen') || s.includes('pengelolaan') || s.includes('perencanaan') || s.includes('tata kelola')) return 'Tingkat ketercapaian realisasi program strategis dan anggaran meningkat.';
    if (s.includes('pembelajaran') || s.includes('asesmen')) return 'Kualitas praktik pembelajaran dan tingkat penyelesaian asesmen meningkat.';
    return 'Tingkat pencapaian target kinerja kelembagaan sekolah meningkat.';
}

function synthesizeRisk(text: string): { risk: string, mitigation: string } {
    const s = (text || '').toLowerCase();
    if (s.includes('waktu') || s.includes('jadwal')) return { risk: 'Keterbatasan alokasi waktu dan jadwal pelaksanaan operasional.', mitigation: 'Menyusun kalender program prioritas yang terintegrasi dan adaptif.' };
    if (s.includes('dana') || s.includes('anggaran') || s.includes('biaya')) return { risk: 'Keterbatasan alokasi anggaran dan ketersediaan dukungan dana.', mitigation: 'Prioritaskan program strategis dan optimalkan dana BOS.' };
    if (s.includes('komitmen') || s.includes('motivasi') || s.includes('partisipasi') || s.includes('guru') || s.includes('pendidik')) return { risk: 'Rendahnya tingkat partisipasi dan komitmen pemangku kepentingan.', mitigation: 'Sediakan pendampingan dan implementasi secara bertahap.' };
    if (s.includes('fasilitas') || s.includes('sarana')) return { risk: 'Keterbatasan fasilitas dan infrastruktur pendukung pembelajaran.', mitigation: 'Optimalisasi penggunaan fasilitas yang tersedia secara kolaboratif.' };
    return { risk: 'Perubahan kebijakan pendidikan dan keterbatasan sumber daya.', mitigation: 'Sesuaikan perencanaan tahunan berdasarkan regulasi yang berlaku.' };
}

function synthesizeStages(text: string): { y1: string, y2: string, y3: string, y4: string } {
    const s = (text || '').toLowerCase();
    
    if (s.includes('guru') || s.includes('pelatihan') || s.includes('pendidik') || s.includes('kompetensi')) return {
        y1: 'Pelatihan dan penguatan kompetensi dimulai.',
        y2: 'Implementasi dalam pembelajaran.',
        y3: 'Pendampingan dan optimalisasi praktik.',
        y4: 'Budaya profesional terbentuk dan berkelanjutan.'
    };
    if (s.includes('literasi') || s.includes('membaca')) return {
        y1: 'Gerakan literasi diinisiasi.',
        y2: 'Pembiasaan membaca diperkuat.',
        y3: 'Budaya literasi dioptimalkan.',
        y4: 'Budaya literasi menjadi karakter sekolah.'
    };
    if (s.includes('numerasi')) return {
        y1: 'Penguatan numerasi dimulai.',
        y2: 'Numerasi terintegrasi dalam pembelajaran.',
        y3: 'Peningkatan capaian numerasi dioptimalkan.',
        y4: 'Budaya numerasi berkelanjutan.'
    };
    if (s.includes('karakter') || s.includes('iklim') || s.includes('budaya positif') || s.includes('kekerasan')) return {
        y1: 'Program pendidikan karakter diinisiasi.',
        y2: 'Iklim keamanan sekolah diperkuat.',
        y3: 'Kualitas iklim dioptimalkan.',
        y4: 'Budaya positif dilembagakan secara berkelanjutan.'
    };
    if (s.includes('manajemen') || s.includes('pengelolaan') || s.includes('perencanaan') || s.includes('tata kelola') || s.includes('fasilitas') || s.includes('sarana')) return {
        y1: 'Perbaikan tata kelola diinisiasi.',
        y2: 'Sistem manajemen dan pengelolaan diperkuat.',
        y3: 'Kualitas layanan dan efisiensi dioptimalkan.',
        y4: 'Tata kelola yang akuntabel terbentuk dan berkelanjutan.'
    };
    if (s.includes('pembelajaran') || s.includes('asesmen')) return {
        y1: 'Peningkatan kualitas pembelajaran diinisiasi.',
        y2: 'Praktik pembelajaran dan asesmen diperkuat.',
        y3: 'Pelaksanaan asesmen untuk pembelajaran dioptimalkan.',
        y4: 'Budaya pembelajaran yang berpusat pada siswa berkelanjutan.'
    };
    
    // Default contextual progression
    return {
        y1: 'Persiapan dan inisiasi implementasi program.',
        y2: 'Implementasi program diperkuat dan diperluas.',
        y3: 'Pendampingan dan optimalisasi praktik pencapaian.',
        y4: 'Pelembagaan dan keberlanjutan program strategis.'
    };
}

export class Chapter3Builder {
  private referenceBuilder = new ReferenceBuilder();

  public build(kg: KnowledgeGraph, settings: any = {}): DocumentChapter {

    const rp = settings?.relationalPlanning;
    let rawObjectives = rp?.objectives || settings?.planningResult?.objectives || [];
    
    if (rp?.objectives && rp.objectives.length > 0) {
        rawObjectives = rp.objectives.map((obj: any) => ({
             strategicObjective: obj.objective || obj.strategicObjective,
             objective: obj.target || obj.objective,
             performanceIndicator: obj.successIndicator || obj.performanceIndicator,
             risk: obj.risk,
             targetY1: obj.targetY1,
             targetY2: obj.targetY2,
             targetY3: obj.targetY3,
             targetY4: obj.targetY4
        }));
    }

    const rktItems: any[] = [];
    ['Y1', 'Y2', 'Y3', 'Y4'].forEach(year => {
      const yearRkt = rp?.annualPlans?.[year]?.rkt || [];
      rktItems.push(...yearRkt);
    });
    if (rktItems.length === 0) {
        rktItems.push(...(settings?.planningResult?.rkt || []));
    }
    
    // We will collect and synthesize data first, preventing duplicates
    const uniqueObjectives = new Set<string>();
    const uniquePrograms = new Set<string>();
    const objectiveData: any[] = [];
    const programData: any[] = [];
    const targetData: any[] = [];
    const indicatorData: any[] = [];
    const riskData: any[] = [];

    rawObjectives.forEach((obj: any) => {
        const text = [obj.strategicObjective, obj.objective, obj.performanceIndicator, obj.risk].join(' ');
        if (!text.trim()) return;

        const synthObj = synthesizeObjective(text);
        if (!uniqueObjectives.has(synthObj)) {
            uniqueObjectives.add(synthObj);
            objectiveData.push({
                'No.': objectiveData.length + 1,
                'Sasaran Strategis': synthObj
            });
            
            const synthProg = synthesizeProgram(text);
            if (!uniquePrograms.has(synthProg)) {
                uniquePrograms.add(synthProg);
                programData.push({
                    'No.': programData.length + 1,
                    'Program Strategis': synthProg
                });
            }

            const stages = synthesizeStages(text);
            
            // Generate milestone text only during document rendering
            // Force true strategic milestones instead of numeric placeholders (like 5, 10, 15, 20)
            const isNumericOrShort = (val: any) => !val || !isNaN(Number(val)) || String(val).trim().length < 5;
            const useStages = isNumericOrShort(obj.targetY1) || isNumericOrShort(obj.targetY2) || (obj.targetY1 === obj.targetY2 && obj.targetY2 === obj.targetY3 && obj.targetY3 === obj.targetY4);
            
            targetData.push({
                'Sasaran Strategis': synthObj,
                'Tahun 1': useStages ? stages.y1 : obj.targetY1,
                'Tahun 2': useStages ? stages.y2 : obj.targetY2,
                'Tahun 3': useStages ? stages.y3 : obj.targetY3,
                'Tahun 4': useStages ? stages.y4 : obj.targetY4
            });

            indicatorData.push({
                'Sasaran Strategis': synthObj,
                'Indikator Kinerja': synthesizeIndicator(text)
            });
            
            const riskObj = synthesizeRisk(text);
            riskData.push({
                'Sasaran Strategis': synthObj,
                'Risiko': riskObj.risk,
                'Mitigasi': riskObj.mitigation
            });
        }
    });

    const sections: DocumentSection[] = [];

    if (objectiveData.length === 0) {
        sections.push({
          id: generateId('DocumentSection'),
          title: '3.1 Sasaran Strategis',
          paragraphs: ['Rumusan sasaran strategis sedang dalam tahap penyusunan.'],
          tables: [],
          references: []
        });
        return {
          id: generateId('DocumentChapter'),
          title: 'BAB III: Program Strategis Jangka Menengah',
          sections: sections,
          paragraphs: [],
          tables: [],
          figures: [],
          references: [],
          metadata: { generated: true }
        };
    }

    // 3.1 Sasaran Strategis
    sections.push({
      id: generateId('DocumentSection'),
      title: '3.1 Sasaran Strategis',
      paragraphs: [
        'Sasaran strategis disusun sebagai arah kebijakan kelembagaan untuk merespons hasil evaluasi pendidikan secara terukur. Penetapan sasaran difokuskan pada penyelesaian permasalahan.'
      ],
      tables: [{ title: 'Daftar Sasaran Strategis', data: objectiveData }],
      references: []
    });

    // 3.2 Program Strategis
    sections.push({
      id: generateId('DocumentSection'),
      title: '3.2 Program Strategis',
      paragraphs: [
        'Program strategis dirancang sebagai instrumen operasional yang berorientasi pada peningkatan kapasitas kelembagaan.'
      ],
      tables: [{ title: 'Daftar Program Strategis', data: programData }],
      references: []
    });

    // 3.3 Target Empat Tahunan
    sections.push({
      id: generateId('DocumentSection'),
      title: '3.3 Target Empat Tahunan',
      paragraphs: [
        'Setiap sasaran strategis ditetapkan proyeksi pencapaiannya guna menjamin kesinambungan peningkatan mutu.'
      ],
      tables: [{ title: 'Pemetaan Target Pencapaian', data: targetData }],
      references: []
    });

    // 3.4 Indikator Kinerja
    sections.push({
      id: generateId('DocumentSection'),
      title: '3.4 Indikator Kinerja',
      paragraphs: [
        'Pemantauan kinerja institusional diukur melalui indikator yang spesifik dan objektif untuk memastikan pelaksanaan program efektif.'
      ],
      tables: [{ title: 'Pemetaan Indikator Kinerja', data: indicatorData }],
      references: []
    });

    // 3.5 Manajemen Risiko
    sections.push({
      id: generateId('DocumentSection'),
      title: '3.5 Manajemen Risiko',
      paragraphs: [
        'Manajemen risiko diintegrasikan sebagai bentuk kehati-hatian operasional dalam perencanaan.'
      ],
      tables: [{ title: 'Pemetaan Manajemen Risiko', data: riskData }],
      references: []
    });

    return {
      id: generateId('DocumentChapter'),
      title: 'BAB III: Program Strategis Jangka Menengah',
      sections: sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
