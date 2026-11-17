with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

content = content.replace('onClick={() => setCurrentView("pengaturan")}', 'id="tour-pengaturan"\n            onClick={() => setCurrentView("pengaturan")}')

replacement = """    {
      target: '#tour-planning-intelligence',
      content: 'Langkah Tambahan: Gunakan fitur AI ini untuk memetakan benang merah perencanaan Anda secara visual dan strategis.',
    },
    {
      target: '#tour-pengaturan',
      content: 'Penting: Jangan lupa untuk melakukan Backup Data secara berkala di menu Pengaturan untuk mengamankan data sekolah Anda.',
    }"""

content = content.replace("""    {
      target: '#tour-planning-intelligence',
      content: 'Langkah Tambahan: Gunakan fitur AI ini untuk memetakan benang merah perencanaan Anda secara visual dan strategis.',
    }""", replacement)

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
