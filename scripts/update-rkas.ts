import fs from 'fs';

const rkasReplacement = `export const renderRKASChapters = (settings: any, NarrativeEditor: any, EmptyTableDiagnostic: any, setActiveTab: any) => {
  const getYears = () => [1, 2, 3, 4];

  // Helper to calculate totals
  const getBudgetRecap = () => {
     let totalBudget = 0;
     const byFundingSource: Record<string, number> = {};
     const byProgram: Record<string, number> = {};

     getYears().forEach(y => {
        const rkasData = settings.relationalPlanning?.annualPlans?.["Y" + y]?.rkas || [];
        rkasData.forEach((budg: any) => {
           const amount = parseFloat(budg.amount) || 0;
           totalBudget += amount;
           byFundingSource[budg.fundingSource] = (byFundingSource[budg.fundingSource] || 0) + amount;
           const parentRkt = (settings.relationalPlanning?.annualPlans?.["Y" + y]?.rkt || []).find((r: any) => r.id === budg.rktActivityId);
           const progName = parentRkt?.activity || "Program Lainnya";
           byProgram[progName] = (byProgram[progName] || 0) + amount;
        });
     });

     return { totalBudget, byFundingSource, byProgram };
  };

  const recap = getBudgetRecap();

  return (
    <>
      {renderTOC("rkas")}
      <div id="chapter-bab1" className="page-break-before mt-32 pt-10 min-h-[200mm]" style={{ pageBreakBefore: "always" }}>
        <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB I<br/>PENDAHULUAN</h3>
        <p className="text-justify leading-relaxed indent-8">
           Rencana Kegiatan dan Anggaran Sekolah (RKAS) ini disusun sebagai dokumen perencanaan keuangan resmi yang menjabarkan alokasi pendanaan untuk mencapai sasaran strategis sekolah dalam satu tahun anggaran. RKAS ini merupakan turunan langsung dari Rencana Kerja Tahunan (RKT) dan disusun berdasarkan prinsip transparansi, akuntabilitas, dan efisiensi guna memastikan terpenuhinya Standar Nasional Pendidikan.
        </p>
      </div>

      <div id="chapter-bab2" className="page-break-before mt-32 pt-10 min-h-[200mm]" style={{ pageBreakBefore: "always" }}>
        <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB II<br/>RINGKASAN PERENCANAAN ANGGARAN</h3>
        <p className="text-justify leading-relaxed mb-6">
          Berikut adalah ringkasan perencanaan anggaran berdasarkan sumber dana yang tersedia. RKAS dikembangkan untuk mendukung prioritas peningkatan kualitas pembelajaran, tata kelola, dan sarana prasarana sekolah sesuai dengan rekomendasi Rapor Pendidikan dan Rencana Kerja Jangka Menengah (RKJM).
        </p>
        <table className="w-full text-sm border-collapse border border-black mb-8 text-left">
          <thead>
            <tr className="bg-slate-100">
               <th className="border border-black p-2 w-16 text-center">No</th>
               <th className="border border-black p-2">Sumber Pendanaan</th>
               <th className="border border-black p-2 text-right">Estimasi Pagu Anggaran (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(recap.byFundingSource).map(([source, amount], idx) => (
               <tr key={idx}>
                 <td className="border border-black p-2 text-center">{idx + 1}</td>
                 <td className="border border-black p-2">{source}</td>
                 <td className="border border-black p-2 text-right">{(amount as number).toLocaleString('id-ID')}</td>
               </tr>
            ))}
            {Object.keys(recap.byFundingSource).length === 0 && (
               <tr>
                 <td colSpan={3} className="border border-black p-4 text-center italic">Tidak ada data sumber pendanaan</td>
               </tr>
            )}
          </tbody>
          {Object.keys(recap.byFundingSource).length > 0 && (
             <tfoot>
               <tr className="font-bold bg-slate-50">
                 <td colSpan={2} className="border border-black p-2 text-right">TOTAL ESTIMASI PENDANAAN</td>
                 <td className="border border-black p-2 text-right">{recap.totalBudget.toLocaleString('id-ID')}</td>
               </tr>
             </tfoot>
          )}
        </table>
      </div>

      <div id="chapter-bab3" className="page-break-before mt-32 pt-10 min-h-[200mm]" style={{ pageBreakBefore: "always" }}>
        <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB III<br/>PROGRAM PRIORITAS</h3>
        <p className="text-justify leading-relaxed mb-6">
          Anggaran difokuskan pada program-program strategis yang telah dirumuskan dalam Rencana Kerja Tahunan (RKT). Berikut merupakan rekapitulasi prioritas pendanaan per program:
        </p>
        <table className="w-full text-sm border-collapse border border-black mb-8 text-left">
          <thead>
            <tr className="bg-slate-100">
               <th className="border border-black p-2 w-16 text-center">No</th>
               <th className="border border-black p-2">Program Utama</th>
               <th className="border border-black p-2 text-right">Alokasi (Rp)</th>
               <th className="border border-black p-2 w-32 text-center">% dari Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(recap.byProgram).map(([prog, amount], idx) => (
               <tr key={idx}>
                 <td className="border border-black p-2 text-center">{idx + 1}</td>
                 <td className="border border-black p-2">{prog}</td>
                 <td className="border border-black p-2 text-right">{(amount as number).toLocaleString('id-ID')}</td>
                 <td className="border border-black p-2 text-center">{recap.totalBudget > 0 ? (((amount as number) / recap.totalBudget) * 100).toFixed(2) : "0.00"}%</td>
               </tr>
            ))}
             {Object.keys(recap.byProgram).length === 0 && (
               <tr>
                 <td colSpan={4} className="border border-black p-4 text-center italic">Tidak ada data program</td>
               </tr>
            )}
          </tbody>
           {Object.keys(recap.byProgram).length > 0 && (
             <tfoot>
               <tr className="font-bold bg-slate-50">
                 <td colSpan={2} className="border border-black p-2 text-right">TOTAL</td>
                 <td className="border border-black p-2 text-right">{recap.totalBudget.toLocaleString('id-ID')}</td>
                 <td className="border border-black p-2 text-center">100%</td>
               </tr>
             </tfoot>
          )}
        </table>
      </div>

      <div id="chapter-bab4" className="page-break-before mt-32 pt-10 print:w-[297mm] print:h-auto overflow-x-auto print:overflow-visible" style={{ pageBreakBefore: "always" }}>
        <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB IV<br/>RINCIAN RENCANA KEGIATAN DAN ANGGARAN</h3>
        <p className="text-justify leading-relaxed mb-6 print:w-[210mm]">
          Tabel di bawah ini memuat matriks rincian rencana kegiatan dan anggaran (RKAS) yang menjabarkan alokasi dana secara spesifik per tahun, termasuk kode rekening, sumber pendanaan, volume, dan satuan.
        </p>

        {getYears().map(year => {
           const rkasData = settings.relationalPlanning?.annualPlans?.["Y" + year]?.rkas || [];
           if (rkasData.length === 0) {
              return (
                <div key={"rkas-y" + year} className="mb-12 print:w-[210mm]">
                   <h4 className="font-bold text-lg mb-4">Tahun Ke-{year}</h4>
                   <EmptyTableDiagnostic />
                </div>
              );
           }

           return (
             <div key={"rkas-y" + year} className="mb-12 w-full print:w-full">
               <h4 className="font-bold text-lg mb-4">Rincian Anggaran Tahun Ke-{year}</h4>
               <table className="w-full text-[10px] border-collapse border border-black text-left break-inside-auto">
                 <thead>
                   <tr className="bg-slate-100 print:bg-slate-100/50 break-inside-avoid">
                      <th className="border border-black p-1 text-center w-8">No</th>
                      <th className="border border-black p-1 w-32">Program (RKT)</th>
                      <th className="border border-black p-1 w-24">Kode Rekening</th>
                      <th className="border border-black p-1">Rincian Belanja (Item)</th>
                      <th className="border border-black p-1 w-10 text-center">Vol</th>
                      <th className="border border-black p-1 w-12 text-center">Sat</th>
                      <th className="border border-black p-1 w-20 text-right">Harga Satuan</th>
                      <th className="border border-black p-1 w-24 text-right">Jumlah (Rp)</th>
                      <th className="border border-black p-1 w-20 text-center">Sumber Dana</th>
                   </tr>
                 </thead>
                 <tbody>
                   {rkasData.map((budg: any, i: number) => {
                      const parentRkt = (settings.relationalPlanning?.annualPlans?.["Y" + year]?.rkt || []).find((r: any) => r.id === budg.rktActivityId);
                      const parentRkjm = (settings.relationalPlanning?.objectives || []).find((o: any) => o.id === parentRkt?.rkjmObjectiveId);
                      
                      const volume = budg.volume || 1;
                      const unit = budg.unit || "LS";
                      const amount = parseFloat(budg.amount) || 0;
                      const unitPrice = amount / volume;

                      return (
                         <tr key={i} className="break-inside-avoid">
                            <td className="border border-black p-1 text-center">{i + 1}</td>
                            <td className="border border-black p-1">{parentRkt?.activity || budg.rktActivityId}</td>
                            <td className="border border-black p-1 font-mono">{budg.accountCode}</td>
                            <td className="border border-black p-1">
                               <div className="font-bold">{budg.budgetItem}</div>
                               {parentRkjm && <div className="text-[9px] text-slate-600 italic mt-0.5 break-words">Objektif: {parentRkjm.target}</div>}
                            </td>
                            <td className="border border-black p-1 text-center">{volume}</td>
                            <td className="border border-black p-1 text-center">{unit}</td>
                            <td className="border border-black p-1 text-right">{unitPrice.toLocaleString('id-ID')}</td>
                            <td className="border border-black p-1 text-right font-bold">{amount.toLocaleString('id-ID')}</td>
                            <td className="border border-black p-1 text-center">{budg.fundingSource}</td>
                         </tr>
                      );
                   })}
                 </tbody>
               </table>
             </div>
           );
        })}
      </div>

      <div id="chapter-bab5" className="page-break-before mt-32 pt-10 min-h-[200mm]" style={{ pageBreakBefore: "always" }}>
        <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB V<br/>PENUTUP</h3>
        <p className="text-justify leading-relaxed">
          Rencana Kegiatan dan Anggaran Sekolah (RKAS) ini disahkan untuk menjadi pedoman mutlak dalam pelaksanaan pengadaan barang, jasa, dan aktivitas sekolah selama satu tahun anggaran. Setiap realisasi dana wajib dipertanggungjawabkan sesuai dengan mekanisme pelaporan yang diatur dalam pedoman pengelolaan dana pendidikan yang berlaku. RKAS ini akan dipantau dan dievaluasi secara berkala guna menjamin tercapainya efektivitas dan efisiensi penggunaan sumber daya keuangan sekolah.
        </p>
      </div>
    </>
  );
};`;

const fileContent = fs.readFileSync('src/DocumentChapters.tsx', 'utf8');

// Replace the entire renderRKASChapters function
const startIdx = fileContent.indexOf('export const renderRKASChapters =');
if (startIdx !== -1) {
    const nextExport = fileContent.indexOf('export const renderMonitoringChapters =', startIdx);
    if (nextExport !== -1) {
        const newContent = fileContent.slice(0, startIdx) + rkasReplacement + "\n\n" + fileContent.slice(nextExport);
        fs.writeFileSync('src/DocumentChapters.tsx', newContent);
        console.log("Updated RKAS rendering engine!");
    } else {
        console.error("Could not find the end of renderRKASChapters");
    }
} else {
    console.error("Could not find renderRKASChapters");
}
