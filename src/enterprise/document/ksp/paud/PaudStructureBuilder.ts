import { DocumentSection, DocumentBlock } from '../../CanonicalDocumentTypes';
import { KspMetadata } from '../../../../ksp/KspMetadataAdapter';

export function buildPaudBab1(metadata: KspMetadata): DocumentSection {
  const schoolName = metadata.schoolName || 'Satuan Pendidikan PAUD';
  return {
    id: `paud-bab1-${Date.now()}`,
    chapterId: 'BAB_I',
    title: 'BAB I PENDAHULUAN',
    blocks: [
      {
        id: 'paud-bab1-h2-1',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'paud-bab1-t1', type: 'TEXT', text: 'A. Karakteristik Satuan Pendidikan PAUD' }]
      },
      {
        id: 'paud-bab1-p1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'paud-bab1-tp1', type: 'TEXT', text: `Karakteristik peserta didik di ${schoolName} berada pada fase fondasi. Fokus pendidikan adalah stimulasi perkembangan holistik yang mencakup nilai agama, budi pekerti, motorik, kognitif, bahasa, dan sosial emosional. Lingkungan belajar dirancang aman, nyaman, dan inklusif.` }]
      }
    ]
  };
}

export function buildPaudBab2(metadata: KspMetadata): DocumentSection {
  const vision = metadata.rawStrategicPolicy?.vision || 'Terwujudnya peserta didik yang sehat, cerdas, ceria, dan berakhlak mulia';
  const missions = (metadata.rawStrategicPolicy?.mission && metadata.rawStrategicPolicy?.mission.length > 0) ? metadata.rawStrategicPolicy.mission : ['Memberikan layanan pendidikan dan pengasuhan yang berkualitas'];
  const goals = (metadata.rawStrategicPolicy?.goals && metadata.rawStrategicPolicy?.goals.length > 0) ? metadata.rawStrategicPolicy.goals : ['Mempersiapkan anak usia dini memasuki jenjang pendidikan dasar dengan kesiapan optimal'];

  const blocks: DocumentBlock[] = [
    {
      id: 'paud-bab2-h2-1',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'paud-bab2-t1', type: 'TEXT', text: 'A. Visi, Misi, dan Tujuan PAUD' }]
    },
    {
      id: 'paud-bab2-h3-1',
      type: 'HEADING',
      level: 3,
      nodes: [{ id: 'paud-bab2-t2', type: 'TEXT', text: '1. Visi' }]
    },
    {
      id: 'paud-bab2-p1',
      type: 'PARAGRAPH',
      nodes: [{ id: 'paud-bab2-tp1', type: 'TEXT', text: vision }]
    },
    {
      id: 'paud-bab2-h3-2',
      type: 'HEADING',
      level: 3,
      nodes: [{ id: 'paud-bab2-t3', type: 'TEXT', text: '2. Misi' }]
    },
    {
      id: 'paud-bab2-list1',
      type: 'LIST',
      ordered: true,
      items: missions.map((m: any, i: number) => ({
        id: `paud-bab2-li1-${i}`,
        nodes: [{ id: `paud-bab2-lt1-${i}`, type: 'TEXT', text: typeof m === 'string' ? m : m?.text || m?.statement || String(m) }]
      }))
    },
    {
      id: 'paud-bab2-h3-3',
      type: 'HEADING',
      level: 3,
      nodes: [{ id: 'paud-bab2-t4', type: 'TEXT', text: '3. Tujuan' }]
    },
    {
      id: 'paud-bab2-list2',
      type: 'LIST',
      ordered: true,
      items: goals.map((m: any, i: number) => ({
        id: `paud-bab2-li2-${i}`,
        nodes: [{ id: `paud-bab2-lt2-${i}`, type: 'TEXT', text: typeof m === 'string' ? m : m?.text || m?.statement || String(m) }]
      }))
    }
  ];

  return {
    id: `paud-bab2-${Date.now()}`,
    chapterId: 'BAB_II',
    title: 'BAB II VISI, MISI, DAN TUJUAN',
    blocks
  };
}

