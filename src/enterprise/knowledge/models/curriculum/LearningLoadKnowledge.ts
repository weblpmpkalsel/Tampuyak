import { ValidationResult, ValidationIssue } from '../../validation/ValidationTypes';

export class LearningLoadKnowledge {
  public readonly id: string;
  public readonly knowledgeOwner: 'Curriculum Hub' = 'Curriculum Hub';
  public readonly governmentSource: string = 'Kemendikdasmen Standar Proses';
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
    readonly academicYear: string;
    readonly weeklyLearningLoad: number;
    readonly annualLearningLoad: number;
    readonly effectiveWeeks: number;
    readonly totalLearningHours: number;
  };

  constructor(
    id: string,
    version: string,
    payload: {
      educationLevel: string;
      phase: string;
      academicYear: string;
      weeklyLearningLoad: number;
      annualLearningLoad: number;
      effectiveWeeks: number;
      totalLearningHours: number;
    },
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
      'Academic Year must be defined',
      'Weekly Learning Load must be greater than 0',
      'Annual Learning Load must be greater than 0',
      'Effective Weeks must be between 30 and 40',
      'Total Learning Hours must equal Annual Learning Load'
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
    if (!this.payload.academicYear) {
      issues.push({ field: 'academicYear', message: 'Academic Year is required', severity: 'ERROR' });
    }
    if (this.payload.weeklyLearningLoad <= 0) {
      issues.push({ field: 'weeklyLearningLoad', message: 'Weekly Learning Load must be greater than 0', severity: 'ERROR' });
    }
    if (this.payload.annualLearningLoad <= 0) {
      issues.push({ field: 'annualLearningLoad', message: 'Annual Learning Load must be greater than 0', severity: 'ERROR' });
    }
    if (this.payload.effectiveWeeks < 30 || this.payload.effectiveWeeks > 40) {
      issues.push({ field: 'effectiveWeeks', message: 'Effective Weeks must be between 30 and 40', severity: 'ERROR' });
    }
    if (this.payload.totalLearningHours !== this.payload.annualLearningLoad) {
      issues.push({ field: 'totalLearningHours', message: 'Total Learning Hours must match Annual Learning Load', severity: 'ERROR' });
    }

    const status = issues.length > 0 ? 'ERROR' : 'PASS';
    return { status, issues };
  }
}
