import { EvaluationServiceResult, EvaluationPayload } from '../services/EvaluationService';
import { CanonicalKnowledgeObject } from '../contracts/KnowledgeTypes';

/**
 * Payload representing the assembled Evaluation knowledge domain.
 * This aliases the EvaluationPayload from the service to maintain domain-oriented naming
 * at the Builder layer without introducing new structures.
 */
export type EvaluationKnowledge = EvaluationPayload;

/**
 * Input arguments for building Evaluation knowledge.
 * Receives the already-processed output from the EvaluationService.
 */
export interface EvaluationBuilderInput {
  serviceResult: EvaluationServiceResult;
}

/**
 * Assembles Evaluation knowledge from the Enterprise Knowledge Service.
 * Performs pure orchestration without validation or normalization.
 * 
 * @param input Processed result from EvaluationService.
 * @returns Canonical Knowledge Object containing the assembled Evaluation payload.
 */
export function buildEvaluation(input: EvaluationBuilderInput): CanonicalKnowledgeObject<EvaluationKnowledge> {
  const sourceKnowledge = input.serviceResult.knowledge;
  
  // Enterprise Rule 029: Builders perform structural mapping only.
  // Enterprise Rule 032: Builders must never generate new identifiers.
  // Enterprise Rule 039: Canonical Pass-Through. Builders must preserve the CanonicalKnowledgeObject
  // produced by Services. Builders may only replace the mapped domain payload.
  // We clone the existing CanonicalKnowledgeObject, preserving metadata (including identifiers),
  // and only update the domain to reflect the builder's output domain.
  return {
    ...sourceKnowledge,
    metadata: {
      ...sourceKnowledge.metadata,
      domain: 'EvaluationKnowledge'
    },
    data: sourceKnowledge.data // Mapping domain payload directly as pass-through
  };
}
