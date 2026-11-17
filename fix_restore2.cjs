const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const badStr = `                            </td>
                          </tr>
                        ))}
                        }
                        }
                        }
                        }
        </div>
     </div>
  );
};

const OnboardingWizardView`;

const goodStr = `                            </td>
                          </tr>
                        ))}
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
                        {(settings.relationalPlanning?.annualPlans?.Y1?.rkt || []).map((rkt: any, i: number) => {
                          const parent = (settings.relationalPlanning?.objectives || []).find((o: any) => o.id === rkt.rkjmObjectiveId);
                          return (
                            <tr key={i}>
                              <td className="border border-slate-900 p-2 text-center font-bold">{rkt.id}</td>
                              <td className="border border-slate-900 p-2">{parent?.strategicObjective || rkt.rkjmObjectiveId}</td>
                              <td className="border border-slate-900 p-2">{rkt.activity}</td>
                              <td className="border border-slate-900 p-2 text-center">{rkt.target}</td>
                            </tr>
                          );
                        })}
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
                        {(settings.relationalPlanning?.annualPlans?.Y1?.rkas || []).map((budg: any, i: number) => {
                          const parentRkt = (settings.relationalPlanning?.annualPlans?.Y1?.rkt || []).find((r: any) => r.id === budg.rktActivityId);
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
                        {(settings.relationalPlanning?.annualPlans?.Y1?.monitoring || []).map((mon: any, i: number) => {
                          const parentRkas = (settings.relationalPlanning?.annualPlans?.Y1?.rkas || []).find((r: any) => r.id === mon.rkasId);
                          return (
                            <tr key={i}>
                              <td className="border border-slate-900 p-2">{parentRkas?.budgetItem || mon.rkasId}</td>
                              <td className="border border-slate-900 p-2">{mon.evidence}</td>
                              <td className="border border-slate-900 p-2 text-center font-bold">{mon.result}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
               </div>

              <div id="chapter-bab5" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB V<br/>PENUTUP</h3>
                 <NarrativeEditor 
                   id="bab5_penutup" 
                   label="5.1 Kesimpulan" 
                   defaultText={\`Sebagai bentuk komitmen institusional, dokumen \${meta?.title || "Tampuyak"} ini ditetapkan sebagai instrumen tata kelola yang mengikat secara operasional. Pemantauan dan evaluasi (Monev) akan dilakukan secara sistematis guna menjamin perbaikan mutu yang berkesinambungan (continuous improvement).\`} 
                 />
                 <NarrativeEditor 
                   id="bab5_saran" 
                   label="5.2 Saran & Rekomendasi" 
                   defaultText="Diharapkan seluruh pemangku kepentingan dapat berkolaborasi untuk memastikan eksekusi rencana kerja dan anggaran berjalan sesuai dengan visi dan misi yang telah disepakati." 
                 />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OnboardingWizardView`;

code = code.replace(badStr, goodStr);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Restored template correctly without regex');
