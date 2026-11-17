import {
  ISupervisionRepository,
  IScheduleRepository,
  IObservationRepository,
  IInstrumentRepository,
  IPostObservationRepository,
  IFollowUpRepository,
  ISupervisionRepositoryFactory,
} from './ISupervisionRepositories';

import { FirestoreSupervisionRepository } from './firestore/FirestoreSupervisionRepository';
import { FirestoreScheduleRepository } from './firestore/FirestoreScheduleRepository';
import { FirestoreObservationRepository } from './firestore/FirestoreObservationRepository';
import { FirestoreInstrumentRepository } from './firestore/FirestoreInstrumentRepository';
import { FirestorePostObservationRepository } from './firestore/FirestorePostObservationRepository';
import { FirestoreFollowUpRepository } from './firestore/FirestoreFollowUpRepository';

export class SupervisionRepositoryFactory implements ISupervisionRepositoryFactory {
  private static instance: SupervisionRepositoryFactory;

  private supervisionRepository: ISupervisionRepository;
  private scheduleRepository: IScheduleRepository;
  private observationRepository: IObservationRepository;
  private instrumentRepository: IInstrumentRepository;
  private postObservationRepository: IPostObservationRepository;
  private followUpRepository: IFollowUpRepository;

  private constructor() {
    this.supervisionRepository = new FirestoreSupervisionRepository();
    this.scheduleRepository = new FirestoreScheduleRepository();
    this.observationRepository = new FirestoreObservationRepository();
    this.instrumentRepository = new FirestoreInstrumentRepository();
    this.postObservationRepository = new FirestorePostObservationRepository();
    this.followUpRepository = new FirestoreFollowUpRepository();
  }

  public static getInstance(): SupervisionRepositoryFactory {
    if (!SupervisionRepositoryFactory.instance) {
      SupervisionRepositoryFactory.instance = new SupervisionRepositoryFactory();
    }
    return SupervisionRepositoryFactory.instance;
  }

  getSupervisionRepository(): ISupervisionRepository {
    return this.supervisionRepository;
  }
  
  getScheduleRepository(): IScheduleRepository {
    return this.scheduleRepository;
  }
  
  getObservationRepository(): IObservationRepository {
    return this.observationRepository;
  }
  
  getInstrumentRepository(): IInstrumentRepository {
    return this.instrumentRepository;
  }
  
  getPostObservationRepository(): IPostObservationRepository {
    return this.postObservationRepository;
  }
  
  getFollowUpRepository(): IFollowUpRepository {
    return this.followUpRepository;
  }
}
