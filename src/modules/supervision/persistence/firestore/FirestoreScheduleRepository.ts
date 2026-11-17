import { IScheduleRepository } from '../ISupervisionRepositories';
import { SupervisionSchedule } from '../../types/SupervisionTypes';
import { FirestoreBaseRepository } from './FirestoreBaseRepository';
import { where } from 'firebase/firestore';

export class FirestoreScheduleRepository extends FirestoreBaseRepository<SupervisionSchedule> implements IScheduleRepository {
  
  async create(data: SupervisionSchedule): Promise<SupervisionSchedule> {
    return this._create(data);
  }

  constructor() {
    super('supervision_schedules');
  }

  async findByPlanId(planId: string): Promise<SupervisionSchedule[]> {
    return this.findAll([where('planId', '==', planId)]);
  }
}
