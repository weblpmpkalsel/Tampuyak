with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

replacement = """    {
      target: '#tour-analisis',
      content: 'Langkah 2: Lakukan Analisis Sekolah.',
    },
    {
      target: '#tour-unggah-rapor',
      content: 'Penting: Di dalam menu Analisis Sekolah, klik tombol ini untuk mengunggah file Rapor Pendidikan hasil unduhan Anda agar aplikasi bisa memberikan rekomendasi dan capaian otomatis.',
    },"""

content = content.replace("""    {
      target: '#tour-analisis',
      content: 'Langkah 2: Lakukan Analisis Sekolah. Di dalam menu ini, Anda dapat mengunggah file Rapor Pendidikan hasil unduhan Anda untuk melihat capaian dan rekomendasi.',
    },""", replacement)

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
