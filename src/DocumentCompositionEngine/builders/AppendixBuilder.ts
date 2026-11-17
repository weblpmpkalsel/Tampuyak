import { DocumentChapter, DocumentSection } from '../DocumentModel';
import { generateId } from '../utils';
import { KnowledgeGraph } from '../../SPKG';

function formatCell(text: string | null | undefined, emptyState: string = 'Belum diunggah.'): string {
  if (!text || text.trim() === '' || text === '-' || text === 'undefined' || text === 'Data sedang dalam tahap penyusunan hasil sinkronisasi.') return emptyState;
  return text;
}

export class AppendixBuilder {
  public build(kg: KnowledgeGraph, settings: any = {}): DocumentChapter {
    const sections: DocumentSection[] = [];
    const rp = settings?.relationalPlanning;
    const analisisData = settings?.analisis?.data || {};
    
    // APPENDIX A: Surat Keputusan
    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran A: Surat Keputusan Tim Penyusun RKJM',
      paragraphs: [
        `Nomor SK: Dokumen akan dilengkapi oleh sekolah.`,
        `Tanggal: Dokumen akan dilengkapi oleh sekolah.`,
        `Penetapan: Dokumen akan dilengkapi oleh sekolah.`,
        `Status: Belum diunggah.`
      ]
    });

    // APPENDIX B: Surat Tugas
    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran B: Surat Tugas',
      paragraphs: [
        `Nomor: Dokumen akan dilengkapi oleh sekolah.`,
        `Tanggal: Dokumen akan dilengkapi oleh sekolah.`,
        `Status: Belum diunggah.`
      ]
    });

    // APPENDIX C: Undangan Rapat
    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran C: Undangan Rapat',
      paragraphs: [
        `Status: Belum diunggah.`,
        `Dokumen akan dilengkapi oleh sekolah.`
      ]
    });

    // APPENDIX D: Daftar Hadir
    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran D: Daftar Hadir',
      paragraphs: [
        `Tanggal: Dokumen akan dilengkapi oleh sekolah.`,
        `Tempat: Dokumen akan dilengkapi oleh sekolah.`
      ],
      tables: [{
        title: 'Format Daftar Hadir',
        data: [
          {'No': '1', 'Nama': 'Dokumen akan dilengkapi oleh sekolah.', 'Jabatan': 'Dokumen akan dilengkapi oleh sekolah.', 'Tanda Tangan': 'Belum diunggah.'},
          {'No': '2', 'Nama': 'Dokumen akan dilengkapi oleh sekolah.', 'Jabatan': 'Dokumen akan dilengkapi oleh sekolah.', 'Tanda Tangan': 'Belum diunggah.'},
          {'No': '3', 'Nama': 'Dokumen akan dilengkapi oleh sekolah.', 'Jabatan': 'Dokumen akan dilengkapi oleh sekolah.', 'Tanda Tangan': 'Belum diunggah.'}
        ]
      }]
    });

    // APPENDIX E: Notulen Rapat
    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran E: Notulen Rapat',
      paragraphs: [
        `Agenda: Dokumen akan dilengkapi oleh sekolah.`,
        `Hari: Dokumen akan dilengkapi oleh sekolah.`,
        `Tanggal: Dokumen akan dilengkapi oleh sekolah.`,
        `Pembahasan: Dokumen akan dilengkapi oleh sekolah.`,
        `Kesimpulan: Dokumen akan dilengkapi oleh sekolah.`
      ]
    });

    // APPENDIX F: Berita Acara
    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran F: Berita Acara',
      paragraphs: [
        `Berita Acara Pengesahan RKJM`,
        `Pada hari ini, tanggal [Dokumen akan dilengkapi oleh sekolah.], bertempat di [Dokumen akan dilengkapi oleh sekolah.], telah dilaksanakan rapat pengesahan dokumen Rencana Kerja Jangka Menengah (RKJM) yang dihadiri oleh Kepala Sekolah, Komite Sekolah, dan perwakilan guru.`,
        `Demikian berita acara ini dibuat untuk dapat dipergunakan sebagaimana mestinya.`,
        `Status: Belum diunggah.`
      ]
    });

    // APPENDIX G: Dokumentasi Kegiatan
    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran G: Dokumentasi Kegiatan',
      paragraphs: [
        `[Ruang Foto 1 - Belum diunggah.]`,
        `[Ruang Foto 2 - Belum diunggah.]`,
        `[Ruang Foto 3 - Belum diunggah.]`,
        `Caption: Dokumen akan dilengkapi oleh sekolah.`
      ]
    });

    // APPENDIX H: Lembar Pengesahan
    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran H: Lembar Pengesahan',
      paragraphs: [
        `Kepala Sekolah: ${settings?.principal?.name || 'Dokumen akan dilengkapi oleh sekolah.'}`,
        `Komite Sekolah: Dokumen akan dilengkapi oleh sekolah.`,
        `Tanggal: Dokumen akan dilengkapi oleh sekolah.`,
        `Tanda Tangan: Belum diunggah.`
      ]
    });

    // APPENDIX I: Rekap Analisis
    const prioritasLen = analisisData?.prioritas?.length || 0;
    const programLen = rp?.programs?.length || 0;
    const objLen = rp?.objectives?.length || 0;
    const reportNodes = kg.getNodesByType('EducationReport');
    
    let totalScore = 0;
    let scoreCount = 0;
    reportNodes.forEach((node: any) => {
      const score = parseFloat(node.data?.score || '0');
      if (!isNaN(score) && score > 0) {
        totalScore += score;
        scoreCount++;
      }
    });
    const avgScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(2) : 'Belum diunggah.';
    
    let indikatorCount = 0;
    if (rp?.objectives) {
        rp.objectives.forEach((obj: any) => {
           if (obj.performanceIndicator || obj.successIndicator) indikatorCount++;
        });
    }

    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran I: Rekap Analisis',
      paragraphs: [],
      tables: [{
        title: 'Ringkasan Eksekutif Analisis Perencanaan',
        data: [{
          'Parameter': 'Jumlah Isu Prioritas',
          'Nilai/Keterangan': prioritasLen.toString()
        }, {
          'Parameter': 'Jumlah Program Strategis',
          'Nilai/Keterangan': programLen.toString()
        }, {
          'Parameter': 'Jumlah Sasaran',
          'Nilai/Keterangan': objLen.toString()
        }, {
          'Parameter': 'Jumlah Indikator Keberhasilan',
          'Nilai/Keterangan': indikatorCount.toString()
        }, {
          'Parameter': 'Average Rapor Score',
          'Nilai/Keterangan': avgScore.toString()
        }]
      }]
    });

    // APPENDIX J: Rekap Anggaran
    const anggaranData: any[] = [];
    const rkasItems = rp?.annualPlans?.Y1?.rkas || settings?.planningResult?.rkas || [];
    if (rkasItems.length > 0) {
      rkasItems.forEach((bud: any) => {
        let amountDisplay = '0';
        const rawAmount = bud.totalCost || bud.amount || bud.unitCost || bud.unitPrice;
        if (rawAmount && (typeof rawAmount === 'number' || !isNaN(Number(rawAmount)))) {
          amountDisplay = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(rawAmount));
        }

        anggaranData.push({
          'Program': formatCell(bud.program || bud.activity),
          'Tahun': 'Tahun 1',
          'Anggaran': amountDisplay,
          'Sumber Dana': formatCell(bud.fundingSource),
          'Status': formatCell(bud.status, 'Direncanakan')
        });
      });
    } else {
      anggaranData.push({
        'Program': 'Dokumen akan dilengkapi oleh sekolah.',
        'Tahun': 'Dokumen akan dilengkapi oleh sekolah.',
        'Anggaran': 'Dokumen akan dilengkapi oleh sekolah.',
        'Sumber Dana': 'Dokumen akan dilengkapi oleh sekolah.',
        'Status': 'Belum diunggah.'
      });
    }

    sections.push({
      id: generateId('DocumentSection'),
      title: 'Lampiran J: Rekap Anggaran',
      paragraphs: [],
      tables: [{
        title: 'Rekapitulasi Estimasi Anggaran (Tahun Pertama)',
        data: anggaranData
      }]
    });
    
    // Optional Appendices
    if (settings?.documents?.some((d: any) => d.type === 'pakta_integritas')) {
        sections.push({
          id: generateId('DocumentSection'),
          title: 'Lampiran Tambahan: Pakta Integritas',
          paragraphs: [
            `Status: Tersedia dalam sistem.`
          ]
        });
    }

    if (settings?.documents?.some((d: any) => d.type === 'surat_pernyataan')) {
        sections.push({
          id: generateId('DocumentSection'),
          title: 'Lampiran Tambahan: Surat Pernyataan',
          paragraphs: [
            `Status: Tersedia dalam sistem.`
          ]
        });
    }

    if (settings?.documents?.some((d: any) => d.type === 'dokumen_pendukung')) {
        sections.push({
          id: generateId('DocumentSection'),
          title: 'Lampiran Tambahan: Dokumen Pendukung',
          paragraphs: [
            `Status: Tersedia dalam sistem.`
          ]
        });
    }

    return {
      id: generateId('DocumentAppendix'),
      title: 'Lampiran-Lampiran',
      sections: sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}

