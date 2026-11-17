import { EnterpriseAssetMetadata } from './MasterDataTypes';

/**
 * Catalog entry for Master Data Registry
 */
export interface MasterDataCatalogEntry {
  id: string;
  name: string;
  description: string;
  metadata: EnterpriseAssetMetadata;
}

/**
 * EnterpriseMasterDataRegistry is a catalog only.
 * It registers metadata.
 * It must NEVER store runtime data.
 */
export const EnterpriseMasterDataRegistry: Record<string, MasterDataCatalogEntry> = {
  SchoolProfile: {
    id: 'MD-001',
    name: 'SchoolProfile',
    description: 'Canonical identity of the school',
    metadata: {
      id: 'MD-001',
      version: '1.0.0',
      owner: 'Enterprise Administration',
      lifecycle: 'Approved'
    }
  },
  SchoolOrganization: {
    id: 'MD-002',
    name: 'SchoolOrganization',
    description: 'Canonical organization structure of the school',
    metadata: {
      id: 'MD-002',
      version: '1.0.0',
      owner: 'Enterprise Administration',
      lifecycle: 'Approved'
    }
  },
  SchoolGovernance: {
    id: 'MD-003',
    name: 'SchoolGovernance',
    description: 'Canonical definition of the school governance structure, regulatory compliance bodies, and decision-making hierarchy',
    metadata: {
      id: 'MD-003',
      version: '1.0.0',
      owner: 'Enterprise Administration',
      lifecycle: 'Approved'
    }
  },
  Facilities: {
    id: 'MD-004',
    name: 'Facilities',
    description: 'Canonical representation of school facilities',
    metadata: {
      id: 'MD-004',
      version: '1.0.0',
      owner: 'Enterprise Administration',
      lifecycle: 'Approved'
    }
  },
  Community: {
    id: 'MD-005',
    name: 'Community',
    description: 'Canonical representation of the school community and partners',
    metadata: {
      id: 'MD-005',
      version: '1.0.0',
      owner: 'Enterprise Administration',
      lifecycle: 'Approved'
    }
  },
  AcademicYear: {
    id: 'MD-006',
    name: 'AcademicYear',
    description: 'Canonical representation of the academic year and calendar',
    metadata: {
      id: 'MD-006',
      version: '1.0.0',
      owner: 'Enterprise Administration',
      lifecycle: 'Approved'
    }
  }
};
