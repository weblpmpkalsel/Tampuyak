import { DocumentChapter, DocumentSection } from '../DocumentModel';
import { generateId, sanitizeAndSummarize } from '../utils';
import { KnowledgeGraph } from '../../SPKG';

function formatCell(text: string | null | undefined, maxWords: number = 12, emptyState: string = 'Data sedang dalam tahap penyusunan'): string {
  if (!text) return emptyState;
  const sanitized = sanitizeAndSummarize(text, maxWords);
  if (sanitized === '-' || sanitized === '') return emptyState;
  
  const words = sanitized.split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return sanitized.replace(/\.$/, '');
}

function formatTahunPelaksanaan(schedule: string | null | undefined): string {
  if (!schedule) return 'Tahun Ke-1';
  if (/^20\d{2}$/.test(schedule.trim())) {
    return schedule.trim();
  }
  const s = schedule.toLowerCase();
  if (s.includes('tahun 1') || s.includes('y1') || s.includes('semester 1') || s.includes('semester 2')) return 'Tahun Ke-1';
  if (s.includes('tahun 2') || s.includes('y2') || s.includes('semester 3') || s.includes('semester 4')) return 'Tahun Ke-2';
  if (s.includes('tahun 3') || s.includes('y3') || s.includes('semester 5') || s.includes('semester 6')) return 'Tahun Ke-3';
  if (s.includes('tahun 4') || s.includes('y4') || s.includes('semester 7') || s.includes('semester 8')) return 'Tahun Ke-4';
  
  // Clean up any remaining "Semester X" mentions
  if (s.includes('semester')) return 'Tahun Ke-1';
  
  return schedule;
}

