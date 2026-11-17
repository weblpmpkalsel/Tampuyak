const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldEmpty = `<h4 className="font-bold text-slate-700 mb-1">Belum Ada Riwayat Impor</h4>
               <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">Mulai lengkapi data sekolah Anda dengan mengunduh template dan mengunggahnya kembali.</p>`;

const newEmpty = `<h4 className="font-bold text-slate-700 mb-1">Pusat Impor Data</h4>
               <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">Gunakan menu ini untuk mengimpor data sekolah dalam jumlah besar menggunakan Template Excel resmi.</p>`;

code = code.replace(oldEmpty, newEmpty);
fs.writeFileSync('src/Tampuyak.tsx', code);
