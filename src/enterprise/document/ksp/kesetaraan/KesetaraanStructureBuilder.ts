import { DocumentSection, DocumentBlock } from '../../CanonicalDocumentTypes';
import { KspMetadata } from '../../../../ksp/KspMetadataAdapter';

export function buildKesetaraanBab1(metadata: KspMetadata): DocumentSection {
  const schoolName = metadata.schoolName || 'Satuan Pendidikan Kesetaraan';
  
  // Extracting tutor and warga belajar if available in rawStudents/rawCharacteristics
  let totalWarga = metadata.rawStudents?.totalStudents;
  let textWarga = totalWarga ? `Terdapat sejumlah ${totalWarga} warga belajar yang aktif berpartisipasi.` : 'Warga belajar berasal dari berbagai latar belakang usia, profesi, dan pengalaman sosial.';

  const tutorCharacteristics = (metadata as any).rawCharacteristics?.tutorCharacteristics || 'Tutor memiliki peran ganda sebagai fasilitator dan mitra belajar, mendampingi warga belajar dengan pendekatan pembelajaran orang dewasa (andragogi) serta kecakapan hidup (life skills).';
  const partnershipDUDI = (metadata as any).rawCharacteristics?.partnershipDUDI || 'Kemitraan strategis dijalin dengan berbagai lembaga pelatihan kerja, Dunia Usaha dan Dunia Industri (DUDI), serta pemerintah desa untuk mendukung program keterampilan vokasi.';

  return {
    id: `kes-bab1-${Date.now()}`,
    chapterId: 'BAB_I',
    title: 'BAB I PENDAHULUAN',
    blocks: [
      {
        id: 'kes-bab1-h2-1',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'kes-bab1-t1', type: 'TEXT', text: 'A. Karakteristik Satuan Pendidikan Kesetaraan' }]
      },
      {
        id: 'kes-bab1-p1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'kes-bab1-tp1', type: 'TEXT', text: `Karakteristik satuan pendidikan Kesetaraan di ${schoolName} dirancang untuk memberikan layanan pendidikan yang fleksibel, andragogis, dan kontekstual.` }]
      },
      {
        id: 'kes-bab1-h2-2',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'kes-bab1-t2', type: 'TEXT', text: 'B. Karakteristik Warga Belajar' }]
      },
      {
        id: 'kes-bab1-p2',
        type: 'PARAGRAPH',
        nodes: [{ id: 'kes-bab1-tp2', type: 'TEXT', text: textWarga }]
      },
      {
        id: 'kes-bab1-h2-3',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'kes-bab1-t3', type: 'TEXT', text: 'C. Karakteristik Tutor' }]
      },
      {
        id: 'kes-bab1-p3',
        type: 'PARAGRAPH',
        nodes: [{ id: 'kes-bab1-tp3', type: 'TEXT', text: tutorCharacteristics }]
      },
      {
        id: 'kes-bab1-h2-4',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'kes-bab1-t4', type: 'TEXT', text: 'D. Kemitraan' }]
      },
      {
        id: 'kes-bab1-p4',
        type: 'PARAGRAPH',
        nodes: [{ id: 'kes-bab1-tp4', type: 'TEXT', text: partnershipDUDI }]
      }
    ]
  };
}

export function buildKesetaraanBab2(metadata: KspMetadata): DocumentSection {
  const vision = metadata.rawStrategicPolicy?.vision || 'Terwujudnya warga belajar yang mandiri, berkarakter, dan memiliki kecakapan hidup';
  const missions = (metadata.rawStrategicPolicy?.mission && metadata.rawStrategicPolicy?.mission.length > 0) ? metadata.rawStrategicPolicy.mission : ['Menyelenggarakan layanan pendidikan yang responsif dan inklusif'];
  const goals = (metadata.rawStrategicPolicy?.goals && metadata.rawStrategicPolicy?.goals.length > 0) ? metadata.rawStrategicPolicy.goals : ['Menghasilkan lulusan yang siap kerja dan mandiri di masyarakat'];

  const blocks: DocumentBlock[] = [
    {
      id: 'kes-bab2-h2-1',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'kes-bab2-t1', type: 'TEXT', text: 'A. Visi, Misi, dan Tujuan Kesetaraan' }]
    },
    {
      id: 'kes-bab2-h3-1',
      type: 'HEADING',
      level: 3,
      nodes: [{ id: 'kes-bab2-t2', type: 'TEXT', text: '1. Visi' }]
    },
    {
      id: 'kes-bab2-p1',
      type: 'PARAGRAPH',
      nodes: [{ id: 'kes-bab2-tp1', type: 'TEXT', text: vision }]
    },
    {
      id: 'kes-bab2-h3-2',
      type: 'HEADING',
      level: 3,
      nodes: [{ id: 'kes-bab2-t3', type: 'TEXT', text: '2. Misi' }]
    },
    {
      id: 'kes-bab2-list1',
      type: 'LIST',
      ordered: true,
      items: missions.map((m: any, i: number) => ({
        id: `kes-bab2-li1-${i}`,
        nodes: [{ id: `kes-bab2-lt1-${i}`, type: 'TEXT', text: typeof m === 'string' ? m : m?.text || m?.statement || String(m) }]
      }))
    },
    {
      id: 'kes-bab2-h3-3',
      type: 'HEADING',
      level: 3,
      nodes: [{ id: 'kes-bab2-t4', type: 'TEXT', text: '3. Tujuan' }]
    },
    {
      id: 'kes-bab2-list2',
      type: 'LIST',
      ordered: true,
      items: goals.map((m: any, i: number) => ({
        id: `kes-bab2-li2-${i}`,
        nodes: [{ id: `kes-bab2-lt2-${i}`, type: 'TEXT', text: typeof m === 'string' ? m : m?.text || m?.statement || String(m) }]
      }))
    }
  ];

  return {
    id: `kes-bab2-${Date.now()}`,
    chapterId: 'BAB_II',
    title: 'BAB II VISI, MISI, DAN TUJUAN',
    blocks
  };
}

