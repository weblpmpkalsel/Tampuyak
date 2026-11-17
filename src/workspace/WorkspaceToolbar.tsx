import React, { useState } from 'react';
import { 
  ArrowLeft, Search, ZoomIn, ZoomOut, Maximize, Minimize, 
  Printer, ShieldCheck, FileDown, Download, Edit3, Eye, Code, 
  Database, Save, Undo, Redo, Microscope, X, Moon, Sun, 
  CheckCircle2, XCircle, AlertTriangle, Paperclip, FileText
} from 'lucide-react';
import { useWorkspace } from './WorkspaceContext';
import { Button } from '../components/ui/button'; // Adjust import if needed

export interface WorkspaceToolbarProps {
  title?: React.ReactNode;
  onClose?: () => void;
  isDarkPreview?: boolean;
  setIsDarkPreview?: (dark: boolean) => void;
  showHealthModal?: boolean;
  setShowHealthModal?: (show: boolean) => void;
  healthScore?: number;
  isDraftReady?: boolean;
  isPrintReady?: boolean;
  healthChecks?: any[];
  chaptersComplete?: boolean;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  historyIndex?: number;
  historyLength?: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportPdf?: () => void;
  onExportDocx?: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  qaMode?: boolean;
  setQaMode?: (mode: boolean) => void;
  // Extensibility for custom tabs
  customTabs?: { id: string; label: string; icon: any }[];
}

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  title = "Enterprise Workspace",
  onClose,
  isDarkPreview = false,
  setIsDarkPreview,
  showHealthModal = false,
  setShowHealthModal,
  healthScore = 0,
  isDraftReady = true,
  isPrintReady = false,
  healthChecks = [],
  chaptersComplete = true,
  onSave,
  onUndo,
  onRedo,
  historyIndex = 0,
  historyLength = 0,
  activeTab,
  setActiveTab,
  onExportPdf,
  onExportDocx,
  zoom,
  setZoom,
  searchQuery,
  setSearchQuery,
  qaMode = false,
  setQaMode,
  customTabs = []
}) => {
  const { state: workspaceState, setMode: setWorkspaceMode } = useWorkspace();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        (/* console.log removed */ (..._args: any[]) => {})(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex-none bg-white border-b border-[var(--color-eds-border)] h-14 flex items-center justify-between px-4 shadow-sm z-30">
      <div className="flex items-center">
        {onClose && (
          <Button variant="ghost" className="h-9 px-3 mr-4 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        )}
        <div className="h-6 w-px bg-slate-300 mx-2"></div>
        <div className="flex items-center space-x-1 ml-2">
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
      </div>

      <div className="flex items-center">
        {/* Quality Gate Indicator */}
        {setShowHealthModal && (
          <div className="relative mr-4">
            <button 
              className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isPrintReady ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}
              onClick={() => setShowHealthModal(!showHealthModal)}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Score: {healthScore}%
            </button>
            
            {showHealthModal && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-[var(--color-eds-border)] rounded-xl shadow-xl z-50 p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-[var(--color-eds-text-primary)]">Sertifikasi & Kepatuhan</h4>
                  <button onClick={() => setShowHealthModal(false)} className="text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]"><X className="w-4 h-4" /></button>
                </div>
                
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-eds-text-primary)] mb-3 border-b border-slate-200 pb-2">Pre-Print Certification</h4>
                <div className="space-y-2">
                  {healthChecks.filter(c => c.type !== "optional").map(c => (
                    <div key={c.id} className="flex items-center justify-between text-sm">
                      <span className={c.valid ? "text-[var(--color-eds-text-primary)]" : (c.type === "mandatory" || c.type === "certification_only" ? "text-rose-600 font-medium" : "text-amber-600 font-medium")}>
                        {c.label} {c.type === "recommended" && "(Rec.)"}
                      </span>
                      {c.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : (c.type === "mandatory" || c.type === "certification_only" ? <XCircle className="w-4 h-4 text-rose-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />)}
                    </div>
                  ))}
                </div>
                
                {!chaptersComplete && (
                   <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                     <p className="text-xs text-amber-800 font-medium"><AlertTriangle className="w-3 h-3 inline mr-1" /> Beberapa bab tidak memiliki sumber data yang lengkap. Periksa tab Sertifikasi Data.</p>
                   </div>
                )}
                
                <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-center text-xs font-bold">
                  <span className={isDraftReady ? "text-emerald-600" : "text-amber-600"}>{isDraftReady ? "✓ DRAFT READY" : "⚠ BLOCKING ISSUES"}</span>
                  <span className={isPrintReady ? "text-emerald-600" : "text-[var(--color-eds-text-secondary)]"}>{isPrintReady ? "✓ CERTIFIED PDF/DOCX READY" : "CERTIFICATION PENDING"}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-6 w-px bg-slate-300 mx-2"></div>
        
        {onSave && (
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={onSave} title="Simpan Draf">
            <Save className="w-5 h-5" />
          </Button>
        )}
        {onUndo && (
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={onUndo} title="Undo" disabled={historyIndex === 0}>
            <Undo className="w-5 h-5" />
          </Button>
        )}
        {onRedo && (
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={onRedo} title="Redo" disabled={historyIndex >= historyLength - 1}>
            <Redo className="w-5 h-5" />
          </Button>
        )}
        
        <div className="h-6 w-px bg-slate-300 mx-2"></div>

        {/* Dynamic Tabs */}
        {customTabs.length > 0 ? customTabs.map(tab => (
          <Button key={tab.id} variant="ghost" className={`h-9 px-3 ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => setActiveTab(tab.id)} title={tab.label}>
            <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
          </Button>
        )) : (
          <Button variant="ghost" className={`w-9 h-9 p-0 ${activeTab === 'coverage' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => setActiveTab('coverage')} title="Cek Kelengkapan Data">
            <Database className="w-5 h-5" />
          </Button>
        )}

        {(!customTabs.length || customTabs.some(t => t.id === 'pratinjau')) && (
          <>
            <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'preview' && activeTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveTab("pratinjau"); setWorkspaceMode('preview'); }} title="Preview">
              <Eye className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'edit' && activeTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveTab("pratinjau"); setWorkspaceMode('edit'); }} title="Edit Mode">
              <Edit3 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'printPreview' && activeTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveTab("pratinjau"); setWorkspaceMode('printPreview'); }} title="Print Preview">
              <Printer className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'developer' && activeTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveTab("pratinjau"); setWorkspaceMode('developer'); }} title="Developer">
              <Code className="w-5 h-5" />
            </Button>
          </>
        )}
        
        <div className="h-6 w-px bg-slate-300 mx-2"></div>

        <Button variant="outline" className="h-9 px-3 gap-2 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => (() => { const guard = document.getElementById('print-guard'); if (guard) guard.style.setProperty('display', 'none', 'important'); window.print(); setTimeout(() => { if (guard) guard.style.removeProperty('display'); }, 500); })()} disabled={!isDraftReady} title="Cetak Draft">
          <Printer className="w-4 h-4" /> Print Draft
        </Button>
        
        <Button variant="default" className="h-9 px-3 gap-2 bg-blue-600 hover:bg-blue-700 text-white ml-2" onClick={() => (() => { const guard = document.getElementById('print-guard'); if (guard) guard.style.setProperty('display', 'none', 'important'); window.print(); setTimeout(() => { if (guard) guard.style.removeProperty('display'); }, 500); })()} disabled={!isPrintReady} title="Cetak Versi Tersertifikasi">
          <ShieldCheck className="w-4 h-4" /> Certified Print
        </Button>
        
        {onExportPdf && (
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={onExportPdf} title="Ekspor PDF" disabled={!isPrintReady}>
            <FileDown className="w-5 h-5 text-rose-600" />
          </Button>
        )}
        
        {onExportDocx && (
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={onExportDocx} title="Ekspor DOCX" disabled={!isPrintReady}>
            <Download className="w-5 h-5 text-[var(--color-eds-text-primary)] font-bold" />
          </Button>
        )}
        
        <div className="h-6 w-px bg-slate-300 mx-2"></div>

        <div className="flex items-center bg-slate-100 rounded-xl px-2 py-1 mr-2">
          <Button variant="ghost" className="w-7 h-7 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-200" onClick={() => setZoom(Math.max(50, zoom - 25))}><ZoomOut className="w-4 h-4" /></Button>
          <Button variant="ghost" className="w-auto min-w-[3rem] h-7 p-0 text-xs font-bold text-[var(--color-eds-text-primary)] hover:bg-slate-200 rounded" onClick={() => setZoom(100)} title="Reset Zoom">{zoom}%</Button>
          <Button variant="ghost" className="w-7 h-7 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-200" onClick={() => setZoom(Math.min(200, zoom + 25))}><ZoomIn className="w-4 h-4" /></Button>
        </div>

        <div className="relative">
           <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-eds-text-secondary)]" />
           <input maxLength={255} type="text" placeholder="Cari..." className="pl-9 pr-3 py-1.5 bg-slate-100 border-none rounded-xl text-sm w-40 focus:ring-2 focus:ring-blue-500 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (window as any).find(searchQuery); } }} />
        </div>

        <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2 transition-all" onClick={toggleFullscreen} title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}>
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </Button>
        
        {setQaMode && (
          <>
            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            <Button variant="ghost" className={`w-9 h-9 p-0 ${qaMode ? 'bg-purple-100 text-purple-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'} transition-all`} onClick={() => setQaMode(!qaMode)} title="Mode Inspeksi QA (GM-UAT)">
              <Microscope className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
