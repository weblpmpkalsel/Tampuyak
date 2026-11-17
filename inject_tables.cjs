const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// I will inject the new rendering for BAB II, BAB III, BAB IV inside DocumentWorkspaceView's #printable-doc section.
// The easiest way is to replace everything inside <div id="chapter-bab2" ...> to the end of <div id="chapter-bab4" ...>

const newChapters = `
              <div id="chapter-bab2" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB II<br/>ANALISIS KONDISI DAN LINGKUNGAN STRATEGIS</h3>
                 <div className="space-y-4">
                   <h4 className="font-bold text-lg">2.1 Profil dan Konteks Sekolah</h4>
                   <p className="text-justify indent-8 leading-relaxed">
                     Sekolah {settings.school?.name || "..."} merupakan institusi pendidikan yang senantiasa beradaptasi dengan tuntutan zaman. 
                     Berdasarkan hasil analisis, sekolah telah memetakan kebutuhan dasar siswa dan kondisi lingkungan masyarakat sekitar untuk 
                     mengambil langkah-langkah strategis dalam peningkatan mutu layanan.
                   </p>
                   
                   <h4 className="font-bold text-lg mt-6">2.2 Interpretasi Rapor Pendidikan dan Identifikasi Isu</h4>
                   <p className="text-justify indent-8 leading-relaxed">
                     Evaluasi hasil belajar melalui Rapor Pendidikan menunjukkan capaian yang menjadi landasan utama penyusunan rencana jangka menengah.
                     Setiap isu strategis telah diidentifikasi dan ditautkan langsung dengan Standar Nasional Pendidikan (SNP) yang relevan.
                   </p>
                 </div>
              </div>

              <div id="chapter-bab3" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB III<br/>PROGRAM KERJA DAN STRATEGI IMPLEMENTASI</h3>
                 
                 <div className="space-y-4">
                   <h4 className="font-bold text-lg">3.1 Rencana Kerja Jangka Menengah (RKJM)</h4>
                   <p className="text-justify indent-8 leading-relaxed mb-4">
                     RKJM disusun berdasarkan isu strategis yang membutuhkan intervensi lintas tahun. Berikut adalah sasaran strategis 4 tahunan:
                   </p>
                   
                   <table className="w-full border-collapse border border-slate-900 text-[11px] mb-8">
                     <thead>
                       <tr className="bg-slate-100">
                         <th className="border border-slate-900 p-2 text-center w-12">ID</th>
                         <th className="border border-slate-900 p-2 text-left">Sasaran Strategis & Asal (Prioritas)</th>
                         <th className="border border-slate-900 p-2 text-center">Baseline</th>
                         <th className="border border-slate-900 p-2 text-center">TGT Y1</th>
                         <th className="border border-slate-900 p-2 text-center">TGT Y2</th>
                         <th className="border border-slate-900 p-2 text-center">TGT Y3</th>
                         <th className="border border-slate-900 p-2 text-center">TGT Y4</th>
                         <th className="border border-slate-900 p-2 text-left">Unit / Mitigasi</th>
                       </tr>
                     </thead>
                     <tbody>
                       {(settings.relationalPlanning?.objectives || []).map((obj, i) => (
                         <tr key={i}>
                           <td className="border border-slate-900 p-2 text-center font-bold">{obj.id}</td>
                           <td className="border border-slate-900 p-2">
                             <div className="font-bold mb-1">{obj.strategicObjective}</div>
                             <div className="text-[9px] text-slate-600">Prioritas: {obj.originatingPriority}</div>
                             <div className="text-[9px] text-slate-600">SNP: {obj.associatedSnp}</div>
                           </td>
                           <td className="border border-slate-900 p-2 text-center">{obj.baseline}</td>
                           <td className="border border-slate-900 p-2 text-center">{obj.targetY1}</td>
                           <td className="border border-slate-900 p-2 text-center">{obj.targetY2}</td>
                           <td className="border border-slate-900 p-2 text-center">{obj.targetY3}</td>
                           <td className="border border-slate-900 p-2 text-center">{obj.targetY4}</td>
                           <td className="border border-slate-900 p-2">
                             <div className="font-medium">Unit: {obj.responsibleUnit}</div>
                             <div className="text-[9px]">Risiko: {obj.risk}</div>
                             <div className="text-[9px]">Mitigasi: {obj.mitigation}</div>
                           </td>
                         </tr>
                       ))}
                       {(!settings.relationalPlanning || !settings.relationalPlanning.objectives || settings.relationalPlanning.objectives.length === 0) && (
                         <tr><td colSpan={8} className="border border-slate-900 p-4 text-center italic text-slate-500">Data RKJM belum tersedia</td></tr>
                       )}
                     </tbody>
                   </table>

                   <h4 className="font-bold text-lg mt-8">3.2 Rencana Kerja Tahunan (RKT) - Tahun Berjalan</h4>
                   <p className="text-justify indent-8 leading-relaxed mb-4">
                     Penjabaran RKJM untuk tahun pertama diwujudkan dalam program prioritas tahunan yang spesifik, dengan penunjukan tanggung jawab pelaksanaan yang mengacu pada ketercapaian target tahunan.
                   </p>

                   <table className="w-full border-collapse border border-slate-900 text-[11px] mb-8">
                     <thead>
                       <tr className="bg-slate-100">
                         <th className="border border-slate-900 p-2 text-center w-12">ID</th>
                         <th className="border border-slate-900 p-2 text-left">Induk RKJM</th>
                         <th className="border border-slate-900 p-2 text-left">Nama Kegiatan Tahunan</th>
                         <th className="border border-slate-900 p-2 text-center">Target Output</th>
                       </tr>
                     </thead>
                     <tbody>
                       {(settings.relationalPlanning?.annualPlans?.Y1?.rkt || []).map((rkt, i) => {
                         const parent = (settings.relationalPlanning?.objectives || []).find(o => o.id === rkt.rkjmObjectiveId);
                         return (
                           <tr key={i}>
                             <td className="border border-slate-900 p-2 text-center font-bold">{rkt.id}</td>
                             <td className="border border-slate-900 p-2">{parent?.strategicObjective || rkt.rkjmObjectiveId}</td>
                             <td className="border border-slate-900 p-2">{rkt.activity}</td>
                             <td className="border border-slate-900 p-2 text-center">{rkt.target}</td>
                           </tr>
                         );
                       })}
                       {(!settings.relationalPlanning?.annualPlans?.Y1?.rkt || settings.relationalPlanning.annualPlans.Y1.rkt.length === 0) && (
                         <tr><td colSpan={4} className="border border-slate-900 p-4 text-center italic text-slate-500">Data RKT belum tersedia</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
              </div>

              <div id="chapter-bab4" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB IV<br/>RENCANA ANGGARAN BIAYA (RKAS)</h3>
                 
                 <div className="space-y-4">
                   <h4 className="font-bold text-lg">4.1 Rincian Alokasi Anggaran</h4>
                   <p className="text-justify indent-8 leading-relaxed mb-4">
                     Setiap aktivitas RKT diikat dengan alokasi anggaran yang transparan dan akuntabel sesuai dengan kode rekening belanja daerah dan pusat.
                   </p>

                   <table className="w-full border-collapse border border-slate-900 text-[11px] mb-8">
                     <thead>
                       <tr className="bg-slate-100">
                         <th className="border border-slate-900 p-2 text-center w-20">Kode Rek.</th>
                         <th className="border border-slate-900 p-2 text-left">Asal Program (RKT)</th>
                         <th className="border border-slate-900 p-2 text-left">Uraian / Rincian Belanja</th>
                         <th className="border border-slate-900 p-2 text-center">Sumber</th>
                         <th className="border border-slate-900 p-2 text-right">Jumlah (Rp)</th>
                       </tr>
                     </thead>
                     <tbody>
                       {(settings.relationalPlanning?.annualPlans?.Y1?.rkas || []).map((budg, i) => {
                         const parentRkt = (settings.relationalPlanning?.annualPlans?.Y1?.rkt || []).find(r => r.id === budg.rktActivityId);
                         return (
                           <tr key={i}>
                             <td className="border border-slate-900 p-2 text-center font-mono">{budg.accountCode}</td>
                             <td className="border border-slate-900 p-2 text-[10px] text-slate-700">{parentRkt?.activity || budg.rktActivityId}</td>
                             <td className="border border-slate-900 p-2 font-bold">{budg.budgetItem}</td>
                             <td className="border border-slate-900 p-2 text-center">{budg.fundingSource}</td>
                             <td className="border border-slate-900 p-2 text-right font-mono">{budg.amount?.toLocaleString('id-ID')}</td>
                           </tr>
                         );
                       })}
                       {(!settings.relationalPlanning?.annualPlans?.Y1?.rkas || settings.relationalPlanning.annualPlans.Y1.rkas.length === 0) && (
                         <tr><td colSpan={5} className="border border-slate-900 p-4 text-center italic text-slate-500">Data RKAS belum tersedia</td></tr>
                       )}
                     </tbody>
                   </table>

                   <h4 className="font-bold text-lg mt-8">4.2 Monitoring, Evaluasi, dan Bukti Pelaksanaan</h4>
                   <p className="text-justify indent-8 leading-relaxed mb-4">
                     Untuk memastikan integritas pelaksanaan, setiap anggaran dicatat bukti output pelaksanaannya secara langsung yang bermuara pada capaian kinerja Rencana Kerja Jangka Menengah (RKJM).
                   </p>
                   
                   <table className="w-full border-collapse border border-slate-900 text-[11px] mb-8">
                     <thead>
                       <tr className="bg-slate-100">
                         <th className="border border-slate-900 p-2 text-left">Induk Belanja (RKAS)</th>
                         <th className="border border-slate-900 p-2 text-left">Bukti Monitoring</th>
                         <th className="border border-slate-900 p-2 text-center">Status Output</th>
                       </tr>
                     </thead>
                     <tbody>
                       {(settings.relationalPlanning?.annualPlans?.Y1?.monitoring || []).map((mon, i) => {
                         const parentRkas = (settings.relationalPlanning?.annualPlans?.Y1?.rkas || []).find(r => r.id === mon.rkasId);
                         return (
                           <tr key={i}>
                             <td className="border border-slate-900 p-2">{parentRkas?.budgetItem || mon.rkasId}</td>
                             <td className="border border-slate-900 p-2">{mon.evidence}</td>
                             <td className="border border-slate-900 p-2 text-center font-bold">{mon.result}</td>
                           </tr>
                         );
                       })}
                       {(!settings.relationalPlanning?.annualPlans?.Y1?.monitoring || settings.relationalPlanning.annualPlans.Y1.monitoring.length === 0) && (
                         <tr><td colSpan={3} className="border border-slate-900 p-4 text-center italic text-slate-500">Data Monitoring belum tersedia</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
              </div>
`;

// Replace BAB 2, 3, 4 blocks
const startTag = '<div id="chapter-bab2"';
const endTag = '<div id="chapter-bab5"';
const startIndex = code.indexOf(startTag);
const endIndex = code.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newChapters + '\\n              ' + code.substring(endIndex);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log('Successfully injected relational planning tables into DocumentWorkspaceView.');
} else {
  console.log('Failed to find chapters.');
}

