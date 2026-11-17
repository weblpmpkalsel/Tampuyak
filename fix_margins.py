import re

with open('src/index.css', 'r') as f:
    content = f.read()

# Fix @page portrait
content = re.sub(r'@page \{\s*size: A4 portrait;\s*margin: [^;]+;\s*(/\*.*?\*/)?\s*\}', '@page {\n      size: A4 portrait;\n      margin: 3cm 3cm 3cm 4cm;\n    }', content)
content = re.sub(r'@page portrait-page \{\s*size: A4 portrait;\s*margin: [^;]+;\s*\}', '@page portrait-page {\n      size: A4 portrait;\n      margin: 3cm 3cm 3cm 4cm;\n    }', content)

# Fix @page landscape
content = re.sub(r'@page landscape-page \{\s*size: A4 landscape;\s*margin: [^;]+;\s*\}', '@page landscape-page {\n      size: A4 landscape;\n      margin: 3cm 3cm 3cm 3cm;\n    }', content)

# Fix screen mode portrait
content = re.sub(r'\.workspace-mode-preview \.portrait-section, \.workspace-mode-edit \.portrait-section, \.workspace-mode-developer \.portrait-section \{\s*width: 210mm;\s*margin: 0 auto;\s*padding-bottom: 2.5cm;\s*padding-left: 2cm;\s*padding-right: 2cm;', '.workspace-mode-preview .portrait-section, .workspace-mode-edit .portrait-section, .workspace-mode-developer .portrait-section {\n             width: 210mm;\n             margin: 0 auto;\n             padding-top: 3cm;\n             padding-bottom: 3cm;\n             padding-left: 4cm;\n             padding-right: 3cm;', content)

content = re.sub(r'\.workspace-mode-printPreview \.portrait-section \{\s*width: 210mm;\s*margin: 0 auto;\s*padding-bottom: 2.5cm;\s*padding-left: 2cm;\s*padding-right: 2cm;', '.workspace-mode-printPreview .portrait-section {\n             width: 210mm;\n             margin: 0 auto;\n             padding-top: 3cm;\n             padding-bottom: 3cm;\n             padding-left: 4cm;\n             padding-right: 3cm;', content)

# Fix screen mode landscape
content = re.sub(r'\.landscape-section \{\s*width: 297mm;\s*margin-left: auto;\s*margin-right: auto;\s*padding-bottom: 1.5cm;\s*padding-left: 1.5cm;\s*padding-right: 1.5cm;', '.landscape-section {\n            width: 297mm;\n            margin-left: auto;\n            margin-right: auto;\n            padding-top: 3cm;\n            padding-bottom: 3cm;\n            padding-left: 3cm;\n            padding-right: 3cm;', content)


with open('src/index.css', 'w') as f:
    f.write(content)