export class Chapter4Builder {
  public build(kg: KnowledgeGraph, settings: any = {}): DocumentChapter {
    (/* console.log removed */ (..._args: any[]) => {})('=================================================');
    (/* console.log removed */ (..._args: any[]) => {})('BREAKPOINT 1');
    (/* console.log removed */ (..._args: any[]) => {})('=================================================');
    (/* console.log removed */ (..._args: any[]) => {})('settings.relationalPlanning keys:', settings.relationalPlanning ? Object.keys(settings.relationalPlanning) : 'undefined');
    (/* console.log removed */ (..._args: any[]) => {})('settings.relationalPlanning.annualPlans keys:', settings.relationalPlanning?.annualPlans ? Object.keys(settings.relationalPlanning.annualPlans) : 'undefined');
    (/* console.log removed */ (..._args: any[]) => {})('Y1.rkt:', settings.relationalPlanning?.annualPlans?.Y1?.rkt);
    (/* console.log removed */ (..._args: any[]) => {})('Y1.rkas:', settings.relationalPlanning?.annualPlans?.Y1?.rkas);
    (/* console.log removed */ (..._args: any[]) => {})('Y2.rkt:', settings.relationalPlanning?.annualPlans?.Y2?.rkt);
    (/* console.log removed */ (..._args: any[]) => {})('Y2.rkas:', settings.relationalPlanning?.annualPlans?.Y2?.rkas);
    (/* console.log removed */ (..._args: any[]) => {})('Y3.rkt:', settings.relationalPlanning?.annualPlans?.Y3?.rkt);
    (/* console.log removed */ (..._args: any[]) => {})('Y3.rkas:', settings.relationalPlanning?.annualPlans?.Y3?.rkas);
    (/* console.log removed */ (..._args: any[]) => {})('Y4.rkt:', settings.relationalPlanning?.annualPlans?.Y4?.rkt);
    (/* console.log removed */ (..._args: any[]) => {})('Y4.rkas:', settings.relationalPlanning?.annualPlans?.Y4?.rkas);


    const rp = settings?.relationalPlanning;
    const objectives = rp?.objectives || [];
    
    // Aggregate RKT and RKAS from all four years
    const rktItems: any[] = [];
    const rkasItems: any[] = [];
    
    ['Y1', 'Y2', 'Y3', 'Y4'].forEach(year => {
      const yearRkt = rp?.annualPlans?.[year]?.rkt || [];
      const yearRkas = rp?.annualPlans?.[year]?.rkas || [];
      
      yearRkt.forEach((item: any) => {
        item._assignedYear = item._assignedYear || year;
        rktItems.push(item);
      });
      
      yearRkas.forEach((item: any) => {
        item._assignedYear = item._assignedYear || year;
        rkasItems.push(item);
      });
    });

    const hasData = objectives.length > 0 || rktItems.length > 0;
    const emptyStateText = "Data sedang dalam tahap penyusunan hasil sinkronisasi.";
    const belumDitetapkan = "Data sedang dalam tahap penyusunan";

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
          uniquePrograms.get(progName)!.add(rkt._assignedYear);
        });
      });
      
      (/* console.log removed */ (..._args: any[]) => {})('=================================================');
      (/* console.log removed */ (..._args: any[]) => {})('BREAKPOINT 2');
      (/* console.log removed */ (..._args: any[]) => {})('=================================================');
      (/* console.log removed */ (..._args: any[]) => {})('roadmapData:', roadmapData);
      
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
          allProgs.get(progName)!.add(rkt._assignedYear);
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
    }
    
    (/* console.log removed */ (..._args: any[]) => {})('=================================================');
    (/* console.log removed */ (..._args: any[]) => {})('BREAKPOINT 3');
    (/* console.log removed */ (..._args: any[]) => {})('=================================================');
    (/* console.log removed */ (..._args: any[]) => {})('roadmapData.length:', roadmapData.length);
    (/* console.log removed */ (..._args: any[]) => {})('rktItems.length:', rktItems.length);
    (/* console.log removed */ (..._args: any[]) => {})('rkasItems.length:', rkasItems.length);
    (/* console.log removed */ (..._args: any[]) => {})('objectives.length:', objectives.length);
    if (roadmapData.length === 0) {
      (/* console.log removed */ (..._args: any[]) => {})('=================================================');
      (/* console.log removed */ (..._args: any[]) => {})('BREAKPOINT 4');
      (/* console.log removed */ (..._args: any[]) => {})('=================================================');
      objectives.forEach((obj: any) => {
          const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
          (/* console.log removed */ (..._args: any[]) => {})('objective.id:', obj.id);
          (/* console.log removed */ (..._args: any[]) => {})('objective.name:', obj.strategicObjective || obj.objective || obj.nama);
          (/* console.log removed */ (..._args: any[]) => {})('relatedRkt.length:', relatedRkt.length);
          (/* console.log removed */ (..._args: any[]) => {})('relatedRkt:', relatedRkt);
      });
      (/* console.log removed */ (..._args: any[]) => {})('=================================================');
      (/* console.log removed */ (..._args: any[]) => {})('BREAKPOINT 5');
      (/* console.log removed */ (..._args: any[]) => {})('=================================================');
      rktItems.forEach((rktItem: any) => {
          (/* console.log removed */ (..._args: any[]) => {})('rktItem:', rktItem);
          (/* console.log removed */ (..._args: any[]) => {})('rktItem.rkjmObjectiveId:', rktItem.rkjmObjectiveId);
          (/* console.log removed */ (..._args: any[]) => {})('rktItem.objectiveId:', rktItem.objectiveId);
          (/* console.log removed */ (..._args: any[]) => {})('rktItem.program:', rktItem.program);
          (/* console.log removed */ (..._args: any[]) => {})('rktItem.activity:', rktItem.activity);
          (/* console.log removed */ (..._args: any[]) => {})('rktItem._assignedYear:', rktItem._assignedYear);
      });

      roadmapData.push({
        'Program': emptyStateText,
        'Tahun Ke-1': belumDitetapkan,
        'Tahun Ke-2': belumDitetapkan,
        'Tahun Ke-3': belumDitetapkan,
        'Tahun Ke-4': belumDitetapkan,
        'Keterangan': belumDitetapkan
      });
    }

    sections.push({
      id: generateId('DocumentSection'),
      title: '4.1 Peta Jalan Implementasi',
      paragraphs: [roadmapIntro],
      tables: [{
        title: 'Peta Jalan Implementasi',
        data: roadmapData
      }]
    });

    // 4.2 Rencana Kerja Tahunan
    const annualIntro = "Rencana kerja ini menjabarkan rincian kegiatan dari setiap program beserta penanggung jawabnya. Panduan ini disusun agar sekolah dapat melaksanakan kegiatan secara terarah dan tepat sasaran.";
    
    const annualData: any[] = [];
    if (hasData) {
      objectives.forEach((obj: any) => {
        const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
        relatedRkt.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          const actName = rkt.subActivity || (rkt.program && rkt.activity ? rkt.activity : emptyStateText);
          const executionYear = rkt._assignedYear ? `Tahun Ke-${rkt._assignedYear.replace('Y', '')}` : formatTahunPelaksanaan(rkt.schedule);
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
          const executionYear = rkt._assignedYear ? `Tahun Ke-${rkt._assignedYear.replace('Y', '')}` : formatTahunPelaksanaan(rkt.schedule);
          annualData.push({
            'Program': formatCell(progName, 12, emptyStateText),
            'Kegiatan': formatCell(actName, 12, belumDitetapkan),
            'Penanggung Jawab': formatCell(rkt.personResponsible, 12, belumDitetapkan),
            'Tahun Pelaksanaan': executionYear
          });
        });
      }
    }
    
    if (annualData.length === 0) {
      annualData.push({
        'Program': emptyStateText,
        'Kegiatan': belumDitetapkan,
        'Penanggung Jawab': belumDitetapkan,
        'Tahun Pelaksanaan': belumDitetapkan
      });
    }

    sections.push({
      id: generateId('DocumentSection'),
      title: '4.2 Rencana Kerja Tahunan',
      paragraphs: [annualIntro],
      tables: [{
        title: 'Rencana Kerja Tahunan',
        data: annualData
      }]
    });

    // 4.3 Proyeksi Anggaran
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
            const executionYear = bud._assignedYear ? `Tahun Ke-${bud._assignedYear.replace('Y', '')}` : (rkt._assignedYear ? `Tahun Ke-${rkt._assignedYear.replace('Y', '')}` : formatTahunPelaksanaan(rkt.schedule));
            budgetData.push({
              'Program': formatCell(progName, 12, emptyStateText),
              'Tahun Pelaksanaan': executionYear,
              'Estimasi Anggaran': amountDisplay,
              'Sumber Pendanaan': formatCell(bud.fundingSource, 12, 'BOS Reguler'),
              'Keterangan': formatCell(bud.budgetNarrative || bud.description || bud.notes || bud.budgetItem || rkt.activity, 12, 'Dukungan operasional program')
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
            const executionYear = bud._assignedYear ? `Tahun Ke-${bud._assignedYear.replace('Y', '')}` : formatTahunPelaksanaan(bud.schedule);
            budgetData.push({
              'Program': formatCell(bud.program, 12, emptyStateText),
              'Tahun Pelaksanaan': executionYear,
              'Estimasi Anggaran': amountDisplay,
              'Sumber Pendanaan': formatCell(bud.fundingSource, 12, 'BOS Reguler'),
              'Keterangan': formatCell(bud.budgetNarrative || bud.description || bud.notes || bud.budgetItem, 12, 'Dukungan operasional program')
            });
         });
      }
    }
    
    if (budgetData.length === 0) {
      budgetData.push({
        'Program': emptyStateText,
        'Tahun Pelaksanaan': belumDitetapkan,
        'Estimasi Anggaran': belumDitetapkan,
        'Sumber Pendanaan': belumDitetapkan,
        'Keterangan': belumDitetapkan
      });
    }

    sections.push({
      id: generateId('DocumentSection'),
      title: '4.3 Proyeksi Anggaran',
      paragraphs: [budgetIntro],
      tables: [{
        title: 'Proyeksi Anggaran',
        data: budgetData
      }]
    });

    // 4.4 Sumber Pendanaan
    const fundingIntro = "Sumber pendanaan dipetakan untuk memastikan seluruh program prioritas dapat terlaksana dengan baik. Penggunaan dana ini diarahkan sesuai dengan petunjuk teknis dan peraturan yang berlaku.";
    
    const fundingData: any[] = [];
    if (hasData && rkasItems.length > 0) {
      const sourceMap = new Map<string, Set<string>>();
      
      objectives.forEach((obj: any) => {
        const relatedRkt = rktItems.filter((r: any) => r.rkjmObjectiveId === obj.id || r.objectiveId === obj.id);
        relatedRkt.forEach((rkt: any) => {
          const progName = rkt.program || rkt.activity || emptyStateText;
          const relatedRkas = rkasItems.filter((b: any) => b.rktActivityId === rkt.id || b.activityId === rkt.id);
          
          relatedRkas.forEach((bud: any) => {
            const src = bud.fundingSource || belumDitetapkan;
            if (!sourceMap.has(src)) {
              sourceMap.set(src, new Set<string>());
            }
            sourceMap.get(src)!.add(progName);
          });
        });
      });
      
      if (sourceMap.size === 0) {
         rkasItems.forEach((bud: any) => {
            const src = bud.fundingSource || belumDitetapkan;
            const progName = bud.program || emptyStateText;
            if (!sourceMap.has(src)) {
              sourceMap.set(src, new Set<string>());
            }
            sourceMap.get(src)!.add(progName);
         });
      }

      sourceMap.forEach((programs, source) => {
        fundingData.push({
          'Sumber Pendanaan': formatCell(source, 12, 'BOS Reguler'),
          'Program': formatCell(Array.from(programs).join(', '), 12, emptyStateText),
          'Keterangan': 'Sesuai Juknis BOS Reguler'
        });
      });
    }

    if (fundingData.length === 0) {
      fundingData.push({
        'Sumber Pendanaan': emptyStateText,
        'Program': belumDitetapkan,
        'Keterangan': belumDitetapkan
      });
    }

    sections.push({
      id: generateId('DocumentSection'),
      title: '4.4 Sumber Pendanaan',
      paragraphs: [fundingIntro],
      tables: [{
        title: 'Sumber Pendanaan',
        data: fundingData
      }]
    });

    // 4.5 Monitoring dan Evaluasi
    const monitoringIntro = "Mekanisme pengawasan disusun untuk memantau ketercapaian program sesuai target yang telah ditetapkan. Hasil evaluasi ini akan digunakan sebagai dasar perbaikan layanan pendidikan sekolah ke depan.";
    
    const monitoringData: any[] = [];
    if (hasData) {
      objectives.forEach((obj: any) => {
        const objPrograms = rp?.programs ? rp.programs.filter((p: any) => p.objectiveId === obj.id || p.rkjmObjectiveId === obj.id) : (obj.programs || []);
        if (objPrograms.length > 0) {
          objPrograms.forEach((prog: any) => {
            const progName = prog.program || prog.name || obj.strategicObjective || emptyStateText;
            monitoringData.push({
              'Program': formatCell(progName, 12, emptyStateText),
              'Indikator': formatCell(prog.performanceIndicator || obj.performanceIndicator || obj.successIndicator || 'Peningkatan pencapaian', 12, 'Peningkatan pencapaian'),
              'Frekuensi': 'Setiap akhir semester',
              'Penanggung Jawab': formatCell(prog.responsiblePerson || obj.responsibleUnit, 12, 'Tim Pengembang Sekolah'),
              'Bukti Dukung': 'Laporan pelaksanaan kegiatan'
            });
          });
        } else {
          monitoringData.push({
            'Program': formatCell(obj.strategicObjective, 12, emptyStateText),
            'Indikator': formatCell(obj.performanceIndicator || obj.successIndicator || 'Peningkatan pencapaian', 12, 'Peningkatan pencapaian'),
            'Frekuensi': 'Setiap akhir semester',
            'Penanggung Jawab': formatCell(obj.responsibleUnit, 12, 'Tim Pengembang Sekolah'),
            'Bukti Dukung': 'Laporan pelaksanaan kegiatan'
          });
        }
      });
    }

    if (monitoringData.length === 0) {
      monitoringData.push({
        'Program': emptyStateText,
        'Indikator': emptyStateText,
        'Frekuensi': belumDitetapkan,
        'Penanggung Jawab': belumDitetapkan,
        'Bukti Dukung': belumDitetapkan
      });
    }

    sections.push({
      id: generateId('DocumentSection'),
      title: '4.5 Monitoring dan Evaluasi',
      paragraphs: [monitoringIntro],
      tables: [{
        title: 'Monitoring dan Evaluasi',
        data: monitoringData
      }]
    });

    // 4.6 Ringkasan Bab IV
    const summaryIntro = "Program sekolah disusun selaras dengan ketersediaan anggaran dan sumber pendanaan. Pelaksanaan kegiatan diawasi melalui pemantauan rutin untuk memastikan perbaikan mutu pendidikan yang berkelanjutan.";

    sections.push({
      id: generateId('DocumentSection'),
      title: '4.6 Ringkasan Bab IV',
      paragraphs: [summaryIntro]
    });

    return {
      id: generateId('DocumentChapter'),
      title: 'BAB IV: Kerangka Implementasi dan Pembiayaan',
      sections: sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}

