const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// 1. App name in the sidebar
const oldSidebar = `<div
          className="h-16 flex items-center px-4 border-b border-slate-100/80 cursor-pointer"
          onClick={() => {
            setCurrentView("beranda");
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg shadow-indigo-500/20 mr-4">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-[22px] tracking-tighter text-slate-900 leading-none">
              TAMPUYAK
            </h1>
            <span className="text-[10px] font-black text-indigo-600 tracking-[0.2em] uppercase">
              OS
            </span>
          </div>
        </div>`;

const newSidebar = `<div
          className="h-16 flex items-center px-4 border-b border-slate-100/80 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => {
            setCurrentView("beranda");
          }}
        >
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="w-10 h-10 object-contain mr-3 drop-shadow-sm" />
          <div className="flex flex-col">
            <h1 className="font-black text-[18px] tracking-tight text-slate-900 leading-none mb-0.5">
              TAMPUYAK OS
            </h1>
            <span className="text-[9px] font-bold text-slate-500 leading-tight">
              School Operating System
            </span>
          </div>
        </div>`;

code = code.replace(oldSidebar, newSidebar);
// Fallback if padding is px-8 instead
const oldSidebar8 = oldSidebar.replace('px-4', 'px-8');
code = code.replace(oldSidebar8, newSidebar.replace('px-4', 'px-8'));

// 2. Add lucide icons
code = code.replace(/Code\n} from "lucide-react";/, 'Code,\n  Instagram,\n  Facebook,\n  Youtube\n} from "lucide-react";');

// 3. Add footer
const oldMainEnd = `            {currentView === "dqaEngine" && (
              <DocumentQualityAssuranceView navigateToView={setCurrentView} />
            )}
          </div>
        </div>
      </main>`;

const newMainEnd = `            {currentView === "dqaEngine" && (
              <DocumentQualityAssuranceView navigateToView={setCurrentView} />
            )}
          </div>
        </div>
        <footer className="w-full text-center py-8 text-slate-500 text-sm mt-auto border-t border-slate-200 bg-slate-50">
          <div className="font-bold text-slate-700 mb-1">
            Developed by <span className="text-indigo-600">Deni Ranoptri, S.Pd., M.Pd</span>
          </div>
          <div className="text-xs mb-4">Guru • Inovator • Praktisi Pendidikan</div>
          <div className="flex items-center justify-center space-x-6">
            <a href="https://www.instagram.com/best_deny?igsh=MTdqYTJmcWsydGUwMw==" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform text-slate-400 hover:text-pink-600" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.tiktok.com/@denipositif" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform text-slate-400 hover:text-black" aria-label="TikTok">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.32 6.07-1.4 1.62-3.32 2.62-5.46 2.87-2.14.25-4.35-.14-6.19-1.28-1.84-1.14-3.16-2.92-3.76-4.99-.59-2.07-.36-4.32.65-6.2 1.01-1.88 2.71-3.31 4.72-4.01 2.01-.7 4.24-.62 6.18.22.03.62.06 1.25.09 1.87-1.39-.77-3.03-.89-4.51-.34-1.48.55-2.65 1.77-3.15 3.27-.5 1.5-.23 3.19.74 4.46.97 1.27 2.5 1.99 4.08 1.92 1.58-.07 3.02-.9 3.86-2.22.84-1.32 1.11-2.96.72-4.43-.01-5.11 0-10.22-.01-15.33z"/></svg>
            </a>
            <a href="https://web.facebook.com/demian.renovtri.3?rdid=NebkE1tEAlxKk8ZM&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1FwSzyNwVW%2F%3F_rdc%3D1%26_rdr" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform text-slate-400 hover:text-blue-600" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@DeniRanoptri" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform text-slate-400 hover:text-red-600" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </main>`;

code = code.replace(oldMainEnd, newMainEnd);

