const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

file = file.replace(
`                    <Input
                      label="Total Siswa"
                      type="number"
                      value={(g.lakiLaki || 0) + (g.perempuan || 0) || g.siswa || 0}
                      onChange={(v: any) => {}}
                    />`,
`                    <Input
                      label="Total Siswa"
                      type="number"
                      value={((g.lakiLaki || 0) + (g.perempuan || 0)) > 0 ? (g.lakiLaki || 0) + (g.perempuan || 0) : (g.siswa || 0)}
                      disabled={true}
                      onChange={(v: any) => {}}
                    />`
);

fs.writeFileSync('src/Tampuyak.tsx', file);
