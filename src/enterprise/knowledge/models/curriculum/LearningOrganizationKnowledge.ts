import { ValidationResult, ValidationIssue } from '../../validation/ValidationTypes';

export class LearningOrganizationKnowledge {
  public readonly id: string;
  public readonly knowledgeOwner: 'Curriculum Hub' = 'Curriculum Hub';
  public readonly governmentSource: string = 'Kemendikdasmen Standar Proses';
  public readonly version: string;
  
  public readonly metadata: {
    readonly kemendikdasmenAligned: boolean;
    readonly deepLearningAligned: boolean;
  };

  public readonly validationRules: ReadonlyArray<string>;
  
  public readonly payload: {
    readonly educationalPhilosophy: string;
    readonly learningPrinciples: string;
    readonly implementationStrategy: string;
    readonly responsibleUnit: string;
    readonly targetLearners: string;
    readonly assessmentApproach: string;
    readonly supportingDocuments: ReadonlyArray<string>;
  };

  constructor(
    id: string,
    version: string,
    payload: {
      educationalPhilosophy: string;
      learningPrinciples: string;
      implementationStrategy: string;
      responsibleUnit: string;
      targetLearners: string;
      assessmentApproach: string;
      supportingDocuments: string[];
    },
    metadata?: any
  ) {
    this.id = id;
    this.version = version;
    this.payload = { 
        ...payload,
        supportingDocuments: [...(payload.supportingDocuments || [])]
    };
    this.metadata = metadata || {
      kemendikdasmenAligned: true,
      deepLearningAligned: true,
    };

    this.validationRules = [
      'Educational Philosophy must be defined',
      'Learning Principles must be defined',
      'Implementation Strategy must be defined',
      'Assessment Approach must be defined'
    ];
  }

  public validate(): ValidationResult {
    const issues: ValidationIssue[] = [];

    if (!this.payload.educationalPhilosophy) {
      issues.push({ field: 'educationalPhilosophy', message: 'Educational Philosophy is required', severity: 'ERROR' });
    }
    if (!this.payload.learningPrinciples) {
      issues.push({ field: 'learningPrinciples', message: 'Learning Principles is required', severity: 'ERROR' });
    }
    if (!this.payload.implementationStrategy) {
      issues.push({ field: 'implementationStrategy', message: 'Implementation Strategy is required', severity: 'ERROR' });
    }
    if (!this.payload.assessmentApproach) {
      issues.push({ field: 'assessmentApproach', message: 'Assessment Approach is required', severity: 'ERROR' });
    }

    const status = issues.length > 0 ? 'ERROR' : 'PASS';
    return { status, issues };
  }
}
