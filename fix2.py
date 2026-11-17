with open("src/Tampuyak.tsx", "r") as f:
    content = f.read()

content = content.replace("  // Tour State\n  useEffect(() => {", "  // Tour State\n  const [runTour, setRunTour] = useState(false);\n  useEffect(() => {")

with open("src/Tampuyak.tsx", "w") as f:
    f.write(content)
