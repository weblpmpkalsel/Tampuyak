const fs = require('fs');
let code = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter4Builder.ts', 'utf8');

const target1 = `    // 4.2 Rencana Kerja Tahunan
    const annualIntro = "Rencana kerja ini menjabarkan rincian kegiatan dari setiap program beserta penanggung jawabnya. Panduan ini disusun agar sekolah dapat melaksanakan kegiatan secara terarah dan tepat sasaran.";
    
    const annualData: any[] = [];
    if (hasData) {
      objectives.forEach((obj: any) => {
        const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
        relatedRkt.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          const actName = rkt.subActivity || (rkt.program && rkt.activity ? rkt.activity : emptyStateText);
          annualData.push({
            'Program': formatCell(progName, 12, emptyStateText),
            'Kegiatan': formatCell(actName, 12, belumDitetapkan),
            'Penanggung Jawab': formatCell(rkt.personResponsible || obj.responsibleUnit, 12, belumDitetapkan),
            'Tahun Pelaksanaan': formatTahunPelaksanaan(rkt.schedule)
          });
        });
      });
      if (annualData.length === 0 && rktItems.length > 0) {
        rktItems.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          const actName = rkt.subActivity || (rkt.program && rkt.activity ? rkt.activity : emptyStateText);
          annualData.push({
            'Program': formatCell(progName, 12, emptyStateText),
            'Kegiatan': formatCell(actName, 12, belumDitetapkan),
            'Penanggung Jawab': formatCell(rkt.personResponsible, 12, belumDitetapkan),
            'Tahun Pelaksanaan': formatTahunPelaksanaan(rkt.schedule)
          });
        });
      }
    }`;

const replacement1 = `    // 4.2 Rencana Kerja Tahunan
    const annualIntro = "Rencana kerja ini menjabarkan rincian kegiatan dari setiap program beserta penanggung jawabnya. Panduan ini disusun agar sekolah dapat melaksanakan kegiatan secara terarah dan tepat sasaran.";
    
    const annualData: any[] = [];
    if (hasData) {
      objectives.forEach((obj: any) => {
        const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
        relatedRkt.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          const actName = rkt.subActivity || (rkt.program && rkt.activity ? rkt.activity : emptyStateText);
          const executionYear = rkt._assignedYear ? \`Tahun Ke-\${rkt._assignedYear.replace('Y', '')}\` : formatTahunPelaksanaan(rkt.schedule);
          annualData.push({
            'Program': formatCell(progName, 12, emptyStateText),
            'Kegiatan': formatCell(actName, 12, belumDitetapkan),
            'Penanggung Jawab': formatCell(rkt.personResponsible || obj.responsibleUnit, 12, belumDitetapkan),
            'Tahun Pelaksanaan': executionYear
          });
        });
      });
      if (annualData.length === 0 && rktItems.length > 0) {
        rktItems.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          const actName = rkt.subActivity || (rkt.program && rkt.activity ? rkt.activity : emptyStateText);
          const executionYear = rkt._assignedYear ? \`Tahun Ke-\${rkt._assignedYear.replace('Y', '')}\` : formatTahunPelaksanaan(rkt.schedule);
          annualData.push({
            'Program': formatCell(progName, 12, emptyStateText),
            'Kegiatan': formatCell(actName, 12, belumDitetapkan),
            'Penanggung Jawab': formatCell(rkt.personResponsible, 12, belumDitetapkan),
            'Tahun Pelaksanaan': executionYear
          });
        });
      }
    }`;

code = code.replace(target1, replacement1);
fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter4Builder.ts', code);
