import { MasterDataEntity } from './MasterDataTypes';

/**
 * Canonical properties for Community
 */
export interface CommunityProperties {
  parents: string;
  industryPartners: string[];
  village: string;
  healthCenter: string;
  police: string;
  military: string;
  localGovernment: string;
}

/**
 * Community Master Data Object
 */
export type Community = MasterDataEntity<CommunityProperties>;
