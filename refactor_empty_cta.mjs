import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// RKAS Empty State in RelationalPlanningView (around line 9870)
const oldRkasEmpty = `{(!currentYearPlan.rkas || currentYearPlan.rkas.length === 0) ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--color-eds-border)]">
            <p className="text-[var(--color-eds-text-secondary)]">Belum ada rincian anggaran RKAS untuk Tahun {activeYear}.</p>
         </div>
      ) : (`;

const newRkasEmpty = `{(!currentYearPlan.rkas || currentYearPlan.rkas.length === 0) ? (
         <EmptyState 
           icon={FileText} 
           title="Data RKAS Belum Tersedia" 
           description={"Belum ada rincian anggaran RKAS yang disusun untuk Tahun " + activeYear + ". Silakan susun Rencana Kegiatan dan Anggaran Sekolah."}
           ctaText="Susun RKAS"
           onCtaClick={() => navigateToView("rkasDerivation")}
         />
      ) : (`;
content = content.replace(oldRkasEmpty, newRkasEmpty);

// Add CTA to existing EmptyStates in RelationalPlanningView
content = content.replace(/description=\{"Belum ada data implementasi yang ditambahkan untuk Tahun " \+ activeYear \+ "\. Silakan tambahkan data pelaksanaan program\."\}\n\s*\/>/g, `description={"Belum ada data implementasi yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan data pelaksanaan program."}\n             ctaText="Ke Modul Pelaksanaan"\n             onCtaClick={() => navigateToView("monitoring")}\n           />`);

content = content.replace(/description=\{"Belum ada data monitoring yang ditambahkan untuk Tahun " \+ activeYear \+ "\. Silakan tambahkan laporan bukti pelaksanaan\."\}\n\s*\/>/g, `description={"Belum ada data monitoring yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan laporan bukti pelaksanaan."}\n             ctaText="Ke Modul Monitoring"\n             onCtaClick={() => navigateToView("monitoring")}\n           />`);

content = content.replace(/description=\{"Belum ada data evaluasi yang ditambahkan untuk Tahun " \+ activeYear \+ "\. Silakan tambahkan hasil evaluasi program\."\}\n\s*\/>/g, `description={"Belum ada data evaluasi yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan hasil evaluasi program."}\n             ctaText="Ke Modul Evaluasi"\n             onCtaClick={() => navigateToView("monitoring")}\n           />`);


// RKT Empty State (if exists)
const oldRktEmpty = `{(!currentYearPlan.rkt || currentYearPlan.rkt.length === 0) ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--color-eds-border)]">
            <p className="text-[var(--color-eds-text-secondary)]">Belum ada rincian aktivitas RKT untuk Tahun {activeYear}.</p>
         </div>
      ) : (`;
const newRktEmpty = `{(!currentYearPlan.rkt || currentYearPlan.rkt.length === 0) ? (
         <EmptyState 
           icon={FileText} 
           title="Data RKT Belum Tersedia" 
           description={"Belum ada rincian aktivitas RKT yang disusun untuk Tahun " + activeYear + ". Silakan susun Rencana Kerja Tahunan."}
           ctaText="Susun RKT"
           onCtaClick={() => navigateToView("rktDerivation")}
         />
      ) : (`;
content = content.replace(oldRktEmpty, newRktEmpty);

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Added CTAs to empty states');
