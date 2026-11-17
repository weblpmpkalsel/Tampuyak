import React from 'react';
import { KspPreviewWorkspace } from '../enterprise/workspace/preview/KspPreviewWorkspace';

export const KSPWorkspace = ({ 
  onClose,
  settings 
}: { 
  onClose: () => void;
  settings: any;
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative">
       <KspPreviewWorkspace onClose={onClose} />
    </div>
  );
};
