const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// RKJMPipelineView print preview injection
const rkjmCoverOld = `<div className="text-center pt-24 pb-32">
              <h1 className="text-4xl font-bold mb-4 uppercase">RENCANA KERJA JANGKA MENENGAH (RKJM)</h1>
              <h2 className="text-2xl mb-12">Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</h2>
              <div className="mt-32 text-xl font-bold">`;

const rkjmCoverNew = `
            {/* Cover */}
            <div className="text-center pt-16 pb-24 relative">
              {(settings.visualIdentity?.logoSekolah || settings.visualIdentity?.logoPemda) && (
                 <div className="flex justify-center items-center gap-8 mb-12">
                   {settings.visualIdentity?.logoPemda && <img src={settings.visualIdentity.logoPemda} className="w-24 h-24 object-contain" />}
                   {settings.visualIdentity?.logoSekolah && <img src={settings.visualIdentity.logoSekolah} className="w-24 h-24 object-contain" />}
                 </div>
              )}
              {settings.visualIdentity?.fotoSekolah && (
                 <img src={settings.visualIdentity.fotoSekolah} className="w-3/4 max-w-lg mx-auto h-48 object-cover rounded-xl shadow-md mb-12" />
              )}
              <h1 className="text-4xl font-bold mb-4 uppercase">RENCANA KERJA JANGKA MENENGAH (RKJM)</h1>
              <h2 className="text-2xl mb-12">Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</h2>
              <div className="mt-16 text-xl font-bold">`;

content = content.replace(rkjmCoverOld, rkjmCoverNew);

const rkjmApprovalOld = `<div>
                   <p className="mb-24">Mengesahkan,<br/>Kepala Sekolah</p>
                   <p className="font-bold underline">{settings.principal?.name || "Belum diatur"}</p>
                   <p>NIP. {settings.principal?.nip || "-"}</p>
                 </div>
                 <div>
                   <p className="mb-24">Menyetujui,<br/>Ketua Komite</p>
                   <p className="font-bold underline">{settings.komite?.name || "Belum diatur"}</p>
                 </div>`;

const rkjmApprovalNew = `
                 <div className="relative inline-block text-left">
                   <p className="mb-8">Mengesahkan,<br/>Kepala Sekolah</p>
                   <div className="h-24 relative flex items-center justify-center">
                      {settings.visualIdentity?.ttdKepalaSekolah && <img src={settings.visualIdentity.ttdKepalaSekolah} className="h-16 object-contain z-10 relative" />}
                      {settings.visualIdentity?.stempel && <img src={settings.visualIdentity.stempel} className="h-24 opacity-80 object-contain absolute left-0 top-0 -translate-x-4 -translate-y-2 mix-blend-multiply" />}
                   </div>
                   <p className="font-bold underline mt-2 relative z-20">{settings.principal?.name || "Belum diatur"}</p>
                   <p>NIP. {settings.principal?.nip || "-"}</p>
                 </div>
                 <div className="relative inline-block text-left">
                   <p className="mb-8">Menyetujui,<br/>Ketua Komite</p>
                   <div className="h-24 relative flex items-center justify-center">
                      {settings.visualIdentity?.ttdKomite && <img src={settings.visualIdentity.ttdKomite} className="h-16 object-contain z-10 relative" />}
                   </div>
                   <p className="font-bold underline mt-2">{settings.komite?.name || "Belum diatur"}</p>
                 </div>`;

content = content.replace(rkjmApprovalOld, rkjmApprovalNew);

// DocumentDetailView print preview injection
const docCoverOld = `<div className="text-center pt-24 pb-32">
              <h1 className="text-4xl font-bold mb-4 uppercase">{meta.subtitle} ({meta.title})</h1>
              <h2 className="text-2xl mb-12">Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</h2>
              <div className="mt-32 text-xl font-bold">`;
              
const docCoverNew = `
            {/* Cover */}
            <div className="text-center pt-16 pb-24 relative">
              {(settings.visualIdentity?.logoSekolah || settings.visualIdentity?.logoPemda) && (
                 <div className="flex justify-center items-center gap-8 mb-12">
                   {settings.visualIdentity?.logoPemda && <img src={settings.visualIdentity.logoPemda} className="w-24 h-24 object-contain" />}
                   {settings.visualIdentity?.logoSekolah && <img src={settings.visualIdentity.logoSekolah} className="w-24 h-24 object-contain" />}
                 </div>
              )}
              {settings.visualIdentity?.fotoSekolah && (
                 <img src={settings.visualIdentity.fotoSekolah} className="w-3/4 max-w-lg mx-auto h-48 object-cover rounded-xl shadow-md mb-12" />
              )}
              <h1 className="text-4xl font-bold mb-4 uppercase">{meta.subtitle} ({meta.title})</h1>
              <h2 className="text-2xl mb-12">Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</h2>
              <div className="mt-16 text-xl font-bold">`;

content = content.replace(docCoverOld, docCoverNew);

const docApprovalOld = `<div>
                   <p className="mb-24">Mengesahkan,<br/>Kepala Sekolah</p>
                   <p className="font-bold underline">{settings.principal?.name || "Belum diatur"}</p>
                   <p>NIP. {settings.principal?.nip || "-"}</p>
                 </div>
                 <div>
                   <p className="mb-24">Menyetujui,<br/>Ketua Komite</p>
                   <p className="font-bold underline">{settings.komite?.name || "Belum diatur"}</p>
                 </div>`;
                 
const docApprovalNew = `
                 <div className="relative inline-block text-left">
                   <p className="mb-8">Mengesahkan,<br/>Kepala Sekolah</p>
                   <div className="h-24 relative flex items-center justify-center">
                      {settings.visualIdentity?.ttdKepalaSekolah && <img src={settings.visualIdentity.ttdKepalaSekolah} className="h-16 object-contain z-10 relative" />}
                      {settings.visualIdentity?.stempel && <img src={settings.visualIdentity.stempel} className="h-24 opacity-80 object-contain absolute left-0 top-0 -translate-x-4 -translate-y-2 mix-blend-multiply" />}
                   </div>
                   <p className="font-bold underline mt-2 relative z-20">{settings.principal?.name || "Belum diatur"}</p>
                   <p>NIP. {settings.principal?.nip || "-"}</p>
                 </div>
                 <div className="relative inline-block text-left">
                   <p className="mb-8">Menyetujui,<br/>Ketua Komite</p>
                   <div className="h-24 relative flex items-center justify-center">
                      {settings.visualIdentity?.ttdKomite && <img src={settings.visualIdentity.ttdKomite} className="h-16 object-contain z-10 relative" />}
                   </div>
                   <p className="font-bold underline mt-2">{settings.komite?.name || "Belum diatur"}</p>
                 </div>`;
                 
content = content.replace(docApprovalOld, docApprovalNew);

fs.writeFileSync('src/Tampuyak.tsx', content);
