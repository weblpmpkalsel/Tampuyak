import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkspaceState, WorkspaceMode, PresentationOverride } from './WorkspaceTypes';

interface WorkspaceContextValue {
  state: WorkspaceState;
  setMode: (mode: WorkspaceMode) => void;
  setOverride: (id: string, override: PresentationOverride) => void;
  getOverrideValue: (id: string, fallback: string) => string;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WorkspaceState>(() => {
    let initialOverrides = {};
    try {
      const saved = localStorage.getItem('tampuyak_document_overrides');
      if (saved) initialOverrides = JSON.parse(saved);
    } catch(e) {}
    return {
      workspaceMode: 'preview',
      selection: null,
      overrides: initialOverrides,
      zoom: 100,
    };
  });
  
  React.useEffect(() => {
    try {
      localStorage.setItem('tampuyak_document_overrides', JSON.stringify(state.overrides));
    } catch(e) {}
  }, [state.overrides]);

  const setMode = (mode: WorkspaceMode) => {
    setState((prev) => ({ ...prev, workspaceMode: mode }));
  };

  const setOverride = (id: string, override: PresentationOverride) => {
    setState((prev) => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        [id]: override,
      },
    }));
  };

  const getOverrideValue = (id: string, fallback: string): string => {
    return state.overrides[id]?.value ?? fallback;
  };

  return (
    <WorkspaceContext.Provider value={{ state, setMode, setOverride, getOverrideValue }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
