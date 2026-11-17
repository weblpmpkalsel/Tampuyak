import re
with open('src/Tampuyak.tsx', 'r') as f:
    content = f.read()
    idx = content.find('label="Jenjang"')
    if idx != -1:
        start = max(0, idx - 500)
        end = min(len(content), idx + 1000)
        print(content[start:end])
