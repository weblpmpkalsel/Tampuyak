import re

with open('src/EnterpriseDocumentViewer.tsx', 'r') as f:
    content = f.read()

content = content.replace("padding-left: 0 !important; padding-right: 0 !important; padding-bottom: 0 !important;", "padding-top: 0 !important; padding-left: 0 !important; padding-right: 0 !important; padding-bottom: 0 !important;")

with open('src/EnterpriseDocumentViewer.tsx', 'w') as f:
    f.write(content)
