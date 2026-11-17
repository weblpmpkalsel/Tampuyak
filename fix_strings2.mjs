import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  '"1. Menyelenggarakan pembelajaran berbasis proyek yang mengintegrasikan nilai-nilai Pancasila.\n2. Memfasilitasi pengembangan minat dan bakat melalui kegiatan ekstrakurikuler yang beragam."',
  '"1. Menyelenggarakan pembelajaran berbasis proyek yang mengintegrasikan nilai-nilai Pancasila.\\n2. Memfasilitasi pengembangan minat dan bakat melalui kegiatan ekstrakurikuler yang beragam."'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
