const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace Textarea for Visi
content = content.replace(
  /<Textarea\s+label="Visi Sekolah"\s+value=\{data\.visi\}\s+onChange=\{\(v: any\) => update\("visi", v\)\}\s+rows=\{3\}\s+required\s+\/>/g,
  `<Textarea
              label="Visi Sekolah"
              value={data.visi}
              onChange={(v: any) => update("visi", v)}
              rows={3}
              required
              guidanceType="visi"
            />`
);

// We should also replace the Misi inputs! But misi is an array mapping using basic <input> in Identitas
// Let's modify the misi mapping to include SmartGuidance on focus.
// Around line 4406:
const oldMisiMap = `              {(data.misi || []).map((item: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const n = [...(data.misi || [])];
                      n[idx] = e.target.value;
                      update("misi", n);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    placeholder={\`Misi \${idx + 1}\`}
                  />
                  <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={() => {
                      const n = [...(data.misi || [])];
                      n.splice(idx, 1);
                      update("misi", n);
                    }}
                  />
                </div>
              ))}`;

const newMisiMap = `              {(data.misi || []).map((item: string, idx: number) => {
                const [isFocused, setIsFocused] = useState(false);
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => {
                          const n = [...(data.misi || [])];
                          n[idx] = e.target.value;
                          update("misi", n);
                        }}
                        className="flex-1 px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                        placeholder={\`Misi \${idx + 1}\`}
                      />
                      <Button
                        variant="danger"
                        icon={Trash2}
                        onClick={() => {
                          const n = [...(data.misi || [])];
                          n.splice(idx, 1);
                          update("misi", n);
                        }}
                      />
                    </div>
                    {isFocused && <SmartGuidance type="misi" />}
                  </div>
                );
              })}`;

if (content.includes(oldMisiMap)) {
  content = content.replace(oldMisiMap, newMisiMap);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
