import re

with open('src/EnterpriseDocumentViewer.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className={`${orientationClass}`}',
    'className={`${orientationClass} gdds-page-wrapper`}'
)
content = content.replace(
    'className={`flex flex-col justify-center items-center text-center box-border portrait-section print-no-break py-4 md:py-8 w-full min-h-[22cm] max-h-[26cm] gap-6 md:gap-8`}',
    'className={`portrait-section gdds-page-wrapper text-center print-no-break`}'
)
content = content.replace(
    'className={`portrait-section`}',
    'className={`portrait-section gdds-page-wrapper`}'
)

with open('src/EnterpriseDocumentViewer.tsx', 'w') as f:
    f.write(content)

