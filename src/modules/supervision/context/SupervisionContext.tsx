import React, { createContext } from 'react';
import { SupervisionRootState } from '../state/SupervisionState';
import { SupervisionAction } from './SupervisionActions';
import { SupervisionApplicationService } from '../application/SupervisionApplicationService';
import { ISupervisionRepositoryFactory } from '../persistence/ISupervisionRepositories';

export interface SupervisionContextProps {
  state: SupervisionRootState;
  dispatch: React.Dispatch<SupervisionAction>;
  applicationService: SupervisionApplicationService;
  repositories: ISupervisionRepositoryFactory;
}

export const SupervisionContext = createContext<SupervisionContextProps | undefined>(undefined);
