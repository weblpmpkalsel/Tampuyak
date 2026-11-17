const fs = require('fs');

let approvalCode = fs.readFileSync('src/RKASDocument/ApprovalBuilder.ts', 'utf-8');

const oldTables = `        tables: [{
          title: 'Tanda Tangan Pengesahan',
          data: [
            { Jabatan: 'Kepala Sekolah', Nama: settings?.school?.principal?.name || '(Belum diisi pada Profil Sekolah)', Tanggal: '____________________' },
            { Jabatan: 'Bendahara Sekolah / Bendahara BOS', Nama: settings?.school?.treasurer?.name || '(Belum diisi pada Profil Sekolah)', Tanggal: '____________________' }
          ]
        }]`;

const newTables = `        tables: [{
          title: 'Tanda Tangan Pengesahan',
          data: [
            { Jabatan: 'Kepala Sekolah', Nama: settings?.principal?.name || '(Belum diisi pada Profil Sekolah)', Tanggal: '____________________' },
            { Jabatan: 'Bendahara Sekolah / Bendahara BOS', Nama: settings?.bendaharaBOS?.name || '(Belum diisi pada Profil Sekolah)', Tanggal: '____________________' }
          ]
        }]`;

approvalCode = approvalCode.replace(oldTables, newTables);
fs.writeFileSync('src/RKASDocument/ApprovalBuilder.ts', approvalCode);
console.log("ApprovalBuilder patched with correct paths!");
