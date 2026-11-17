import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, runTransaction } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserService } from './userService';

export interface WorkspaceRequest {
  requestId: string;
  workspaceId: string;
  requestedBy: string; // User UID
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: number;
}

export interface Workspace {
  workspaceId: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DISABLED';
  createdAt: number;
}

export class WorkspaceService {
  private static requestsCollection = 'workspaceRequests';
  private static workspacesCollection = 'workspaces';

  static async submitWorkspaceRequest(request: WorkspaceRequest): Promise<void> {
    const reqRef = doc(db, this.requestsCollection, request.requestId);
    await setDoc(reqRef, request);
  }

  static async getPendingRequests(): Promise<WorkspaceRequest[]> {
    const q = query(collection(db, this.requestsCollection), where('status', '==', 'PENDING'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as WorkspaceRequest);
  }

  static async approveWorkspaceRequest(requestId: string): Promise<void> {
    const reqRef = doc(db, this.requestsCollection, requestId);
    
    await runTransaction(db, async (transaction) => {
      const reqDoc = await transaction.get(reqRef);
      if (!reqDoc.exists()) throw new Error("Request does not exist");
      const data = reqDoc.data() as WorkspaceRequest;
      
      if (data.status !== 'PENDING') throw new Error("Request is not pending");
      
      // Update request status
      transaction.update(reqRef, { status: 'APPROVED' });
      
      // Create workspace
      const workspaceId = data.workspaceId;
      const workspaceRef = doc(db, this.workspacesCollection, workspaceId);
      transaction.set(workspaceRef, {
        workspaceId,
        status: 'ACTIVE',
        createdAt: Date.now()
      });
      
      // Update user status
      const userRef = doc(db, 'users', data.requestedBy);
      transaction.update(userRef, { status: 'ACTIVE', workspaceId: workspaceId });
    });
  }

  static async rejectWorkspaceRequest(requestId: string): Promise<void> {
    const reqRef = doc(db, this.requestsCollection, requestId);
    
    await runTransaction(db, async (transaction) => {
      const reqDoc = await transaction.get(reqRef);
      if (!reqDoc.exists()) throw new Error("Request does not exist");
      const data = reqDoc.data() as WorkspaceRequest;
      
      if (data.status !== 'PENDING') throw new Error("Request is not pending");
      
      // Update request status
      transaction.update(reqRef, { status: 'REJECTED' });
      
      // Update user status
      const userRef = doc(db, 'users', data.requestedBy);
      transaction.update(userRef, { status: 'REJECTED' });
    });
  }
}
