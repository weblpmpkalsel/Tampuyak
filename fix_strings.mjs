import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// fix lines 8541
code = code.replace(
  '"RENCANA KERJA JANGKA MENENGAH (RKJM)\nTAHUN 2024 - 2028"',
  '"RENCANA KERJA JANGKA MENENGAH (RKJM)\\nTAHUN 2024 - 2028"'
);

// fix lines 8562
code = code.replace(
  '"1.1 Latar Belakang\nBerdasarkan Rapor Pendidikan tahun terakhir, sekolah kami memiliki beberapa kekuatan dan kelemahan yang perlu ditindaklanjuti. Kelemahan utama berada pada kemampuan numerasi siswa kelas 5."',
  '"1.1 Latar Belakang\\nBerdasarkan Rapor Pendidikan tahun terakhir, sekolah kami memiliki beberapa kekuatan dan kelemahan yang perlu ditindaklanjuti. Kelemahan utama berada pada kemampuan numerasi siswa kelas 5."'
);

// fix lines 8570
code = code.replace(
  '"1.2 Tujuan Strategis\nMeningkatkan skor numerasi sebesar 15% pada tahun ajaran berikutnya melalui program-program inovatif dan peningkatan kapasitas pendidik."',
  '"1.2 Tujuan Strategis\\nMeningkatkan skor numerasi sebesar 15% pada tahun ajaran berikutnya melalui program-program inovatif dan peningkatan kapasitas pendidik."'
);

// fix line 8788
code = code.replace(
  'rows={block.content.split("\n").length}',
  'rows={block.content.split("\\n").length}'
);

// Let's also check for other instances.
// We can just find any `" \n "` or similar and replace them.
// But it's safer to just run TSC and see what else broke.

fs.writeFileSync('src/Tampuyak.tsx', code);
