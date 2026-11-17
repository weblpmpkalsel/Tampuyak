import { ProgramKnowledgeFactory } from '../../../knowledge/engine/program/factory/ProgramKnowledgeFactory';
import { EnterpriseKnowledgeDomain } from '../../../knowledge/types/EnterpriseKnowledgeDomain';

export const ProgramNumerasiKnowledgeType = ProgramKnowledgeFactory.createKnowledgeType(
  'ASSET-PROGRAM-NUMERASI',
  'Program Numerasi',
  'Official template and structure for creating School Numeracy Programs.',
  EnterpriseKnowledgeDomain.CURRICULUM,
  ['Kemendikdasmen', 'BSKAP']
);
