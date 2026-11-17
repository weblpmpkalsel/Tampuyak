import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace(
    '.gdds-doc {',
    '.gdds-page-wrapper {\n    padding-top: 1cm;\n    box-sizing: border-box;\n}\n\n.gdds-doc {'
)

with open('src/index.css', 'w') as f:
    f.write(content)

