import { ProgramKnowledgeFactory } from '../../../knowledge/engine/program/factory/ProgramKnowledgeFactory';
import { EnterpriseKnowledgeDomain } from '../../../knowledge/types/EnterpriseKnowledgeDomain';

export const ProgramKokurikulerKnowledgeType = ProgramKnowledgeFactory.createKnowledgeType(
  'ASSET-PROGRAM-KOKURIKULER',
  'Program Kokurikuler',
  'Official template and structure for creating School Co-curricular Programs.',
  EnterpriseKnowledgeDomain.CURRICULUM,
  ['Kemendikdasmen', 'BSKAP', '8 Dimensi Profil Lulusan', '7 Kebiasaan Anak Indonesia Hebat']
);
