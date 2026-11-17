import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// The replacement for printable-doc / printable-rkjm content
const getFullContent = (titleVar, subtitleVar) => 
'            {/* Cover */}\n' +
'            <div className="text-center pt-24 pb-32">\n' +
'              <h1 className="text-4xl font-bold mb-4 uppercase">{' + subtitleVar + '} ({' + titleVar + '})</h1>\n' +
'              <h2 className="text-2xl mb-12">Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</h2>\n' +
'              <div className="mt-32 text-xl font-bold">\n' +
'                <p>{settings.school?.name || "Nama Sekolah"}</p>\n' +
'                <p>NPSN: {settings.school?.npsn || "-"}</p>\n' +
'              </div>\n' +
'            </div>\n' +
'\n' +
'            {/* Approval Page */}\n' +
'            <div className="page-break-before" style={{ pageBreakBefore: "always" }}>\n' +
'               <h3 className="text-2xl font-bold text-center mb-12">LEMBAR PENGESAHAN</h3>\n' +
'               <p className="text-justify mb-12 leading-relaxed">Dokumen {' + titleVar + '} ini telah direview, disetujui dan disahkan oleh pihak yang berwenang untuk dapat digunakan sebagai acuan kerja sekolah.</p>\n' +
'               <div className="grid grid-cols-2 gap-8 text-center mt-16">\n' +
'                 <div>\n' +
'                   <p className="mb-24">Mengesahkan,<br/>Kepala Sekolah</p>\n' +
'                   <p className="font-bold underline">{settings.principal?.name || "Belum diatur"}</p>\n' +
'                   <p>NIP. {settings.principal?.nip || "-"}</p>\n' +
'                 </div>\n' +
'                 <div>\n' +
'                   <p className="mb-24">Menyetujui,<br/>Ketua Komite</p>\n' +
'                   <p className="font-bold underline">{settings.komite?.name || "Belum diatur"}</p>\n' +
'                 </div>\n' +
'               </div>\n' +
'            </div>\n' +
'\n' +
'            {/* Table of Contents */}\n' +
'            <div className="page-break-before" style={{ pageBreakBefore: "always" }}>\n' +
'               <h3 className="text-2xl font-bold text-center mb-12 uppercase">Daftar Isi</h3>\n' +
'               <div className="space-y-4 max-w-2xl mx-auto">\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1"><span>LEMBAR PENGESAHAN</span><span>i</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1"><span>DAFTAR ISI</span><span>ii</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-4"><span>BAB I: PENDAHULUAN</span><span>1</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 pl-4"><span>1.1 Latar Belakang</span><span>1</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 pl-4"><span>1.2 Tujuan dan Sasaran</span><span>2</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-4"><span>BAB II: ANALISIS KONDISI</span><span>4</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-4"><span>BAB III: PROGRAM KERJA</span><span>8</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-4"><span>BAB IV: RENCANA ANGGARAN</span><span>15</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-4"><span>BAB V: PENUTUP</span><span>20</span></div>\n' +
'                 <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-4"><span>LAMPIRAN</span><span>21</span></div>\n' +
'               </div>\n' +
'            </div>\n' +
'\n' +
'            {/* Body */}\n' +
'            <div className="page-break-before" style={{ pageBreakBefore: "always" }}>\n' +
'               <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB I<br/>PENDAHULUAN</h3>\n' +
'               <h4 className="font-bold text-lg mb-4">1.1 Latar Belakang</h4>\n' +
'               <p className="text-justify mb-6 leading-relaxed indent-8">Pendidikan merupakan fondasi utama dalam pembangunan karakter dan kompetensi peserta didik. {settings.school?.name || "Sekolah ini"} berkomitmen untuk terus meningkatkan mutu layanan pendidikan melalui perencanaan yang terstruktur dan terukur.</p>\n' +
'               <h4 className="font-bold text-lg mb-4">1.2 Tujuan dan Sasaran</h4>\n' +
'               <p className="text-justify mb-6 leading-relaxed indent-8">Tujuan utama penyusunan dokumen ini adalah untuk memberikan pedoman arah kebijakan dan operasional sekolah selama periode yang telah ditetapkan, guna memastikan seluruh sumber daya dimanfaatkan secara optimal.</p>\n' +
'            </div>\n' +
'\n' +
'            <div className="page-break-before" style={{ pageBreakBefore: "always" }}>\n' +
'               <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB II<br/>ANALISIS KONDISI</h3>\n' +
'               <p className="text-justify mb-6 leading-relaxed indent-8">Berdasarkan hasil Rapor Pendidikan dan evaluasi internal, terdapat beberapa area yang menjadi fokus peningkatan, terutama pada literasi, numerasi, dan iklim keamanan sekolah.</p>\n' +
'            </div>\n' +
'\n' +
'            <div className="page-break-before" style={{ pageBreakBefore: "always" }}>\n' +
'               <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB III<br/>PROGRAM KERJA</h3>\n' +
'               <table className="w-full border-collapse border border-slate-800 text-sm mb-6">\n' +
'                 <thead>\n' +
'                   <tr className="bg-slate-100">\n' +
'                     <th className="border border-slate-800 p-2">No</th>\n' +
'                     <th className="border border-slate-800 p-2">Program / Kegiatan</th>\n' +
'                     <th className="border border-slate-800 p-2">Target Waktu</th>\n' +
'                     <th className="border border-slate-800 p-2">Penanggung Jawab</th>\n' +
'                   </tr>\n' +
'                 </thead>\n' +
'                 <tbody>\n' +
'                   <tr>\n' +
'                     <td className="border border-slate-800 p-2 text-center">1</td>\n' +
'                     <td className="border border-slate-800 p-2">Peningkatan Kompetensi Guru (Bimtek IKM)</td>\n' +
'                     <td className="border border-slate-800 p-2 text-center">Juli 2024</td>\n' +
'                     <td className="border border-slate-800 p-2">Kepala Sekolah</td>\n' +
'                   </tr>\n' +
'                   <tr>\n' +
'                     <td className="border border-slate-800 p-2 text-center">2</td>\n' +
'                     <td className="border border-slate-800 p-2">Pengadaan Buku Teks Utama</td>\n' +
'                     <td className="border border-slate-800 p-2 text-center">Agustus 2024</td>\n' +
'                     <td className="border border-slate-800 p-2">Bendahara</td>\n' +
'                   </tr>\n' +
'                 </tbody>\n' +
'               </table>\n' +
'            </div>\n' +
'\n' +
'            <div className="page-break-before" style={{ pageBreakBefore: "always" }}>\n' +
'               <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB IV<br/>RENCANA ANGGARAN</h3>\n' +
'               <p className="text-justify mb-6 leading-relaxed indent-8">Seluruh rencana anggaran telah diselaraskan dengan kebutuhan program prioritas dan diinput melalui sistem ARKAS. Rincian anggaran mencakup belanja pegawai, belanja barang dan jasa, serta belanja modal.</p>\n' +
'            </div>\n' +
'\n' +
'            <div className="page-break-before" style={{ pageBreakBefore: "always" }}>\n' +
'               <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB V<br/>PENUTUP</h3>\n' +
'               <p className="text-justify mb-6 leading-relaxed indent-8">Dokumen {' + titleVar + '} ini diharapkan dapat menjadi panduan yang efektif bagi seluruh pemangku kepentingan dalam mewujudkan visi, misi, dan tujuan {settings.school?.name || "Sekolah"}.</p>\n' +
'            </div>\n' +
'\n' +
'            {/* Appendix */}\n' +
'            <div className="page-break-before" style={{ pageBreakBefore: "always" }}>\n' +
'               <h3 className="text-2xl font-bold text-center mb-8 uppercase">LAMPIRAN</h3>\n' +
'               <ul className="list-disc pl-8 space-y-2">\n' +
'                 <li>SK Tim Pengembang Sekolah</li>\n' +
'                 <li>Dokumentasi Rapat Penyusunan</li>\n' +
'                 <li>Berita Acara Pengesahan</li>\n' +
'                 <li>Rapor Pendidikan Tahun Berjalan</li>\n' +
'               </ul>\n' +
'            </div>\n';

