const fs = require('fs');

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// 1. Fix coverageData objects
const oldCoverageData = `  const coverageData = [
    { 
      id: "bab1",
      chapter: "BAB I: Pendahuluan", 
      sources: ["Data Master Sekolah", "Visi Misi"], 
      coverage: (settings.school?.name && settings.school?.npsn) ? 100 : 50,
      missing: (settings.school?.name && settings.school?.npsn) ? [] : ["Identitas Sekolah belum lengkap (Nama/NPSN)"],
      status: (settings.school?.name && settings.school?.npsn) ? "Complete" : "Partial"
    },
    { 
      id: "bab2",
      chapter: "BAB II: Analisis Kondisi", 
      sources: ["Rapor Pendidikan", "Analisis Prioritas (SWOT)"], 
      coverage: settings.rapor?.indicators?.length ? 100 : 0,
      missing: settings.rapor?.indicators?.length ? [] : ["Sinkronisasi Rapor Pendidikan belum dilakukan"],
      status: settings.rapor?.indicators?.length ? "Complete" : "Missing"
    },
    {
      id: "bab3",
      chapter: "BAB III: Program Kerja",
      sources: ["Rencana Kerja Tahunan (RKT)", "Modul Perencanaan"],
      coverage: settings.planning?.rkt?.programs?.length ? 100 : 0,
      missing: settings.planning?.rkt?.programs?.length ? [] : ["Program RKT belum disusun"],
      status: settings.planning?.rkt?.programs?.length ? "Complete" : "Missing"
    },
    {
      id: "bab4",
      chapter: "BAB IV: Rencana Anggaran",
      sources: ["ARKAS", "Modul Anggaran"],
      coverage: settings.planning?.rkas?.activities?.length ? 100 : 0,
      missing: settings.planning?.rkas?.activities?.length ? [] : ["Rencana kegiatan (RKAS) belum diisi"],
      status: settings.planning?.rkas?.activities?.length ? "Complete" : "Missing"
    },
    {
      id: "appendix",
      chapter: "LAMPIRAN",
      sources: ["Aset Dokumen", "Bukti Fisik"],
      coverage: 100,
      missing: [],
      status: "Complete"
    }
  ];`;

const newCoverageData = `  const coverageData = [
    { 
      id: "bab1",
      chapter: "BAB I: Pendahuluan", 
      sources: ["Data Master Sekolah", "Visi Misi"], 
      coverage: (settings.school?.name && settings.school?.npsn) ? 100 : 50,
      missing: (settings.school?.name && settings.school?.npsn) ? [] : [{ dataset: "Identitas Sekolah (Nama/NPSN)", module: "Pengaturan > Identitas Sekolah", link: "dataSekolah", action: "Lengkapi data NPSN dan Nama Sekolah pada form Identitas." }],
      status: (settings.school?.name && settings.school?.npsn) ? "Complete" : "Partial"
    },
    { 
      id: "bab2",
      chapter: "BAB II: Analisis Kondisi", 
      sources: ["Rapor Pendidikan", "Analisis Prioritas (SWOT)"], 
      coverage: settings.rapor?.indicators?.length ? 100 : 0,
      missing: settings.rapor?.indicators?.length ? [] : [{ dataset: "Data Rapor Pendidikan", module: "Modul Rapor Pendidikan", link: "rapor", action: "Lakukan sinkronisasi data Rapor Pendidikan." }],
      status: settings.rapor?.indicators?.length ? "Complete" : "Missing"
    },
    {
      id: "bab3",
      chapter: "BAB III: Program Kerja",
      sources: ["Rencana Kerja Tahunan (RKT)", "Modul Perencanaan"],
      coverage: settings.planning?.rkt?.programs?.length ? 100 : 0,
      missing: settings.planning?.rkt?.programs?.length ? [] : [{ dataset: "Program Rencana Kerja Tahunan", module: "Perencanaan > RKT", link: "documentDetail_rkt", action: "Buat minimal 1 program Rencana Kerja Tahunan." }],
      status: settings.planning?.rkt?.programs?.length ? "Complete" : "Missing"
    },
    {
      id: "bab4",
      chapter: "BAB IV: Rencana Anggaran",
      sources: ["ARKAS", "Modul Anggaran"],
      coverage: settings.planning?.rkas?.activities?.length ? 100 : 0,
      missing: settings.planning?.rkas?.activities?.length ? [] : [{ dataset: "Rincian Kegiatan (RKAS)", module: "Perencanaan > RKAS", link: "documentDetail_rkas", action: "Buat dan tetapkan rincian kegiatan RKAS." }],
      status: settings.planning?.rkas?.activities?.length ? "Complete" : "Missing"
    },
    {
      id: "appendix",
      chapter: "LAMPIRAN",
      sources: ["Aset Dokumen", "Bukti Fisik"],
      coverage: 100,
      missing: [],
      status: "Complete"
    }
  ];`;

