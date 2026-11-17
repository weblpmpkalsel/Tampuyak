with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

# Change button style and add id
old_button = """          <Button 
            icon={Upload} 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline"
          >
            Import Excel
          </Button>"""

new_button = """          <Button 
            id="tour-unggah-rapor"
            icon={Upload} 
            onClick={() => fileInputRef.current?.click()} 
            variant="primary"
          >
            Unggah Rapor Pendidikan
          </Button>"""

content = content.replace(old_button, new_button)

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
