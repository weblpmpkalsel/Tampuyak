import { ISupervisionRepository } from '../ISupervisionRepositories';
import { SupervisionPlan, SupervisionStatus } from '../../types/SupervisionTypes';
import { CreateSupervisionRecordDTO } from '../PersistenceContracts';
import { FirestoreBaseRepository } from './FirestoreBaseRepository';
import { query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export class FirestoreSupervisionRepository extends FirestoreBaseRepository<SupervisionPlan> implements ISupervisionRepository {
  constructor() {
    super('supervision_plans');
  }

  // Override create to accept CreateSupervisionRecordDTO instead of SupervisionPlan
  async create(data: CreateSupervisionRecordDTO): Promise<SupervisionPlan> {
    const plan: SupervisionPlan = {
      id: data.planId || uuidv4(),
      title: data.title,
      description: '',
      calendarSnapshot: {
        academicYear: data.academicYear,
        semester: data.semester,
      },
      status: SupervisionStatus.DRAFT,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this._create(plan);
    return plan;
  }

  async findAll(filters?: Record<string, any>): Promise<SupervisionPlan[]> {
    if (!filters) {
      return super.findAll();
    }
    
    let constraints = [];
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    return super.findAll(constraints);
  }

  async archive(id: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, this.collectionName, id), { status: SupervisionStatus.COMPLETED });
      return true;
    } catch (e) {
      return false;
    }
  }

  async restore(id: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, this.collectionName, id), { status: SupervisionStatus.DRAFT });
      return true;
    } catch (e) {
      return false;
    }
  }
}
