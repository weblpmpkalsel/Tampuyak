const fs = require('fs');
let code = fs.readFileSync('src/workspace/EditableRegion.tsx', 'utf8');

code = code.replace(
  /const applyEdit = \(\) => \{\n\s*if \(draftValue !== currentValue\) \{/,
  `const applyEdit = () => {
    if (!draftValue.trim()) {
      alert("Teks tidak boleh kosong.");
      setDraftValue(currentValue);
      setIsEditing(false);
      return;
    }
    if (draftValue !== currentValue) {`
);

fs.writeFileSync('src/workspace/EditableRegion.tsx', code);
console.log("Patched EditableRegion validation");
