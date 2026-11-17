import { collection, doc, setDoc, getDocs, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface DeviceSession {
  sessionId: string;
  uid: string;
  deviceId: string;
  browser: string;
  platform: string;
  lastLogin: any;
  lastSeen: any;
  isActive: boolean;
}

export class SessionService {
  private static collectionName = 'deviceSessions';

  static async createSession(uid: string, deviceId: string, browser: string, platform: string): Promise<string> {
    const sessionId = `${uid}_${deviceId}_${Date.now()}`;
    const session: DeviceSession = {
      sessionId,
      uid,
      deviceId,
      browser,
      platform,
      lastLogin: serverTimestamp(),
      lastSeen: serverTimestamp(),
      isActive: true
    };
    
    await setDoc(doc(db, this.collectionName, sessionId), session);
    return sessionId;
  }

  static async updateLastSeen(sessionId: string): Promise<void> {
    await updateDoc(doc(db, this.collectionName, sessionId), {
      lastSeen: serverTimestamp()
    });
  }

  static async getActiveSessions(uid: string): Promise<DeviceSession[]> {
    const q = query(
      collection(db, this.collectionName), 
      where('uid', '==', uid),
      where('isActive', '==', true)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as DeviceSession);
  }

  static async forceLogout(sessionId: string): Promise<void> {
    await updateDoc(doc(db, this.collectionName, sessionId), {
      isActive: false
    });
  }

  static async logoutAllDevices(uid: string): Promise<void> {
    const sessions = await this.getActiveSessions(uid);
    const promises = sessions.map(s => this.forceLogout(s.sessionId));
    await Promise.all(promises);
  }
}
