/**
 * Narrative Intelligence Engine
 * Tampuyak OS - Enterprise School Planning Platform
 */

import { CanonicalObject, KnowledgeGraph, SPKGNodeType } from './SPKG';
import { TargetProjectionEngine } from './TargetProjectionEngine';

export class NarrativeIntelligenceEngine {
  private kg = KnowledgeGraph.getInstance();
  private programNames = [
    'Penguatan Kapasitas Pedagogi Numerasi Terapan',
    'Integrasi Modul Literasi Berbasis Proyek',
    'Pelatihan Intensif Lesson Study Antar Guru',
    'Adaptasi Kurikulum Pendidikan Inklusif Terbimbing',
    'Optimalisasi Iklim Keamanan Berbasis Komunitas',
    'Restrukturisasi Asesmen Formatif Kontekstual',
    'Transformasi Tata Kelola Digital Berbasis Data',
    'Inovasi Modul Pembelajaran Kolaboratif'
  ];
  private programIndex = 0;

  private generateId(type: string): string {
    return `${type.toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  public generateSchoolAnalysisNarrative(workspaceId: string): CanonicalObject[] {
    const nodes: CanonicalObject[] = [];
    
    // Create Chapter II Narrative Node
    const chapterII: CanonicalObject = {
      id: this.generateId('chapter'),
      type: 'Dashboard', // Or custom type for Chapter
      title: 'BAB II: Analisis Kondisi Sekolah',
      description: 'Berdasarkan Rapor Pendidikan, pencapaian kompetensi numerasi peserta didik berada di bawah standar kompetensi yang diharapkan. Tren penurunan terlihat pada tahun terakhir, mengindikasikan adanya kendala struktural dalam pedagogi guru dan pendekatan pembelajaran. Analisis SWOT menunjukkan kekuatan pada ketersediaan sarana digital, namun kelemahan utama terletak pada kompetensi guru dalam merancang pembelajaran numerasi kontekstual. Evaluasi ini menjadi dasar dalam merumuskan prioritas peningkatan mutu sekolah.',
      evidence: ['Rapor Pendidikan 2024', 'Analisis SWOT Tahunan'],
      source: 'Narrative Engine',
      createdBy: 'System',
      generatedBy: 'AI',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      childrenIds: [],
      confidenceScore: 98,
      status: 'Active',
      version: 1,
      data: { isChapter: true }
    };
    nodes.push(chapterII);

    return nodes;
  }

  public generateIRBMatrix(parentId: string): CanonicalObject[] {
    const nodes: CanonicalObject[] = [];
    const irbId = this.generateId('irb');
    
    const irbNode: CanonicalObject = {
      id: irbId,
      type: 'IRB',
      title: 'Identifikasi, Refleksi, dan Benahi (IRB) - Numerasi',
      description: 'Matriks IRB untuk perbaikan kompetensi numerasi berdasarkan analisis capaian Rapor Pendidikan.',
      evidence: ['Rapor Pendidikan 2024'],
      source: 'Narrative Engine',
      createdBy: 'System',
      generatedBy: 'AI',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      parentId,
      childrenIds: [],
      confidenceScore: 95,
      status: 'Active',
      version: 1,
      data: {
        identification: 'Pencapaian kompetensi numerasi peserta didik berada di bawah kompetensi yang diharapkan.',
        reflection: 'Kegiatan pembelajaran masih didominasi oleh latihan prosedural, kurangnya integrasi numerasi kontekstual dalam penyelesaian masalah sehari-hari.',
        improvement: 'Penguatan pembelajaran numerasi kontekstual melalui pendampingan guru (Lesson Study) dan penyediaan modul ajar interaktif.',
        responsible: 'Tim Kurikulum',
        expectedResult: 'Peningkatan kompetensi pedagogik guru dan perbaikan skor numerasi peserta didik secara terukur.'
      }
    };
    nodes.push(irbNode);
    return nodes;
  }

  public generateStrategicProgram(parentId: string, issue: string): CanonicalObject[] {
    const nodes: CanonicalObject[] = [];
    
    // Generate Strategic Objective
    const objectiveId = this.generateId('objective');
    const objectiveNode: CanonicalObject = {
      id: objectiveId,
      type: 'StrategicObjective',
      title: 'Peningkatan Kompetensi Profesional Guru dalam Pembelajaran Kontekstual',
      description: `Sasaran strategis ini dirancang untuk merespon secara langsung ${issue}. Fokus utama adalah membekali pendidik dengan keterampilan pedagogi yang relevan agar mampu menyusun rancangan pembelajaran berbasis pemecahan masalah. Sasaran ini diharapkan berdampak langsung pada indikator mutu sekolah.`,
      evidence: ['IRB Matrix'],
      source: 'Narrative Engine',
      createdBy: 'System',
      generatedBy: 'AI',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      parentId,
      childrenIds: [],
      confidenceScore: 97,
      status: 'Active',
      version: 1,
      data: {
        targets: TargetProjectionEngine.calculateProjections(40, 85) // Example baseline and target
      }
    };
    nodes.push(objectiveNode);

    const programName = this.programNames[this.programIndex % this.programNames.length];
    this.programIndex++;
    
    const programId = this.generateId('program');
    const programNode: CanonicalObject = {
      id: programId,
      type: 'StrategicProgram',
      title: programName,
      description: `Berdasarkan Rapor Pendidikan dan analisis SWOT, sekolah mengidentifikasi ${issue} sebagai isu strategis yang membutuhkan intervensi sistematis. Untuk mengatasi isu ini, sekolah menetapkan ${programName}, yang dilaksanakan secara bertahap selama empat tahun melalui peningkatan kapasitas guru, pembelajaran kontekstual, dan pemantauan berkelanjutan. Tujuan utama program ini adalah menyelesaikan kesenjangan kualitas pembelajaran melalui pendekatan kolaboratif.`,
      evidence: ['IRB Matrix'],
      source: 'Narrative Engine',
      createdBy: 'System',
      generatedBy: 'AI',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      parentId: objectiveId,
      childrenIds: [],
      confidenceScore: 96,
      status: 'Active',
      version: 1
    };
    objectiveNode.childrenIds.push(programId);
    nodes.push(programNode);

    // Generate Activities for this program
    const activities = [
      { name: 'Lokakarya Peningkatan Kapasitas Guru', desc: 'Pelatihan intensif perancangan modul ajar kontekstual.' },
      { name: 'Pelaksanaan Lesson Study', desc: 'Siklus plan-do-see antar guru mata pelajaran untuk perbaikan mutu pembelajaran.' },
      { name: 'Supervisi Akademik Berkelanjutan', desc: 'Pendampingan langsung kepala sekolah di ruang kelas.' },
      { name: 'Monitoring dan Evaluasi Program', desc: 'Evaluasi capaian bulanan berbasis data asesmen formatif.' }
    ];

    activities.forEach((act, idx) => {
      const actId = this.generateId('activity');
      const actNode: CanonicalObject = {
        id: actId,
        type: 'Activity',
        title: act.name,
        description: `${act.name} dirancang untuk memastikan implementasi ${programName} berjalan efektif. Kegiatan ini berfokus pada ${act.desc.toLowerCase()}`,
        evidence: [programName],
        source: 'Narrative Engine',
        createdBy: 'System',
        generatedBy: 'AI',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        parentId: programId,
        childrenIds: [],
        confidenceScore: 92,
        status: 'Active',
        version: 1,
        data: {
          output: 'Tersedianya dokumen modul ajar dan laporan supervisi.',
          outcome: 'Guru mampu mengimplementasikan strategi pembelajaran kontekstual di kelas.',
          impact: 'Meningkatnya partisipasi kognitif siswa dan skor asesmen formatif.',
          risk: 'Keterbatasan waktu guru di luar jam mengajar aktif.',
          mitigation: 'Pengintegrasian kegiatan ke dalam jadwal Komunitas Belajar mingguan.',
          schedule: 'Juli - Agustus',
          performanceIndicator: 'Jumlah modul ajar kontekstual yang dihasilkan',
          successCriteria: '100% guru menyusun modul ajar berbasis proyek kontekstual'
        }
      };
      programNode.childrenIds.push(actId);
      nodes.push(actNode);

      // Budgets
      const budgetId = this.generateId('budget');
      const budgetNode: CanonicalObject = {
        id: budgetId,
        type: 'Budget',
        title: `Anggaran: ${act.name}`,
        description: `Alokasi dana BOS untuk pelaksanaan ${act.name}.`,
        evidence: [act.name],
        source: 'Narrative Engine',
        createdBy: 'System',
        generatedBy: 'AI',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        parentId: actId,
        childrenIds: [],
        confidenceScore: 99,
        status: 'Active',
        version: 1,
        data: { 
          amount: 2500000 + (idx * 500000),
          fundingSource: 'BOS Reguler',
          volume: 1,
          unit: 'Kegiatan',
          priority: 'Tinggi'
        }
      };
      actNode.childrenIds.push(budgetId);
      nodes.push(budgetNode);
    });

    return nodes;
  }
}
