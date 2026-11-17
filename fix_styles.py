with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

content = content.replace('''        styles={{
          options: {
            primaryColor: '#2563eb',
            zIndex: 10000,
          },
        }}''', '''        primaryColor="#2563eb"
        zIndex={10000}''')

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
