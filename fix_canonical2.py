import re

with open('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'r') as f:
    content = f.read()

# Replace topMargin calculations
content = re.sub(r"const baseTopMargin = .*?;\s*const topMargin = .*?;", "", content, flags=re.DOTALL)

# Replace className
old_class = r"className={`bg-white shadow-lg print:shadow-none gdds-doc print-section-override \$\{isCover \? 'flex flex-col print:min-h-\[297mm\]' : ''\}`}"
new_class = r"className={`bg-white shadow-lg print:shadow-none gdds-doc gdds-page-wrapper print-section-override ${isCover ? 'text-center' : ''}`}"
content = re.sub(old_class, new_class, content)

# Remove minHeight and flex from inner div
old_style = r"""      style=\{\{
        width: `\$\{210 \* scale\}mm`,
        minHeight: `\$\{297 \* scale\}mm`,
        paddingTop: `\$\{topMargin \* scale\}cm`,
        paddingBottom: `\$\{3 \* scale\}cm`,
        paddingLeft: `\$\{4 \* scale\}cm`,
        paddingRight: `\$\{3 \* scale\}cm`,
        transformOrigin: 'top center',
        boxSizing: 'border-box'
      \}\}
    >
      <div className=\{`flex flex-col text-gray-900 \$\{isCover \? 'items-center justify-between text-center flex-grow h-full' : ''\}`\}"""

new_style = r"""      style={{
        width: `${210 * scale}mm`,
        paddingBottom: `${3 * scale}cm`,
        paddingLeft: `${4 * scale}cm`,
        paddingRight: `${3 * scale}cm`,
        transformOrigin: 'top center',
        boxSizing: 'border-box'
      }}
    >
      <div className={`text-gray-900 ${isCover ? 'text-center' : ''}`}"""

if old_style in content:
    content = content.replace(old_style, new_style)
    print("Style Replaced")
else:
    print("Style not found")

with open('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'w') as f:
    f.write(content)

