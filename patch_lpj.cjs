const fs = require('fs');
let file = fs.readFileSync('src/components/LpjKepalaSekolahView.tsx', 'utf8');

file = file.replace(
`                  <td className="border border-black p-2 text-center">{r.name || \`Kelas \${idx + 1}\`}</td>
                  <td className="border border-black p-2 text-center">{r.lakiLaki || Math.floor((r.total || 30)/2)}</td>
                  <td className="border border-black p-2 text-center">{r.perempuan || Math.ceil((r.total || 30)/2)}</td>
                  <td className="border border-black p-2 text-center font-bold">{r.total || 30}</td>`,
`                  <td className="border border-black p-2 text-center">{r.name || r.nama || \`Kelas \${idx + 1}\`}</td>
                  <td className="border border-black p-2 text-center">{r.lakiLaki || 0}</td>
                  <td className="border border-black p-2 text-center">{r.perempuan || 0}</td>
                  <td className="border border-black p-2 text-center font-bold">{((r.lakiLaki || 0) + (r.perempuan || 0)) > 0 ? ((r.lakiLaki || 0) + (r.perempuan || 0)) : (r.total || r.siswa || 0)}</td>`
);

fs.writeFileSync('src/components/LpjKepalaSekolahView.tsx', file);
