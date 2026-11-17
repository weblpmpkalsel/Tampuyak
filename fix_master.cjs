const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// 1. initialSettings
if (!code.includes('governmentLogo: "",')) {
  code = code.replace(
    /name: "",\s*npsn: "",/,
    'name: "",\n    npsn: "",\n    governmentLogo: "",'
  );
}

// 2. Add FileUploadField helper to School tab or just a simple input
const schoolTabCodeOld = `  School: ({ data, update }: any) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        title="Profil Institusi"
        description="Identitas utama satuan pendidikan Anda yang akan tertera pada seluruh dokumen."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input
            label="Nama Sekolah"`;

const schoolTabCodeNew = `  School: ({ data, update }: any) => {
    const handleImageUpload = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert("File terlalu besar"); return; }
      const reader = new FileReader();
      reader.onload = (event: any) => {
        update("governmentLogo", event.target.result);
      };
      reader.readAsDataURL(file);
    };

    return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        title="Profil Institusi"
        description="Identitas utama satuan pendidikan Anda yang akan tertera pada seluruh dokumen."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="md:col-span-2 p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between gap-4">
             <div>
               <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">Logo Pemerintah Daerah <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold uppercase">Wajib</span></h4>
               <p className="text-sm text-slate-500">Logo instansi pemerintah daerah. Wajib untuk semua dokumen resmi.</p>
             </div>
             <div className="flex items-center gap-4">
               {data.governmentLogo && (
                 <div className="w-16 h-16 bg-white border border-slate-200 p-1 rounded">
                   <img src={data.governmentLogo} className="w-full h-full object-contain" />
                 </div>
               )}
               <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
                 Upload Logo
                 <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
               </label>
             </div>
          </div>
          <Input
            label="Nama Sekolah"`;

code = code.replace(schoolTabCodeOld, schoolTabCodeNew);

// 3. Remove logoPemda from visualIdentity
const visIDOld = `<FileUploadField title="Logo Pemerintah Daerah" desc="Opsional. Logo instansi/pemda (jika disyaratkan dalam format KSP/RKJM). Maks. 5MB." assetKey="logoPemda" />`;
code = code.replace(visIDOld, "");

const visIDStatusOld = `<div className={\`p-4 rounded-xl border \${visualIdentity.logoPemda ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}\`}>
             <p className="text-xs font-bold uppercase mb-1">Logo Pemda</p>
             <p className="text-sm font-medium flex items-center gap-2">{visualIdentity.logoPemda ? <><CheckCircle2 className="w-4 h-4" /> Tersedia</> : <><XCircle className="w-4 h-4 text-slate-400" /> Opsional</>}</p>
           </div>`;
code = code.replace(visIDStatusOld, "");

// 4. Update PrePrintValidationEngine
const prePrintOld = `    // Validate Profile
    if (!settings.school?.name) errors.push("Nama sekolah wajib diisi");
    if (!settings.school?.npsn) errors.push("NPSN wajib diisi");
    
    // Validate Signatures & Logos
    if (reg.printRules.requireLogoSekolah && !settings.visualIdentity?.logoSekolah) {
       errors.push("Logo Sekolah wajib diunggah sesuai regulasi.");
    }`;

const prePrintNew = `    // Validate Profile
    if (!settings.school?.name) errors.push("Nama sekolah wajib diisi");
    if (!settings.school?.npsn) errors.push("NPSN wajib diisi");
    
    if (!settings.school?.governmentLogo) {
      errors.push("Logo Pemerintah Daerah belum diunggah. Dokumen resmi tidak dapat dipratinjau maupun dicetak sebelum identitas sekolah lengkap.");
    }

    // Validate Signatures & Logos
    if (reg.printRules.requireLogoSekolah && !settings.visualIdentity?.logoSekolah) {
       errors.push("Logo Sekolah wajib diunggah sesuai regulasi.");
    }`;
code = code.replace(prePrintOld, prePrintNew);

// 5. Fix Cover templates consuming settings.visualIdentity.logoPemda
// Cover RKJM Preview
code = code.replace(/settings\.visualIdentity\?\.logoPemda/g, "settings.school?.governmentLogo");

// 6. Fix `PrePrintValidationEngine` usage in other parts if they check logoPemda
// There are multiple places where `logoPemda` might be used for covers.
code = code.replace(/visualIdentity\.logoPemda/g, "school.governmentLogo");


fs.writeFileSync('src/Tampuyak.tsx', code);
