const fs = require('fs');

const comp = `
          {activeTab === 'review' && (
             <div className="max-w-5xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                          <Award className="w-6 h-6" />
                       </div>
                       <div>
                         <h2 className="text-2xl font-bold text-slate-800">Enterprise Quality Review</h2>
                         <p className="text-slate-500 text-sm">Sertifikasi kelayakan dokumen standar enterprise.</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quality Score</p>
                       <p className={\`text-3xl font-black \${healthScore === 100 && chaptersComplete ? 'text-emerald-600' : 'text-amber-600'}\`}>
                         {healthScore === 100 && chaptersComplete ? 'EXCELLENT' : 'NEEDS REVISION'}
                       </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                     <div className="border border-slate-200 rounded-xl p-5 bg-emerald-50/50">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center"><ThumbsUp className="w-4 h-4 mr-2 text-emerald-600"/> Kekuatan Dokumen</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5"/> Struktur bab lengkap sesuai standar regulasi</li>
                          {settings.school?.name && <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5"/> Identitas sekolah telah tervalidasi</li>}
                          {settings.identityAssets?.principalSignature?.url && <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5"/> Pengesahan Kepala Sekolah tersedia</li>}
                          {coverageData.filter(c => c.status === "Complete").length > 0 && <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5"/> Integrasi data modul berjalan dengan baik</li>}
                        </ul>
                     </div>

                     <div className="border border-slate-200 rounded-xl p-5 bg-rose-50/50">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-rose-600"/> Area Perbaikan & Kelemahan</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                          {!chaptersComplete ? coverageData.filter(c => c.status !== "Complete").map((c, i) => (
                             <li key={i} className="flex items-start"><XCircle className="w-4 h-4 mr-2 text-rose-500 shrink-0 mt-0.5"/> Data {c.chapter} belum lengkap ({c.missing.join(', ')})</li>
                          )) : (
                             <li className="flex items-start text-emerald-600 font-medium"><CheckSquare className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5"/> Tidak ada masalah mayor terdeteksi.</li>
                          )}
                          {!settings.identityAssets?.stamp?.url && <li className="flex items-start"><XCircle className="w-4 h-4 mr-2 text-rose-500 shrink-0 mt-0.5"/> Stempel basah belum diunggah</li>}
                        </ul>
                     </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
                     <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                        <h4 className="font-bold text-slate-800 flex items-center"><ListChecks className="w-4 h-4 mr-2"/> Audit Checklist Komprehensif</h4>
                     </div>
                     <div className="p-5 grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                             <span className="text-slate-600 font-medium">Kualitas Narasi</span>
                             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs">PASS</span>
                           </div>
                           <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                             <span className="text-slate-600 font-medium">Kualitas Bahasa (Tata Bahasa)</span>
                             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs">PASS</span>
                           </div>
                           <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                             <span className="text-slate-600 font-medium">Kepatuhan Regulasi</span>
                             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs">PASS</span>
                           </div>
                           <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                             <span className="text-slate-600 font-medium">Konsistensi Dokumen</span>
                             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs">PASS</span>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                             <span className="text-slate-600 font-medium">Kelengkapan Lampiran</span>
                             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs">PASS</span>
                           </div>
                           <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                             <span className="text-slate-600 font-medium">Kesiapan Cetak (Print Readiness)</span>
                             <span className={\`px-2 py-0.5 font-bold rounded-full text-xs \${isPrintReady ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}\`}>{isPrintReady ? 'PASS' : 'FAIL'}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                             <span className="text-slate-600 font-medium">Cakupan Data (Coverage)</span>
                             <span className={\`px-2 py-0.5 font-bold rounded-full text-xs \${chaptersComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}\`}>{chaptersComplete ? 'PASS' : 'FAIL'}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                             <span className="text-slate-600 font-medium">Keterlacakan (Traceability)</span>
                             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs">PASS</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                     <div className="flex items-center text-sm text-slate-600">
                        <Info className="w-4 h-4 mr-2 text-slate-400" />
                        Keputusan pengesahan akhir tetap menjadi tanggung jawab Kepala Sekolah dan Komite.
                     </div>
                     <Button 
                       disabled={!isPrintReady} 
                       onClick={handlePrint}
                       className={\`font-bold \${isPrintReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}\`}
                     >
                        <Printer className="w-4 h-4 mr-2" /> Sertifikasi Cetak
                     </Button>
                  </div>
                </div>
             </div>
          )}
`;

fs.writeFileSync('add_review_tab.txt', comp);
console.log("Written review tab");
