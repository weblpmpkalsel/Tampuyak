import { AcademicYear, CalendarEvent } from '../../master-data/AcademicYear.model';
import { CanonicalKnowledgeObject, KnowledgeSource } from '../contracts/KnowledgeTypes';
import { ValidationResult, ValidationIssue, ValidationStatus, ProcessingMetadata } from '../validation/ValidationTypes';

export interface AcademicCalendarPayload {
  academicYear: string;
  semester: string;
  effectiveWeeks: number;
  effectiveLearningDays: number;
  events: CalendarEvent[];
}

export interface AcademicCalendarInput {
  academicYear?: AcademicYear;
}

export interface AcademicCalendarServiceResult {
  knowledge: CanonicalKnowledgeObject<AcademicCalendarPayload>;
  validation: ValidationResult;
  processingMetadata: ProcessingMetadata;
  sourceVersions: Record<string, string>;
}

const SERVICE_VERSION = '1.0.0';

function normalizeAcademicCalendar(input: AcademicCalendarInput): AcademicCalendarPayload {
  const props = input.academicYear?.properties;
  return {
    academicYear: props?.currentYear?.trim() ?? '',
    semester: props?.semester?.trim() ?? '',
    effectiveWeeks: props?.effectiveWeeks ?? 0,
    effectiveLearningDays: props?.effectiveLearningDays ?? 0,
    events: props?.events ?? [],
  };
}

function validateAcademicCalendar(payload: AcademicCalendarPayload, input: AcademicCalendarInput): ValidationResult {
  const issues: ValidationIssue[] = [];
  let status: ValidationStatus = 'PASS';

  if (!input.academicYear) {
    issues.push({
      field: 'academicYear',
      message: 'Missing AcademicYear master data',
      severity: 'WARNING'
    });
    status = 'WARNING';
  } else if (!payload.academicYear) {
    issues.push({
      field: 'academicYear',
      message: 'Academic Year is missing',
      severity: 'WARNING'
    });
    status = 'WARNING';
  }

  return { status, issues };
}

export function processAcademicCalendar(input: AcademicCalendarInput): AcademicCalendarServiceResult {
  const payload = normalizeAcademicCalendar(input);
  const validation = validateAcademicCalendar(payload, input);

  const knowledgeSource: KnowledgeSource = {
    origin: 'MASTER_DATA',
    serviceVersion: SERVICE_VERSION
  };

  const knowledge: CanonicalKnowledgeObject<AcademicCalendarPayload> = {
    metadata: {
      id: `AC-${Date.now()}`,
      domain: 'AcademicCalendar',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lifecycle: 'GENERATED',
      source: knowledgeSource
    },
    data: payload
  };

  const sourceVersions: Record<string, string> = {
    academicYear: input.academicYear?.metadata.version ?? 'unknown'
  };

  const processingMetadata: ProcessingMetadata = {
    processedAt: new Date().toISOString(),
    serviceVersion: SERVICE_VERSION,
    sourceVersion: 'aggregated'
  };

  return {
    knowledge,
    validation,
    processingMetadata,
    sourceVersions
  };
}
