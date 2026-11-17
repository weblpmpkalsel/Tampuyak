const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const oldListInputItem = '<ListInputItem key={idx} item={item} idx={idx} data={data} update={update} field="tujuan" placeholder={`Tujuan ${idx + 1}`} guidanceType="tujuan" />';

const newListInputItem = \`<div key={idx} className="flex gap-2 items-start">
                  <Input
                    value={item}
                    onChange={(val: any) => {
                      const newArray = [...(data.tujuan || [])];
                      newArray[idx] = val;
                      update("tujuan", newArray);
                    }}
                    placeholder={\\\`Tujuan \\\${idx + 1}\\\`}
                    className="flex-1"
                  />
                  <ContextHelpButton type="tujuan" />
                  <button
                    onClick={() =>
                      update(
                        "tujuan",
                        data.tujuan.filter((_: any, i: number) => i !== idx),
                      )
                    }
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl shrink-0 mt-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>\`;

content = content.replace(oldListInputItem, newListInputItem);
fs.writeFileSync('src/Tampuyak.tsx', content);
console.log("Fixed ListInputItem");
