import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { OrganizationService } from '../firestore/organizationService';

export interface IdentityTrace {
  id?: string;
  uid: string;
  email: string;
  timestamp: any;
  steps: {
    firebaseAuth: 'PASS' | 'FAIL' | 'PENDING';
    firestoreProfile: 'PASS' | 'FAIL' | 'PENDING';
    roleResolution: 'PASS' | 'FAIL' | 'PENDING';
    statusResolution: 'PASS' | 'FAIL' | 'PENDING';
    workspaceLookup: 'PASS' | 'FAIL' | 'PENDING' | 'N/A';
    organizationLookup: 'PASS' | 'FAIL' | 'PENDING' | 'N/A';
    finalRoute: string;
  };
}

export class IdentityTraceService {
  static async recordLoginTrace(user: any, profile: any): Promise<void> {
    if (!user) return;
    
    // Prevent duplicate logs in same session
    const traceKey = `trace_logged_${user.uid}`;
    if (sessionStorage.getItem(traceKey)) return;
    sessionStorage.setItem(traceKey, 'true');

    const trace: Omit<IdentityTrace, 'id' | 'timestamp'> = {
      uid: user.uid,
      email: user.email || '',
      steps: {
        firebaseAuth: user ? 'PASS' : 'FAIL',
        firestoreProfile: profile ? 'PASS' : 'FAIL',
        roleResolution: profile?.role ? 'PASS' : 'FAIL',
        statusResolution: profile?.status ? 'PASS' : 'FAIL',
        workspaceLookup: 'N/A',
        organizationLookup: 'N/A',
        finalRoute: 'FAIL'
      }
    };

    if (profile?.role === 'OWNER') {
      trace.steps.finalRoute = '/control';
    } else if (profile?.status === 'PENDING') {
      trace.steps.finalRoute = '/pending';
    } else if (profile?.status === 'REJECTED') {
      trace.steps.finalRoute = '/rejected';
    } else if (profile?.status === 'DISABLED') {
      trace.steps.finalRoute = '/unauthorized';
    } else if (profile?.role === 'SCHOOL_ADMIN' && profile?.status === 'ACTIVE') {
      if (profile.workspaceId) {
        trace.steps.workspaceLookup = 'PASS';
        try {
          const org = await OrganizationService.getProfile(profile.workspaceId);
          if (org) {
            trace.steps.organizationLookup = 'PASS';
            trace.steps.finalRoute = '/dashboard';
          } else {
            trace.steps.organizationLookup = 'FAIL';
            trace.steps.finalRoute = '/workspace/setup';
          }
        } catch (e) {
          trace.steps.organizationLookup = 'FAIL';
          trace.steps.finalRoute = '/workspace/setup';
        }
      } else {
        trace.steps.workspaceLookup = 'FAIL'; // Missing workspace
        trace.steps.finalRoute = '/unauthorized'; // actually it might redirect to pending or error
      }
    } else {
      trace.steps.finalRoute = '/';
    }

    try {
      await addDoc(collection(db, 'identity_traces'), {
        ...trace,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error('Failed to log identity trace', e);
    }
  }

  static async getTraces(max: number = 50): Promise<IdentityTrace[]> {
    try {
      const q = query(collection(db, 'identity_traces'), orderBy('timestamp', 'desc'), limit(max));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as IdentityTrace));
    } catch (e) {
      console.error('Failed to fetch identity traces', e);
      return [];
    }
  }
}