// 4. Update About Tab
const oldAboutTab = `      <Card title="Tentang Tampuyak OS" icon={Info}>
        <div className="p-6 text-center space-y-4">
          <div
            className="w-24 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[24px] flex items-center justify-center shadow-xl shadow-indigo-500/20 mx-auto mb-6 transform hover:scale-105 transition-transform cursor-pointer"
            onClick={handleDevClick}
          >
            <Layout className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Tampuyak OS
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            Sistem Operasi Tata Kelola Sekolah
          </p>
          <div className="inline-block bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mt-4">
            <span className="text-sm font-bold text-indigo-700">
              Versi 2026.1.0-alpha
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-6 leading-relaxed">
            Tampuyak OS adalah sistem operasi tata kelola sekolah yang dirancang
            khusus untuk mempermudah tugas Kepala Sekolah dalam mengelola data,
            menyusun dokumen perencanaan, dan memonitoring pelaksanaan program
            sekolah.
          </p>
        </div>
      </Card>`;

const newAboutTab = `      <Card title="Tentang Tampuyak OS" icon={Info}>
        <div className="p-8 text-center space-y-4">
          <img
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png"
            alt="Tampuyak Logo"
            className="w-24 h-24 object-contain mx-auto mb-6 drop-shadow-xl transform hover:scale-105 transition-transform cursor-pointer"
            onClick={handleDevClick}
          />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            TAMPUYAK OS
          </h2>
          <p className="text-slate-500 text-lg font-bold">
            School Operating System
          </p>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 font-medium">
            Tata Kelola Administrasi dan Manajemen Pendidikan untuk Upaya Akselerasi Kualitas
          </p>
          <div className="inline-block bg-indigo-50 border border-indigo-100 px-6 py-2 rounded-full mt-2 mb-6">
            <span className="text-sm font-bold text-indigo-700">
              Version 1.0.0
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 max-w-2xl mx-auto">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Developer</p>
               <p className="text-sm font-bold text-slate-700">Deni Ranoptri, S.Pd., M.Pd</p>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Release Date</p>
               <p className="text-sm font-bold text-slate-700">June 2026</p>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Architecture</p>
               <p className="text-sm font-bold text-slate-700">Offline-First PWA</p>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Storage Engine</p>
               <p className="text-sm font-bold text-slate-700">TampuyakDB (IndexedDB)</p>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Workflow Engine</p>
               <p className="text-sm font-bold text-slate-700">Tampuyak Pipeline v1</p>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">License</p>
               <p className="text-sm font-bold text-slate-700">Proprietary</p>
             </div>
          </div>
        </div>
      </Card>`;

code = code.replace(oldAboutTab, newAboutTab);

// 5. Version
code = code.replace(/Versi 2026\.1\.0-alpha/g, 'Version 1.0.0');

// 6. Print Footer
const oldPrintEnd1 = `            </div>
</div>
        </div>
        <style>{\`
          @media print {
            body * { visibility: hidden; }
            .print\\\\:hidden { display: none !important; }
            #printable-rkjm`;

const newPrintEnd1 = `            </div>
            
            <div className="hidden print:block fixed bottom-4 left-0 w-full text-center">
               <p className="text-[10px] text-slate-400 font-sans font-medium">Dihasilkan oleh TAMPUYAK OS (School Operating System) v1.0.0</p>
            </div>
</div>
        </div>
        <style>{\`
          @media print {
            body * { visibility: hidden; }
            .print\\\\:hidden { display: none !important; }
            #printable-rkjm`;

code = code.replace(oldPrintEnd1, newPrintEnd1);

const oldPrintEnd2 = `            </div>
</div>
        </div>
        <style>{\`
          @media print {
            body * { visibility: hidden; }
            .print\\\\:hidden { display: none !important; }
            #printable-doc`;

const newPrintEnd2 = `            </div>
            
            <div className="hidden print:block fixed bottom-4 left-0 w-full text-center">
               <p className="text-[10px] text-slate-400 font-sans font-medium">Dihasilkan oleh TAMPUYAK OS (School Operating System) v1.0.0</p>
            </div>
</div>
        </div>
        <style>{\`
          @media print {
            body * { visibility: hidden; }
            .print\\\\:hidden { display: none !important; }
            #printable-doc`;

code = code.replace(oldPrintEnd2, newPrintEnd2);

fs.writeFileSync('src/Tampuyak.tsx', code);
