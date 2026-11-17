const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

file = file.replace(
`  Rombel: ({ data, update }: any) => {
    const handleAdd = () => update([...data, { id: Date.now(), nama: "", wali: "", siswa: 0 }]);`,
`  Rombel: ({ data, update }: any) => {
    const handleAdd = () => update([...data, { id: Date.now(), nama: "", wali: "", lakiLaki: 0, perempuan: 0, siswa: 0 }]);`
);

file = file.replace(
`                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <Input
                      label="Nama Kelas"
                      value={g.nama}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].nama = v;
                        update(nd);
                      }}
                    />
                    <Input
                      label="Wali Kelas"
                      value={g.wali}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].wali = v;
                        update(nd);
                      }}
                    />
                    <Input
                      label="Jumlah Siswa"
                      type="number"
                      value={g.siswa}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].siswa = v;
                        update(nd);
                      }}
                    />
                  </div>`,
`                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <Input
                      label="Nama Kelas"
                      value={g.nama}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].nama = v;
                        update(nd);
                      }}
                    />
                    <Input
                      label="Wali Kelas"
                      value={g.wali}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].wali = v;
                        update(nd);
                      }}
                    />
                    <Input
                      label="Laki-laki"
                      type="number"
                      value={g.lakiLaki || 0}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].lakiLaki = parseInt(v) || 0;
                        nd[i].siswa = (nd[i].lakiLaki || 0) + (nd[i].perempuan || 0);
                        update(nd);
                      }}
                    />
                    <Input
                      label="Perempuan"
                      type="number"
                      value={g.perempuan || 0}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].perempuan = parseInt(v) || 0;
                        nd[i].siswa = (nd[i].lakiLaki || 0) + (nd[i].perempuan || 0);
                        update(nd);
                      }}
                    />
                    <Input
                      label="Total Siswa"
                      type="number"
                      value={(g.lakiLaki || 0) + (g.perempuan || 0) || g.siswa || 0}
                      onChange={(v: any) => {}}
                    />
                  </div>`
);

fs.writeFileSync('src/Tampuyak.tsx', file);
