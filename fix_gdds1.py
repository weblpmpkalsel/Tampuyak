import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace(".gdds-page-wrapper {\n    padding-top: 1cm;\n    box-sizing: border-box;\n}", ".gdds-page-wrapper {\n    box-sizing: border-box;\n}")

with open('src/index.css', 'w') as f:
    f.write(content)
