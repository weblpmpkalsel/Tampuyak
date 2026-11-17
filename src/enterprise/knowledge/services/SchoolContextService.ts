import { SchoolProfile } from '../../master-data/SchoolProfile.model';
import { Community } from '../../master-data/Community.model';
import { Facilities } from '../../master-data/Facilities.model';
import { SchoolOrganization } from '../../master-data/SchoolOrganization.model';
import { SchoolGovernance } from '../../master-data/SchoolGovernance.model';
import { AcademicYear } from '../../master-data/AcademicYear.model';
import { CanonicalKnowledgeObject } from '../contracts/KnowledgeTypes';
import { ValidationResult, ValidationIssue, ValidationStatus, ProcessingMetadata } from '../validation/ValidationTypes';

/**
 * The payload containing the aggregated, un-reshaped canonical properties from Master Data.
 */
export interface SchoolContextPayload {
  profile: SchoolProfile['properties'];
  community: Community['properties'];
  facilities: Facilities['properties'];
  organization: SchoolOrganization['properties'];
  governance: SchoolGovernance['properties'];
  academicYear: AcademicYear['properties'];
}

/**
 * Output of the SchoolContextService containing the knowledge object, validation, and metadata.
 */
export interface SchoolContextServiceResult {
  knowledge: CanonicalKnowledgeObject<SchoolContextPayload>;
  validation: ValidationResult;
  processingMetadata: ProcessingMetadata;
  sourceVersions: Record<string, string>;
}

/**
 * Input arguments for processing school context.
 */
export interface SchoolContextInput {
  profile: SchoolProfile;
  community: Community;
  facilities: Facilities;
  organization: SchoolOrganization;
  governance: SchoolGovernance;
  academicYear: AcademicYear;
}

const SERVICE_VERSION = '1.0.0';

/**
 * Validates the completeness of the School Context.
 */
function validateContext(input: SchoolContextInput): ValidationResult {
  const issues: ValidationIssue[] = [];
  let status: ValidationStatus = 'PASS';

  if (!input.community || !input.community.properties || 
      (input.community.properties.industryPartners?.length === 0 && !input.community.properties.parents)) {
      issues.push({
        field: 'community',
        message: 'Missing or incomplete community master data',
        severity: 'WARNING'
      });
      status = 'WARNING';
  }

  if (!input.facilities || !input.facilities.properties || input.facilities.properties.buildings?.length === 0) {
      issues.push({
        field: 'facilities',
        message: 'Missing or incomplete facilities master data',
        severity: 'WARNING'
      });
      status = 'WARNING';
  }

  if (!input.governance || !input.governance.properties || !input.governance.properties.regulatoryRegion) {
      issues.push({
        field: 'governance',
        message: 'Missing or incomplete governance master data',
        severity: 'WARNING'
      });
      status = 'WARNING';
  }

  return { status, issues };
}

/**
 * Aggregates contextual master data into a canonical knowledge object.
 * Returns immutable context, validation, and processing metadata.
 * 
 * @param input Aggregated raw Master Data entities.
 * @returns Canonical knowledge object with validation and traceability metadata.
 */
export function processSchoolContext(input: SchoolContextInput): SchoolContextServiceResult {
  const validation = validateContext(input);

  // Maintain immutability by creating a new payload with copies of the properties
  const payload: SchoolContextPayload = {
    profile: { ...input.profile.properties },
    community: { ...input.community.properties },
    facilities: { ...input.facilities.properties },
    organization: { ...input.organization.properties },
    governance: { ...input.governance.properties },
    academicYear: { ...input.academicYear.properties }
  };

  const knowledge: CanonicalKnowledgeObject<SchoolContextPayload> = {
    metadata: {
      id: `CTX-${Date.now()}`,
      domain: 'SchoolContext',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lifecycle: 'GENERATED',
      source: {
        origin: 'MASTER_DATA',
        serviceVersion: SERVICE_VERSION
      }
    },
    data: payload
  };

  const sourceVersions = {
    profile: input.profile.metadata.version,
    community: input.community.metadata.version,
    facilities: input.facilities.metadata.version,
    organization: input.organization.metadata.version,
    governance: input.governance.metadata.version,
    academicYear: input.academicYear.metadata.version,
  };

  const processingMetadata: ProcessingMetadata = {
    processedAt: new Date().toISOString(),
    serviceVersion: SERVICE_VERSION,
    sourceVersion: 'aggregated' // Aggregated from multiple Master Data sources
  };

  return {
    knowledge,
    validation,
    processingMetadata,
    sourceVersions
  };
}
