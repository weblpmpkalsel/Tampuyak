import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace(
    '.gdds-list-item {',
    '.gdds-list-item {\n    page-break-inside: avoid;\n    break-inside: avoid;\n    orphans: 3;\n    widows: 3;'
)

with open('src/index.css', 'w') as f:
    f.write(content)

