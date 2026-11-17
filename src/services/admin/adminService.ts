import { OrganizationService } from '../firestore/organizationService';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserService, UserProfile, UserRole } from '../firestore/userService';
import { WorkspaceService } from '../firestore/workspaceService';
import { AuditService, AuditAction } from '../firestore/auditService';

export class AdminService {
  /**
   * Only SUPER_ADMIN and OWNER can suspend users
   */
  static async suspendUser(actorUid: string, actorRole: UserRole, targetUid: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);
    
    // Cannot suspend OWNER
    const target = await UserService.getUserProfile(targetUid);
    if (!target) throw new Error('User not found');
    if (target.role === 'OWNER') throw new Error('Cannot modify OWNER');
    // SUPER_ADMIN cannot be suspended by another SUPER_ADMIN
    if (target.role === 'SUPER_ADMIN' && actorRole === 'SUPER_ADMIN') {
      throw new Error('Only OWNER can suspend SUPER_ADMIN');
    }

    await UserService.updateUserProfile(targetUid, { status: 'DISABLED' });
    await AuditService.logEvent(actorUid, actorRole, AuditAction.SUSPEND_USER, targetUid);
  }

  static async activateUser(actorUid: string, actorRole: UserRole, targetUid: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);
    const target = await UserService.getUserProfile(targetUid);
    if (!target) throw new Error('User not found');
    if (target.role === 'OWNER') throw new Error('Cannot modify OWNER');
    if (target.role === 'SUPER_ADMIN' && actorRole === 'SUPER_ADMIN') {
      throw new Error('Only OWNER can activate SUPER_ADMIN');
    }

    const updates: Partial<UserProfile> = { status: 'ACTIVE' };

    if (target.status === 'PENDING') {
      updates.role = 'SCHOOL_ADMIN' as any;
      const workspaceId = `ws_${target.npsn || targetUid}`;
      updates.workspaceId = workspaceId;

      
      try {
        await OrganizationService.createProfile(workspaceId, {
          schoolName: target.schoolName || '',
          npsn: target.npsn || '',
          nss: '',
          educationLevel: '',
          status: '',
          address: '',
          village: '',
          district: target.district || '',
          city: '',
          province: target.province || '',
          postalCode: '',
          phone: target.phone || '',
          email: target.email || '',
          website: '',
          principalName: target.principalName || '',
          principalNip: '',
          principalPhone: '',
          principalEmail: '',
          principalAppointmentDate: '',
          academicYear: '',
          semester: '',
          schoolVision: '',
          schoolMission: '',
          schoolMotto: ''
        });
      } catch (e) {
        console.error('Error creating organization profile:', e);
      }
    }

    await UserService.updateUserProfile(targetUid, updates);
    await AuditService.logEvent(actorUid, actorRole, AuditAction.ACTIVATE_USER, targetUid);
  }

    static async rejectUser(actorUid: string, actorRole: UserRole, targetUid: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);
    const target = await UserService.getUserProfile(targetUid);
    if (!target) throw new Error('User not found');
    if (target.role === 'OWNER') throw new Error('Cannot modify OWNER');
    if (target.role === 'SUPER_ADMIN' && actorRole === 'SUPER_ADMIN') {
      throw new Error('Only OWNER can reject SUPER_ADMIN');
    }
    await UserService.updateUserProfile(targetUid, { status: 'REJECTED' });
    await AuditService.logEvent(actorUid, actorRole, AuditAction.REJECT_USER, targetUid);
  }

static async changeUserRole(actorUid: string, actorRole: UserRole, targetUid: string, newRole: UserRole): Promise<void> {
    this.verifyAdminOrOwner(actorRole);

    const target = await UserService.getUserProfile(targetUid);
    if (!target) throw new Error('User not found');
    if (target.role === 'OWNER') throw new Error('Cannot modify OWNER');

    if (newRole === 'OWNER') throw new Error('Cannot manually promote to OWNER');
    if (newRole === 'SUPER_ADMIN' && actorRole !== 'OWNER') {
      throw new Error('Only OWNER can promote to SUPER_ADMIN');
    }
    if (target.role === 'SUPER_ADMIN' && actorRole !== 'OWNER') {
      throw new Error('Only OWNER can demote SUPER_ADMIN');
    }

    await UserService.updateUserProfile(targetUid, { role: newRole });
    await AuditService.logEvent(actorUid, actorRole, AuditAction.PROMOTE_ROLE, targetUid, { newRole });
  }

  static async approveWorkspace(actorUid: string, actorRole: UserRole, requestId: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);

    await WorkspaceService.approveWorkspaceRequest(requestId);
    await AuditService.logEvent(actorUid, actorRole, AuditAction.APPROVE_REQUEST, requestId);
  }

  static async rejectWorkspace(actorUid: string, actorRole: UserRole, requestId: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);

    await WorkspaceService.rejectWorkspaceRequest(requestId);
    await AuditService.logEvent(actorUid, actorRole, AuditAction.REJECT_REQUEST, requestId);
  }

  static async transferOwnership(currentOwnerUid: string, currentOwnerRole: UserRole, newOwnerUid: string): Promise<void> {
    if (currentOwnerRole !== 'OWNER') {
      throw new Error('Only current OWNER can transfer ownership');
    }
    const newOwner = await UserService.getUserProfile(newOwnerUid);
    if (!newOwner) throw new Error('New owner user not found');
    
    // Replace ownerUid inside system/platform
    const systemRef = doc(db, 'system', 'platform');
    await setDoc(systemRef, {
      ownerUid: newOwnerUid,
      ownerEmail: newOwner.email,
      transferredAt: serverTimestamp()
    }, { merge: true });

    // Demote current owner to SUPER_ADMIN, promote new owner to OWNER
    await UserService.updateUserProfile(newOwnerUid, { role: 'OWNER', status: 'ACTIVE', workspaceId: 'SYSTEM', approvalBypass: true }, currentOwnerRole);
    await UserService.updateUserProfile(currentOwnerUid, { role: 'SUPER_ADMIN', approvalBypass: false }, currentOwnerRole);
    await AuditService.logEvent(currentOwnerUid, currentOwnerRole, AuditAction.OWNER_TRANSFER, newOwnerUid);
  }

  private static verifyAdminOrOwner(role: UserRole) {
    if (role !== 'OWNER' && role !== 'SUPER_ADMIN' && role !== 'SCHOOL_ADMIN') {
      throw new Error('Insufficient permissions. Requires SCHOOL_ADMIN, SUPER_ADMIN, or OWNER');
    }
  }
}
