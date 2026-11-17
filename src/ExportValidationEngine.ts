/**
 * Export Validation Engine - Supervisory Audit Mode
 * Tampuyak OS - Enterprise School Planning Platform
 */

import { CanonicalObject, KnowledgeGraph, QualityEngine } from './SPKG';

export interface ExecutiveReview {
  strengths: string[];
  weaknesses: string[];
  majorFindings: string[];
  minorFindings: string[];
  recommendations: string[];
  readinessStatus: string;
}

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: ValidationIssue[];
  executiveReview: ExecutiveReview;
}

export interface ValidationIssue {
  type: 'Critical' | 'Error' | 'Warning';
  message: string;
  elementId?: string;
  category: 'Compliance' | 'Logic' | 'Narrative' | 'Consistency' | 'Explainability';
}

export class ExportValidationEngine {
  public validateDocument(title: string, nodes: CanonicalObject[]): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;
    
    let criticalFindings = 0;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const majorFindings: string[] = [];
    const minorFindings: string[] = [];
    const recommendations: string[] = [];

    // 1. Basic Content Checks
    nodes.forEach(node => {
      if (!node.title || node.title.trim() === '') {
        issues.push({ type: 'Critical', category: 'Narrative', message: `Judul kosong terdeteksi pada elemen ${node.type}`, elementId: node.id });
        score -= 5;
        criticalFindings++;
      }
      if (!node.description || node.description.trim() === '') {
        issues.push({ type: 'Critical', category: 'Narrative', message: `Deskripsi narasi kosong pada ${node.type} (${node.title})`, elementId: node.id });
        score -= 5;
        criticalFindings++;
      }
      if (node.description && (node.description.includes('undefined') || node.description.includes('null') || node.description.includes('NaN'))) {
        issues.push({ type: 'Critical', category: 'Logic', message: `Data tidak valid (undefined/null/NaN) terdeteksi pada narasi ${node.type} (${node.title})`, elementId: node.id });
        score -= 10;
        criticalFindings++;
      }
      if (node.description && (node.description.includes('[') && node.description.includes(']'))) {
        issues.push({ type: 'Error', category: 'Narrative', message: `Placeholder yang belum terisi (kurung siku) terdeteksi pada narasi ${node.type} (${node.title})`, elementId: node.id });
        score -= 2;
      }
      if (node.description && (node.description.toLowerCase().includes('program intervensi mutu'))) {
        issues.push({ type: 'Critical', category: 'Narrative', message: `Penggunaan nama program repetitif terdeteksi (Program Intervensi Mutu) pada ${node.title}. Narasi ditolak.`, elementId: node.id });
        score -= 15;
        criticalFindings++;
      }
      
      // Node specific quality checks
      if (node.type === 'IRB') {
        if (!node.data?.identification || !node.data?.reflection || !node.data?.improvement) {
          issues.push({ type: 'Critical', category: 'Compliance', message: `Matriks IRB tidak lengkap pada ${node.title}. Harus berisi Identifikasi, Refleksi, dan Benahi sesuai pedoman.`, elementId: node.id });
          score -= 10;
          criticalFindings++;
        }
      }

      if (node.type === 'Activity') {
        if (!node.data?.output || !node.data?.outcome || !node.data?.impact) {
          issues.push({ type: 'Critical', category: 'Logic', message: `Rantai hasil (Output/Outcome/Impact) tidak lengkap pada kegiatan ${node.title}.`, elementId: node.id });
          score -= 5;
          criticalFindings++;
        }
        if (!node.data?.risk || !node.data?.mitigation) {
          issues.push({ type: 'Error', category: 'Compliance', message: `Manajemen Risiko (Risiko & Mitigasi) tidak ditemukan pada kegiatan ${node.title}.`, elementId: node.id });
          score -= 3;
        }
        if (!node.data?.schedule || !node.data?.performanceIndicator || !node.data?.successCriteria) {
          issues.push({ type: 'Critical', category: 'Compliance', message: `Komponen RKT tidak lengkap (Jadwal, Indikator, Kriteria Sukses) pada kegiatan ${node.title}.`, elementId: node.id });
          score -= 5;
          criticalFindings++;
        }
      }

      if (node.type === 'Budget') {
        if (!node.data?.amount || !node.data?.fundingSource || !node.data?.volume || !node.data?.unit) {
          issues.push({ type: 'Critical', category: 'Compliance', message: `Komponen RKAS tidak lengkap (Sumber Dana, Volume, Satuan, Biaya) pada anggaran ${node.title}.`, elementId: node.id });
          score -= 5;
          criticalFindings++;
        }
      }
    });

