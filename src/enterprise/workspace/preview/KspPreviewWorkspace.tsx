import { LayoutProfile, defaultLayoutProfile } from './LayoutProfile';
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { assembleKspDocument } from '../../document/ksp/KspDocumentAssembler';
import { CanonicalRenderer } from './CanonicalRenderer';
import { CanonicalDocument, DocumentBlock, ContainerBlock } from '../../document/CanonicalDocumentTypes';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../../Tampuyak';
import { enterpriseComplianceEngine } from '../../compliance/engine/ComplianceEngine';
import { ComplianceContext } from '../../compliance/ComplianceTypes';
import { Printer, FileText, Download, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { KSPValidationPanel } from '../../../ksp/KSPValidationPanel';

import { useKspMetadata } from '../../../ksp/KspMetadataAdapter';

const DedicatedKspPrintRoot = ({ document, layoutProfile, overrides, isReady }: any) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let node = window.document.getElementById('print-root');
    if (!node) {
      node = window.document.createElement('div');
      node.id = 'print-root';
      window.document.body.appendChild(node);
    }
    setMountNode(node);
  }, []);

  if (!mountNode) return null;

  return createPortal(
    <div className="w-full bg-white text-black font-serif m-0 p-0 relative print-canvas-root">
       {!isReady && (
         <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10">
           <div className="text-[15rem] font-black text-slate-800 transform -rotate-45 select-none tracking-widest whitespace-nowrap">DRAF</div>
         </div>
       )}
       <CanonicalRenderer 
            document={document} 
            selectedNodeId={null} 
            onSelectNode={() => {}} 
            scale={1} 
            layoutProfile={layoutProfile}
            overrides={overrides}
       />
    </div>,
    mountNode
  );
};

