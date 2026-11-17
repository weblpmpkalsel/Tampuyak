const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const visualIdentityTabCode = `VisualIdentity: ({ appCtx }: any) => {
    const { settings, updateSetting } = appCtx;
    const visualIdentity = settings.visualIdentity || {};
    
    const updateVisual = (key: string, value: string | null) => {
      updateSetting("visualIdentity", key, value);
    };

    const handleFileUpload = (key: string) => (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      // Validation
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
         alert("Format file tidak didukung. Gunakan PNG, JPG, atau SVG.");
         return;
      }
      if (file.size > 5 * 1024 * 1024) {
         alert("Ukuran file maksimal 5 MB.");
         return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        updateVisual(key, base64Str);
      };
      reader.readAsDataURL(file);
    };

    const FileUploadField = ({ title, desc, assetKey, isRequired = false }: any) => {
      const currentVal = visualIdentity[assetKey];
      return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white gap-4">
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              {title} {isRequired && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold uppercase">Wajib</span>}
            </h4>
            <p className="text-sm text-slate-500">{desc}</p>
            {currentVal && (
               <div className="mt-3 flex gap-2 items-center">
                 <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tersedia</span>
               </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            {currentVal ? (
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img src={currentVal} alt={title} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded text-center transition-colors">
                    <input type="file" accept=".png,.jpg,.jpeg,.svg" className="hidden" onChange={handleFileUpload(assetKey)} />
                    Ganti
                  </label>
                  <button onClick={() => { if(confirm("Hapus aset ini?")) updateVisual(assetKey, null); }} className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded transition-colors">Hapus</button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-4 h-4 mr-2 text-slate-400" />
                Unggah File
                <input type="file" accept=".png,.jpg,.jpeg,.svg" className="hidden" onChange={handleFileUpload(assetKey)} />
              </label>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <PageHelp title="Identitas Visual" description="Pusat pengaturan aset visual resmi sekolah. Diunggah sekali, otomatis digunakan di seluruh dokumen cetak (RKJM, RKT, RKAS, KSP)." importance="Memastikan seluruh dokumen resmi memiliki kop, stempel, dan tanda tangan yang sah dan seragam." nextStep="Unggah logo sekolah dan stempel resmi." />
        
        <Card title="Logo & Profil Visual" icon={Palette} description="Logo resmi dan foto representatif sekolah.">
           <div className="space-y-4">
              <FileUploadField title="Logo Sekolah" desc="Logo utama sekolah (PNG dengan latar transparan direkomendasikan). Maks. 5MB." assetKey="logoSekolah" isRequired={true} />
              <FileUploadField title="Logo Pemerintah Daerah" desc="Opsional. Logo instansi/pemda (jika disyaratkan dalam format KSP/RKJM). Maks. 5MB." assetKey="logoPemda" />
              <FileUploadField title="Foto Sekolah" desc="Opsional. Digunakan pada sampul dokumen RKJM/RKT." assetKey="fotoSekolah" />
           </div>
        </Card>

        <Card title="Stempel & Tanda Tangan Digital" icon={FileSignature} description="Aset pengesahan untuk pencetakan dokumen resmi.">
           <div className="space-y-4">
              <FileUploadField title="Stempel Sekolah" desc="Wajib PNG transparan. Digunakan untuk Lembar Pengesahan otomatis." assetKey="stempel" />
              <FileUploadField title="Tanda Tangan Kepala Sekolah" desc="Opsional. Wajib PNG transparan." assetKey="ttdKepalaSekolah" />
              <FileUploadField title="Tanda Tangan Ketua Komite" desc="Opsional. Wajib PNG transparan." assetKey="ttdKomite" />
           </div>
        </Card>
      </div>
    );
  },
`;

if (!content.includes('VisualIdentity: ({ appCtx }: any) => {')) {
  content = content.replace('const SettingsTabs = {\n', 'const SettingsTabs = {\n  ' + visualIdentityTabCode);
} else {
  console.log("VisualIdentity tab already exists in SettingsTabs");
}

fs.writeFileSync('src/Tampuyak.tsx', content);
