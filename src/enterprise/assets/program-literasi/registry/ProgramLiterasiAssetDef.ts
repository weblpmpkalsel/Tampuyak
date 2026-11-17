import { ProgramKnowledgeFactory } from '../../../knowledge/engine/program/factory/ProgramKnowledgeFactory';
import { EnterpriseKnowledgeDomain } from '../../../knowledge/types/EnterpriseKnowledgeDomain';

export const ProgramLiterasiKnowledgeType = ProgramKnowledgeFactory.createKnowledgeType(
  'ASSET-PROGRAM-LITERASI',
  'Program Literasi',
  'Official template and structure for creating School Literacy Programs.',
  EnterpriseKnowledgeDomain.CURRICULUM,
  ['Kemendikdasmen', 'BSKAP']
);
