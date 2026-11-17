import React, { ReactNode } from 'react';
import { SupervisionRole, SUPERVISION_PERMISSIONS } from './SupervisionPermissions';
import { useSupervisionAuth } from './SupervisionAuthContext';

export interface RoleGuardProps {
  allowedRoles: SupervisionRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback = null }) => {
  const { userRole } = useSupervisionAuth();
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export interface PermissionGuardProps {
  requiredPermission: keyof typeof SUPERVISION_PERMISSIONS;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ requiredPermission, children, fallback = null }) => {
  const { userRole } = useSupervisionAuth();
  
  if (!userRole) return <>{fallback}</>;
  
  const allowedRoles = SUPERVISION_PERMISSIONS[requiredPermission];
  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export interface OwnershipGuardProps {
  resourceOwnerId: string;
  overrideRoles?: SupervisionRole[]; 
  children: ReactNode;
  fallback?: ReactNode;
}

export const OwnershipGuard: React.FC<OwnershipGuardProps> = ({ 
  resourceOwnerId, 
  overrideRoles = ['HEADMASTER', 'SUPERVISOR'], 
  children, 
  fallback = null 
}) => {
  const { userRole, userId } = useSupervisionAuth();
  
  if (!userRole || !userId) return <>{fallback}</>;
  
  if (userId === resourceOwnerId || overrideRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
