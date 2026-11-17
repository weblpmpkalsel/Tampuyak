with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

replacement = """    {
      target: '#tour-analisis',
      content: 'Langkah 2: Lakukan Analisis Sekolah. Di dalam menu ini, Anda dapat mengunggah file Rapor Pendidikan hasil unduhan Anda untuk melihat capaian dan rekomendasi.',
    },"""

content = content.replace("""    {
      target: '#tour-analisis',
      content: 'Langkah 2: Lakukan Analisis Sekolah (Rapor Pendidikan, dsb) untuk melihat capaian dan rekomendasi.',
    },""", replacement)

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
