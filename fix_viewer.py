import re

with open('src/EnterpriseDocumentViewer.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="text-xl font-bold uppercase text-slate-900 leading-tight"',
    'className="gdds-cover-title-3"'
)
content = content.replace(
    'className="text-2xl font-black uppercase text-slate-900 leading-tight mt-2"',
    'className="gdds-cover-title-2"'
)
content = content.replace(
    'className="text-4xl font-black text-slate-900 uppercase tracking-widest leading-tight"',
    'className="gdds-cover-title-1"'
)
content = content.replace(
    'className="text-2xl font-black text-slate-900 mt-4 uppercase"',
    'className="gdds-cover-title-2"'
)
content = content.replace(
    'className="text-xl font-bold text-slate-900 mt-12 uppercase tracking-widest"',
    'className="gdds-cover-title-3 mt-12"'
)
content = content.replace(
    'className="text-xl font-bold text-slate-900 mt-2 uppercase tracking-wider"',
    'className="gdds-cover-title-3"'
)
content = content.replace(
    'className="text-lg font-bold text-slate-900"',
    'className="gdds-cover-text font-bold"'
)
content = content.replace(
    'className="text-lg font-bold text-slate-900 mt-1"',
    'className="gdds-cover-text font-bold"'
)


with open('src/EnterpriseDocumentViewer.tsx', 'w') as f:
    f.write(content)

