const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const targetEmptyWorkspace = `<div className="text-center py-20">
                       <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                       <p className="text-slate-500 mb-6 font-medium">Dokumen ini belum dibuat.</p>
                       <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigateToView(docId === "rkt" ? "rktDerivation" : docId === "rkas" ? "rkasDerivation" : docId === "ksp" ? "kspStudio" : "rkjmPipeline")}>Mulai Penyusunan {meta.title}</Button>
                     </div>`;

const newEmptyWorkspace = `<div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 max-w-2xl mx-auto mt-12">
                       <div className="w-20 h-20 bg-white shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                         <FolderOpen className="w-10 h-10 text-indigo-400" />
                       </div>
                       <h3 className="text-2xl font-black text-slate-800 mb-4">Workspace {meta.title}</h3>
                       <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                         Halaman ini adalah pusat pengelolaan dokumen {meta.subtitle}. Dokumen ini penting sebagai panduan resmi operasional dan perencanaan sekolah Anda.
                       </p>
                       <p className="text-slate-500 font-medium mb-10">
                         Untuk memulai, gunakan sistem penyusunan otomatis untuk membuat draf awal berdasarkan data sekolah Anda.
                       </p>
                       <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl shadow-md text-lg" onClick={() => navigateToView(docId === "rkt" ? "rktDerivation" : docId === "rkas" ? "rkasDerivation" : docId === "ksp" ? "kspStudio" : "rkjmPipeline")}>
                         Mulai Penyusunan {meta.title}
                       </Button>
                     </div>`;

code = code.replace(targetEmptyWorkspace, newEmptyWorkspace);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