const getExportDocxFn = (targetId, filenameVar) =>
'  const handleExportDocx = () => {\n' +
'    const header = "<html xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\' xmlns=\'http://www.w3.org/TR/REC-html40\'><head><meta charset=\'utf-8\'><title>Export HTML To Doc</title></head><body>";\n' +
'    const footer = "</body></html>";\n' +
'    const sourceHTML = header + document.getElementById("' + targetId + '").innerHTML + footer;\n' +
'    const source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(sourceHTML);\n' +
'    const fileDownload = document.createElement("a");\n' +
'    document.body.appendChild(fileDownload);\n' +
'    fileDownload.href = source;\n' +
'    fileDownload.download = ' + filenameVar + ' + ".doc";\n' +
'    fileDownload.click();\n' +
'    document.body.removeChild(fileDownload);\n' +
'  };\n';

// Apply DocumentWorkspaceView
let dwStart = code.indexOf('const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {');
let dwEnd = code.indexOf('const PublishingCenterView = ({ navigateToView }: any) => {');

let dwCode = code.substring(dwStart, dwEnd);
const pdStart = dwCode.indexOf('<div className="text-center pt-24 pb-32">');
const pdEnd = dwCode.indexOf('</div>\n        </div>\n        <style>', pdStart);

if (pdStart > -1 && pdEnd > -1) {
  dwCode = dwCode.substring(0, pdStart) + getFullContent("meta.title", "meta.subtitle") + dwCode.substring(pdEnd);
}

