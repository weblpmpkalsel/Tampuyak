with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

content = content.replace('/tampuyak-icon.png', '/tampuyak-icon.svg')

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
