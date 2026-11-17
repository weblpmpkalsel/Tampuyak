/**
 * Shared metadata interface for all Enterprise Assets.
 * This is used across Master Data, Policies, Registries, and Builders.
 */
export interface EnterpriseAssetMetadata {
  id: string;
  version: string;
  owner: string;
  lifecycle: 'Draft' | 'Reviewed' | 'Approved' | 'Frozen';
  lastUpdated?: string;
}

/**
 * Validation metadata for a property.
 */
export interface ValidationMetadata {
  isRequired: boolean;
  rules: string[];
}

/**
 * Base structure for a Master Data Entity.
 * Contains only canonical properties, validation, and metadata.
 * NO business logic. NO rendering logic. NO AI logic.
 */
export interface MasterDataEntity<T> {
  metadata: EnterpriseAssetMetadata;
  properties: T;
  validation: Record<keyof T, ValidationMetadata>;
}
