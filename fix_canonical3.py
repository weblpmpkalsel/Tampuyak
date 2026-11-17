import re

with open('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'r') as f:
    content = f.read()

# Replace topMargin calculations
content = re.sub(r"const baseTopMargin = .*?;\s*const topMargin = .*?;", "", content, flags=re.DOTALL)

old_style = """      style={{
        width: `${210 * scale}mm`,
        minHeight: `${297 * scale}mm`,
        paddingTop: `${topMargin * scale}cm`,
        paddingBottom: `${3 * scale}cm`,
        paddingLeft: `${4 * scale}cm`,
        paddingRight: `${3 * scale}cm`,
        transformOrigin: 'top center',
        boxSizing: 'border-box'
      }}
    >
      <div className={`flex flex-col text-gray-900 ${isCover ? 'items-center justify-between text-center flex-grow h-full' : ''}`} style={{ fontSize: `${scale}rem` }}>"""

new_style = """      style={{
        width: `${210 * scale}mm`,
        paddingBottom: `${3 * scale}cm`,
        paddingLeft: `${4 * scale}cm`,
        paddingRight: `${3 * scale}cm`,
        transformOrigin: 'top center',
        boxSizing: 'border-box'
      }}
    >
      <div className={`text-gray-900 ${isCover ? 'text-center' : ''}`} style={{ fontSize: `${scale}rem` }}>"""

if old_style in content:
    content = content.replace(old_style, new_style)
    print("Style Replaced")
else:
    print("Style not found")

with open('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'w') as f:
    f.write(content)