dwCode = dwCode.replace('if (isPrintMode) {', getExportDocxFn("printable-doc", '`${meta.title} - ${settings.school?.name || "Sekolah"}`') + '\n  if (isPrintMode) {');
dwCode = dwCode.replace('alert("Mengunduh format DOCX...")', 'handleExportDocx()');
dwCode = dwCode.replace(
  '<Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white h-9" onClick={() => { setTimeout(() => window.print(), 100); }}><FileText className="w-4 h-4 mr-2" /> Export PDF</Button>',
  '<Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white h-9" onClick={() => { setTimeout(() => window.print(), 100); }} title="Gunakan opsi Save as PDF pada browser"><FileText className="w-4 h-4 mr-2" /> Export PDF</Button>'
);
code = code.substring(0, dwStart) + dwCode + code.substring(dwEnd);

// Apply RKJMPipelineView
let rkjmStart = code.indexOf('const RKJMPipelineView = () => {');
let rkjmEnd = code.indexOf('const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {');

let rkjmCode = code.substring(rkjmStart, rkjmEnd);
const pdRkjmStart = rkjmCode.indexOf('<div className="text-center pt-24 pb-32">');
const pdRkjmEnd = rkjmCode.indexOf('</div>\n        </div>\n        <style>', pdRkjmStart);

if (pdRkjmStart > -1 && pdRkjmEnd > -1) {
  rkjmCode = rkjmCode.substring(0, pdRkjmStart) + getFullContent('"Rencana Kerja Jangka Menengah"', '"RKJM"') + rkjmCode.substring(pdRkjmEnd);
}

rkjmCode = rkjmCode.replace('if (isPrintMode) {', getExportDocxFn("printable-rkjm", '`RKJM - ${settings.school?.name || "Sekolah"}`') + '\n  if (isPrintMode) {');
rkjmCode = rkjmCode.replace('alert("Mengunduh format DOCX...")', 'handleExportDocx()');
rkjmCode = rkjmCode.replace(
  '<Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white h-9" onClick={() => { setTimeout(() => window.print(), 100); }}><FileText className="w-4 h-4 mr-2" /> Export PDF</Button>',
  '<Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white h-9" onClick={() => { setTimeout(() => window.print(), 100); }} title="Gunakan opsi Save as PDF pada browser"><FileText className="w-4 h-4 mr-2" /> Export PDF</Button>'
);
code = code.substring(0, rkjmStart) + rkjmCode + code.substring(rkjmEnd);

fs.writeFileSync('src/Tampuyak.tsx', code);
