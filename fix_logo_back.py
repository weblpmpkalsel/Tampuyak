with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

content = content.replace('/tampuyak-icon.svg', '/tampuyak-icon.png')

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
