import {
  SupervisionPlan,
  SupervisionSchedule,
  Observation,
  SupervisionInstrument,
  PostObservation,
  FollowUp,
} from '../types/SupervisionTypes';
import { CreateSupervisionRecordDTO, UpdateObservationDTO } from './PersistenceContracts';

export interface ISupervisionRepository {
  create(data: CreateSupervisionRecordDTO): Promise<SupervisionPlan>;
  update(id: string, updates: Partial<SupervisionPlan>): Promise<SupervisionPlan>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<SupervisionPlan | null>;
  findAll(filters?: Record<string, any>): Promise<SupervisionPlan[]>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

export interface IScheduleRepository {
  create(data: SupervisionSchedule): Promise<SupervisionSchedule>;
  update(id: string, updates: Partial<SupervisionSchedule>): Promise<SupervisionSchedule>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<SupervisionSchedule | null>;
  findAll(): Promise<SupervisionSchedule[]>;
  findByPlanId(planId: string): Promise<SupervisionSchedule[]>;
}

export interface IObservationRepository {
  create(data: Observation): Promise<Observation>;
  update(id: string, updates: Partial<Observation>): Promise<Observation>;
  findAll(): Promise<Observation[]>;
  findByScheduleId(scheduleId: string): Promise<Observation | null>;
}

export interface IInstrumentRepository {
  create(data: SupervisionInstrument): Promise<SupervisionInstrument>;
  update(id: string, updates: Partial<SupervisionInstrument>): Promise<SupervisionInstrument>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<SupervisionInstrument | null>;
  findAll(): Promise<SupervisionInstrument[]>;
}

export interface IPostObservationRepository {
  create(data: PostObservation): Promise<PostObservation>;
  update(id: string, updates: Partial<PostObservation>): Promise<PostObservation>;
  findAll(): Promise<PostObservation[]>;
  findByScheduleId(scheduleId: string): Promise<PostObservation | null>;
}

export interface IFollowUpRepository {
  create(data: FollowUp): Promise<FollowUp>;
  update(id: string, updates: Partial<FollowUp>): Promise<FollowUp>;
  findAll(): Promise<FollowUp[]>;
  findByScheduleId(scheduleId: string): Promise<FollowUp | null>;
}

export interface ISupervisionRepositoryFactory {
  getSupervisionRepository(): ISupervisionRepository;
  getScheduleRepository(): IScheduleRepository;
  getObservationRepository(): IObservationRepository;
  getInstrumentRepository(): IInstrumentRepository;
  getPostObservationRepository(): IPostObservationRepository;
  getFollowUpRepository(): IFollowUpRepository;
}
