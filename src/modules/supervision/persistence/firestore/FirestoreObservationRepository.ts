import { IObservationRepository } from '../ISupervisionRepositories';
import { Observation } from '../../types/SupervisionTypes';
import { FirestoreBaseRepository } from './FirestoreBaseRepository';
import { where } from 'firebase/firestore';

export class FirestoreObservationRepository extends FirestoreBaseRepository<Observation> implements IObservationRepository {
  
  async create(data: Observation): Promise<Observation> {
    return this._create(data);
  }

  constructor() {
    super('supervision_observations');
  }

  async findByScheduleId(scheduleId: string): Promise<Observation | null> {
    const results = await this.findAll([where('supervisionId', '==', scheduleId)]);
    return results.length > 0 ? results[0] : null;
  }
}
