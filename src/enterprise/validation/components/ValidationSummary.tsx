import React from 'react';
import { ValidationSummary as SummaryType } from '../EnterpriseValidationTypes';
import { ValidationBadge } from './ValidationBadge';

interface ValidationSummaryProps {
  summary: SummaryType;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({ summary }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="font-semibold text-slate-800">Enterprise Data Quality</h3>
        <ValidationBadge status={summary.overallStatus} label={summary.overallStatus === 'PASS' ? 'Golden Quality' : 'Needs Review'} />
      </div>
      
      <div className="p-4 grid grid-cols-4 gap-4">
        <div className="text-center p-3 bg-rose-50 rounded-lg">
          <div className="text-2xl font-bold text-rose-700">{summary.criticalCount}</div>
          <div className="text-xs font-medium text-rose-600 uppercase tracking-wider mt-1">Critical</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-700">{summary.errorCount}</div>
          <div className="text-xs font-medium text-red-600 uppercase tracking-wider mt-1">Errors</div>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="text-2xl font-bold text-amber-700">{summary.warningCount}</div>
          <div className="text-xs font-medium text-amber-600 uppercase tracking-wider mt-1">Warnings</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{summary.infoCount}</div>
          <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mt-1">Info</div>
        </div>
      </div>
    </div>
  );
};
