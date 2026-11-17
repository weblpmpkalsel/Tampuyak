import { UserRole, UserProfile } from '../firestore/userService';

export interface PermissionCache {
  uid: string;
  role: UserRole;
  workspaceId: string | null;
  permissions: string[];
  expiresAt: number;
}

export class PermissionService {
  private static cache: Map<string, PermissionCache> = new Map();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getPermissionsForRole(role: UserRole): string[] {
    switch (role) {
      case 'OWNER':
      case 'SUPER_ADMIN':
        return ['manage_users', 'manage_workspaces', 'view_audit', 'access_all_schools'];
      case 'SCHOOL_ADMIN':
        return ['manage_users', 'manage_workspaces', 'access_all_schools'];
      case 'OPERATOR' :
      case 'HEADMASTER' :
      case 'TEACHER' :
        return ['access_own_school'];
      case 'VIEWER' :
      default:
        return ['view_only'];
    }
  }

  static setCache(profile: UserProfile): void {
    this.cache.set(profile.uid, {
      uid: profile.uid,
      role: profile.role,
      workspaceId: profile.workspaceId || null,
      permissions: this.getPermissionsForRole(profile.role),
      expiresAt: Date.now() + this.CACHE_TTL
    });
  }

  static getCache(uid: string): PermissionCache | null {
    const cached = this.cache.get(uid);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(uid);
      return null;
    }
    return cached;
  }

  static clearCache(uid: string): void {
    this.cache.delete(uid);
  }
}
