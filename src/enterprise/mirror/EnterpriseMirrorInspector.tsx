import React, { useState, useEffect } from 'react';
import { EnterpriseMirrorService, MirrorSummary } from './EnterpriseMirrorService';

export const EnterpriseMirrorInspector = ({ settings }: { settings: any }) => {
  const [summary, setSummary] = useState<MirrorSummary | null>(null);

  useEffect(() => {
    if (settings) {
      setSummary(EnterpriseMirrorService.runMirrorAudit(settings));
    }
  }, [settings]);

  if (!summary) return <div className="p-6">Loading Inspector...</div>;

  return (
    <div className="p-6 bg-white rounded-xl border border-[var(--color-eds-border)] shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-eds-text-primary)]">
          Enterprise Mirror Inspector
        </h2>
        <p className="text-sm text-[var(--color-eds-text-secondary)] mt-1">
          Read-only view of data synchronization between Master Data and Workspace Data.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="text-sm font-medium text-gray-500">Total Domains</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{summary.totalDomains}</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <div className="text-sm font-medium text-emerald-700">Synchronized</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{summary.synchronizedDomains}</div>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="text-sm font-medium text-amber-700">Conflicted</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{summary.conflictedDomains}</div>
        </div>
      </div>

      <div className="space-y-4">
        {summary.results.map((result, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className={`p-4 flex items-center justify-between ${result.isSynchronized ? 'bg-gray-50' : 'bg-amber-50/50'}`}>
              <h3 className="font-semibold text-gray-900">{result.domain}</h3>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${result.isSynchronized ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {result.isSynchronized ? 'IDENTICAL' : 'CONFLICT'}
              </span>
            </div>
            
            {!result.isSynchronized && result.conflicts.length > 0 && (
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="overflow-x-auto">
                  <div className="overflow-x-auto w-full pb-4"><table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="py-3 px-4 font-semibold text-gray-600 bg-gray-50 rounded-l-md">Field</th>
                        <th className="py-3 px-4 font-semibold text-gray-600 bg-gray-50">Master Value</th>
                        <th className="py-3 px-4 font-semibold text-gray-600 bg-gray-50">Workspace Value</th>
                        <th className="py-3 px-4 font-semibold text-gray-600 bg-gray-50 rounded-r-md">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {result.conflicts.map((conflict, cIdx) => (
                        <tr key={cIdx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-800">{conflict.field}</td>
                          <td className="py-3 px-4">
                            <div className="max-w-[200px] truncate text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                              {JSON.stringify(conflict.masterValue) || 'Empty/Undefined'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="max-w-[200px] truncate text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                              {JSON.stringify(conflict.workspaceValue) || 'Empty/Undefined'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono border border-gray-200">
                              {conflict.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-xs text-center text-gray-400">
        Last Checked: {new Date(summary.lastRun).toLocaleTimeString()} • Read Only Mode
      </div>
    </div>
  );
};
