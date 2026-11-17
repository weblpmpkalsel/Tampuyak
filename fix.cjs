const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const search = `            <Textarea
              label="Misi Sekolah (Terkunci ke School DNA)"
              value={Array.isArray(dna.misi) ? dna.misi.join("
") : dna.misi || data.mission}
              onChange={() => {}}
              disabled
              rows={4}
            />
            <Textarea
              label="Tujuan Sekolah (Terkunci ke School DNA)"
              value={Array.isArray(dna.tujuan) ? dna.tujuan.join("\\
") : dna.tujuan || data.goals}
              onChange={() => {}}
              disabled
              rows={3}
            />`;

const replace = `            <Textarea
              label="Misi Sekolah (Terkunci ke School DNA)"
              value={Array.isArray(dna.misi) ? dna.misi.join("\\n") : dna.misi || data.mission}
              onChange={() => {}}
              disabled
              rows={4}
            />
            <Textarea
              label="Tujuan Sekolah (Terkunci ke School DNA)"
              value={Array.isArray(dna.tujuan) ? dna.tujuan.join("\\n") : dna.tujuan || data.goals}
              onChange={() => {}}
              disabled
              rows={3}
            />`;

code = code.replace(search, replace);
fs.writeFileSync('src/Tampuyak.tsx', code);
