import { useContext } from 'react';
import { SupervisionContext } from './SupervisionContext';

export const useSupervision = () => {
  const context = useContext(SupervisionContext);
  if (context === undefined) {
    throw new Error('useSupervision must be used within a SupervisionProvider');
  }
  return context;
};
