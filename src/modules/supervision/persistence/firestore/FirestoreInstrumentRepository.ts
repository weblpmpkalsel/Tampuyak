import { IInstrumentRepository } from '../ISupervisionRepositories';
import { SupervisionInstrument } from '../../types/SupervisionTypes';
import { FirestoreBaseRepository } from './FirestoreBaseRepository';

export class FirestoreInstrumentRepository extends FirestoreBaseRepository<SupervisionInstrument> implements IInstrumentRepository {
  
  async create(data: SupervisionInstrument): Promise<SupervisionInstrument> {
    return this._create(data);
  }

  constructor() {
    super('supervision_instruments');
  }
}
