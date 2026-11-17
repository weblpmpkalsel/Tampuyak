import { ProgramKnowledgeFactory } from '../../../knowledge/engine/program/factory/ProgramKnowledgeFactory';
import { EnterpriseKnowledgeDomain } from '../../../knowledge/types/EnterpriseKnowledgeDomain';

export const ProgramEkstrakurikulerKnowledgeType = ProgramKnowledgeFactory.createKnowledgeType(
  'ASSET-PROGRAM-EKSTRAKURIKULER',
  'Program Ekstrakurikuler',
  'Official template and structure for creating School Extra-curricular Programs.',
  EnterpriseKnowledgeDomain.STUDENT_DEVELOPMENT,
  ['Kemendikdasmen', 'BSKAP', '8 Dimensi Profil Lulusan']
);
