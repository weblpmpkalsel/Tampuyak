import re

with open('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "sizeClass = 'font-bold text-3xl tracking-widest my-2';",
    "sizeClass = 'gdds-cover-title-1';"
)
content = content.replace(
    "sizeClass = 'font-bold text-xl tracking-wide my-1';",
    "sizeClass = 'gdds-cover-title-2';"
)
content = content.replace(
    "sizeClass = 'font-bold text-lg my-1';",
    "sizeClass = 'gdds-cover-title-3';"
)
content = content.replace(
    "sizeClass = 'font-bold text-base my-1';",
    "sizeClass = 'gdds-cover-text';"
)
content = content.replace(
    "let pClass = isCover || isApproval ? 'gdds-p-no-indent text-center' : 'gdds-p';",
    "let pClass = isCover ? 'gdds-cover-text' : isApproval ? 'gdds-p-no-indent text-center' : 'gdds-p';"
)

with open('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'w') as f:
    f.write(content)

