const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldSchoolEnd = `          <Input
            label="Website"
            value={data.website}
            onChange={(v: any) => update("website", v)}
          />
        </div>
      </Card>
    </div>
    );
  },`;

const newSchoolEnd = `          <Input
            label="Website"
            value={data.website}
            onChange={(v: any) => update("website", v)}
          />
        </div>
      </Card>

      <Card
        title="Visi, Misi & Tujuan"
        description="Arah dan panduan utama pergerakan satuan pendidikan."
      >
        <div className="space-y-4">
          <Textarea
            label="Visi Sekolah"
            value={identitasData.visi}
            onChange={(v: any) => updateIdentitas("visi", v)}
            rows={3}
            required
            guidanceType="visi"
          />
          <Input
            label="Motto Sekolah"
            value={identitasData.motto}
            onChange={(v: any) => updateIdentitas("motto", v)}
            placeholder="Misal: Cerdas, Terampil, Berakhlak Mulia"
          />

          <div className="space-y-3">
            <label className="block text-[13px] font-bold text-slate-700 tracking-wide">
              Misi Sekolah
            </label>
            {(identitasData.misi || []).map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const n = [...(identitasData.misi || [])];
                    n[idx] = e.target.value;
                    updateIdentitas("misi", n);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() =>
                    updateIdentitas(
                      "misi",
                      identitasData.misi.filter((_: any, i: number) => i !== idx),
                    )
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button
              onClick={() => updateIdentitas("misi", [...(identitasData.misi || []), ""])}
              variant="outline"
              icon={Plus}
              size="sm"
            >
              Tambah Misi
            </Button>
          </div>

          <div className="space-y-3">
            <label className="block text-[13px] font-bold text-slate-700 tracking-wide">
              Tujuan Sekolah
            </label>
            {(identitasData.tujuan || []).map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-start">
                <Input
                  value={item}
                  onChange={(val: any) => {
                    const newArray = [...(identitasData.tujuan || [])];
                    newArray[idx] = val;
                    updateIdentitas("tujuan", newArray);
                  }}
                  placeholder={\`Tujuan \${idx + 1}\`}
                  className="flex-1"
                />
                <button
                  onClick={() =>
                    updateIdentitas(
                      "tujuan",
                      identitasData.tujuan.filter((_: any, i: number) => i !== idx),
                    )
                  }
                  className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-xl shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button
              onClick={() => updateIdentitas("tujuan", [...(identitasData.tujuan || []), ""])}
              variant="outline"
              icon={Plus}
              size="sm"
            >
              Tambah Tujuan
            </Button>
          </div>
        </div>
      </Card>
    </div>
    );
  },`;

code = code.replace(oldSchoolEnd, newSchoolEnd);

fs.writeFileSync('src/Tampuyak.tsx', code);
