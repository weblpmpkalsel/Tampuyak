import {
  SupervisionPlan,
  Observation,
  Recommendation,
  Evidence,
  AuditTrail
} from '../types/SupervisionTypes';

// ============================================================================
// BASE ENTITY CONTRACTS (VERSIONING & METADATA)
// ============================================================================

export interface VersionedEntity {
  version: number;
}

export interface SoftDeleteEntity {
  isDeleted: boolean;
  deletedAt?: number;
}

export interface AuditableEntity {
  createdBy: string;
  createdAt: number;
  updatedBy?: string;
  updatedAt?: number;
}

export interface SnapshotEntity<T> {
  readonly snapshotData: Readonly<T>;
  readonly snapshotTakenAt: number;
}

// ============================================================================
// ERROR CONTRACTS
// ============================================================================

export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class RecordNotFound extends RepositoryError {
  constructor(entityName: string, id: string) {
    super(`Record of type ${entityName} with ID ${id} not found.`);
    this.name = 'RecordNotFound';
  }
}

export class DuplicateRecord extends RepositoryError {
  constructor(entityName: string, id: string) {
    super(`Record of type ${entityName} with ID ${id} already exists.`);
    this.name = 'DuplicateRecord';
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string) {
    super(`Validation failed: ${message}`);
    this.name = 'ValidationError';
  }
}

export class StorageUnavailable extends RepositoryError {
  constructor(message: string = 'Storage service is currently unavailable.') {
    super(message);
    this.name = 'StorageUnavailable';
  }
}

// ============================================================================
// PERSISTENCE DTOs
// ============================================================================

export interface CreateSupervisionRecordDTO {
  planId: string;
  title: string;
  academicYear: string;
  semester: string;
}

export interface UpdateObservationDTO {
  id: string;
  updates: Partial<Observation>;
}

export interface ArchiveRecommendationDTO {
  id: string;
  archivedBy: string;
  reason?: string;
}

export interface RestoreEvidenceDTO {
  id: string;
  restoredBy: string;
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface SupervisionRepository {
  create(data: CreateSupervisionRecordDTO): Promise<SupervisionPlan>;
  update(id: string, updates: Partial<SupervisionPlan>): Promise<SupervisionPlan>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<SupervisionPlan | null>;
  findAll(filters?: Record<string, any>): Promise<SupervisionPlan[]>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

export interface ObservationRepository {
  create(data: Observation): Promise<Observation>;
  update(data: UpdateObservationDTO): Promise<Observation>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Observation | null>;
  findAll(filters?: Record<string, any>): Promise<Observation[]>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

export interface RecommendationRepository {
  create(data: Recommendation): Promise<Recommendation>;
  update(id: string, updates: Partial<Recommendation>): Promise<Recommendation>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Recommendation | null>;
  findAll(filters?: Record<string, any>): Promise<Recommendation[]>;
  archive(data: ArchiveRecommendationDTO): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

export interface EvidenceRepository {
  create(data: Evidence): Promise<Evidence>;
  update(id: string, updates: Partial<Evidence>): Promise<Evidence>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Evidence | null>;
  findAll(filters?: Record<string, any>): Promise<Evidence[]>;
  archive(id: string): Promise<boolean>;
  restore(data: RestoreEvidenceDTO): Promise<boolean>;
}

export interface AttachmentRepository {
  create(data: any): Promise<string>;
  update(id: string, data: any): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<any | null>;
  findAll(filters?: Record<string, any>): Promise<any[]>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

export interface AuditTrailRepository {
  create(data: AuditTrail): Promise<AuditTrail>;
  update(id: string, updates: Partial<AuditTrail>): Promise<AuditTrail>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<AuditTrail | null>;
  findAll(filters?: Record<string, any>): Promise<AuditTrail[]>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}
