const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

code = code.replace(
  /const handleSave = \(e: React\.MouseEvent\) => \{\n\s*e\.stopPropagation\(\);\n\s*if \(onSaveOverride\) \{/,
  `const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editText.trim()) {
      alert("Teks tidak boleh kosong.");
      return;
    }
    if (onSaveOverride) {`
);

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', code);
console.log("Patched CanonicalRenderer validation");
