const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const listInputItem = `const ListInputItem = ({ item, idx, data, update, field, placeholder, guidanceType }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={item}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            const n = [...(data[field] || [])];
            n[idx] = e.target.value;
            update(field, n);
          }}
          className="flex-1 px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
          placeholder={placeholder}
        />
        <Button
          variant="danger"
          icon={Trash2}
          onClick={() => {
            const n = [...(data[field] || [])];
            n.splice(idx, 1);
            update(field, n);
          }}
        />
      </div>
      {isFocused && guidanceType && <SmartGuidance type={guidanceType} />}
    </div>
  );
};`;

if (!content.includes('const ListInputItem =')) {
  content = content.replace('const MisiItem =', listInputItem + '\nconst MisiItem =');
}

const oldTujuanMap = `{(data.tujuan || []).map((item: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const n = [...(data.tujuan || [])];
                      n[idx] = e.target.value;
                      update("tujuan", n);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() =>
                      update(
                        "tujuan",
                        data.tujuan.filter((_: any, i: number) => i !== idx),
                      )
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}`;
              
const newTujuanMap = `{(data.tujuan || []).map((item: string, idx: number) => (
                <ListInputItem key={idx} item={item} idx={idx} data={data} update={update} field="tujuan" placeholder={\`Tujuan \${idx + 1}\`} guidanceType="tujuan" />
              ))}`;

if (content.includes(oldTujuanMap)) {
  content = content.replace(oldTujuanMap, newTujuanMap);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
