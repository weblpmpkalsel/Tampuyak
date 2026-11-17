import re

with open('src/EnterpriseDocumentViewer.tsx', 'r') as f:
    content = f.read()

content = content.replace("className={`mb-8 section-container ${applyPageBreak ? 'pt-8 ' : ''}`}", "className={`mb-8 section-container`}")

with open('src/EnterpriseDocumentViewer.tsx', 'w') as f:
    f.write(content)

