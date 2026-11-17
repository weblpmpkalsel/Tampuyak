import re

with open('src/EnterpriseDocumentViewer.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="gdds-signature-name mt-24"', 'className="gdds-signature-name"')

with open('src/EnterpriseDocumentViewer.tsx', 'w') as f:
    f.write(content)
