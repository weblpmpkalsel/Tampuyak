const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const replacement = `
  VisualIdentity: ({ appCtx }: any) => {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHelp title="Identitas Visual" description="Pusat pengaturan aset visual resmi sekolah. Diunggah sekali, otomatis digunakan di seluruh dokumen cetak (RKJM, RKT, RKAS, KSP)." importance="Memastikan seluruh dokumen resmi memiliki kop, stempel, dan tanda tangan yang sah dan seragam." nextStep="Unggah logo sekolah dan stempel resmi." />
        <Card title="Aset Visual" description="Aset pendukung visual sekolah (Opsional).">
          <div className="space-y-4">
            <AssetUploadField 
              title="Logo Sekolah" 
              desc="Logo utama sekolah (PNG dengan latar transparan direkomendasikan). Maks. 5MB." 
              assetKey="schoolLogo" 
              isRequired={false} 
            />
            <AssetUploadField 
              title="Foto Sekolah" 
              desc="Foto bangunan/tampak depan sekolah. Maks. 5MB." 
              assetKey="schoolPhoto" 
              isRequired={false} 
            />
          </div>
        </Card>
        
        <Card title="Aset Pengesahan" description="Aset resmi untuk pengesahan dokumen.">
          <div className="space-y-4">
            <AssetUploadField 
              title="Stempel Sekolah" 
              desc="Stempel resmi sekolah (PNG transparan). Maks. 5MB." 
              assetKey="stamp" 
              isRequired={false} 
            />
            <AssetUploadField 
              title="Tanda Tangan Kepala Sekolah" 
              desc="Tanda tangan kepala sekolah (PNG transparan). Maks. 5MB." 
              assetKey="principalSignature" 
              isRequired={false} 
            />
            <AssetUploadField 
              title="Tanda Tangan Bendahara" 
              desc="Tanda tangan bendahara (PNG transparan). Maks. 5MB." 
              assetKey="treasurerSignature" 
              isRequired={false} 
            />
            <AssetUploadField 
              title="Tanda Tangan Komite" 
              desc="Tanda tangan komite (PNG transparan). Maks. 5MB." 
              assetKey="committeeSignature" 
              isRequired={false} 
            />
          </div>
        </Card>
      </div>
    );
  },
`;

const startIndex = code.indexOf('  VisualIdentity: ({ appCtx }: any) => {');
let endIndex = -1;
if (startIndex !== -1) {
  // Find the end of VisualIdentity
  // It ends right before `  Karakteristik: ({ data, update }: any) => {`
  endIndex = code.indexOf('  Karakteristik: ({ data, update }: any) => {', startIndex);
  if (endIndex !== -1) {
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
    fs.writeFileSync('src/Tampuyak.tsx', code);
    console.log("Successfully replaced VisualIdentity");
  } else {
    console.log("Could not find end of VisualIdentity");
  }
} else {
  console.log("Could not find start of VisualIdentity");
}
