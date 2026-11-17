import { User } from 'firebase/auth';
import { UserProfile } from '../firestore/userService';

export const isDevAuthBypass = () => {
  try {
    if (import.meta.env.VITE_DEV_AUTH_BYPASS === 'true') return true;
  } catch (e) {}
  return false;
};

export const DEV_USER: User = {
  uid: 'dev-admin-uid',
  email: 'admin@sd.dev',
  displayName: 'Dev Administrator',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'dev-token',
  getIdTokenResult: async () => ({ token: 'dev-token', claims: {}, authTime: '', issuedAtTime: '', expirationTime: '', signInProvider: null, signInSecondFactor: null }),
  reload: async () => {},
  toJSON: () => ({})
} as any;

export const DEV_PROFILE: UserProfile = {
  uid: 'dev-admin-uid',
  email: 'admin@sd.dev',
  displayName: 'Dev Administrator',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  createdAt: Date.now()
};

export function getEffectiveUser(authCurrentUser: User | null): User | null {
  if (isDevAuthBypass()) return DEV_USER;
  return authCurrentUser;
}
