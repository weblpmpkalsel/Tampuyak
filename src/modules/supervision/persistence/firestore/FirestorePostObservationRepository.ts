import { IPostObservationRepository } from '../ISupervisionRepositories';
import { PostObservation } from '../../types/SupervisionTypes';
import { FirestoreBaseRepository } from './FirestoreBaseRepository';
import { where } from 'firebase/firestore';

export class FirestorePostObservationRepository extends FirestoreBaseRepository<PostObservation> implements IPostObservationRepository {
  
  async create(data: PostObservation): Promise<PostObservation> {
    return this._create(data);
  }

  constructor() {
    super('supervision_post_observations');
  }

  async findByScheduleId(scheduleId: string): Promise<PostObservation | null> {
    const results = await this.findAll([where('supervisionId', '==', scheduleId)]);
    return results.length > 0 ? results[0] : null;
  }
}
