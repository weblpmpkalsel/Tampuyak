import { CanonicalDocument, DocumentSection } from '../../CanonicalDocumentTypes';
import { KspMetadata } from '../../../../ksp/KspMetadataAdapter';
import { buildKspCoverSection } from '../cover/KspCoverStructure';
import { buildKspApprovalSection } from '../approval/KspApprovalStructure';
import { buildTeamSection } from '../../frontmatter/TeamBuilder';
import { buildPrefaceSection } from '../../frontmatter/PrefaceBuilder';
import { buildKspTocSection } from '../toc/KspTocStructure';
import { buildKesetaraanBab1, buildKesetaraanBab2, buildKesetaraanBab3, buildKesetaraanBab4, buildKesetaraanBab5, buildKesetaraanLampiran } from './KesetaraanStructureBuilder';

export function assembleKesetaraanDocument(metadata: KspMetadata): CanonicalDocument {
  const isProvincialAuthority = ['SMA', 'SMK', 'SLB'].includes(metadata.schoolLevel);
  const educationAuthorityRegion = isProvincialAuthority ? metadata.province : metadata.regencyOrCity;

  const coverSection = buildKspCoverSection({
    ...metadata,
    educationAuthorityRegion
  } as any);
  
  const approvalSection = buildKspApprovalSection({
    ...metadata,
    educationAuthorityRegion
  } as any);

  const teamSection = buildTeamSection({
    documentId: 'KSP-KES-001',
    title: 'Kurikulum Satuan Pendidikan',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    draftingTeam: metadata.draftingTeam
  });

  const prefaceSection = buildPrefaceSection({
    schoolName: metadata.schoolName,
    academicYear: metadata.academicYear,
    regencyOrCity: metadata.regencyOrCity,
    approvalDate: metadata.approvalDate,
    principalName: metadata.principalName,    
    principalNip: metadata.principalNip,
    principalPosition: metadata.principalPosition
  });

  const bab1Section = buildKesetaraanBab1(metadata);
  const bab2Section = buildKesetaraanBab2(metadata);
  const bab3Section = buildKesetaraanBab3(metadata);
  const bab4Section = buildKesetaraanBab4(metadata);
  const bab5Section = buildKesetaraanBab5(metadata);
  const lampiranSection = buildKesetaraanLampiran(metadata);

  const tocSection = buildKspTocSection([
    coverSection,
    approvalSection,
    teamSection,
    prefaceSection,
    bab1Section,
    bab2Section,
    bab3Section,
    bab4Section,
    bab5Section,
    lampiranSection
  ]);

  const sections = [
    coverSection,
    approvalSection,
    teamSection,
    prefaceSection,
    tocSection,
    bab1Section,
    bab2Section,
    bab3Section,
    bab4Section,
    bab5Section,
    lampiranSection
  ];

  return {
    id: `KSP-KES-${Date.now()}`,
    metadata: {
      documentId: 'KSP-KES-001',
      title: 'Kurikulum Satuan Pendidikan Kesetaraan',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      draftingTeam: metadata.draftingTeam
    },
    sections
  };
}
