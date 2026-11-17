const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// 1. handleArrayChange
const targetArrayChange = `  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArr = [...(formData[field as keyof typeof formData] as string[])];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };`;
const replacementArrayChange = `  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArr = [...(formData[field as keyof typeof formData] as any[])];
    if (typeof newArr[index] === 'object') {
       newArr[index] = { ...newArr[index], nama: value };
    } else {
       newArr[index] = value;
    }
    setFormData({ ...formData, [field]: newArr });
  };`;
code = code.replace(targetArrayChange, replacementArrayChange);

// 2. handleAddArrayItem
const targetAddArrayItem = `  const handleAddArrayItem = (field: string) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field as keyof typeof formData] as string[]), ""],
    });
  };`;
const replacementAddArrayItem = `  const handleAddArrayItem = (field: string) => {
    let newItem: any = "";
    if (field === "kegiatan") {
      newItem = { id: \`keg-\${Date.now()}\`, nama: "", programId: null, status: "DRAFT" };
    } else if (field === "program") {
      newItem = { id: \`prog-\${Date.now()}\`, nama: "", kebijakanId: null, status: "DRAFT" };
    } else {
      newItem = { id: \`\${field}-\${Date.now()}\`, nama: "", status: "DRAFT" };
    }
    setFormData({
      ...formData,
      [field]: [...(formData[field as keyof typeof formData] as any[]), newItem],
    });
  };`;
code = code.replace(targetAddArrayItem, replacementAddArrayItem);

// 3. renderEditableList
// Wait, I will just replace the specific lines inside renderEditableList
// In isEditing mode
code = code.replace(
  /\{\(formData\[field as keyof typeof formData\] as string\[\]\)\.map\(/,
  "{(formData[field as keyof typeof formData] as any[]).map("
);

// In read-only mode
const targetReadOnly = `        <ul className="space-y-2">
          {(analisis.data[field as keyof typeof analisis.data] as string[]).map(
            (item: string, idx: number) => (
              <li key={idx} className="text-sm text-[var(--color-eds-text-secondary)] flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                {item}
              </li>
            )
          )}
        </ul>`;
const replacementReadOnly = `        <ul className="space-y-2">
          {(analisis.data[field as keyof typeof analisis.data] as any[]).map(
            (item: any, idx: number) => (
              <li key={idx} className="text-sm text-[var(--color-eds-text-secondary)] flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2"></div>
                {typeof item === 'object' ? (item.nama || item.name || "") : item}
              </li>
            )
          )}
        </ul>`;
code = code.replace(targetReadOnly, replacementReadOnly);

// 4. TargetEditableItem
const targetTargetEditable = `const TargetEditableItem = ({ item, idx, field, handleArrayChange }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        value={item}
        onFocus={() => setIsFocused(true)}`;
const replacementTargetEditable = `const TargetEditableItem = ({ item, idx, field, handleArrayChange }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const val = typeof item === 'object' ? (item.nama || item.name || "") : item;
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        value={val}
        onFocus={() => setIsFocused(true)}`;
code = code.replace(targetTargetEditable, replacementTargetEditable);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Editable lists patch applied!");
