import React, { useReducer, useMemo } from 'react';
import { SupervisionContext } from './SupervisionContext';
import { supervisionReducer, initialSupervisionState } from './SupervisionReducer';
import { SupervisionApplicationService } from '../application/SupervisionApplicationService';
import { SupervisionAuthProvider } from '../auth/SupervisionAuthContext';
import { SupervisionRepositoryFactory } from '../persistence/SupervisionRepositoryFactory';
import { seedInstruments } from '../persistence/firestore/SupervisionSeeder';
import { useEffect } from 'react';

export const SupervisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(supervisionReducer, initialSupervisionState);
  
  // Instansiasi Application Service murni tanpa injeksi dependencies database/storage
  const repositories = useMemo(() => SupervisionRepositoryFactory.getInstance(), []);
  const applicationService = useMemo(() => new SupervisionApplicationService(repositories), [repositories]);

  const value = useMemo(() => ({ state, dispatch, applicationService, repositories }), [state, applicationService, repositories]);

  useEffect(() => {
    seedInstruments().catch(console.error);
  }, []);


  return (
    <SupervisionAuthProvider>
      <SupervisionContext.Provider value={value}>
        {children}
      </SupervisionContext.Provider>
    </SupervisionAuthProvider>
  );
};
