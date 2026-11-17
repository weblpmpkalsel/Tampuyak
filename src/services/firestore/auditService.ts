import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserRole } from './userService';

export enum AuditAction {
  APPROVE_REQUEST = 'APPROVE_REQUEST',
  REJECT_REQUEST = 'REJECT_REQUEST',
  SUSPEND_USER = 'SUSPEND_USER',
  ACTIVATE_USER = 'ACTIVATE_USER',
  REJECT_USER = 'REJECT_USER',
  PROMOTE_ROLE = 'PROMOTE_ROLE',
  DEMOTE_ROLE = 'DEMOTE_ROLE',
  OWNER_TRANSFER = 'OWNER_TRANSFER'
}

export interface AuditLog {
  timestamp: any;
  actorUid: string;
  actorRole: UserRole;
  action: AuditAction;
  targetId: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  private static collectionName = 'auditLogs';

    static async logEvent(
    actorUid: string,
    actorRole: UserRole,
    action: AuditAction,
    targetId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const log: any = {
      timestamp: serverTimestamp(),
      actorUid,
      actorRole,
      action,
      targetId,
    };
    if (metadata) {
      // Sanitize to remove undefined values
      const sanitized = JSON.parse(JSON.stringify(metadata));
      log.metadata = Object.keys(sanitized).length > 0 ? sanitized : {};
    } else {
      log.metadata = {};
    }
    await addDoc(collection(db, this.collectionName), log);
  }
}
