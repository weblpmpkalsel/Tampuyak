import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { UserService, UserProfile } from '../services/firestore/userService';
import { PermissionService } from '../services/auth/permissionService';

import { isDevAuthBypass, DEV_USER, DEV_PROFILE } from '../services/auth/devAuth';

interface PortalDashboardGuardProps {
  children: React.ReactNode;
}

export default function PortalDashboardGuard({ children }: PortalDashboardGuardProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDevAuthBypass()) {
      console.log('[PortalDashboardGuard] Bypass Active');
      setUser(DEV_USER);
      setProfile(DEV_PROFILE);
      PermissionService.setCache(DEV_PROFILE);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const syncedProfile = await UserService.syncUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || ''
          });
          
          setProfile(syncedProfile);
          PermissionService.setCache(syncedProfile); import("../services/admin/identityTraceService").then(m => m.IdentityTraceService.recordLoginTrace(firebaseUser, syncedProfile));
        } catch (error) {
          console.error("Error syncing profile:", error);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/unauthorized" replace />;
  }

  
  if (profile.role === 'OWNER') {
    return <Navigate to="/control" replace />;
  }

  if (profile.status === 'PENDING') {
    return <Navigate to="/pending" replace />;
  }

  if (profile.status === 'REJECTED') {
    return <Navigate to="/rejected" replace />;
  }
  
  if (profile.status === 'DISABLED') {
    return <Navigate to="/unauthorized" replace />;
  }

  // At this point, the user is ACTIVE and authorized
  // The Tampuyak OS core component handles its internal routing.
  return <>{children}</>;
}
