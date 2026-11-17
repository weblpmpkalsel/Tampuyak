import { MasterDataEntity } from './MasterDataTypes';

/**
 * Canonical properties for Facilities
 */
export interface FacilitiesProperties {
  buildings: string[];
  classrooms: number;
  laboratories: string[];
  library: string;
  ict: string[];
  internet: string;
  utilities: string[];
}

/**
 * Facilities Master Data Object
 */
export type Facilities = MasterDataEntity<FacilitiesProperties>;
