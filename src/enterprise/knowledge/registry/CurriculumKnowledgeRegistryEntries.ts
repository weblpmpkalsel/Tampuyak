import { EnterpriseKnowledgeType } from '../types/EnterpriseKnowledgeType';
import { EnterpriseKnowledgeDomain } from '../types/EnterpriseKnowledgeDomain';
import { EnterpriseKnowledgeCategory } from '../types/EnterpriseKnowledgeCategory';
import { EnterpriseKnowledgeCapability } from '../types/EnterpriseKnowledgeCapability';

export const CurriculumStructureKnowledgeType: EnterpriseKnowledgeType = {
  id: 'CURRICULUM_STRUCTURE_KNOWLEDGE',
  displayName: 'Curriculum Structure Knowledge',
  description: 'Defines the structural phase, level, and curriculum type aligned with Kemendikdasmen standards.',
  domain: EnterpriseKnowledgeDomain.CURRICULUM,
  category: EnterpriseKnowledgeCategory.POLICY,
  capabilities: [EnterpriseKnowledgeCapability.SUPPORTS_VERSIONING, EnterpriseKnowledgeCapability.SUPPORTS_TEMPLATE],
  lifecycleSupport: true,
  governmentPolicyTags: ['Kemendikdasmen', 'Standar Isi', 'Kurikulum Merdeka'],
  versionSupport: true
};

export const LearningLoadKnowledgeType: EnterpriseKnowledgeType = {
  id: 'LEARNING_LOAD_KNOWLEDGE',
  displayName: 'Learning Load Knowledge',
  description: 'Defines the intra and co-curricular hours distribution.',
  domain: EnterpriseKnowledgeDomain.CURRICULUM,
  category: EnterpriseKnowledgeCategory.STANDARD_OPERATING_PROCEDURE,
  capabilities: [EnterpriseKnowledgeCapability.SUPPORTS_VERSIONING],
  lifecycleSupport: true,
  governmentPolicyTags: ['Kemendikdasmen', 'Standar Proses', 'Beban Belajar'],
  versionSupport: true
};

export const IntracurricularKnowledgeType: EnterpriseKnowledgeType = {
  id: 'INTRACURRICULAR_KNOWLEDGE',
  displayName: 'Intracurricular Knowledge',
  description: 'Defines subjects, time allocations, and pedagogical approaches like Deep Learning.',
  domain: EnterpriseKnowledgeDomain.CURRICULUM,
  category: EnterpriseKnowledgeCategory.PROGRAM,
  capabilities: [EnterpriseKnowledgeCapability.SUPPORTS_VERSIONING, EnterpriseKnowledgeCapability.SUPPORTS_AI_DRAFT],
  lifecycleSupport: true,
  governmentPolicyTags: ['Kemendikdasmen', 'Deep Learning', 'Capaian Pembelajaran'],
  versionSupport: true
};

export const CocurricularKnowledgeType: EnterpriseKnowledgeType = {
  id: 'COCURRICULAR_KNOWLEDGE',
  displayName: 'Cocurricular Knowledge (P5)',
  description: 'Defines P5 themes and their mapping to the 8 Dimensi Profil Lulusan.',
  domain: EnterpriseKnowledgeDomain.CURRICULUM,
  category: EnterpriseKnowledgeCategory.PROGRAM,
  capabilities: [EnterpriseKnowledgeCapability.SUPPORTS_VERSIONING, EnterpriseKnowledgeCapability.SUPPORTS_AI_DRAFT],
  lifecycleSupport: true,
  governmentPolicyTags: ['Kemendikdasmen', 'P5', '8 Dimensi Profil Lulusan'],
  versionSupport: true
};

export const ExtracurricularKnowledgeType: EnterpriseKnowledgeType = {
  id: 'EXTRACURRICULAR_KNOWLEDGE',
  displayName: 'Extracurricular Knowledge',
  description: 'Defines mandatory and optional programs, mapping routines to 7 Kebiasaan Anak Indonesia Hebat.',
  domain: EnterpriseKnowledgeDomain.CURRICULUM,
  category: EnterpriseKnowledgeCategory.PROGRAM,
  capabilities: [EnterpriseKnowledgeCapability.SUPPORTS_VERSIONING],
  lifecycleSupport: true,
  governmentPolicyTags: ['Kemendikdasmen', 'Ekstrakurikuler', '7 Kebiasaan Anak Indonesia Hebat'],
  versionSupport: true
};

export const CURRICULUM_KNOWLEDGE_TYPES = [
  CurriculumStructureKnowledgeType,
  LearningLoadKnowledgeType,
  IntracurricularKnowledgeType,
  CocurricularKnowledgeType,
  ExtracurricularKnowledgeType
];
