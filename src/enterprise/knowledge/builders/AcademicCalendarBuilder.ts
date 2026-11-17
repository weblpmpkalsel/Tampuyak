import { AcademicCalendarServiceResult, AcademicCalendarPayload } from '../services/AcademicCalendarService';
import { CanonicalKnowledgeObject } from '../contracts/KnowledgeTypes';

export type AcademicCalendarKnowledge = AcademicCalendarPayload;

export interface AcademicCalendarBuilderInput {
  serviceResult: AcademicCalendarServiceResult;
}

export function buildAcademicCalendar(input: AcademicCalendarBuilderInput): CanonicalKnowledgeObject<AcademicCalendarKnowledge> {
  const sourceKnowledge = input.serviceResult.knowledge;
  
  return {
    ...sourceKnowledge,
    metadata: {
      ...sourceKnowledge.metadata,
      domain: 'AcademicCalendarKnowledge'
    }
  };
}
