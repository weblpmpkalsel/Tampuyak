const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    /"1\.1 Latar Belakang\\nBerdasarkan Rapor Pendidikan tahun terakhir, sekolah kami memiliki beberapa kekuatan dan kelemahan yang perlu ditindaklanjuti\. Kelemahan utama berada pada kemampuan numerasi siswa kelas 5\."/g,
    '"BAB I PENDAHULUAN\\n\\n1.1 Latar Belakang\\n[Isi latar belakang penyusunan dokumen. Jelaskan kondisi riil sekolah dan dasar hukum yang digunakan.]"'
);

code = code.replace(
    /"1\.2 Tujuan\\nRKJM ini disusun untuk menutupi gap capaian dan mewujudkan Visi Misi sekolah dalam 4 tahun ke depan melalui berbagai program strategis\."/g,
    '"1.2 Tujuan dan Sasaran\\n[Uraikan tujuan yang ingin dicapai berdasarkan Visi, Misi, dan Rapor Pendidikan terbaru.]"'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
