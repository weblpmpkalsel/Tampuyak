const fs = require('fs');
let code = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter4Builder.ts', 'utf8');

const target1 = `    // 4.3 Proyeksi Anggaran
    const budgetIntro = "Proyeksi anggaran ini memuat estimasi biaya yang dibutuhkan untuk mendukung pelaksanaan program sekolah. Alokasi dana direncanakan secara cermat agar penggunaan keuangan berjalan efektif dan efisien.";
    
    const budgetData: any[] = [];
    if (hasData && rkasItems.length > 0) {
      objectives.forEach((obj: any) => {
        const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
        relatedRkt.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          const relatedRkas = rkasItems.filter((b: any) => b.rktActivityId === rkt.id || b.activityId === rkt.id);
          
          relatedRkas.forEach((bud: any) => {
            let amountDisplay = bud.totalCost || bud.amount || bud.unitCost || bud.unitPrice || belumDitetapkan;
            if (amountDisplay !== belumDitetapkan && (typeof amountDisplay === 'number' || !isNaN(Number(amountDisplay)))) {
               amountDisplay = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amountDisplay));
            }
            budgetData.push({
              'Program': formatCell(progName, 12, emptyStateText),
              'Tahun Pelaksanaan': formatTahunPelaksanaan(rkt.schedule),
              'Estimasi Anggaran': amountDisplay,
              'Sumber Pendanaan': formatCell(bud.fundingSource, 12, belumDitetapkan),
              'Keterangan': formatCell(bud.budgetNarrative || bud.description || bud.notes, 12, belumDitetapkan)
            });
          });
        });
      });
      if (budgetData.length === 0) {
         rkasItems.forEach((bud: any) => {
            let amountDisplay = bud.totalCost || bud.amount || bud.unitCost || bud.unitPrice || belumDitetapkan;
            if (amountDisplay !== belumDitetapkan && (typeof amountDisplay === 'number' || !isNaN(Number(amountDisplay)))) {
               amountDisplay = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amountDisplay));
            }
            budgetData.push({
              'Program': formatCell(bud.program, 12, emptyStateText),
              'Tahun Pelaksanaan': formatTahunPelaksanaan(bud.schedule),
              'Estimasi Anggaran': amountDisplay,
              'Sumber Pendanaan': formatCell(bud.fundingSource, 12, belumDitetapkan),
              'Keterangan': formatCell(bud.budgetNarrative || bud.description || bud.notes, 12, belumDitetapkan)
            });
         });
      }
    }`;

const replacement1 = `    // 4.3 Proyeksi Anggaran
    const budgetIntro = "Proyeksi anggaran ini memuat estimasi biaya yang dibutuhkan untuk mendukung pelaksanaan program sekolah. Alokasi dana direncanakan secara cermat agar penggunaan keuangan berjalan efektif dan efisien.";
    
    const budgetData: any[] = [];
    if (hasData && rkasItems.length > 0) {
      objectives.forEach((obj: any) => {
        const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
        relatedRkt.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          const relatedRkas = rkasItems.filter((b: any) => b.rktActivityId === rkt.id || b.activityId === rkt.id);
          
          relatedRkas.forEach((bud: any) => {
            let amountDisplay = bud.totalCost || bud.amount || bud.unitCost || bud.unitPrice || belumDitetapkan;
            if (amountDisplay !== belumDitetapkan && (typeof amountDisplay === 'number' || !isNaN(Number(amountDisplay)))) {
               amountDisplay = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amountDisplay));
            }
            const executionYear = bud._assignedYear ? \`Tahun Ke-\${bud._assignedYear.replace('Y', '')}\` : (rkt._assignedYear ? \`Tahun Ke-\${rkt._assignedYear.replace('Y', '')}\` : formatTahunPelaksanaan(rkt.schedule));
            budgetData.push({
              'Program': formatCell(progName, 12, emptyStateText),
              'Tahun Pelaksanaan': executionYear,
              'Estimasi Anggaran': amountDisplay,
              'Sumber Pendanaan': formatCell(bud.fundingSource, 12, belumDitetapkan),
              'Keterangan': formatCell(bud.budgetNarrative || bud.description || bud.notes, 12, belumDitetapkan)
            });
          });
        });
      });
      if (budgetData.length === 0) {
         rkasItems.forEach((bud: any) => {
            let amountDisplay = bud.totalCost || bud.amount || bud.unitCost || bud.unitPrice || belumDitetapkan;
            if (amountDisplay !== belumDitetapkan && (typeof amountDisplay === 'number' || !isNaN(Number(amountDisplay)))) {
               amountDisplay = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amountDisplay));
            }
            const executionYear = bud._assignedYear ? \`Tahun Ke-\${bud._assignedYear.replace('Y', '')}\` : formatTahunPelaksanaan(bud.schedule);
            budgetData.push({
              'Program': formatCell(bud.program, 12, emptyStateText),
              'Tahun Pelaksanaan': executionYear,
              'Estimasi Anggaran': amountDisplay,
              'Sumber Pendanaan': formatCell(bud.fundingSource, 12, belumDitetapkan),
              'Keterangan': formatCell(bud.budgetNarrative || bud.description || bud.notes, 12, belumDitetapkan)
            });
         });
      }
    }`;

code = code.replace(target1, replacement1);
fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter4Builder.ts', code);
