import { ValidationResult, ValidationIssue } from '../../validation/ValidationTypes';

export interface CocurricularActivity {
  readonly id: string;
  readonly activityName: string;
  readonly targetPhase: string;
  readonly implementationTime: string;
  readonly profilLulusanDimensions: ReadonlyArray<string>;
  readonly tujuhKebiasaan: ReadonlyArray<string>;
  readonly description: string;
}

export class CocurricularKnowledge {
  public readonly id: string;
  public readonly knowledgeOwner: 'Curriculum Hub' = 'Curriculum Hub';
  public readonly governmentSource: string = 'Kemendikdasmen Standar Isi';
  public readonly version: string;
  
  public readonly metadata: {
    readonly kemendikdasmenAligned: boolean;
  };

  public readonly validationRules: ReadonlyArray<string>;
  
  public readonly payload: {
    readonly programIdentity: string;
    readonly objectives: string;
    readonly targetLearners: string;
    readonly activities: ReadonlyArray<CocurricularActivity>;
    readonly assessment: string;
    readonly reflection: string;
    readonly supportingDocuments: ReadonlyArray<string>;
  };

  constructor(
    id: string,
    version: string,
    payload: {
      programIdentity: string;
      objectives: string;
      targetLearners: string;
      activities: CocurricularActivity[];
      assessment: string;
      reflection: string;
      supportingDocuments: string[];
    },
    metadata?: any
  ) {
    this.id = id;
    this.version = version;
    this.payload = { 
      ...payload,
      activities: [...(payload.activities || [])],
      supportingDocuments: [...(payload.supportingDocuments || [])]
    };
    this.metadata = metadata || {
      kemendikdasmenAligned: true,
    };

    this.validationRules = [
      'Program Identity must be defined',
      'Objectives must be defined',
      'Assessment strategy must be defined',
      'Reflection strategy must be defined'
    ];
  }

  public validate(): ValidationResult {
    const issues: ValidationIssue[] = [];

    if (!this.payload.programIdentity) {
      issues.push({ field: 'programIdentity', message: 'Program Identity is required', severity: 'ERROR' });
    }
    if (!this.payload.objectives) {
      issues.push({ field: 'objectives', message: 'Objectives are required', severity: 'ERROR' });
    }
    if (!this.payload.assessment) {
      issues.push({ field: 'assessment', message: 'Assessment strategy is required', severity: 'ERROR' });
    }

    this.payload.activities.forEach((act, index) => {
      if (!act.activityName) {
        issues.push({ field: `activities[${index}].activityName`, message: `Activity at index ${index} requires a name`, severity: 'ERROR' });
      }
      if (!act.targetPhase) {
        issues.push({ field: `activities[${index}].targetPhase`, message: `Activity ${act.activityName} requires a target phase`, severity: 'ERROR' });
      }
    });

    const status = issues.length > 0 ? 'ERROR' : 'PASS';
    return { status, issues };
  }
}
