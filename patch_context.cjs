const fs = require('fs');
let file = fs.readFileSync('src/enterprise/knowledge/builders/SchoolContextBuilder.ts', 'utf8');

file = file.replace(
`    classes = rawRombel.map(rombel => {
      const totalSiswa = Number(rombel.total) || Number(rombel.siswa) || ((Number(rombel.lakiLaki) || 0) + (Number(rombel.perempuan) || 0));
      return {
        className: rombel.name || rombel.nama || '',
        maleCount: Number(rombel.lakiLaki) || Math.floor(totalSiswa / 2),
        femaleCount: Number(rombel.perempuan) || Math.ceil(totalSiswa / 2),
        totalCount: totalSiswa
      };
    });`,
`    classes = rawRombel.map(rombel => {
      const male = Number(rombel.lakiLaki) || 0;
      const female = Number(rombel.perempuan) || 0;
      const totalSiswa = male + female || Number(rombel.total) || Number(rombel.siswa) || 0;
      return {
        className: rombel.name || rombel.nama || '',
        maleCount: male,
        femaleCount: female,
        totalCount: totalSiswa
      };
    });`
);

fs.writeFileSync('src/enterprise/knowledge/builders/SchoolContextBuilder.ts', file);
