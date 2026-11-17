import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = re.sub(
    r'\.gdds-title-doc\s*\{[^}]*\}',
    r'.gdds-title-doc { font-size: 16pt; font-weight: bold; text-transform: uppercase; text-align: center; margin-bottom: 24pt; line-height: 1.2; }',
    content
)

content = re.sub(
    r'\.gdds-title-bab\s*\{[^}]*\}',
    r'.gdds-title-bab { font-size: 14pt; font-weight: bold; text-transform: uppercase; text-align: center; margin-top: 0; margin-bottom: 24pt; line-height: 1.5; page-break-after: avoid; break-after: avoid; }',
    content
)

content = re.sub(
    r'\.gdds-heading-2\s*\{[^}]*\}',
    r'.gdds-heading-2 { font-size: 12pt; font-weight: bold; text-transform: capitalize; margin-top: 18pt; margin-bottom: 12pt; line-height: 1.5; page-break-after: avoid; break-after: avoid; }',
    content
)

content = re.sub(
    r'\.gdds-heading-3\s*\{[^}]*\}',
    r'.gdds-heading-3 { font-size: 12pt; font-weight: bold; margin-top: 18pt; margin-bottom: 12pt; line-height: 1.5; page-break-after: avoid; break-after: avoid; }',
    content
)

with open('src/index.css', 'w') as f:
    f.write(content)

