import { LearningOrganizationServiceResult, LearningOrganizationPayload } from '../services/LearningOrganizationService';
import { CanonicalKnowledgeObject } from '../contracts/KnowledgeTypes';

/**
 * Payload representing the assembled Learning Organization knowledge domain.
 * This aliases the LearningOrganizationPayload from the service to maintain domain-oriented naming
 * at the Builder layer without introducing new structures.
 */
export type LearningOrganizationKnowledge = LearningOrganizationPayload;

/**
 * Input arguments for building Learning Organization knowledge.
 * Receives the already-processed output from the LearningOrganizationService.
 */
export interface LearningOrganizationBuilderInput {
  serviceResult: LearningOrganizationServiceResult;
}

/**
 * Assembles Learning Organization knowledge from the Enterprise Knowledge Service.
 * Performs pure orchestration without validation or normalization.
 * 
 * @param input Processed result from LearningOrganizationService.
 * @returns Canonical Knowledge Object containing the assembled Learning Organization payload.
 */
export function buildLearningOrganization(input: LearningOrganizationBuilderInput): CanonicalKnowledgeObject<LearningOrganizationKnowledge> {
  const sourceKnowledge = input.serviceResult.knowledge;
  
  // Enterprise Rule 029: Builders perform structural mapping only.
  // Enterprise Rule 032: Builders must never generate new identifiers.
  // We clone the existing CanonicalKnowledgeObject, preserving metadata (including identifiers),
  // and only update the domain to reflect the builder's output domain.
  return {
    ...sourceKnowledge,
    metadata: {
      ...sourceKnowledge.metadata,
      domain: 'LearningOrganizationKnowledge'
    }
  };
}
