import re

with open('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'r') as f:
    content = f.read()

content = content.replace("paddingBottom: `${3 * scale}cm`,", "paddingTop: `${3 * scale}cm`,\n        paddingBottom: `${3 * scale}cm`,")

with open('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'w') as f:
    f.write(content)
