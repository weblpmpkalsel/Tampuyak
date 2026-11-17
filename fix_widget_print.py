with open("src/components/TanyaTampuyakWidget.tsx", "r") as f:
    content = f.read()

content = content.replace('className="fixed bottom-6 right-6', 'className="print:hidden fixed bottom-6 right-6')
content = content.replace('className={`fixed z-50', 'className={`print:hidden fixed z-50')

with open("src/components/TanyaTampuyakWidget.tsx", "w") as f:
    f.write(content)
