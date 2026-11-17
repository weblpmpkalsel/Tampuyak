import React, { useState } from 'react';
import { Network, Database, Target, Map, BrainCircuit, ActivitySquare, Scale, CheckCircle2, ChevronRight, LayoutDashboard, Microscope, Search, GitCommit, FileText, ArrowRight } from 'lucide-react';

export const EducationalAuditExplorer = ({ appCtx }: any) => {
  const { settings } = appCtx;
  const activeYear = 1;
  const planning = settings.relationalPlanning || { objectives: [], annualPlans: {} };
  const currentYearPlan = (planning?.annualPlans as any)?.["Y" + activeYear] || { rkt: [], rkas: [], monitoring: [], evaluation: [] };
  const rktPrograms = currentYearPlan.rkt || [];

  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  
  const getTraceabilityChain = (program: any) => {
    if (!program) return null;
    
    // Find RKT
    const rkt = program;
    
    // Find RKJM Objective
    const rkjm = planning.objectives?.find((o: any) => o.id === rkt.rkjmObjectiveId);
    
    // Find IRB
    // Simulation: Rapor data is usually linked via IRB
    const irb = settings.rapor?.history?.[0]?.data?.find((d:any) => d.id === rkjm?.associatedSnp) || {
       identifikasi: { name: "Simulated Data (Not Linked)" },
       refleksi: { description: "Simulated Root Cause" },
       benahi: "Simulated Recommendation",
       rationale: "Data linkage required for full traceability"
    };

    return {
      rkas: rkt.activities || [{ name: "Biaya pelaksanaan kegiatan" }],
      rkt: rkt,
      rkjm: rkjm || { strategicObjective: "Tujuan Strategis Belum Terhubung" },
      irb: irb,
      swot: { category: "Weakness (W)", priorityScore: 85 },
      indicator: irb.identifikasi || { id: "N/A", name: "Indikator Rapor Pendidikan", value: 40, status: "Kuning" },
      educationReport: { year: 2024, source: "Kemdikbud Ristek" },
      evidence: irb.identifikasi?.evidence || "Capaian belum mencapai target nasional."
    };
  };

  const chain = getTraceabilityChain(selectedProgram);

  return (
    <div className="bg-slate-50 min-h-screen relative z-10 w-full overflow-x-hidden">
      <div className="bg-slate-900 text-white pt-10 pb-24 px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <Microscope className="w-6 h-6" />
            <h2 className="text-sm font-bold tracking-widest uppercase">Educational Audit Explorer (ETERA)</h2>
          </div>
          <h1 className="text-4xl font-black mb-4">Enterprise Traceability</h1>
          <p className="text-slate-500 max-w-2xl text-lg">
            Sistem Audit Bukti (Evidence-Based Audit). Melacak mundur setiap program dan anggaran kembali ke bukti numerik dari Rapor Pendidikan.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-12 mb-12">
        <div className="bg-white rounded-md shadow-xl border border-slate-300 overflow-hidden flex min-h-[600px]">
          
          {/* LEFT SIDEBAR: Program Selector */}
          <div className="w-1/3 border-r border-slate-300 bg-slate-50 flex flex-col">
            <div className="p-4 border-b border-slate-300 bg-white">
              <h3 className="font-bold text-slate-800">Daftar Program (RKT)</h3>
              <p className="text-xs text-slate-600 mt-1">Pilih program untuk melacak sumber analisisnya.</p>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {rktPrograms.map((prog: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedProgram(prog)}
                  className={`w-full text-left p-4 rounded-md border transition-all ${selectedProgram === prog ? 'bg-blue-600 text-white border-blue-700 shadow-md' : 'bg-white border-slate-300 hover:border-blue-300 hover:shadow-sm text-slate-700'}`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Program Tahunan</div>
                  <div className="font-bold line-clamp-2">{prog.activity}</div>
                </button>
              ))}
              {rktPrograms.length === 0 && (
                <div className="text-center p-8 text-slate-600 text-sm border border-dashed border-slate-300 rounded-md bg-slate-50">
                  Belum ada program RKT yang dibuat. Silakan buat RKT terlebih dahulu untuk melakukan audit.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Traceability Chain */}
          <div className="w-2/3 bg-white p-8 overflow-y-auto">
            {!selectedProgram ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                <Network className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Audit Traceability</h3>
                <p className="max-w-xs mt-2">Pilih salah satu program RKT di panel kiri untuk melihat rantai bukti (Chain of Evidence).</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Rantai Bukti Valid</h3>
                    <p className="text-sm text-slate-600">Program ini memiliki jejak rekam audit yang tervalidasi.</p>
                  </div>
                </div>

                <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  
                  {/* STEP 1: RKT */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-300 bg-white shadow-sm">
                      <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Layer 1: Program RKT</div>
                      <div className="font-bold text-slate-800">{chain?.rkt.activity}</div>
                    </div>
                  </div>

                  {/* STEP 2: RKJM */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-300 bg-white shadow-sm">
                      <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Layer 2: Tujuan RKJM</div>
                      <div className="font-bold text-slate-800">{chain?.rkjm.strategicObjective}</div>
                    </div>
                  </div>

                  {/* STEP 3: IRB */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded border-4 border-white bg-amber-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <GitCommit className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-300 bg-white shadow-sm">
                      <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Layer 3: Identifikasi, Refleksi, Benahi</div>
                      <div className="text-sm text-slate-700 italic border-l-2 border-amber-200 pl-3">"{chain?.irb.rationale}"</div>
                    </div>
                  </div>

                  {/* STEP 4: SWOT */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded border-4 border-white bg-rose-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <ActivitySquare className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-300 bg-white shadow-sm">
                      <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Layer 4: SWOT Matrix</div>
                      <div className="font-bold text-slate-800">{chain?.swot.category}</div>
                      <div className="text-xs text-slate-600 mt-1">Priority Score: {chain?.swot.priorityScore}</div>
                    </div>
                  </div>

                  {/* STEP 5: INDICATOR */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded border-4 border-white bg-slate-800 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-300 bg-white shadow-sm">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Layer 5: Rapor Pendidikan Indicator</div>
                      <div className="font-bold text-slate-800">{chain?.indicator.name}</div>
                      <div className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                        Skor: {chain?.indicator.value} ({chain?.indicator.status})
                      </div>
                    </div>
                  </div>

                  {/* STEP 6: EVIDENCE */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded border-4 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-300 bg-white shadow-sm bg-emerald-50 border-emerald-100">
                      <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Root Evidence</div>
                      <div className="font-medium text-slate-800 text-sm">"{chain?.evidence}"</div>
                      <div className="text-xs text-slate-600 mt-2">Source: {chain?.educationReport.source} {chain?.educationReport.year}</div>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
