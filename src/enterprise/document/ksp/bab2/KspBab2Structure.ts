import { DocumentSection, DocumentBlock, HeadingBlock, ParagraphBlock, TextNode, ListBlock, ListItemNode } from '../../CanonicalDocumentTypes';
import { VisionMissionKnowledge } from '../../../knowledge/builders/VisionMissionBuilder';

/**
 * Maps the Vision, Mission, and Goals Knowledge Payload into the Enterprise Canonical Document Model for BAB II.
 * 
 * Enforces Architectural Rules:
 * - Enterprise Rule 044: The model must remain document agnostic.
 * - Enterprise Rule 048: No presentation attributes.
 * - Enterprise Rule 049: Every document node shall have a stable identifier.
 * - Production Rule 032: Consume ONLY Enterprise Knowledge Objects.
 * - Production Rule 033-035: Semantic blocks only, formatting belongs to publisher.
 */
export function buildKspBab2Section(payload: VisionMissionKnowledge, schoolName: string = 'satuan pendidikan'): DocumentSection {
  const blocks: DocumentBlock[] = [];

  // Main Chapter Title
  blocks.push({
    id: 'bab2-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'bab2-text-main-title', type: 'TEXT', text: 'VISI, MISI, DAN TUJUAN' }]
  });

  // A. Visi
  blocks.push({
    id: 'bab2-heading-a',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab2-text-heading-a', type: 'TEXT', text: 'A. Visi' }]
  });

  blocks.push({
    id: 'bab2-paragraph-vision-opening',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab2-text-vision-opening', 
      type: 'TEXT', 
      text: `Visi ${schoolName} merupakan gambaran cita-cita bersama yang menjadi panduan utama dalam setiap pengambilan keputusan dan penyusunan program jangka panjang. Visi ini dirancang untuk mewujudkan profil lulusan yang unggul, berkarakter, dan siap menghadapi tantangan masa depan.` 
    }]
  });

  if (payload.vision && payload.vision.trim().length > 0) {
    blocks.push({
      id: 'bab2-paragraph-vision',
      type: 'PARAGRAPH',
      nodes: [{ 
        id: 'bab2-text-vision', 
        type: 'TEXT', 
        text: `Adapun visi yang telah disepakati oleh seluruh pemangku kepentingan adalah: "${payload.vision}"`
      }]
    });
  } else {
    blocks.push({
      id: 'bab2-paragraph-vision-empty',
      type: 'PARAGRAPH',
      nodes: [{ 
        id: 'bab2-text-vision-empty', 
        type: 'TEXT', 
        text: 'Perumusan rumusan visi saat ini sedang dalam tahap konsolidasi untuk memastikan keselarasan dengan pedoman dan kebijakan pendidikan terkini.' 
      }]
    });
  }

  blocks.push({
    id: 'bab2-paragraph-vision-closing',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab2-text-vision-closing', 
      type: 'TEXT', 
      text: 'Pencapaian visi ini memerlukan komitmen dan kolaborasi aktif dari seluruh warga sekolah, serta penerapan strategi pendidikan yang mengintegrasikan Dimensi Profil Lulusan secara holistik dan berkesinambungan.' 
    }]
  });

  // B. Misi
  blocks.push({
    id: 'bab2-heading-b',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab2-text-heading-b', type: 'TEXT', text: 'B. Misi' }]
  });

  blocks.push({
    id: 'bab2-paragraph-mission-opening',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab2-text-mission-opening', 
      type: 'TEXT', 
      text: `Untuk mewujudkan visi yang telah ditetapkan, ${schoolName} merumuskan langkah-langkah strategis dan operasional dalam bentuk misi. Misi ini menjadi kerangka kerja nyata bagi seluruh pendidik dan tenaga kependidikan dalam memfasilitasi proses pembelajaran yang berdampak:` 
    }]
  });

  if (payload.mission && payload.mission.length > 0) {
    const missionItems: ListItemNode[] = payload.mission.map((missionStatement, index) => ({
      id: `bab2-list-item-mission-${index}`,
      type: 'LIST_ITEM',
      nodes: [{ id: `bab2-text-mission-${index}`, type: 'TEXT', text: missionStatement }]
    }));

    blocks.push({
      id: 'bab2-list-mission',
      type: 'LIST',
      ordered: true,
      items: missionItems
    });
  } else {
    blocks.push({
      id: 'bab2-paragraph-mission-empty',
      type: 'PARAGRAPH',
      nodes: [{ 
        id: 'bab2-text-mission-empty', 
        type: 'TEXT', 
        text: 'Penetapan langkah-langkah misi strategis sedang dalam proses pembaruan guna mendukung tercapainya visi satuan pendidikan secara optimal dan relevan.' 
      }]
    });
  }

  blocks.push({
    id: 'bab2-paragraph-mission-closing',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab2-text-mission-closing', 
      type: 'TEXT', 
      text: 'Setiap butir misi di atas diimplementasikan melalui pendekatan pembelajaran yang bermakna (Meaningful), disadari sepenuhnya (Mindful), dan menyenangkan (Joyful), sehingga senantiasa menciptakan ekosistem sekolah yang kondusif dan inspiratif.' 
    }]
  });

  // C. Tujuan
  blocks.push({
    id: 'bab2-heading-c',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab2-text-heading-c', type: 'TEXT', text: 'C. Tujuan' }]
  });

  blocks.push({
    id: 'bab2-paragraph-goals-opening',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab2-text-goals-opening', 
      type: 'TEXT', 
      text: `Tujuan satuan pendidikan merupakan penjabaran konkret dari visi dan misi yang diharapkan dapat dicapai dalam rentang waktu yang telah ditentukan. Tujuan ini ditetapkan sebagai tolak ukur keberhasilan penyelenggaraan pendidikan secara terukur, realistis, dan berkesinambungan:` 
    }]
  });

  if (payload.goals && payload.goals.length > 0) {
    const goalItems: ListItemNode[] = payload.goals.map((goalStatement, index) => ({
      id: `bab2-list-item-goal-${index}`,
      type: 'LIST_ITEM',
      nodes: [{ id: `bab2-text-goal-${index}`, type: 'TEXT', text: goalStatement }]
    }));

    blocks.push({
      id: 'bab2-list-goals',
      type: 'LIST',
      ordered: true,
      items: goalItems
    });
  } else {
    blocks.push({
      id: 'bab2-paragraph-goals-empty',
      type: 'PARAGRAPH',
      nodes: [{ 
        id: 'bab2-text-goals-empty', 
        type: 'TEXT', 
        text: 'Rincian tujuan terukur saat ini tengah diselaraskan dengan kebutuhan peserta didik, tuntutan perkembangan pendidikan, dan kondisi lingkungan strategis sekolah.' 
      }]
    });
  }

  blocks.push({
    id: 'bab2-paragraph-goals-closing',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab2-text-goals-closing', 
      type: 'TEXT', 
      text: 'Pencapaian dari setiap indikator tujuan ini akan dievaluasi secara berkala untuk meninjau efektivitas program. Hal ini dilakukan guna menjamin lulusan yang dihasilkan benar-benar mampu menginternalisasi dan menerapkan 7 Kebiasaan Anak Indonesia Hebat dalam kehidupan sehari-hari maupun pada jenjang pendidikan selanjutnya.' 
    }]
  });

  return {
    id: 'bab2-section-root',
    chapterId: 'BAB_II',
    title: 'Visi, Misi, dan Tujuan',
    blocks
  };
}
