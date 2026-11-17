import { DocumentSection, DocumentBlock, CanonicalDocumentMetadata, DocumentTeamMember } from '../CanonicalDocumentTypes';

export function buildTeamSection(metadata: CanonicalDocumentMetadata): DocumentSection {
  const blocks: DocumentBlock[] = [];

  blocks.push({
    id: 'team-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'team-text-main-title', type: 'TEXT', text: 'TIM PENYUSUN' }]
  });

  if (!metadata.draftingTeam || metadata.draftingTeam.length === 0) {
    blocks.push({
      id: 'team-paragraph-empty',
      type: 'PARAGRAPH',
      nodes: [{ id: 'team-text-empty', type: 'TEXT', text: 'Susunan Tim Penyusun Kurikulum Satuan Pendidikan ditetapkan secara terpisah melalui Surat Keputusan Kepala Sekolah.' }]
    });
  } else {
    // Generate a list or a table. We'll use a simple list of paragraphs for now, or a list block.
    const listItems = metadata.draftingTeam.map((member, index) => {
      const roleText = member.role ? ` - ${member.role}` : '';
      const identifierText = member.identifier ? ` (NIP: ${member.identifier})` : '';
      return {
        id: `team-list-item-${index}`,
        type: 'LIST_ITEM' as const,
        nodes: [{ id: `team-text-member-${index}`, type: 'TEXT' as const, text: `${member.name}${identifierText}${roleText}` }]
      };
    });

    blocks.push({
      id: 'team-list',
      type: 'LIST',
      ordered: true,
      items: listItems
    });
  }

  return {
    id: 'team-section-root',
    chapterId: 'FRONT_MATTER_TEAM',
    title: 'Tim Penyusun',
    blocks
  };
}