content = content.replace(oldCoverageData, newCoverageData);

// 2. Fix diagnostic UI rendering
const oldMissingRendering = `{cov.missing.length > 0 && (
                           <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                             <p className="text-xs font-bold text-rose-700 mb-2 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" /> Tindakan Diperlukan:</p>
                             <ul className="list-disc pl-5 text-sm text-rose-600 space-y-1">
                               {cov.missing.map((m, i) => <li key={i}>{m}</li>)}
                             </ul>
                             <Button variant="outline" className="h-7 text-xs mt-3 bg-white border-rose-200 text-rose-700 hover:bg-rose-100" onClick={() => navigateToView("beranda")}>Lengkapi Data</Button>
                           </div>
                         )}`;
const newMissingRendering = `{cov.missing.length > 0 && (
                           <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4">
                             <div className="flex items-center gap-2 mb-3">
                               <AlertTriangle className="w-5 h-5 text-rose-600" />
                               <h4 className="font-bold text-rose-800 text-sm">Diagnosis Sertifikasi Data</h4>
                             </div>
                             <div className="space-y-3">
                               {cov.missing.map((m: any, i: number) => (
                                 <div key={i} className="bg-white border border-rose-100 rounded-lg p-3 text-sm flex flex-col gap-2">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b border-rose-50 pb-2">
                                     <div><span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider block">Missing Dataset</span><span className="font-semibold text-slate-800">{m.dataset}</span></div>
                                     <div><span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider block">Source Module</span><span className="font-semibold text-slate-800">{m.module}</span></div>
                                   </div>
                                   <div>
                                     <span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider block">Recommended Action</span>
                                     <span className="text-rose-700 font-medium">{m.action}</span>
                                   </div>
                                   <Button variant="outline" size="sm" className="w-full mt-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => navigateToView(m.link)}>
                                     <ExternalLink className="w-4 h-4 mr-2" /> Buka Modul {m.module.split(' > ').pop()}
                                   </Button>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}`;
content = content.replace(oldMissingRendering, newMissingRendering);

// 3. Fix narrative data structure in the review tab
const oldReviewText = `Data {c.chapter} belum lengkap ({c.missing.join(', ')})`;
const newReviewText = `Data {c.chapter} belum lengkap ({c.missing.map((m: any) => m.dataset).join(', ')})`;
content = content.replace(oldReviewText, newReviewText);

// 4. Fix master settings access in Approval chapter
content = content.replace(`{settings.master?.principal?.name || "Nama Kepala Sekolah"}`, `{settings.principal?.name || "Nama Kepala Sekolah"}`);
content = content.replace(`{settings.master?.principal?.nip || "-"}`, `{settings.principal?.nip || "-"}`);
content = content.replace(`{settings.master?.committee?.name || "Nama Ketua Komite"}`, `{settings.komite?.name || "Nama Ketua Komite"}`);

// 5. Always render #printable-doc and inject print styles
const oldPratinjauStart = `          {activeTab === 'pratinjau' && (
          <div 
            className="flex flex-col items-center gap-8 transition-transform origin-top" 
            style={{ transform: \`scale(\${zoom / 100})\` }}
          >`;
const newPratinjauStart = `          <div 
            className={\`flex flex-col items-center gap-8 transition-transform origin-top \${activeTab === 'pratinjau' ? 'flex' : 'hidden print:flex'}\`}
            style={{ transform: \`scale(\${zoom / 100})\` }}
          >`;
content = content.replace(oldPratinjauStart, newPratinjauStart);

const oldPratinjauEnd = `              <div className="hidden print:block fixed bottom-4 left-0 w-full text-center">
                 <p className="text-[10px] text-slate-500 font-sans font-medium">Dihasilkan oleh TAMPUYAK OS (School Operating System) v1.0.0</p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};`;
const newPratinjauEnd = `              <div className="hidden print:block fixed bottom-4 left-0 w-full text-center">
                 <p className="text-[10px] text-slate-500 font-sans font-medium">Dihasilkan oleh TAMPUYAK OS (School Operating System) v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{\`
        @media print {
          body * { visibility: hidden; }
          .print\\\\:hidden { display: none !important; }
          #printable-doc { position: absolute; left: 0; top: 0; width: 100%; max-width: none; }
          #printable-doc, #printable-doc * { visibility: visible; }
        }
      \`}</style>
    </div>
  );
};`;
content = content.replace(oldPratinjauEnd, newPratinjauEnd);

// Write back
fs.writeFileSync('src/Tampuyak.tsx', content);
console.log("Done applying fixes");
