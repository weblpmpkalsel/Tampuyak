import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { OrganizationService } from '../services/firestore/organizationService';
import { auth } from '../lib/firebase';
import { UserService } from '../services/firestore/userService';
import { getEffectiveUser } from '../services/auth/devAuth';

export default function OrganizationGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    async function checkOrg() {
      try {
        const user = getEffectiveUser(auth.currentUser);
        console.log('[OrganizationGuard] Dev User Accepted');
        if (!user) {
          setLoading(false);
          return;
        }
        const profile = await UserService.getUserProfile(user.uid);
        
        if (profile && (profile.role === 'SUPER_ADMIN' || profile.role === 'OWNER')) {
          setHasProfile(true);
          setLoading(false);
          return;
        }

        if (profile && profile.workspaceId) {
          const orgProfile = await OrganizationService.getProfile(profile.workspaceId);
          if (orgProfile) {
            setHasProfile(true);
          }
        }
      } catch (error) {
        console.error("Error checking org profile", error);
      }
      setLoading(false);
    }
    checkOrg();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasProfile) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
