import React, { useState } from 'react';
import { workspaceModuleRegistry } from './registry/WorkspaceModuleRegistry';
import { useApp } from '../../Tampuyak';
import { X } from 'lucide-react';

export const EnterpriseWorkspaceShell = ({ onClose, initialModuleId }: { onClose?: () => void, initialModuleId?: string }) => {
  const { settings, updateSetting } = useApp();
  const [activeModuleId, setActiveModuleId] = useState(initialModuleId || workspaceModuleRegistry[0].id);

  const ActiveModuleComponent = workspaceModuleRegistry.find(m => m.id === activeModuleId)?.component || workspaceModuleRegistry[0].component;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Workspace Enterprise KSP</h1>
          <p className="text-sm text-slate-500 mt-1">
            Workspace generasi baru untuk KSP Gold. Lingkungan ini terisolasi dari sistem RKJM, RKT, dan RKAS versi lama.
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
  

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Navigation Container */}
        <div className="w-64 flex flex-col gap-1 border-r border-slate-200 pr-6 overflow-y-auto">
          {workspaceModuleRegistry.map(module => {
            const Icon = module.icon;
            const isActive = activeModuleId === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => setActiveModuleId(module.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mr-3 transition-colors ${
                    isActive 
                      ? "text-white" 
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {module.label}
                {module.isFuture && (
                  <span className="ml-auto text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                    WIP
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0 overflow-y-auto bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
          <ActiveModuleComponent settings={settings} updateSetting={updateSetting} activeModuleId={activeModuleId} />
        </div>
      </div>
    </div>
  );
};
