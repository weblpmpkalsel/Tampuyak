import re

with open('src/EnterpriseDocumentViewer.tsx', 'r') as f:
    content = f.read()

content = content.replace('mt-4 mb-8', 'my-6')
content = content.replace('mb-8 mt-4', 'my-6')
content = content.replace('mb-8 mt-6', 'my-6')

with open('src/EnterpriseDocumentViewer.tsx', 'w') as f:
    f.write(content)

