import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// The cetak tab currently looks like this:
/*
          {activeTab === "cetak" && (
            <Card title="Cetak & Ekspor" icon={Printer} description="Pilih format untuk mengunduh dokumen resmi.">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 bg-white">
                   <FileText className="w-10 h-10 text-rose-500 mb-4" />
                   <h3 className="font-bold text-slate-800 text-lg mb-2">Ekspor PDF (.pdf)</h3>
                   <p className="text-sm text-slate-500 mb-6">Format terbaik untuk pencetakan resmi.</p>
                   <Button onClick={() => { setIsPrintMode(true); setTimeout(() => window.print(), 500); }} className="w-full bg-rose-600 hover:bg-rose-700 text-white">Unduh PDF</Button>
                 </div>
                 <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 bg-white">
                   <FileText className="w-10 h-10 text-blue-500 mb-4" />
                   <h3 className="font-bold text-slate-800 text-lg mb-2">Ekspor Word (.docx)</h3>
                   <p className="text-sm text-slate-500 mb-6">Format yang dapat diedit lebih lanjut.</p>
                   <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">Unduh Word</Button>
                 </div>
               </div>
            </Card>
          )}
*/

const cetakReplacement = `          {activeTab === "cetak" && (
            <div className="space-y-6">
              <Card title="Cetak & Ekspor" icon={Printer} description="Pilih format untuk mengunduh dokumen resmi.">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 bg-white">
                     <FileText className="w-10 h-10 text-rose-500 mb-4" />
                     <h3 className="font-bold text-slate-800 text-lg mb-2">Ekspor PDF (.pdf)</h3>
                     <p className="text-sm text-slate-500 mb-6">Format terbaik untuk pencetakan resmi.</p>
                     <Button onClick={() => { setIsPrintMode(true); setTimeout(() => window.print(), 500); }} className="w-full bg-rose-600 hover:bg-rose-700 text-white">Unduh PDF</Button>
                   </div>
                   <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 bg-white">
                     <FileText className="w-10 h-10 text-blue-500 mb-4" />
                     <h3 className="font-bold text-slate-800 text-lg mb-2">Ekspor Word (.docx)</h3>
                     <p className="text-sm text-slate-500 mb-6">Format yang dapat diedit lebih lanjut.</p>
                     <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">Unduh Word</Button>
                   </div>
                 </div>
              </Card>
              <Card title="Riwayat Pencetakan" icon={History} description="Log pencetakan dan ekspor dokumen.">
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500">
                       <tr>
                         <th className="px-4 py-3 font-bold rounded-tl-xl">Tanggal</th>
                         <th className="px-4 py-3 font-bold">Dicetak Oleh</th>
                         <th className="px-4 py-3 font-bold">Versi</th>
                         <th className="px-4 py-3 font-bold rounded-tr-xl">Format</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       <tr className="hover:bg-slate-50">
                         <td className="px-4 py-3 text-slate-700">12 Juni 2026, 14:45</td>
                         <td className="px-4 py-3 font-medium text-slate-800">Operator Sekolah</td>
                         <td className="px-4 py-3 text-slate-600">v1.2</td>
                         <td className="px-4 py-3"><span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-bold">PDF</span></td>
                       </tr>
                       <tr className="hover:bg-slate-50">
                         <td className="px-4 py-3 text-slate-700">11 Juni 2026, 09:30</td>
                         <td className="px-4 py-3 font-medium text-slate-800">Kepala Sekolah</td>
                         <td className="px-4 py-3 text-slate-600">v1.1</td>
                         <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">DOCX</span></td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
              </Card>
            </div>
          )}`;

const cetakStart = code.indexOf('{activeTab === "cetak" && (');
if (cetakStart !== -1) {
  const cetakEnd = code.indexOf(')}', code.indexOf('</Card>', cetakStart)) + 2;
  code = code.substring(0, cetakStart) + cetakReplacement + code.substring(cetakEnd);
  fs.writeFileSync('src/Tampuyak.tsx', code);
}