export function buildKesetaraanBab3(metadata: KspMetadata): DocumentSection {
  const skkStructure = (metadata as any).rawLearningOrganization?.skkStructure || 'Struktur kurikulum pendidikan Kesetaraan memuat mata pelajaran umum, program pemberdayaan, dan keterampilan vokasi. Setiap capaian kompetensi dihargai dengan SKK yang mencerminkan beban belajar, di mana 1 SKK setara dengan 1 jam tatap muka, 2 jam tutorial, atau 3 jam mandiri.';
  const vocationalSkills = (metadata as any).rawLearningOrganization?.vocationalSkills || 'Program keterampilan vokasi diselenggarakan guna membekali warga belajar dengan kecakapan hidup. Program ini dilaksanakan secara terstruktur, terintegrasi, dan melibatkan partisipasi DUDI sesuai dengan potensi sumber daya lokal.';

  const blocks: DocumentBlock[] = [
    {
      id: 'kes-bab3-h2-1',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'kes-bab3-t1', type: 'TEXT', text: 'A. Pengorganisasian Pembelajaran' }]
    },
    {
      id: 'kes-bab3-p1',
      type: 'PARAGRAPH',
      nodes: [{ id: 'kes-bab3-tp1', type: 'TEXT', text: 'Pengorganisasian pembelajaran pada pendidikan Kesetaraan menggunakan sistem Satuan Kredit Kompetensi (SKK). Penetapan beban belajar didasarkan pada bobot SKK untuk setiap mata pelajaran kelompok umum dan pemberdayaan serta keterampilan.' }]
    },
    {
      id: 'kes-bab3-h2-2',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'kes-bab3-t2', type: 'TEXT', text: 'B. Struktur Kurikulum (Sistem SKK)' }]
    },
    {
      id: 'kes-bab3-p2',
      type: 'PARAGRAPH',
      nodes: [{ id: 'kes-bab3-tp2', type: 'TEXT', text: skkStructure }]
    },
    {
      id: 'kes-bab3-h2-3',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'kes-bab3-t3', type: 'TEXT', text: 'C. Program Keterampilan' }]
    },
    {
      id: 'kes-bab3-p3',
      type: 'PARAGRAPH',
      nodes: [{ id: 'kes-bab3-tp3', type: 'TEXT', text: vocationalSkills }]
    }
  ];

  return {
    id: `kes-bab3-${Date.now()}`,
    chapterId: 'BAB_III',
    title: 'BAB III PENGORGANISASIAN PEMBELAJARAN (SKK)',
    blocks
  };
}

export function buildKesetaraanBab4(metadata: KspMetadata): DocumentSection {
  const andragogyPlanning = (metadata as any).rawLearningPolicy?.andragogyPlanning || 'Penyusunan modul ajar diarahkan untuk memfasilitasi pembelajaran andragogi yang menitikberatkan pada kemandirian warga belajar. Tutor mengembangkan strategi yang adaptif, meliputi tatap muka, tutorial, dan mandiri sesuai karakteristik SKK.';

  return {
    id: `kes-bab4-${Date.now()}`,
    chapterId: 'BAB_IV',
    title: 'BAB IV PERENCANAAN PEMBELAJARAN',
    blocks: [
      {
        id: 'kes-bab4-h2-1',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'kes-bab4-t1', type: 'TEXT', text: 'A. Perencanaan Tingkat Satuan Pendidikan' }]
      },
      {
        id: 'kes-bab4-p1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'kes-bab4-tp1', type: 'TEXT', text: andragogyPlanning }]
      }
    ]
  };
}

export function buildKesetaraanBab5(metadata: KspMetadata): DocumentSection {
  const programEvaluation = (metadata as any).rawEvaluation?.programEvaluation || 'Evaluasi di satuan pendidikan Kesetaraan mencakup asesmen formatif dan sumatif, penilaian portofolio kecakapan hidup, serta evaluasi kemitraan DUDI untuk menjamin mutu lulusan.';

  return {
    id: `kes-bab5-${Date.now()}`,
    chapterId: 'BAB_V',
    title: 'BAB V EVALUASI, PENDAMPINGAN, DAN PENGEMBANGAN PROFESIONAL',
    blocks: [
      {
        id: 'kes-bab5-h2-1',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'kes-bab5-t1', type: 'TEXT', text: 'A. Evaluasi Program' }]
      },
      {
        id: 'kes-bab5-p1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'kes-bab5-tp1', type: 'TEXT', text: programEvaluation }]
      }
    ]
  };
}

export function buildKesetaraanLampiran(metadata: KspMetadata): DocumentSection {
  return {
    id: `kes-lampiran-${Date.now()}`,
    chapterId: 'LAMPIRAN',
    title: 'LAMPIRAN',
    blocks: [
      {
        id: 'kes-lamp-p1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'kes-lamp-tp1', type: 'TEXT', text: 'Dokumen pelengkap penyusunan Kurikulum Satuan Pendidikan Kesetaraan (termasuk struktur pembagian SKK dan MoU Kemitraan).' }]
      }
    ]
  };
}
