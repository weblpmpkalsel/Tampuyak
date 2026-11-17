import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { OrganizationProfile } from '../../models/OrganizationProfile';

export class OrganizationService {
  private static collectionName = 'organizations';

  static async getProfile(workspaceId: string): Promise<OrganizationProfile | null> {
    if (!workspaceId) return null;
    const docRef = doc(db, this.collectionName, workspaceId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as OrganizationProfile;
    }
    return null;
  }

  static async setupOrganization(uid: string, profileData: Omit<OrganizationProfile, 'workspaceId' | 'version' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const workspaceId = `ws_${profileData.npsn || uid}`;
    await this.createProfile(workspaceId, profileData);
    
    // Also update the user's profile to assign this workspaceId
    const { UserService } = await import('./userService');
    await UserService.updateUserProfile(uid, {
      workspaceId
    });
  }

  static async createProfile(workspaceId: string, profileData: Omit<OrganizationProfile, 'workspaceId' | 'version' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const docRef = doc(db, this.collectionName, workspaceId);
    
    const profile: OrganizationProfile = {
      ...profileData,
      workspaceId,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await setDoc(docRef, profile);
  }

  static async updateProfile(workspaceId: string, updates: Partial<Omit<OrganizationProfile, 'workspaceId' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, this.collectionName, workspaceId);
    
    // We should theoretically read and increment version, or use FieldValue.increment
    // For simplicity, we just update the updatedAt and increment version client-side or assume it's handled.
    // In a real app we'd use a transaction to guarantee version increment.
    
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Organization profile not found");
    
    const currentData = snap.data() as OrganizationProfile;
    
    await updateDoc(docRef, {
      ...updates,
      version: currentData.version + 1,
      updatedAt: Date.now()
    });
  }
}
