import React, { useState, useEffect } from 'react';
import { 
  Network, Activity, Layers, Play, CheckCircle2, AlertTriangle, 
  ArrowRight, ShieldCheck, FileSpreadsheet, BrainCircuit, Target, Clock, Wallet, BookOpen 
} from 'lucide-react';
import { KnowledgeGraph, SPKGNodeType, CanonicalObject, ChangeImpact, seedInitialGraph } from './SPKG';

const typeIcons: Record<string, any> = {
  'Priority': Target,
  'StrategicObjective': Activity,
  'StrategicProgram': Layers,
  'Activity': Play,
  'Budget': Wallet,
  'Indicator': BrainCircuit,
  'School': Network
};

export const SPKGView = () => {
  const [graph] = useState(() => {
    seedInitialGraph();
    return KnowledgeGraph.getInstance();
  });
  
  const [nodes, setNodes] = useState<CanonicalObject[]>([]);
  const [selectedNode, setSelectedNode] = useState<CanonicalObject | null>(null);
  const [simulatorMode, setSimulatorMode] = useState(false);
  const [simulatedImpact, setSimulatedImpact] = useState<ChangeImpact | null>(null);

  useEffect(() => {
    setNodes(graph.getNodesByType('School').concat(
      graph.getNodesByType('EducationReport'),
      graph.getNodesByType('Priority'),
      graph.getNodesByType('StrategicObjective'),
      graph.getNodesByType('StrategicProgram'),
      graph.getNodesByType('Activity'),
      graph.getNodesByType('Budget')
    ));
  }, [graph]);

  const handleSimulateChange = (nodeId: string) => {
    // Example: Simulating a 20% budget increase or target change
    const impact = (graph as any).calculateImpact(nodeId, {});
    // Add artificial simulation data for demo
    setSimulatedImpact({
      affectedModules: ['RKAS', 'RKT', 'Dashboard'],
      affectedDocuments: ['Kertas Kerja RKAS', 'RKT Tahunan'],
      affectedBudgets: impact.affectedBudgets + 5000000,
      affectedIndicators: ['Numerasi'],
      affectedTargets: ['Nilai 58 -> 82'],
      affectedCertification: true
    });
  };

  const handleApplyChange = () => {
    if (selectedNode) {
      // Apply change
      graph.updateNode(selectedNode.id, {
        description: selectedNode.description + ' (Updated via Simulator)'
      });
      setSimulatorMode(false);
      setSimulatedImpact(null);
      // Refresh nodes
      setNodes([...graph.getNodesByType('School').concat(
        graph.getNodesByType('EducationReport'),
        graph.getNodesByType('Priority'),
        graph.getNodesByType('StrategicObjective'),
        graph.getNodesByType('StrategicProgram'),
        graph.getNodesByType('Activity'),
        graph.getNodesByType('Budget')
      )]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-eds-bg)] p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-eds-text-primary)]">Strategic Planning Knowledge Graph</h1>
          <p className="text-[var(--color-eds-text-secondary)] font-medium mt-1">
            Single Source of Truth untuk seluruh perencanaan sekolah.
          </p>
        </div>
        <button 
          onClick={() => setSimulatorMode(!simulatorMode)}
          className={`flex items-center px-4 py-2 rounded-lg font-bold text-white shadow-sm transition-colors ${simulatorMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {simulatorMode ? <><AlertTriangle className="w-5 h-5 mr-2" /> Exit Simulator</> : <><Play className="w-5 h-5 mr-2" /> Planning Simulator</>}
        </button>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Graph Visualizer (List view for now) */}
        <div className="w-1/2 bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] p-4 overflow-y-auto">
          <h3 className="font-bold text-lg mb-4 text-[var(--color-eds-text-primary)] border-b pb-2">Knowledge Graph Nodes</h3>
          <div className="space-y-3">
            {nodes.map(node => {
              const Icon = typeIcons[node.type] || Network;
              return (
                <div 
                  key={node.id} 
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedNode?.id === node.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-bold text-sm text-[var(--color-eds-text-primary)]">{node.title}</div>
                      <div className="text-xs font-semibold text-[var(--color-eds-text-secondary)] uppercase">{node.type}</div>
                    </div>
                    {node.status === 'Active' && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Object Details & Simulator */}
        <div className="w-1/2 flex flex-col gap-6 overflow-y-auto">
          {selectedNode ? (
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] p-6">
              <div className="flex items-center mb-4">
                <Network className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="font-bold text-xl text-[var(--color-eds-text-primary)]">{selectedNode.title}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Type</p>
                  <p className="font-medium">{selectedNode.type}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Status</p>
                  <p className="font-medium">{selectedNode.status} (v{selectedNode.version})</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Description</p>
                  <p className="font-medium">{selectedNode.description}</p>
                </div>
              </div>

              {selectedNode.explainability && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center"><BrainCircuit className="w-4 h-4 mr-2" /> Explainability Engine</h4>
                  <p className="text-sm text-blue-800 font-medium">{selectedNode.explainability.reasoning}</p>
                  <div className="mt-2 text-xs text-blue-700 font-bold">Confidence: {selectedNode.explainability.confidenceScore}%</div>
                </div>
              )}

              {simulatorMode && (
                <div className="border-t border-dashed border-slate-300 pt-6">
                  <h4 className="font-bold text-lg mb-4 text-amber-700 flex items-center"><Play className="w-5 h-5 mr-2" /> Simulation Actions</h4>
                  <button 
                    onClick={() => handleSimulateChange(selectedNode.id)}
                    className="w-full bg-amber-100 text-amber-800 border border-amber-200 py-2 rounded-lg font-bold hover:bg-amber-200 transition-colors"
                  >
                    Simulate Target/Budget Change
                  </button>

                  {simulatedImpact && (
                    <div className="mt-6 bg-white border border-rose-200 rounded-lg p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                      <h5 className="font-black text-rose-800 mb-3 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Change Impact Engine</h5>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                          <span className="font-semibold text-slate-600">Affected Modules</span>
                          <span className="font-bold text-slate-900">{simulatedImpact.affectedModules.join(', ')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                          <span className="font-semibold text-slate-600">Affected Documents</span>
                          <span className="font-bold text-slate-900">{simulatedImpact.affectedDocuments.join(', ')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                          <span className="font-semibold text-slate-600">Budget Delta</span>
                          <span className="font-bold text-rose-600">+Rp {simulatedImpact.affectedBudgets.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                          <span className="font-semibold text-slate-600">Targets Altered</span>
                          <span className="font-bold text-emerald-600">{simulatedImpact.affectedTargets.join(', ')}</span>
                        </div>
                      </div>

                      <button 
                        onClick={handleApplyChange}
                        className="w-full mt-4 bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" /> Apply & Auto-Propagate Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] p-12 text-center text-[var(--color-eds-text-secondary)]">
              <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-medium text-lg">Pilih node dari Knowledge Graph untuk melihat detail atau menjalankan simulasi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
