import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Generic cards
content = content.replace(/bg-white border border-slate-\d+ rounded-xl shadow-sm/g, 'enterprise-card');
content = content.replace(/bg-white border border-slate-\d+ rounded-2xl shadow-sm/g, 'enterprise-card');
content = content.replace(/bg-white rounded-xl border border-slate-\d+ shadow-sm/g, 'enterprise-card');
content = content.replace(/bg-white rounded-2xl border border-slate-\d+ shadow-sm/g, 'enterprise-card');
content = content.replace(/bg-white rounded-\[24px\] p-6 border border-slate-300 shadow-sm/g, 'enterprise-card p-6');
content = content.replace(/bg-white p-6 rounded-xl border border-slate-\d+ shadow-sm/g, 'enterprise-card p-6');
content = content.replace(/bg-white border border-slate-\d+ rounded-lg shadow-sm/g, 'enterprise-card');
content = content.replace(/bg-white rounded border border-slate-\d+ shadow-sm/g, 'enterprise-card');

// Card headers
content = content.replace(/p-6 border-b border-slate-\d+ bg-slate-50/g, 'enterprise-card-header');
content = content.replace(/px-6 py-4 border-b border-slate-\d+ flex justify-between items-center bg-slate-50/g, 'enterprise-card-header');

// Tables
content = content.replace(/<table className="w-full text-sm text-left">/g, '<table className="enterprise-table">');
content = content.replace(/<table className="w-full text-left text-sm mt-4">/g, '<table className="enterprise-table mt-4">');
content = content.replace(/<thead className="text-xs font-bold text-\[var\(--color-eds-text-secondary\)\] uppercase tracking-wider bg-\[var\(--color-eds-bg\)\] sticky top-0 border-b border-\[var\(--color-eds-border\)\]">/g, '<thead>');
content = content.replace(/<tbody className="divide-y divide-\[var\(--color-eds-border\)\]">/g, '<tbody>');
content = content.replace(/<tr className="hover:bg-\[var\(--color-eds-bg\)\] transition-colors">/g, '<tr>');
content = content.replace(/<td className="py-3/g, '<td className="');
content = content.replace(/<th className="py-3/g, '<th className="');
content = content.replace(/<td className=" "/g, '<td className="');
content = content.replace(/<th className=" "/g, '<th className="');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Refactoring complete');
