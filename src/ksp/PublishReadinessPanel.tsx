import React, { useMemo } from 'react';
import { CheckCircle2, FileText, Download, Lock, ChevronRight, XCircle } from 'lucide-react';
import { useApp } from "../Tampuyak";
import { enterpriseComplianceEngine } from '../enterprise/compliance/engine/ComplianceEngine';
import { ComplianceContext } from '../enterprise/compliance/ComplianceTypes';
import { ComplianceIssue } from '../enterprise/compliance/contracts/ComplianceIssue';
import { RuleRegistry } from '../enterprise/compliance/registry/RuleRegistry';

export const PublishReadinessPanel = ({ onNavigate }: { onNavigate: (target: string) => void }) => {
  const { settings } = useApp();

  const complianceContext: ComplianceContext = useMemo(() => ({
    documentType: 'KSP',
    metadata: settings
  }), [settings]);

  const complianceReport = useMemo(() => enterpriseComplianceEngine.execute(complianceContext), [complianceContext]);
  
  const issues = complianceReport.issues;

  // Filter issues based on category or severity to map to missing items
  const missingItems = issues
    .filter((issue: ComplianceIssue) => issue.severity === 'Blocking' || issue.severity === 'Quality' || issue.severity === 'Attachment Required')
    .map((issue: ComplianceIssue) => {
      const rule = RuleRegistry.find(r => r.id === issue.ruleId);
      const category = rule?.category || 'Document';
      return {
        type: category.toLowerCase() === 'attachment' ? 'attachment' : 'document',
        title: issue.title,
        description: issue.description,
        status: issue.severity === 'Blocking' || issue.severity === 'Attachment Required' ? 'Missing' : 'Incomplete',
        actionLabel: category.toLowerCase() === 'attachment' ? 'Open Attachments' : 'Open Settings',
        onAction: () => onNavigate(category.toLowerCase() === 'attachment' ? 'attachments' : 'settings')
      };
    });

  const allRules = RuleRegistry.filter(r => r.appliesTo === 'KSP' && (r.severity === 'Blocking' || r.severity === 'Quality' || r.severity === 'Attachment Required'));
  
  const readyItems = allRules
    .filter(rule => !issues.find(issue => issue.ruleId === rule.id))
    .map(rule => ({
      type: rule.category.toLowerCase() === 'attachment' ? 'attachment' : 'document',
      title: rule.title,
      status: 'Complete'
    }));

  const isReady = missingItems.length === 0;
  
  const totalItems = missingItems.length + readyItems.length;
  const completionPercent = totalItems > 0 ? Math.round((readyItems.length / totalItems) * 100) : 100;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Publishing Workflow</h2>
          <p className="text-sm text-gray-500 mt-1">Document Readiness & Attachment Readiness</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-gray-900 tracking-tight">{completionPercent}%</span>
          <div className={`mt-1 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider inline-block ${isReady ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
            {isReady ? 'Publishing Status: Ready' : 'Publishing Status: Blocked'}
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
        <div className={`h-3 rounded-full transition-all duration-1000 ease-out ${isReady ? 'bg-emerald-600' : 'bg-indigo-600'}`} style={{ width: `${completionPercent}%` }}></div>
      </div>

      <div className="flex-1 space-y-6">
        {missingItems.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wider flex items-center mb-3">
              <XCircle className="w-4 h-4 mr-2" /> Required Actions ({missingItems.length})
            </h3>
            <div className="space-y-3">
              {missingItems.map((item, idx) => (
                <div key={idx} className="bg-rose-50 border border-rose-100 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mr-2">
                        {item.type === 'attachment' ? 'Attachment Readiness' : 'Document Readiness'}
                      </span>
                      <span className="font-bold text-gray-900">{item.title}</span>
                    </div>
                    <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full uppercase">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <button 
                    onClick={item.onAction}
                    className="flex items-center text-sm font-semibold text-rose-700 hover:text-rose-800 bg-white border border-rose-200 px-3 py-1.5 rounded shadow-sm transition-colors"
                  >
                    {item.actionLabel} <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center mb-3">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Completed Requirements ({readyItems.length})
          </h3>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg divide-y divide-emerald-100/50">
            {readyItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 text-sm">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mr-2">
                    {item.type === 'attachment' ? 'Attachment' : 'Document'}
                  </span>
                  <span className="font-medium text-gray-700">{item.title}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200 my-6"></div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <button disabled={!isReady} className={`flex items-center justify-center p-3 rounded-lg font-bold transition-colors ${isReady ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'}`}>
          {!isReady && <Lock className="w-4 h-4 mr-2" />}
          <FileText className="w-5 h-5 mr-2" />
          Publish PDF
        </button>
        <button disabled={!isReady} className={`flex items-center justify-center p-3 rounded-lg font-bold transition-colors ${isReady ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'}`}>
          {!isReady && <Lock className="w-4 h-4 mr-2" />}
          <Download className="w-5 h-5 mr-2" />
          Publish DOCX
        </button>
      </div>
    </div>
  );
};
