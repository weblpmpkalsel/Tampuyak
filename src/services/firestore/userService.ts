import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'OPERATOR' | 'HEADMASTER' | 'VIEWER' | 'ADMIN' | 'school_admin';

export interface UserProfile {
  schoolName?: string;
  principalName?: string;
  phone?: string;
  province?: string;
  district?: string;
  npsn?: string;
  workspaceId?: string | null;
  emailVerified?: boolean;
  updatedAt?: number;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'DISABLED';
  createdAt: number;
  approvalBypass?: boolean;
}

export class UserService {
  private static collectionName = 'users';

  static async syncUser(user: { uid: string; email: string; displayName?: string }): Promise<UserProfile> {
    const systemRef = doc(db, 'system', 'platform');
    let systemSnap = await getDoc(systemRef);
    
    const OWNER_EMAIL = 'kkg1jaro@gmail.com';
    const SUPER_ADMIN_EMAIL = 'denidemian83@gmail.com';
    
    let isOwner = false;
    let isSuperAdmin = false;

    if (user.email === OWNER_EMAIL) {
      isOwner = true;
      await setDoc(systemRef, {
        ownerUid: user.uid,
        ownerEmail: OWNER_EMAIL,
        bootstrappedAt: serverTimestamp()
      }, { merge: true });
    } else if (systemSnap.exists() && systemSnap.data()?.ownerUid) {
      isOwner = user.uid === systemSnap.data().ownerUid;
    }

    if (user.email === SUPER_ADMIN_EMAIL) {
      isSuperAdmin = true;
    }

    let profile = await this.getUserProfile(user.uid);
    if (!profile) {
      profile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        role: isOwner ? 'OWNER' : (isSuperAdmin ? 'SUPER_ADMIN' : 'SCHOOL_ADMIN'),
        status: isOwner || isSuperAdmin ? 'ACTIVE' : 'PENDING',
        createdAt: Date.now(),
        ...(isOwner || isSuperAdmin ? { workspaceId: 'SYSTEM', approvalBypass: true } : {})
      };
      await this.createUserProfile(profile);
    } else {
      
      let needsUpdate = false;
      let newRole = profile.role;
      let newStatus = profile.status;
      let newWorkspaceId = profile.workspaceId;
      let newApprovalBypass = profile.approvalBypass;

      if (isOwner && (profile.role !== 'OWNER' || profile.status !== 'ACTIVE' || !profile.workspaceId || !profile.approvalBypass)) {
        newRole = 'OWNER';
        newStatus = 'ACTIVE';
        if (!profile.workspaceId) newWorkspaceId = 'SYSTEM';
        newApprovalBypass = true;
        needsUpdate = true;
      } else if (!isOwner && profile.role === 'OWNER') {
        newRole = 'SCHOOL_ADMIN';
        newStatus = 'PENDING';
        needsUpdate = true;
      }
      
      if (isSuperAdmin && !isOwner && (profile.role !== 'SUPER_ADMIN' || profile.status !== 'ACTIVE' || !profile.workspaceId || !profile.approvalBypass)) {
        newRole = 'SUPER_ADMIN';
        newStatus = 'ACTIVE';
        if (!profile.workspaceId) newWorkspaceId = 'SYSTEM';
        newApprovalBypass = true;
        needsUpdate = true;
      }

      // Migrate old roles
      if (!isOwner && !isSuperAdmin && (
        profile.role === 'VIEWER'  || 
        profile.role === 'TEACHER'  || 
        profile.role === 'OPERATOR'  || 
        profile.role === 'HEADMASTER'  || 
        profile.role === 'ADMIN'  ||
        profile.role === 'school_admin' 
      )) {
        newRole = 'SCHOOL_ADMIN';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await this.updateUserProfile(user.uid, {
          role: newRole,
          status: newStatus,
          workspaceId: newWorkspaceId,
          approvalBypass: newApprovalBypass
        }, isOwner ? 'OWNER' : undefined);
        profile.role = newRole;
        profile.status = newStatus;
        profile.workspaceId = newWorkspaceId;
        profile.approvalBypass = newApprovalBypass;
      }

    }

    return profile;
  }

  static async createUserProfile(user: UserProfile): Promise<void> {
    const userRef = doc(db, this.collectionName, user.uid);
    await setDoc(userRef, user);
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (uid === 'dev-admin-uid') {
      return import('../auth/devAuth').then(m => m.DEV_PROFILE );
    }
    const userRef = doc(db, this.collectionName, uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  }

  static async updateUserProfile(uid: string, data: Partial<UserProfile>, currentUserRole?: UserRole): Promise<void> {
    if (data.role === 'OWNER' && currentUserRole !== 'OWNER') {
      throw new Error('ACCESS DENIED: Cannot promote to OWNER');
    }
    const userRef = doc(db, this.collectionName, uid);
    await updateDoc(userRef, data);
  }

  
  static async getActiveTeachersByWorkspace(workspaceId: string): Promise<UserProfile[]> {
    if (!workspaceId) return [];
    // Requires composite index for workspaceId + status + role
    const q = query(
      collection(db, this.collectionName), 
      where('workspaceId', '==', workspaceId),
      where('status', '==', 'ACTIVE'),
      where('role', '==', 'TEACHER')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as UserProfile);
  }

  static async getPendingUsers(): Promise<UserProfile[]> {
    const q = query(collection(db, this.collectionName), where('status', '==', 'PENDING'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as UserProfile);
  }
}
