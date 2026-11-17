const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const replaceEmpty = (search, title, desc, btnText) => {
    const rx = new RegExp(`<div className="text-center p-8 text-slate-400">\\s*${search}\\s*</div>`, 'g');
    const replacement = `<div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-bold text-slate-700 mb-2">${title}</h4>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">${desc}</p>
                <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" /> ${btnText}
                </Button>
              </div>`;
    code = code.replace(rx, replacement);
}

replaceEmpty("Belum ada program unggulan.", "Program Unggulan Kosong", "Daftarkan program unggulan sekolah Anda untuk diintegrasikan secara otomatis ke dalam dokumen KSP.", "Tambah Program");
replaceEmpty("Belum ada data guru.", "Data Guru Kosong", "Tambahkan data pendidik di sekolah Anda. Data ini akan digunakan dalam penyusunan KSP dan SK Pembagian Tugas.", "Tambah Guru");
replaceEmpty("Belum ada data tenaga kependidikan.", "Data Tendik Kosong", "Tambahkan data tenaga kependidikan. Data ini penting untuk melengkapi profil sekolah.", "Tambah Tendik");
replaceEmpty("Belum ada data rombel.", "Rombongan Belajar Kosong", "Atur jumlah rombongan belajar. Data ini digunakan untuk merencanakan kapasitas dan kebutuhan sarana prasarana.", "Tambah Rombel");

// We need to make sure the Database icon is imported. Wait, Database might be already in Lucide react import?
// Let's check lucide-react imports.

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
