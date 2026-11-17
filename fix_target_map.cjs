const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const oldRenderList = `  const renderEditableList = (title: string, field: string, icon: any) => (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
        {React.createElement(icon, { className: "w-4 h-4 text-indigo-500" })}{" "}
        {title}
      </h3>
      {isEditing ? (
        <div className="space-y-2">
          {(formData[field as keyof typeof formData] as string[]).map(
            (item, idx) => (
              <input
                key={idx}
                value={item}
                onChange={(e) => handleArrayChange(field, idx, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            ),
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem(field)}
            className="w-full mt-2"
          >
            + Tambah Item
          </Button>
        </div>
      ) : (`;

const newRenderList = `  const renderEditableList = (title: string, field: string, icon: any) => (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
        {React.createElement(icon, { className: "w-4 h-4 text-indigo-500" })}{" "}
        {title}
      </h3>
      {isEditing ? (
        <div className="space-y-2">
          {(formData[field as keyof typeof formData] as string[]).map(
            (item, idx) => {
              const [isFocused, setIsFocused] = useState(false);
              return (
                <div key={idx} className="flex flex-col gap-1 w-full">
                  <input
                    value={item}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => handleArrayChange(field, idx, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  {isFocused && (field === "tujuan" || field === "indikator") && <SmartGuidance type={field} />}
                </div>
              );
            }
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem(field)}
            className="w-full mt-2"
          >
            + Tambah Item
          </Button>
        </div>
      ) : (`;

if (content.includes(oldRenderList)) {
  content = content.replace(oldRenderList, newRenderList);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
