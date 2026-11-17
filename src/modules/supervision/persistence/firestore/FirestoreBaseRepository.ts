import { db } from '../../../../lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  QueryConstraint 
} from 'firebase/firestore';

export abstract class FirestoreBaseRepository<T extends { id: string }> {
  constructor(protected readonly collectionName: string) {}

  protected getCollection() {
    return collection(db, this.collectionName);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  protected async _create(data: T): Promise<T> {
    await setDoc(this.getDocRef(data.id), data as any);
    return data;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    await updateDoc(this.getDocRef(id), updates as any);
    const updated = await this.findById(id);
    if (!updated) throw new Error(`Document with id ${id} not found after update.`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(this.getDocRef(id));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async findById(id: string): Promise<T | null> {
    const snap = await getDoc(this.getDocRef(id));
    if (snap.exists()) {
      return snap.data() as T;
    }
    return null;
  }

  async findAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    const q = query(this.getCollection(), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as T);
  }
}
