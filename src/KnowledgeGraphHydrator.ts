import { KnowledgeGraph, CanonicalObject } from './SPKG';

export class KnowledgeGraphHydrator {
  static sanitizeNodeText(text: string): string {
    if (!text || typeof text !== 'string') return text;
    
    const blacklist = [
      'cara', 'klik', 'panduan', 'tutorial', 'worksheet', 'workbook', 
      'lembar', 'sheet', 'https', 'http', 'guru.kemendikdasmen', 
      'petunjuk', 'download', 'unduh', 'referensi pengisian', 'langkah'
    ];
    
    const lines = text.split('\n');
    const sanitizedLines = lines.map(line => {
      // split by dot-space or dot-end
      const sentences = line.split(/(?<=\.)\s+/);
      const cleanSentences = sentences.filter(sentence => {
        const lower = sentence.toLowerCase();
        return !blacklist.some(keyword => lower.includes(keyword));
      });
      return cleanSentences.join(' ');
    });
    
    return sanitizedLines.filter(line => line.trim().length > 0).join('\n').trim();
  }

  static hydrate(kg: KnowledgeGraph, canonical: any) {
    kg.clear();

    const safeAddNode = (node: any) => {
      if (node.title) node.title = KnowledgeGraphHydrator.sanitizeNodeText(node.title);
      if (node.description) node.description = KnowledgeGraphHydrator.sanitizeNodeText(node.description);
      if (node.summary) node.summary = KnowledgeGraphHydrator.sanitizeNodeText(node.summary);
      if (node.analysis) node.analysis = KnowledgeGraphHydrator.sanitizeNodeText(node.analysis);
      if (node.data) {
        if (node.data.summary) node.data.summary = KnowledgeGraphHydrator.sanitizeNodeText(node.data.summary);
        if (node.data.analysis) node.data.analysis = KnowledgeGraphHydrator.sanitizeNodeText(node.data.analysis);
      }
      kg.addNode(node);
    };

    const { schoolData, recommendations, rkt, rkas, indicators } = canonical;

    let totalNodes = 0;
    const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

    // 1. School Node
    const workspaceId = 'school-1';
    if (schoolData) {
      safeAddNode({
        id: workspaceId,
        type: 'School',
        title: schoolData.name || 'Nama Sekolah Tidak Diketahui',
        description: `NPSN: ${schoolData.npsn || '-'}`,
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
      });
      totalNodes++;
    }

    // 2. Report Node
    const reportId = 'report-1';
    safeAddNode({
      id: reportId,
      type: 'EducationReport',
      title: 'Rapor Pendidikan',
      description: 'Dataset Rapor Pendidikan yang diimpor',
      evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
      createdAt: Date.now(), updatedAt: Date.now(), parentId: workspaceId, childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    });
    totalNodes++;

    // Base default nodes needed by DocumentCompositionEngine
    safeAddNode({ id: 'bg-1', type: 'Background', title: 'Latar Belakang', description: 'Dokumen ini disusun berdasarkan analisis kondisi objektif satuan pendidikan.', evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System', createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 });
    safeAddNode({ id: 'vision-1', type: 'Vision', title: 'Visi', description: 'Mewujudkan peserta didik yang berkarakter, cerdas, dan kompetitif.', evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System', createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 });
    safeAddNode({ id: 'mission-1', type: 'Mission', title: 'Misi', description: 'Menyelenggarakan pendidikan berkualitas dan mengembangkan potensi siswa secara optimal.', evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System', createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 });
    safeAddNode({ id: 'legal-1', type: 'LegalBasis', title: 'Landasan Hukum', description: 'Penyusunan dokumen berpedoman pada peraturan perundang-undangan yang berlaku di bidang pendidikan.', evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System', createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 });
    safeAddNode({ id: 'planning-1', type: 'PlanningMethodology', title: 'Metodologi', description: 'Perencanaan disusun melalui pendekatan partisipatif dan berbasis data.', evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System', createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 });
    safeAddNode({ id: 'purpose-1', type: 'Purpose', title: 'Tujuan', description: 'Memberikan arah kebijakan dan pedoman pelaksanaan program pendidikan di sekolah.', evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System', createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 });
    safeAddNode({ id: 'eval-1', type: 'Evaluation', title: 'Evaluasi', description: 'Evaluasi dilakukan secara berkala untuk mengukur capaian target program.', evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System', createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 });
    safeAddNode({ id: 'mon-1', type: 'Monitoring', title: 'Monitoring', description: 'Monitoring pelaksanaan program dilakukan berkesinambungan oleh tim penjaminan mutu.', evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System', createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 });
    totalNodes += 8;

    // 3. Indicators
    let indicatorCount = 0;
    if (indicators) {
      const indsArray = Array.isArray(indicators) ? indicators : Object.entries(indicators).map(([id, val]: any) => ({ id, ...val }));
      for (const ind of indsArray) {
        safeAddNode({
          id: ind.id || generateId('ind'),
          type: 'Indicator',
          title: `Indikator ${ind.id || '-'}`,
          description: `Capaian: ${ind.value || ind.nilai || '-'} (${ind.category || ind.kategori || '-'}). Tren: ${ind.trend || '-'}.`,
          evidence: [], source: 'EducationReport', createdBy: 'Parser', generatedBy: 'System',
          createdAt: Date.now(), updatedAt: Date.now(), parentId: reportId, childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
        });
        indicatorCount++;
        totalNodes++;
      }
    }

    // 4. IRB & Recommendations
    let irbCount = 0;
    let recCount = 0;
    if (recommendations && recommendations.length > 0) {
      recommendations.forEach((rec: any) => {
        const recText = [rec.masalah, rec.problem, rec.akarMasalah, rec.rootCause, rec.benahi, rec.recommendation, rec.kegiatan, rec.activity].join(" ").toLowerCase();
        const isInstructional = /cara\b|\bpanduan\b|\bklik\b|\banda dapat\b|\bperencanaan perlu terjadi\b|\blihat\b|\bkumpulan materi\b|https|guru\.kemendikdasmen|\btahapan\b|\bpetunjuk\b|\blangkah\b|\breferensi\b/i.test(recText);

        if (isInstructional) {
            return; // Skip this recommendation
        }

        const irbId = rec.irbId || generateId('irb');
        safeAddNode({
          id: irbId,
          type: 'IRB',
          title: `IRB: ${rec.masalah || rec.problem}`,
          description: `Masalah: ${rec.masalah || rec.problem}. Akar Masalah: ${rec.akarMasalah || rec.rootCause}. Benahi: ${rec.benahi || rec.recommendation}.`,
          evidence: [], source: 'EducationReport', createdBy: 'Parser', generatedBy: 'System',
          data: rec,
          createdAt: Date.now(), updatedAt: Date.now(), parentId: reportId, childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
        });
        irbCount++;
        totalNodes++;

        const recId = rec.id || rec.recommendationId || generateId('rec');
        safeAddNode({
          id: recId,
          type: 'Recommendation',
          title: rec.benahi || rec.recommendation,
          description: rec.kegiatan || rec.activity,
          evidence: [], source: 'EducationReport', createdBy: 'Parser', generatedBy: 'System',
          createdAt: Date.now(), updatedAt: Date.now(), parentId: irbId, childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
        });
        recCount++;
        totalNodes++;
      });
    }

    // 5. Strategic Objectives, Programs, Activities (RKT)
    let programCount = 0;
    let activityCount = 0;
    let objCount = 0;
    if (rkt && rkt.length > 0) {
      // Group by program
      const programs = Array.from(new Set(rkt.map((p: any) => p.program)));
      programs.forEach((progName: any) => {
        const activities = rkt.filter((p: any) => p.program === progName);
        const firstAct = activities[0] || {};
        const objId = firstAct.objectiveId || generateId('obj');
        
        safeAddNode({
          id: objId,
          type: 'StrategicObjective',
          title: `Tujuan Strategis: ${progName}`,
          description: `Peningkatan mutu melalui program ${progName}.`,
          evidence: [], source: 'RKT', createdBy: 'Parser', generatedBy: 'System',
          createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
        });
        objCount++;
        totalNodes++;

        const progId = firstAct.programId || generateId('prog');
        safeAddNode({
          id: progId,
          type: 'StrategicProgram',
          title: progName,
          description: progName,
          evidence: [], source: 'RKT', createdBy: 'Parser', generatedBy: 'System',
          createdAt: Date.now(), updatedAt: Date.now(), parentId: objId, childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
        });
        programCount++;
        totalNodes++;

        activities.forEach((act: any) => {
          safeAddNode({
            id: act.id || generateId('act'),
            type: 'Activity',
            title: act.kegiatan || act.activity,
            description: act.penjelasan || act.description,
            data: act,
            evidence: [], source: 'RKT', createdBy: 'Parser', generatedBy: 'System',
            createdAt: Date.now(), updatedAt: Date.now(), parentId: progId, childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
          });
          activityCount++;
          totalNodes++;
        });
      });
    }

    // 6. Budgets (RKAS)
    let budgetCount = 0;
    if (rkas && rkas.length > 0) {
      rkas.forEach((bud: any) => {
        safeAddNode({
          id: bud.id || generateId('budget'),
          type: 'Budget',
          title: bud.kegiatan || bud.activity,
          description: `Volume: ${bud.volume} ${bud.satuan || bud.unit}. Biaya: ${bud.total || bud.totalCost}.`,
          data: { amount: bud.total || bud.totalCost },
          evidence: [], source: 'RKAS', createdBy: 'Parser', generatedBy: 'System',
          createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
        });
        budgetCount++;
        totalNodes++;
      });
    }

    // Validation Report
    (/* console.log removed */ (..._args: any[]) => {})("=====================================================");
    (/* console.log removed */ (..._args: any[]) => {})("KnowledgeGraph Report");
    (/* console.log removed */ (..._args: any[]) => {})(`School               ${schoolData ? 1 : 0}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Indicators           ${indicatorCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Recommendations      ${recCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Strategic Objectives ${objCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Programs             ${programCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Activities           ${activityCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Budgets              ${budgetCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Monitoring           1`);
    (/* console.log removed */ (..._args: any[]) => {})(`Evaluation           1`);
    (/* console.log removed */ (..._args: any[]) => {})(`IRB                  ${irbCount}`);
    (/* console.log removed */ (..._args: any[]) => {})(`SWOT                 0`);
    (/* console.log removed */ (..._args: any[]) => {})(`Relationships        ${totalNodes}`);
    (/* console.log removed */ (..._args: any[]) => {})("=====================================================");

    if (totalNodes === 0) {
      console.error("Knowledge Graph Hydration Failure.");
      throw new Error("Knowledge Graph Hydration Failure.");
    }
  }
}
