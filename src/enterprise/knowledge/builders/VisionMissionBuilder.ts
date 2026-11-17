import { VisionMissionServiceResult, VisionMissionPayload } from '../services/VisionMissionService';
import { CanonicalKnowledgeObject, KnowledgeSource } from '../contracts/KnowledgeTypes';

/**
 * Payload representing the assembled Vision Mission knowledge domain.
 * This aliases the VisionMissionPayload from the service to maintain domain-oriented naming
 * at the Builder layer without introducing new structures.
 */
export type VisionMissionKnowledge = VisionMissionPayload;

/**
 * Input arguments for building Vision Mission knowledge.
 * Receives the already-processed output from the VisionMissionService.
 */
export interface VisionMissionBuilderInput {
  serviceResult: VisionMissionServiceResult;
}

/**
 * Assembles Vision Mission strategic knowledge from the Enterprise Knowledge Service.
 * Performs pure orchestration without validation or normalization.
 * 
 * @param input Processed result from VisionMissionService.
 * @returns Canonical Knowledge Object containing the assembled Vision Mission payload.
 */
export function buildVisionMission(input: VisionMissionBuilderInput): CanonicalKnowledgeObject<VisionMissionKnowledge> {
  const sourceKnowledge = input.serviceResult.knowledge;
  
  // Enterprise Rule 029: Builders perform structural mapping only.
  // Enterprise Rule 032: Builders must never generate new identifiers.
  // Enterprise Rule 039: Canonical Pass-Through. Builders must preserve the CanonicalKnowledgeObject
  // produced by Services. Builders may only replace the mapped domain payload.
  return {
    ...sourceKnowledge,
    metadata: {
      ...sourceKnowledge.metadata,
      domain: 'VisionMissionKnowledge'
    },
    data: sourceKnowledge.data
  };
}
