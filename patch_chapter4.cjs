const fs = require('fs');
let code = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter4Builder.ts', 'utf8');

const target1 = `    const rp = settings?.relationalPlanning;
    const objectives = rp?.objectives || [];
    const rktItems = rp?.annualPlans?.Y1?.rkt || settings?.planningResult?.rkt || [];
    const rkasItems = rp?.annualPlans?.Y1?.rkas || settings?.planningResult?.rkas || [];

    const hasData = objectives.length > 0 || rktItems.length > 0;
    const emptyStateText = "Belum tersedia hasil sinkronisasi.";
    const belumDitetapkan = "Belum ditetapkan.";

    const sections: DocumentSection[] = [];
    
    // 4.1 Peta Jalan Implementasi
    const roadmapIntro = "Peta jalan ini menguraikan tahapan pelaksanaan program prioritas sekolah selama empat tahun. Dokumen ini menjadi pedoman untuk memastikan seluruh program berjalan secara berkelanjutan.";
    
    const roadmapData: any[] = [];
    if (hasData) {
      const uniquePrograms = new Set<string>();
      objectives.forEach((obj: any) => {
        const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
        relatedRkt.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          if (!uniquePrograms.has(progName)) {
            uniquePrograms.add(progName);
            roadmapData.push({
              'Program': formatCell(progName, 12, emptyStateText),
              'Tahun Ke-1': '✓',
              'Tahun Ke-2': '✓',
              'Tahun Ke-3': '✓',
              'Tahun Ke-4': '✓',
              'Keterangan': 'Direncanakan'
            });
          }
        });
      });
      if (roadmapData.length === 0 && rktItems.length > 0) {
        const allProgs = Array.from(new Set(rktItems.map((r: any) => r.program || r.activity || emptyStateText)));
        allProgs.forEach((progName: any) => {
          roadmapData.push({
            'Program': formatCell(progName, 12, emptyStateText),
            'Tahun Ke-1': '✓',
            'Tahun Ke-2': '✓',
            'Tahun Ke-3': '✓',
            'Tahun Ke-4': '✓',
            'Keterangan': 'Direncanakan'
          });
        });
      }
    }`;

const replacement1 = `    const rp = settings?.relationalPlanning;
    const objectives = rp?.objectives || [];
    
    // Aggregate RKT and RKAS from all four years
    const rktItems: any[] = [];
    const rkasItems: any[] = [];
    
    ['Y1', 'Y2', 'Y3', 'Y4'].forEach(year => {
      const yearRkt = rp?.annualPlans?.[year]?.rkt || [];
      const yearRkas = rp?.annualPlans?.[year]?.rkas || [];
      
      yearRkt.forEach((item: any) => {
        item._assignedYear = year;
        rktItems.push(item);
      });
      
      yearRkas.forEach((item: any) => {
        item._assignedYear = year;
        rkasItems.push(item);
      });
    });

    if (rktItems.length === 0) {
        const fallbackRkt = settings?.planningResult?.rkt || [];
        fallbackRkt.forEach((item: any) => {
            item._assignedYear = 'Y1';
            rktItems.push(item);
        });
    }

    if (rkasItems.length === 0) {
        const fallbackRkas = settings?.planningResult?.rkas || [];
        fallbackRkas.forEach((item: any) => {
            item._assignedYear = 'Y1';
            rkasItems.push(item);
        });
    }

    const hasData = objectives.length > 0 || rktItems.length > 0;
    const emptyStateText = "Belum tersedia hasil sinkronisasi.";
    const belumDitetapkan = "Belum ditetapkan.";

    const sections: DocumentSection[] = [];
    
    // 4.1 Peta Jalan Implementasi
    const roadmapIntro = "Peta jalan ini menguraikan tahapan pelaksanaan program prioritas sekolah selama empat tahun. Dokumen ini menjadi pedoman untuk memastikan seluruh program berjalan secara berkelanjutan.";
    
    const roadmapData: any[] = [];
    if (hasData) {
      const uniquePrograms = new Map<string, Set<string>>();
      objectives.forEach((obj: any) => {
        const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
        relatedRkt.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          if (!uniquePrograms.has(progName)) {
            uniquePrograms.set(progName, new Set());
          }
          uniquePrograms.get(progName)!.add(rkt._assignedYear || 'Y1');
        });
      });
      
      uniquePrograms.forEach((years, progName) => {
        roadmapData.push({
          'Program': formatCell(progName, 12, emptyStateText),
          'Tahun Ke-1': years.has('Y1') ? '✓' : '-',
          'Tahun Ke-2': years.has('Y2') ? '✓' : '-',
          'Tahun Ke-3': years.has('Y3') ? '✓' : '-',
          'Tahun Ke-4': years.has('Y4') ? '✓' : '-',
          'Keterangan': 'Direncanakan'
        });
      });

      if (roadmapData.length === 0 && rktItems.length > 0) {
        const allProgs = new Map<string, Set<string>>();
        rktItems.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          if (!allProgs.has(progName)) {
            allProgs.set(progName, new Set());
          }
          allProgs.get(progName)!.add(rkt._assignedYear || 'Y1');
        });
        
        allProgs.forEach((years, progName) => {
          roadmapData.push({
            'Program': formatCell(progName, 12, emptyStateText),
            'Tahun Ke-1': years.has('Y1') ? '✓' : '-',
            'Tahun Ke-2': years.has('Y2') ? '✓' : '-',
            'Tahun Ke-3': years.has('Y3') ? '✓' : '-',
            'Tahun Ke-4': years.has('Y4') ? '✓' : '-',
            'Keterangan': 'Direncanakan'
          });
        });
      }
    }`;

code = code.replace(target1, replacement1);
fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter4Builder.ts', code);
