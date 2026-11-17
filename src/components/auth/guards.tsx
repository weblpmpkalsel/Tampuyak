import React, { ReactNode } from 'react';
import { UserRole, UserProfile } from '../../services/firestore/userService';
import { PermissionService } from '../../services/auth/permissionService';

interface RoleGuardProps {
  userRole: UserRole | undefined | null;
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ userRole, allowedRoles, children, fallback = null }) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface OwnerGuardProps {
  userRole: UserRole | undefined | null;
  children: ReactNode;
  fallback?: ReactNode;
}

export const OwnerGuard: React.FC<OwnerGuardProps> = ({ userRole, children, fallback = null }) => {
  return <RoleGuard userRole={userRole} allowedRoles={['OWNER']} fallback={fallback}>{children}</RoleGuard>;
};

interface PermissionGuardProps {
  userRole: UserRole | undefined | null;
  requiredPermissions: 'manage_users' | 'manage_workspaces' | 'view_audit';
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ userRole, requiredPermissions, children, fallback = null }) => {
  let allowedRoles: UserRole[] = [];

  switch (requiredPermissions) {
    case 'manage_users':
      allowedRoles = ['OWNER', 'SUPER_ADMIN'];
      break;
    case 'manage_workspaces':
      allowedRoles = ['OWNER', 'SUPER_ADMIN', 'SCHOOL_ADMIN'];
      break;
    case 'view_audit':
      allowedRoles = ['OWNER', 'SUPER_ADMIN'];
      break;
    default:
      allowedRoles = ['OWNER']; // Fail safe
  }

  return <RoleGuard userRole={userRole} allowedRoles={allowedRoles} fallback={fallback}>{children}</RoleGuard>;
};

interface WorkspaceGuardProps {
  userProfile: UserProfile | null;
  targetWorkspaceId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const WorkspaceGuard: React.FC<WorkspaceGuardProps> = ({ userProfile, targetWorkspaceId, children, fallback = null }) => {
  if (!userProfile) return <>{fallback}</>;

  const cachedPerms = PermissionService.getCache(userProfile.uid);
  if (cachedPerms && cachedPerms.permissions.includes('access_all_schools')) {
    return <>{children}</>;
  }

  if (userProfile.workspaceId !== targetWorkspaceId) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