    // 2. Structural Chain Validation (Planning Logic)
    const priorities = nodes.filter(n => n.type === 'Priority');
    const objectives = nodes.filter(n => n.type === 'StrategicObjective');
    const programs = nodes.filter(n => n.type === 'StrategicProgram');
    const activities = nodes.filter(n => n.type === 'Activity');
    const budgets = nodes.filter(n => n.type === 'Budget');
    
    if (priorities.length > 0 && objectives.length === 0) {
      issues.push({ type: 'Critical', category: 'Logic', message: 'Prioritas ditemukan tetapi tidak ada Sasaran Strategis yang dirumuskan.' });
      score -= 15;
      criticalFindings++;
    }
    
    objectives.forEach(obj => {
      const relatedPrograms = programs.filter(p => p.parentId === obj.id);
      if (relatedPrograms.length === 0) {
        issues.push({ type: 'Critical', category: 'Logic', message: `Sasaran Strategis '${obj.title}' tidak memiliki Program Strategis turunan.`, elementId: obj.id });
        score -= 10;
        criticalFindings++;
      }
    });

    programs.forEach(prog => {
      if (!prog.parentId) {
        issues.push({ type: 'Critical', category: 'Explainability', message: `Program Strategis '${prog.title}' tidak memiliki referensi Sasaran Strategis yang jelas. (Yatim Piatu)`, elementId: prog.id });
        score -= 5;
        criticalFindings++;
      }
      const relatedActivities = activities.filter(a => a.parentId === prog.id);
      if (relatedActivities.length === 0) {
        issues.push({ type: 'Critical', category: 'Logic', message: `Program Strategis '${prog.title}' tidak dijabarkan ke dalam Kegiatan nyata.`, elementId: prog.id });
        score -= 10;
        criticalFindings++;
      }
    });

    activities.forEach(act => {
      if (!act.parentId) {
        issues.push({ type: 'Critical', category: 'Explainability', message: `Kegiatan '${act.title}' tidak merujuk pada Program Strategis manapun.`, elementId: act.id });
        score -= 5;
        criticalFindings++;
      }
      const relatedBudgets = budgets.filter(b => b.parentId === act.id);
      if (relatedBudgets.length === 0) {
        issues.push({ type: 'Error', category: 'Compliance', message: `Kegiatan '${act.title}' tidak memiliki alokasi anggaran (RKAS).`, elementId: act.id });
        score -= 3;
      }
    });

    // 3. Evidence Coverage
    const actionableNodesWithoutEvidence = nodes.filter(n => 
      n.type !== 'School' && n.type !== 'Dashboard' && n.type !== 'EducationReport' && 
      (!n.evidence || n.evidence.length === 0)
    );

    if (actionableNodesWithoutEvidence.length > 0) {
      issues.push({ type: 'Error', category: 'Explainability', message: `${actionableNodesWithoutEvidence.length} elemen perencanaan tidak memiliki Evidence Basis (Dasar Bukti) yang jelas.` });
      score -= (actionableNodesWithoutEvidence.length * 2);
    }

    // 4. Generate Executive Review
    const isValid = score >= 95 && criticalFindings === 0;
    let readinessStatus = '';

    if (isValid) {
      strengths.push("Alur logika perencanaan (Evidence -> Priority -> Activity) konsisten dan koheren.");
      strengths.push("Kepatuhan terhadap Permendikdasmen No.47 Tahun 2023 terpenuhi dengan kelengkapan matriks IRB.");
      readinessStatus = "APPROVED_FOR_EXPORT";
    } else {
      weaknesses.push("Terdapat celah dalam rantai perencanaan yang berpotensi menyebabkan ketidaksesuaian RKT dan RKAS.");
      if (criticalFindings > 0) {
        majorFindings.push(`Ditemukan ${criticalFindings} temuan kritis (Critical Findings) yang memblokir proses pengesahan dokumen.`);
        recommendations.push("Segera lengkapi indikator rantai hasil (Output/Outcome/Impact) dan matriks IRB sebelum mengajukan dokumen ulang.");
      }
      readinessStatus = "REJECTED_NEEDS_REVISION";
    }
    
    issues.filter(i => i.type === 'Error' || i.type === 'Warning').forEach(i => minorFindings.push(i.message));

    return {
      isValid,
      score: Math.max(0, score),
      issues,
      executiveReview: {
        strengths,
        weaknesses,
        majorFindings,
        minorFindings: minorFindings.slice(0, 5), // Keep it concise
        recommendations,
        readinessStatus
      }
    };
  }
}
