cat << 'INNER_EOF' > src/enterprise/document/ksp/bab1/KspBab1Structure.ts
import { DocumentSection, DocumentBlock, HeadingBlock, ParagraphBlock, TextNode, ListBlock, ListItemNode, TableBlock, TableRowNode, TableCellNode } from '../../CanonicalDocumentTypes';
import { SchoolContextKnowledgePayload } from '../../../knowledge/builders/SchoolContextBuilder';

/**
 * Maps the School Context Knowledge Payload into the Enterprise Canonical Document Model for BAB I.
 * 
 * Enforces Architectural Rules:
 * - Enterprise Rule 044: The model must remain document agnostic.
 * - Enterprise Rule 048: No presentation attributes.
 * - Enterprise Rule 049: Every document node shall have a stable identifier.
 */
export function buildKspBab1Section(payload: SchoolContextKnowledgePayload): DocumentSection {
  const { profile, context, students } = payload;
  const blocks: DocumentBlock[] = [];

  // Main Chapter Title
  blocks.push({
    id: 'bab1-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'bab1-text-main-title', type: 'TEXT', text: 'KARAKTERISTIK SATUAN PENDIDIKAN' }]
  });

  // A. Karakteristik Peserta Didik
  blocks.push({
    id: 'bab1-heading-a',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-a', type: 'TEXT', text: 'A. Karakteristik Peserta Didik' }]
  });

  if (students) {
    const studentText = `${profile.schoolName} memiliki jumlah peserta didik sebanyak ${students.totalStudents} orang, dengan sebaran gender terdiri dari ${students.genderDistribution.male} laki-laki dan ${students.genderDistribution.female} perempuan. Secara umum, peserta didik memiliki karakteristik ${students.generalCharacteristics.join(', ')}. Kebutuhan belajar yang dominan adalah ${students.dominantLearningNeeds.join(', ')}. Keberagaman karakteristik dan kebutuhan ini menuntut sekolah untuk merancang strategi pembelajaran yang berdiferensiasi guna memastikan setiap individu dapat mencapai potensi maksimalnya.`;
    
    blocks.push({
      id: 'bab1-paragraph-a-1',
      type: 'PARAGRAPH',
      nodes: [{ 
         id: 'bab1-text-a-1',
         type: 'TEXT',
         text: studentText
       }]
    });
  } else {
    blocks.push({
      id: 'bab1-paragraph-a-1',
      type: 'PARAGRAPH',
      nodes: [{ 
         id: 'bab1-text-a-1',
         type: 'TEXT',
         text: 'Data karakteristik peserta didik belum tersedia.'
       }]
    });
  }

  return {
    id: 'bab1-section-root',
    chapterId: 'BAB_I',
    title: 'Karakteristik Satuan Pendidikan',
    blocks
  };
}
INNER_EOF