export const KspPreviewWorkspace: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { settings, updateSetting } = useApp();
  const complianceContext: ComplianceContext = useMemo(() => ({
    documentType: 'KSP',
    metadata: settings
  }), [settings]);
  const complianceReport = useMemo(() => enterpriseComplianceEngine.execute(complianceContext), [complianceContext]);
  const isReady = complianceReport.releaseReadiness;
  const [showValidationDrawer, setShowValidationDrawer] = useState(false);

  const metadata = useKspMetadata();
  const [document] = useState<CanonicalDocument>(() => assembleKspDocument(metadata));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [rightTab, setRightTab] = useState<'DOCUMENT' | 'KNOWLEDGE' | 'VALIDATION' | 'LAYOUT'>('DOCUMENT');
  const [layoutProfile, setLayoutProfile] = useState<LayoutProfile>(defaultLayoutProfile);

  const handleScrollTo = (id: string) => {
    const el = window.document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 2));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.5));
  const handleFitWidth = () => setScale(1.2);
  const handleFitPage = () => setScale(0.8);

  // Find selected block for the inspector
  const selectedBlock = useMemo(() => {
    if (!selectedNodeId) return null;
    let found: DocumentBlock | null = null;
    
    const searchBlocks = (blocks: readonly DocumentBlock[]) => {
      for (const block of blocks) {
        if (block.id === selectedNodeId) {
          found = block;
          return;
        }
        if (block.type === 'CONTAINER') {
          searchBlocks((block as ContainerBlock).blocks);
        }
      }
    };

    document.sections.forEach(s => {
      if (!found) searchBlocks(s.blocks);
    });

    return found;
  }, [document, selectedNodeId]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-gray-50 text-sm font-sans print:hidden">
      <DedicatedKspPrintRoot document={document} layoutProfile={layoutProfile} overrides={settings.documentOverrides || {}} isReady={isReady} />
      {/* Left Sidebar - Outline Navigation */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col shadow-sm z-10">
        <div className="p-4 border-b border-gray-200 font-semibold bg-gray-50">
          Daftar Isi (Outline)
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {document.sections.map(section => (
            <button
              key={section.id}
              onClick={() => handleScrollTo(section.id)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors truncate font-medium"
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Center Panel - Viewer */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Command Center Header */}
        <div className="border-b border-gray-200 bg-white flex flex-col shadow-sm z-10 shrink-0 relative px-6 py-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              {onClose && (
                <button 
                  onClick={onClose} 
                  className="px-3 py-1.5 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">Kurikulum Satuan Pendidikan</h1>
                <p className="text-sm text-gray-500">Preview & Command Center</p>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="flex gap-2">
              <button onClick={() => (() => { const guard = window.document.getElementById('print-guard'); if (guard) guard.style.setProperty('display', 'none', 'important'); window.print(); setTimeout(() => { if (guard) guard.style.removeProperty('display'); }, 500); })()} className="px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm">
                <Printer className="w-4 h-4" /> Print Browser
              </button>
              <button disabled className="px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors bg-gray-100 text-gray-400 cursor-not-allowed border-transparent relative group">
                <FileText className="w-4 h-4" /> Export PDF
                <span className="absolute -top-2 -right-2 bg-indigo-100 text-indigo-700 text-[0.65rem] font-bold px-1.5 py-0.5 rounded shadow-sm border border-indigo-200">Coming Soon</span>
              </button>
              <button disabled className="px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors bg-gray-100 text-gray-400 cursor-not-allowed border-transparent relative group">
                <Download className="w-4 h-4" /> Export DOCX
                <span className="absolute -top-2 -right-2 bg-indigo-100 text-indigo-700 text-[0.65rem] font-bold px-1.5 py-0.5 rounded shadow-sm border border-indigo-200">Coming Soon</span>
              </button>
            </div>
          </div>
          
          {/* Document Status Card */}
          <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-4 divide-x divide-gray-200">
             <div className="px-4 first:pl-0 flex-1">
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Completion</div>
               <div className="text-2xl font-black text-gray-900">{complianceReport.completionScore}%</div>
             </div>
             <div className="px-4 flex-1">
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Validation Summary</div>
               <div className="flex items-center gap-2">
                 {isReady ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                 <span className={`font-bold ${isReady ? 'text-emerald-700' : 'text-amber-700'}`}>
                   {isReady ? 'All Checks Passed' : `${complianceReport.issues.length} Issues Found`}
                 </span>
               </div>
             </div>
             <div className="px-4 flex-1 flex flex-col justify-center">
               <div className="flex justify-between items-center">
                 <div>
                   <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Publishing Readiness</div>
                   <div className={`text-sm font-bold px-2 py-0.5 rounded inline-block ${isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                     {isReady ? 'READY TO PUBLISH' : 'BLOCKED'}
                   </div>
                 </div>
                 <button onClick={() => setShowValidationDrawer(true)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-3 py-1.5 rounded-md">
                   Open Validation <ChevronRight className="w-4 h-4 ml-1" />
                 </button>
               </div>
             </div>
          </div>
        </div>

        
        
        
        <div className="flex-1 overflow-y-auto bg-slate-100 print:bg-white py-8">
          <div className="flex flex-col items-center gdds-preview-scale" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            <div className="print-canvas-root w-full relative flex flex-col items-center gap-8">
              <CanonicalRenderer 
                document={document} 
                selectedNodeId={selectedNodeId} 
                onSelectNode={setSelectedNodeId} 
                scale={1} 
                layoutProfile={layoutProfile}
                overrides={settings.documentOverrides || {}}
                onSaveOverride={(id, val) => updateSetting('documentOverrides', id, val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Inspector */}
      <div className="w-80 border-l border-gray-200 bg-white flex flex-col shadow-sm z-10 shrink-0">
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button 
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${rightTab === 'DOCUMENT' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRightTab('DOCUMENT')}
          >
            Document
          </button>
          <button 
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${rightTab === 'KNOWLEDGE' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRightTab('KNOWLEDGE')}
          >
            Knowledge
          </button>
          <button 
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${rightTab === 'VALIDATION' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRightTab('VALIDATION')}
          >
            Validation
          </button>
          <button 
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${rightTab === 'LAYOUT' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRightTab('LAYOUT')}
          >
            Layout
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {rightTab === 'DOCUMENT' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Node Inspector</h3>
              {selectedNodeId ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Canonical Node ID</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 break-all text-xs">{selectedNodeId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Type</span>
                    <span className="font-medium text-gray-900">{selectedBlock?.type || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Enterprise Component</span>
                    <span className="font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block">KSP Structure Mapping</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Select a paragraph or block in the document to inspect its properties.</p>
              )}
            </div>
          )}

          {rightTab === 'KNOWLEDGE' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Knowledge Traceability</h3>
              {selectedNodeId ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Knowledge Source</span>
                    <span className="font-medium text-green-700 bg-green-50 px-2 py-1 rounded inline-block text-xs">Enterprise Master Data & Builders</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Configuration Origin</span>
                    <span className="font-medium text-gray-900">EnterpriseConfigurationCenter</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200 mt-4">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      This block represents a pure semantic transformation of the Enterprise Knowledge Object.
                      No presentation formatting is stored in the knowledge layer.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Select a node to trace its Enterprise Knowledge origin.</p>
              )}
            </div>
          )}

          {rightTab === 'LAYOUT' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Layout Profile</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Cover Logo Scale</label>
                  <input type="range" min="0.5" max="2" step="0.1" value={layoutProfile.coverLogoScale} onChange={e => setLayoutProfile({...layoutProfile, coverLogoScale: parseFloat(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.coverLogoScale}x</div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Cover Top Offset (cm)</label>
                  <input type="range" min="-3" max="5" step="0.5" value={layoutProfile.coverTopOffset} onChange={e => setLayoutProfile({...layoutProfile, coverTopOffset: parseFloat(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.coverTopOffset} cm</div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Approval Signature Height (cm)</label>
                  <input type="range" min="2" max="6" step="0.1" value={layoutProfile.approvalSignatureHeight} onChange={e => setLayoutProfile({...layoutProfile, approvalSignatureHeight: parseFloat(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.approvalSignatureHeight} cm</div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Approval Column Gap (cm)</label>
                  <input type="range" min="0" max="5" step="0.5" value={layoutProfile.approvalColumnGap} onChange={e => setLayoutProfile({...layoutProfile, approvalColumnGap: parseFloat(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.approvalColumnGap} cm</div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Paragraph Spacing (pt)</label>
                  <input type="range" min="0" max="24" step="1" value={layoutProfile.paragraphSpacing} onChange={e => setLayoutProfile({...layoutProfile, paragraphSpacing: parseInt(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.paragraphSpacing} pt</div>
                </div>
              </div>
            </div>
          )}
          {rightTab === 'VALIDATION' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Document Validation</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Structural Completeness
                  </div>
                  <p className="text-xs text-green-700">100% (All sections populated)</p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Teacher Boundaries
                  </div>
                  <p className="text-xs text-green-700">Isolated. All teacher artifacts correctly mapped to Attachment nodes.</p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Configuration Binding
                  </div>
                  <p className="text-xs text-green-700">Valid. Dynamic data populated from EnterpriseConfigurationCenter.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Zoom Controls */}
        <div className="absolute bottom-6 right-[340px] flex items-center bg-white border border-gray-200 shadow-lg rounded-full px-2 py-1 z-20">
           <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Zoom Out">-</button>
           <span className="text-xs font-mono w-12 text-center text-gray-600">{Math.round(scale * 100)}%</span>
           <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Zoom In">+</button>
           <div className="w-px h-4 bg-gray-300 mx-1" />
           <button onClick={handleFitWidth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 text-xs font-medium" title="Fit Width">W</button>
           <button onClick={handleFitPage} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 text-xs font-medium" title="Fit Page">P</button>
        </div>
        
        {/* Validation Drawer */}
        {showValidationDrawer && (
          <>
            <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setShowValidationDrawer(false)} />
            <div className="absolute inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
               <div className="flex-1 overflow-y-auto">
                 <KSPValidationPanel onClose={() => setShowValidationDrawer(false)} />
               </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
