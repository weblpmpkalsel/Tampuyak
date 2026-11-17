import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { SupervisionRole } from './SupervisionPermissions';
import { UserRole } from '../../../services/firestore/userService';
import { auth } from '../../../lib/firebase';
import { getEffectiveUser } from '../../../services/auth/devAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { UserService } from '../../../services/firestore/userService';

interface SupervisionAuthContextProps {
  userRole: SupervisionRole | null;
  userId: string | null;
  workspaceId: string | null;
}

const SupervisionAuthContext = createContext<SupervisionAuthContextProps>({
  userRole: null,
  userId: null,
  workspaceId: null
});

export const useSupervisionAuth = () => useContext(SupervisionAuthContext);

export const SupervisionAuthProvider: React.FC<{ children: ReactNode; globalRole?: UserRole | null }> = ({ children, globalRole }) => {
  const [role, setRole] = useState<SupervisionRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const effectiveUser = getEffectiveUser(user);
      if (effectiveUser) {
        setUserId(effectiveUser.uid);
        try {
          const profile = await UserService.getUserProfile(effectiveUser.uid);
          if (profile) {
            setWorkspaceId(profile.organizationId || null);
            setRole('HEADMASTER'); 
          } else {
             setRole('HEADMASTER');
          }
        } catch (e) {
          console.error("Failed to load user profile for supervision auth", e);
          setRole('HEADMASTER');
        }
      } else {
        setUserId(null);
        setRole(null);
        setWorkspaceId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SupervisionAuthContext.Provider value={{ userRole: role, userId, workspaceId }}>
      {children}
    </SupervisionAuthContext.Provider>
  );
};
