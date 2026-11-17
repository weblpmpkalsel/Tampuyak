import { ValidationResult, ValidationIssue } from '../../validation/ValidationTypes';

export interface SubjectKnowledge {
  readonly id: string;
  readonly subjectName: string;
  readonly educationLevel: string;
  readonly phase: string;
  readonly weeklyLearningHours: number;
  readonly annualLearningHours: number;
  readonly learningApproach: string;
  readonly profilLulusanDimensions: ReadonlyArray<string>;
  readonly tujuhKebiasaan: ReadonlyArray<string>;
  readonly deepLearningIndicators: ReadonlyArray<string>;
  readonly notes: string;
}

export class IntracurricularKnowledge {
  public readonly id: string;
  public readonly knowledgeOwner: 'Curriculum Hub' = 'Curriculum Hub';
  public readonly governmentSource: string = 'Kemendikdasmen Standar Isi';
  public readonly version: string;
  
  public readonly metadata: {
    readonly kemendikdasmenAligned: boolean;
  };

  public readonly validationRules: ReadonlyArray<string>;
  
  public readonly payload: {
    readonly subjects: ReadonlyArray<SubjectKnowledge>;
  };

  constructor(
    id: string,
    version: string,
    payload: {
      subjects: SubjectKnowledge[];
    },
    metadata?: any
  ) {
    this.id = id;
    this.version = version;
    this.payload = { 
      subjects: [...(payload.subjects || [])]
    };
    this.metadata = metadata || {
      kemendikdasmenAligned: true,
    };

    this.validationRules = [
      'Each subject must have a name',
      'Each subject must define weekly and annual hours',
      'Each subject must specify a learning approach'
    ];
  }

  public validate(): ValidationResult {
    const issues: ValidationIssue[] = [];

    this.payload.subjects.forEach((subject, index) => {
      if (!subject.subjectName) {
        issues.push({ field: `subjects[${index}].subjectName`, message: `Subject at index ${index} requires a name`, severity: 'ERROR' });
      }
      if (subject.weeklyLearningHours < 0) {
        issues.push({ field: `subjects[${index}].weeklyLearningHours`, message: `Subject ${subject.subjectName} has invalid weekly hours`, severity: 'ERROR' });
      }
      if (subject.annualLearningHours < 0) {
        issues.push({ field: `subjects[${index}].annualLearningHours`, message: `Subject ${subject.subjectName} has invalid annual hours`, severity: 'ERROR' });
      }
      if (!subject.learningApproach) {
        issues.push({ field: `subjects[${index}].learningApproach`, message: `Subject ${subject.subjectName} requires a learning approach`, severity: 'ERROR' });
      }
    });

    const status = issues.length > 0 ? 'ERROR' : 'PASS';
    return { status, issues };
  }
}
