import { IFollowUpRepository } from '../ISupervisionRepositories';
import { FollowUp } from '../../types/SupervisionTypes';
import { FirestoreBaseRepository } from './FirestoreBaseRepository';
import { where } from 'firebase/firestore';

export class FirestoreFollowUpRepository extends FirestoreBaseRepository<FollowUp> implements IFollowUpRepository {
  
  async create(data: FollowUp): Promise<FollowUp> {
    return this._create(data);
  }

  constructor() {
    super('supervision_follow_ups');
  }

  async findByScheduleId(scheduleId: string): Promise<FollowUp | null> {
    const results = await this.findAll([where('supervisionId', '==', scheduleId)]);
    return results.length > 0 ? results[0] : null;
  }
}