export function buildPaudBab3(metadata: KspMetadata): DocumentSection {
  const ageGroupOrganization = (metadata as any).rawLearningOrganization?.ageGroupOrganization || 'Pengorganisasian kelompok usia di layanan PAUD dibagi berdasarkan rentang usia perkembangan anak untuk memastikan stimulasi pendidikan sesuai tahapan usianya, meliputi kelompok usia 3-4 tahun, 4-5 tahun, dan 5-6 tahun.';
  const learningContent = (metadata as any).rawLearningOrganization?.learningContent || 'Muatan pembelajaran mencakup Capaian Pembelajaran Fase Fondasi yang terdiri dari elemen nilai agama dan budi pekerti, jati diri, serta dasar-dasar literasi, matematika, sains, teknologi, rekayasa, dan seni.';
  const playBasedIntracurricular = (metadata as any).rawIntracurricular?.playBased || 'Kegiatan intrakurikuler dirancang melalui bermain bermakna yang diselaraskan dengan topik pembelajaran kontekstual.';
  const paudCocurricular = (metadata as any).rawCocurricular?.paud || 'Projek penguatan profil pelajar Pancasila di PAUD dilaksanakan melalui perayaan tradisi lokal, peringatan hari besar, dan kegiatan observasi alam.';
  const paudExtracurricular = (metadata as any).rawExtracurricular?.paud || 'Kegiatan ekstrakurikuler (bila ada) berfokus pada pengembangan minat dan bakat spesifik anak, seperti seni tari daerah atau olahraga usia dini.';
  const learningTimeAllocation = (metadata as any).rawLearningLoad?.learningTimeAllocation || 'Pengaturan waktu belajar mempedomani ketentuan beban belajar PAUD yaitu minimal 900 menit per minggu.';

  const blocks: DocumentBlock[] = [
    {
      id: 'paud-bab3-h2-1',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'paud-bab3-t1', type: 'TEXT', text: 'A. Pengorganisasian Kelompok Usia' }]
    },
    {
      id: 'paud-bab3-p1',
      type: 'PARAGRAPH',
      nodes: [{ id: 'paud-bab3-tp1', type: 'TEXT', text: ageGroupOrganization }]
    },
    {
      id: 'paud-bab3-h2-2',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'paud-bab3-t2', type: 'TEXT', text: 'B. Muatan Pembelajaran' }]
    },
    {
      id: 'paud-bab3-p2',
      type: 'PARAGRAPH',
      nodes: [{ id: 'paud-bab3-tp2', type: 'TEXT', text: learningContent }]
    },
    {
      id: 'paud-bab3-h2-3',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'paud-bab3-t3', type: 'TEXT', text: 'C. Intrakurikuler' }]
    },
    {
      id: 'paud-bab3-p3',
      type: 'PARAGRAPH',
      nodes: [{ id: 'paud-bab3-tp3', type: 'TEXT', text: playBasedIntracurricular }]
    },
    {
      id: 'paud-bab3-h2-4',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'paud-bab3-t4', type: 'TEXT', text: 'D. Kokurikuler / Projek' }]
    },
    {
      id: 'paud-bab3-p4',
      type: 'PARAGRAPH',
      nodes: [{ id: 'paud-bab3-tp4', type: 'TEXT', text: paudCocurricular }]
    },
    {
      id: 'paud-bab3-h2-5',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'paud-bab3-t5', type: 'TEXT', text: 'E. Ekstrakurikuler' }]
    },
    {
      id: 'paud-bab3-p5',
      type: 'PARAGRAPH',
      nodes: [{ id: 'paud-bab3-tp5', type: 'TEXT', text: paudExtracurricular }]
    },
    {
      id: 'paud-bab3-h2-6',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'paud-bab3-t6', type: 'TEXT', text: 'F. Pengaturan Waktu Belajar' }]
    },
    {
      id: 'paud-bab3-p6',
      type: 'PARAGRAPH',
      nodes: [{ id: 'paud-bab3-tp6', type: 'TEXT', text: learningTimeAllocation }]
    }
  ];

  return {
    id: `paud-bab3-${Date.now()}`,
    chapterId: 'BAB_III',
    title: 'BAB III PENGORGANISASIAN PEMBELAJARAN',
    blocks
  };
}

export function buildPaudBab4(metadata: KspMetadata): DocumentSection {
  const learningPlanning = (metadata as any).rawLearningPolicy?.learningPlanning || 'Penyusunan alur tujuan pembelajaran dan modul ajar disesuaikan dengan kebutuhan bermain anak dan ketersediaan sumber daya di lingkungan sekitar.';
  
  return {
    id: `paud-bab4-${Date.now()}`,
    chapterId: 'BAB_IV',
    title: 'BAB IV PERENCANAAN PEMBELAJARAN',
    blocks: [
      {
        id: 'paud-bab4-h2-1',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'paud-bab4-t1', type: 'TEXT', text: 'A. Perencanaan Tingkat Satuan Pendidikan' }]
      },
      {
        id: 'paud-bab4-p1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'paud-bab4-tp1', type: 'TEXT', text: learningPlanning }]
      }
    ]
  };
}

export function buildPaudBab5(metadata: KspMetadata): DocumentSection {
  const authenticAssessment = (metadata as any).rawEvaluation?.authenticAssessment || 'Evaluasi di PAUD dilakukan melalui asesmen formatif otentik seperti observasi, catatan anekdotal, dan portofolio anak tanpa tes tertulis.';
  
  return {
    id: `paud-bab5-${Date.now()}`,
    chapterId: 'BAB_V',
    title: 'BAB V EVALUASI, PENDAMPINGAN, DAN PENGEMBANGAN PROFESIONAL',
    blocks: [
      {
        id: 'paud-bab5-h2-1',
        type: 'HEADING',
        level: 2,
        nodes: [{ id: 'paud-bab5-t1', type: 'TEXT', text: 'A. Evaluasi Pembelajaran' }]
      },
      {
        id: 'paud-bab5-p1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'paud-bab5-tp1', type: 'TEXT', text: authenticAssessment }]
      }
    ]
  };
}

export function buildPaudLampiran(metadata: KspMetadata): DocumentSection {
  return {
    id: `paud-lampiran-${Date.now()}`,
    chapterId: 'LAMPIRAN',
    title: 'LAMPIRAN',
    blocks: [
      {
        id: 'paud-lamp-p1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'paud-lamp-tp1', type: 'TEXT', text: 'Dokumen pelengkap penyusunan Kurikulum Satuan Pendidikan PAUD.' }]
      }
    ]
  };
}
