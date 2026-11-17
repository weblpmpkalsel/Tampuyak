import { MasterDataEntity } from './MasterDataTypes';

/**
 * Canonical properties for School Organization
 */
export interface SchoolOrganizationProperties {
  principal: string;
  vicePrincipal: string;
  curriculumTeam: string[];
  administrativeStaff: string[];
  schoolCommittee: string[];
  developmentTeam: string[];
}

/**
 * SchoolOrganization Master Data Object
 */
export type SchoolOrganization = MasterDataEntity<SchoolOrganizationProperties>;
