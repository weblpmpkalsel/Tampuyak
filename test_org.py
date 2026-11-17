import re
with open('src/workspace/OrganizationSetup.tsx', 'r') as f:
    content = f.read()
    idx = content.find('name="educationLevel"')
    if idx != -1:
        start = max(0, idx - 200)
        end = min(len(content), idx + 500)
        print(content[start:end])
