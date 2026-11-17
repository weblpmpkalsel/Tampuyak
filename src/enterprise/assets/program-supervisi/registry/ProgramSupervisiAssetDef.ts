import { ProgramKnowledgeFactory } from '../../../knowledge/engine/program/factory/ProgramKnowledgeFactory';
import { EnterpriseKnowledgeDomain } from '../../../knowledge/types/EnterpriseKnowledgeDomain';

export const ProgramSupervisiKnowledgeType = ProgramKnowledgeFactory.createKnowledgeType(
  'ASSET-PROGRAM-SUPERVISI',
  'Program Supervisi Akademik',
  'Official template and structure for Academic Supervision Programs.',
  EnterpriseKnowledgeDomain.EVALUATION,
  ['Kemendikdasmen', 'Standar Nasional Pendidikan']
);
