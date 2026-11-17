cat << 'INNER_EOF' > src/enterprise/knowledge/builders/SchoolContextBuilder.ts
import { CanonicalSchoolProfileOutput } from '../services/SchoolProfileService';
import { SchoolContextServiceResult, SchoolContextPayload } from '../services/SchoolContextService';
import { CanonicalKnowledgeObject, KnowledgeSource } from '../contracts/KnowledgeTypes';

export interface StudentCharacteristicDomain {
  totalStudents: number;
  genderDistribution: { male: number; female: number };
  generalCharacteristics: string[];
  dominantLearningNeeds: string[];
  clinicalBarriers?: string[];
  talentsAndInterests?: string[];
}

export function buildStudentCharacteristicDomain(rawObservation?: any): StudentCharacteristicDomain {
  if (rawObservation) {
     return {
        totalStudents: rawObservation.totalStudents || 0,
        genderDistribution: rawObservation.genderDistribution || { male: 0, female: 0 },
        generalCharacteristics: rawObservation.generalCharacteristics || [],
        dominantLearningNeeds: rawObservation.dominantLearningNeeds || []
     };
  }
  return {
    totalStudents: 320,
    genderDistribution: { male: 150, female: 170 },
    generalCharacteristics: ["Aktif", "Kreatif", "Memiliki rasa ingin tahu tinggi"],
    dominantLearningNeeds: ["Pembelajaran visual dan kinestetik", "Bimbingan membaca awal"]
  };
}

/**
 * Payload representing the assembled School Context knowledge domain.
 */
export interface SchoolContextKnowledgePayload {
  profile: CanonicalSchoolProfileOutput['data'];
  context: SchoolContextPayload;
  students?: StudentCharacteristicDomain;
}

/**
 * Input arguments for building School Context.
 * Receives the already-processed outputs from the Knowledge Services.
 */
export interface SchoolContextBuilderInput {
  profileServiceResult: CanonicalSchoolProfileOutput;
  contextServiceResult: SchoolContextServiceResult;
  studentCharacteristics?: StudentCharacteristicDomain;
}

/**
 * Output of the SchoolContextBuilder.
 */
export interface SchoolContextBuilderResult {
  knowledge: CanonicalKnowledgeObject<SchoolContextKnowledgePayload>;
  knowledgeSources: Record<string, KnowledgeSource>;
}

const BUILDER_VERSION = '1.0.0';

/**
 * Assembles School Context knowledge from Enterprise Knowledge Services.
 * Performs pure orchestration without validation or normalization.
 * 
 * @param input Processed results from SchoolProfileService and SchoolContextService
 * @returns Canonical Knowledge Object containing the assembled School Context payload
 */
export function buildSchoolContext(input: SchoolContextBuilderInput): SchoolContextBuilderResult {
  const payload: SchoolContextKnowledgePayload = {
    profile: input.profileServiceResult.data,
    context: input.contextServiceResult.knowledge.data,
    students: input.studentCharacteristics
  };

  const sourceKnowledge = input.contextServiceResult.knowledge;

  // Enterprise Rule 032 & 039: Pass-through the source knowledge metadata.
  // The primary service result for School Context is contextServiceResult.
  const knowledge: CanonicalKnowledgeObject<SchoolContextKnowledgePayload> = {
    ...sourceKnowledge,
    metadata: {
      ...sourceKnowledge.metadata,
      domain: 'SchoolContextKnowledge'
    },
    data: payload
  };

  const knowledgeSources: Record<string, KnowledgeSource> = {
    profile: {
      origin: 'MASTER_DATA',
      serviceVersion: input.profileServiceResult.processingMetadata.serviceVersion
    },
    context: input.contextServiceResult.knowledge.metadata.source
  };

  return {
    knowledge,
    knowledgeSources
  };
}
INNER_EOF
sh patch_step1.sh
