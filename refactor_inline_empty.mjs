import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace empty implementation
const oldImpl = `{(!currentYearPlan.implementation || currentYearPlan.implementation.length === 0) ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--color-eds-border)]">
              <p className="text-[var(--color-eds-text-secondary)]">Belum ada data implementasi untuk Tahun {activeYear}.</p>
           </div>
        ) : (`;

const newImpl = `{(!currentYearPlan.implementation || currentYearPlan.implementation.length === 0) ? (
           <EmptyState 
             icon={FileText} 
             title="Data Pelaksanaan Belum Tersedia" 
             description={"Belum ada data implementasi yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan data pelaksanaan program."}
           />
        ) : (`;
content = content.replace(oldImpl, newImpl);

const oldMon = `{(!currentYearPlan.monitoring || currentYearPlan.monitoring.length === 0) ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--color-eds-border)]">
              <p className="text-[var(--color-eds-text-secondary)]">Belum ada data monitoring untuk Tahun {activeYear}.</p>
           </div>
        ) : (`;
const newMon = `{(!currentYearPlan.monitoring || currentYearPlan.monitoring.length === 0) ? (
           <EmptyState 
             icon={Activity} 
             title="Data Monitoring Belum Tersedia" 
             description={"Belum ada data monitoring yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan laporan bukti pelaksanaan."}
           />
        ) : (`;
content = content.replace(oldMon, newMon);

const oldEv = `{(!currentYearPlan.evaluation || currentYearPlan.evaluation.length === 0) ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--color-eds-border)]">
              <p className="text-[var(--color-eds-text-secondary)]">Belum ada data evaluasi untuk Tahun {activeYear}.</p>
           </div>
        ) : (`;
const newEv = `{(!currentYearPlan.evaluation || currentYearPlan.evaluation.length === 0) ? (
           <EmptyState 
             icon={CheckSquare} 
             title="Data Evaluasi Belum Tersedia" 
             description={"Belum ada data evaluasi yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan hasil evaluasi program."}
           />
        ) : (`;
content = content.replace(oldEv, newEv);

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Done');
