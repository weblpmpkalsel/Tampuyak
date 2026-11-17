import { MasterDataEntity } from './MasterDataTypes';

/**
 * Canonical properties for School Profile
 */
export interface SchoolProfileProperties {
  schoolName: string;
  npsn: string;
  nss: string;
  schoolStatus: string;
  schoolLevel: string;
  educationStage: string;
  address: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  phone: string;
  email: string;
  website: string;
  schoolLogo: string;
  principal: string;
  principalNip: string;
  committee: string;
  operator: string;
  academicYear: string;
}

/**
 * SchoolProfile Master Data Object
 */
export type SchoolProfile = MasterDataEntity<SchoolProfileProperties>;
