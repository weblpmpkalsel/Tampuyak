import { LearningPolicyServiceResult, LearningPolicyPayload } from '../services/LearningPolicyService';
import { CanonicalKnowledgeObject } from '../contracts/KnowledgeTypes';

export type LearningPolicyKnowledge = LearningPolicyPayload;

export interface LearningPolicyBuilderInput {
  serviceResult: LearningPolicyServiceResult;
}

export function buildLearningPolicy(input: LearningPolicyBuilderInput): CanonicalKnowledgeObject<LearningPolicyKnowledge> {
  const sourceKnowledge = input.serviceResult.knowledge;
  
  return {
    ...sourceKnowledge,
    metadata: {
      ...sourceKnowledge.metadata,
      domain: 'LearningPolicyKnowledge'
    }
  };
}
