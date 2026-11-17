import { SchoolProfile, SchoolProfileProperties } from '../../master-data/SchoolProfile.model';
import {
  ValidationResult,
  ValidationIssue,
  ValidationStatus,
  ProcessingMetadata
} from '../validation/ValidationTypes';

export interface CanonicalSchoolProfileOutput {
  data: SchoolProfileProperties;
  validation: ValidationResult;
  processingMetadata: ProcessingMetadata;
}

const SERVICE_VERSION = '1.0.0';

/**
 * Validates the completeness of the School Profile based on Enterprise Rules.
 */
function validateProfile(properties: SchoolProfileProperties): ValidationResult {
  const issues: ValidationIssue[] = [];
  let status: ValidationStatus = 'PASS';

  const requiredFields: Array<keyof SchoolProfileProperties> = [
    'schoolName',
    'npsn',
    'address',
    'principal',
    'academicYear'
  ];

  for (const field of requiredFields) {
    const value = properties[field];
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      issues.push({
        field: field as string,
        message: `Required field missing: ${field}`,
        severity: 'WARNING'
      });
      status = 'WARNING';
    }
  }

  return { status, issues };
}

/**
 * Normalizes canonical values without mutating the original input.
 */
function normalizeProfile(properties: SchoolProfileProperties): SchoolProfileProperties {
  return {
    ...properties,
    schoolName: properties.schoolName?.trim() ?? '',
    npsn: properties.npsn?.trim() ?? '',
    address: properties.address?.trim() ?? '',
    principal: properties.principal?.trim() ?? '',
    academicYear: properties.academicYear?.trim() ?? '',
    // Spread ensures a new object is created and no mutation occurs
  };
}

/**
 * Retrieves the canonical School Profile, applying validation and normalization.
 * 
 * @param input The raw Master Data entity for School Profile
 * @returns Canonical output containing normalized data, validation, and metadata
 */
export function processSchoolProfile(input: SchoolProfile): CanonicalSchoolProfileOutput {
  const normalizedData = normalizeProfile(input.properties);
  const validation = validateProfile(normalizedData);
  
  const processingMetadata: ProcessingMetadata = {
    processedAt: new Date().toISOString(),
    serviceVersion: SERVICE_VERSION,
    sourceVersion: input.metadata.version
  };

  return {
    data: normalizedData,
    validation,
    processingMetadata
  };
}
