import { MasterDataEntity } from './MasterDataTypes';

/**
 * Canonical properties for School Governance
 */
export interface SchoolGovernanceProperties {
  foundation: string; // Foundation/Yayasan (if private)
  schoolBoardStructure: string;
  accreditationStatus: string;
  accreditationBody: string;
  regulatoryRegion: string;
  licensingInformation: string;
}

/**
 * SchoolGovernance Master Data Object
 */
export type SchoolGovernance = MasterDataEntity<SchoolGovernanceProperties>;
