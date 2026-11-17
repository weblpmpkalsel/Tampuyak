import React, { useState } from 'react';
import { ValidationSummary as SummaryType } from '../EnterpriseValidationTypes';
import { ValidationSummary } from './ValidationSummary';
import { ValidationBadge } from './ValidationBadge';
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';

interface ValidationReportProps {
  summary: SummaryType;
}

export const ValidationReport: React.FC<ValidationReportProps> = ({ summary }) => {
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

  const toggleDomain = (domain: string) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }));
  };

  return (
    <div className="space-y-6">
      <ValidationSummary summary={summary} />
      
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-800 px-1">Domain Validation Details</h4>
        
        {summary.domainResults.map((domain) => (
          <div key={domain.domain} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div 
              className="px-4 py-3 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => toggleDomain(domain.domain)}
            >
              <div className="flex items-center gap-3">
                {expandedDomains[domain.domain] ? 
                  <ChevronDown className="w-4 h-4 text-slate-500" /> : 
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                }
                <span className="font-medium text-slate-700">{domain.domain}</span>
              </div>
              <ValidationBadge status={domain.status} />
            </div>
            
            {expandedDomains[domain.domain] && (
              <div className="p-4 border-t border-slate-100 space-y-4">
                {domain.ruleResults.map(rule => (
                  <div key={rule.ruleId} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{rule.ruleId}: {(rule as any).name || ""}</span>
                      <ValidationBadge status={rule.passed ? 'PASS' : 'ERROR'} />
                    </div>
                    
                    {!rule.passed && rule.issues.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {rule.issues.map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm bg-slate-50 p-2 rounded">
                            <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                              issue.severity === 'CRITICAL' ? 'text-rose-600' :
                              issue.severity === 'ERROR' ? 'text-red-500' :
                              issue.severity === 'WARNING' ? 'text-amber-500' : 'text-blue-500'
                            }`} />
                            <div>
                              <span className="font-semibold">{issue.field}:</span> {issue.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
