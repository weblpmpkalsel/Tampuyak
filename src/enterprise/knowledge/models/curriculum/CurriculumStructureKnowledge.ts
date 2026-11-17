import { ValidationResult, ValidationIssue } from '../../validation/ValidationTypes';

export class CurriculumStructureKnowledge {
  public readonly id: string;
  public readonly knowledgeOwner: 'Curriculum Hub' = 'Curriculum Hub';
  public readonly governmentSource: string = 'Kemendikdasmen Standar Isi';
  public readonly version: string;
  
  public readonly metadata: {
    readonly kemendikdasmenAligned: boolean;
    readonly deepLearningAligned: boolean;
    readonly profilLulusanDimensions: ReadonlyArray<string>;
    readonly tujuhKebiasaan: ReadonlyArray<string>;
  };

  public readonly validationRules: ReadonlyArray<string>;
  
  public readonly payload: {
    readonly educationLevel: string;
    readonly phase: string;
    readonly curriculumType: string;
  };

  constructor(
    id: string,
    version: string,
    payload: { educationLevel: string; phase: string; curriculumType: string },
    metadata?: any
  ) {
    this.id = id;
    this.version = version;
    this.payload = { ...payload };
    this.metadata = metadata || {
      kemendikdasmenAligned: true,
      deepLearningAligned: true,
      profilLulusanDimensions: [],
      tujuhKebiasaan: []
    };
    this.validationRules = [
      'Education Level must be defined',
      'Phase must be defined',
      'Curriculum Type must be defined'
    ];
  }

  public validate(): ValidationResult {
    const issues: ValidationIssue[] = [];

    if (!this.payload.educationLevel) {
      issues.push({ field: 'educationLevel', message: 'Education Level is required', severity: 'ERROR' });
    }
    if (!this.payload.phase) {
      issues.push({ field: 'phase', message: 'Phase is required', severity: 'ERROR' });
    }
    if (!this.payload.curriculumType) {
      issues.push({ field: 'curriculumType', message: 'Curriculum Type is required', severity: 'ERROR' });
    }

    const status = issues.length > 0 ? 'ERROR' : 'PASS';
    return { status, issues };
  }
}
