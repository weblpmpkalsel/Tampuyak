import { EnterpriseValidationRule, ValidationRuleResult, ValidationIssue } from '../EnterpriseValidationTypes';
import { KspMetadata } from '../../../ksp/KspMetadataAdapter';

export const bab1Rules: EnterpriseValidationRule<KspMetadata>[] = [
  {
    id: 'BAB1-001',
    name: 'School Characteristics Validation',
    category: 'BAB_I',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      if (!data.schoolName) {
        issues.push({ field: 'schoolName', message: 'School name is missing', severity: 'CRITICAL' });
      }
      if (!data.npsn) {
        issues.push({ field: 'npsn', message: 'NPSN is missing', severity: 'ERROR' });
      }
      
      return {
        ruleId: 'BAB1-001',
        passed: issues.length === 0,
        issues
      };
    }
  }
];

export const bab2Rules: EnterpriseValidationRule<KspMetadata>[] = [
  {
    id: 'BAB2-001',
    name: 'Vision Quality',
    category: 'BAB_II',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      const vision = data.rawStrategicPolicy?.vision || '';
      if (!vision) {
        issues.push({ field: 'vision', message: 'Vision is empty or missing', severity: 'WARNING' });
      } else if (vision.length < 20) {
        issues.push({ field: 'vision', message: 'Vision is too short (minimum 20 characters recommended)', severity: 'INFO' });
      }
      // Check for generic wording
      if (vision.toLowerCase().includes('lorem ipsum') || vision.toLowerCase().includes('data belum tersedia')) {
        issues.push({ field: 'vision', message: 'Vision contains placeholder text', severity: 'ERROR' });
      }
      return { ruleId: 'BAB2-001', passed: issues.length === 0, issues };
    }
  },
  {
    id: 'BAB2-002',
    name: 'Mission Quality',
    category: 'BAB_II',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      const mission = data.rawStrategicPolicy?.mission || [];
      if (!Array.isArray(mission) || mission.length === 0) {
        issues.push({ field: 'mission', message: 'Mission is empty', severity: 'WARNING' });
      } else {
        const uniqueMissions = new Set(mission);
        if (uniqueMissions.size !== mission.length) {
          issues.push({ field: 'mission', message: 'Duplicate mission statements detected', severity: 'WARNING' });
        }
      }
      return { ruleId: 'BAB2-002', passed: issues.length === 0, issues };
    }
  },
  {
    id: 'BAB2-003',
    name: 'Goals Quality',
    category: 'BAB_II',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      const goals = data.rawStrategicPolicy?.goals || [];
      if (!Array.isArray(goals) || goals.length === 0) {
        issues.push({ field: 'goals', message: 'Goals are empty', severity: 'WARNING' });
      }
      return { ruleId: 'BAB2-003', passed: issues.length === 0, issues };
    }
  }
];

export const bab3Rules: EnterpriseValidationRule<KspMetadata>[] = [
  {
    id: 'BAB3-001',
    name: 'Extracurricular Validation',
    category: 'BAB_III',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      const ex = data.rawExtracurricular;
      if (!ex) {
        issues.push({ field: 'extracurricular', message: 'Extracurricular data is missing', severity: 'INFO' });
      } else {
        let programs = [];
        if (typeof ex === 'string') {
          programs = [{ name: 'Extracurricular', description: ex }];
        } else if (Array.isArray(ex)) {
          programs = ex;
        } else {
          programs = [...(ex.mandatoryPrograms || []), ...(ex.optionalPrograms || [])];
        }

        if (programs.length === 0) {
          issues.push({ field: 'extracurricular', message: 'Extracurricular program list is empty', severity: 'WARNING' });
        } else {
          const names = programs.map((p: any) => p.name || p.activityName).filter(Boolean);
          if (new Set(names).size !== names.length) {
            issues.push({ field: 'extracurricular', message: 'Duplicate extracurricular names detected', severity: 'WARNING' });
          }
        }
      }
      return { ruleId: 'BAB3-001', passed: issues.length === 0, issues };
    }
  },
  {
    id: 'BAB3-002',
    name: 'Academic Calendar Validation',
    category: 'BAB_III',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      const cal = data.rawAcademicCalendar;
      if (!cal) {
        issues.push({ field: 'academicCalendar', message: 'Academic Calendar data is missing', severity: 'WARNING' });
      } else if (!cal.events || cal.events.length === 0) {
        issues.push({ field: 'academicCalendar.events', message: 'Calendar events list is empty', severity: 'WARNING' });
      } else {
        const eventNames = cal.events.map((e: any) => `${e.date}-${e.name}`);
        if (new Set(eventNames).size !== eventNames.length) {
          issues.push({ field: 'academicCalendar.events', message: 'Duplicate calendar activities detected', severity: 'WARNING' });
        }
        const invalidDates = cal.events.filter((e: any) => !e.date);
        if (invalidDates.length > 0) {
          issues.push({ field: 'academicCalendar.events', message: 'Calendar activities with missing dates detected', severity: 'ERROR' });
        }
      }
      return { ruleId: 'BAB3-002', passed: issues.length === 0, issues };
    }
  },
  {
    id: 'BAB3-003',
    name: 'Learning Load Validation',
    category: 'BAB_III',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      const load = data.rawLearningLoad;
      if (!load) {
         issues.push({ field: 'learningLoad', message: 'Learning Load data is missing', severity: 'WARNING' });
      } else {
         if (load.weeklyLearningLoad <= 0) {
           issues.push({ field: 'learningLoad.weeklyLearningLoad', message: 'Weekly Learning Load (JP) must be > 0', severity: 'ERROR' });
         }
         if (load.effectiveWeeks <= 0) {
           issues.push({ field: 'learningLoad.effectiveWeeks', message: 'Effective weeks must be > 0', severity: 'ERROR' });
         }
      }
      return { ruleId: 'BAB3-003', passed: issues.length === 0, issues };
    }
  }
];

export const bab4Rules: EnterpriseValidationRule<KspMetadata>[] = [
  {
    id: 'BAB4-001',
    name: 'Learning Planning Validation',
    category: 'BAB_IV',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      if (!data.rawLearningPolicy) {
        issues.push({ field: 'learningPolicy', message: 'Learning Planning data is missing', severity: 'WARNING' });
      }
      return { ruleId: 'BAB4-001', passed: issues.length === 0, issues };
    }
  }
];

export const bab5Rules: EnterpriseValidationRule<KspMetadata>[] = [
  {
    id: 'BAB5-001',
    name: 'Evaluation & Professional Development Validation',
    category: 'BAB_V',
    evaluate: (data: KspMetadata): ValidationRuleResult => {
      const issues: ValidationIssue[] = [];
      if (!data.rawEvaluation) {
        issues.push({ field: 'evaluation', message: 'Evaluation and Professional Development data is missing', severity: 'WARNING' });
      }
      return { ruleId: 'BAB5-001', passed: issues.length === 0, issues };
    }
  }
];

export const allEnterpriseRules = [
  ...bab1Rules,
  ...bab2Rules,
  ...bab3Rules,
  ...bab4Rules,
  ...bab5Rules
];
