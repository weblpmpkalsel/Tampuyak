import { DocumentChapter } from '../DocumentModel';
import { generateId } from '../utils';
import { KnowledgeGraph } from '../../SPKG';

export class Chapter1Builder {
  public build(kg: KnowledgeGraph, metadata: any = {}): DocumentChapter {

    // 1.1 School Profile
    const profileParagraphs = [
      `${metadata?.schoolName || 'Satuan pendidikan ini'} adalah sekolah jenjang ${metadata?.schoolLevel || '-'} dengan status ${metadata?.schoolStatus || '-'} (NPSN: ${metadata?.npsn || '-'}), yang berlokasi di ${metadata?.address || '-'}, Kecamatan ${metadata?.district || '-'}, Kabupaten/Kota ${metadata?.regencyOrCity || '-'}, Provinsi ${metadata?.province || '-'}. Saat ini sekolah dipimpin oleh ${metadata?.principalName || '-'}.`
    ];

    // 1.2 Vision
    const visiParagraphs = [];
    if (metadata?.identitas?.visi) {
      visiParagraphs.push(metadata.identitas.visi);
    } else {
      visiParagraphs.push("Visi sekolah belum ditetapkan.");
    }

    // 1.3 Mission
    const misiParagraphs = [];
    if (metadata?.identitas?.misi && Array.isArray(metadata.identitas.misi) && metadata.identitas.misi.length > 0) {
      metadata.identitas.misi.forEach((m: string, i: number) => {
        if (m.trim()) misiParagraphs.push(`- ${m}`);
      });
      if (misiParagraphs.length === 0) misiParagraphs.push("- Misi sekolah belum ditetapkan.");
    } else {
      misiParagraphs.push("- Misi sekolah belum ditetapkan.");
    }

    // 1.4 School Goals
    const tujuanParagraphs = [];
    if (metadata?.identitas?.tujuan && Array.isArray(metadata.identitas.tujuan) && metadata.identitas.tujuan.length > 0) {
      metadata.identitas.tujuan.forEach((t: string, i: number) => {
        if (t.trim()) tujuanParagraphs.push(`- ${t}`);
      });
      if (tujuanParagraphs.length === 0) tujuanParagraphs.push("- Tujuan sekolah belum ditetapkan.");
    } else {
      tujuanParagraphs.push("- Tujuan sekolah belum ditetapkan.");
    }

    // 1.5 School Characteristics / Values
    const charsParagraphs = [];
    if (metadata?.karakteristik?.pesertaDidik) charsParagraphs.push(`- Karakteristik Peserta Didik: ${metadata.karakteristik.pesertaDidik}`);
    if (metadata?.karakteristik?.guru) charsParagraphs.push(`- Tenaga Pendidik: ${metadata.karakteristik.guru}`);
    if (metadata?.karakteristik?.orangTua) charsParagraphs.push(`- Sosial Kemasyarakatan: ${metadata.karakteristik.orangTua}`);
    if (metadata?.potensi?.daerah && metadata.potensi.daerah.length > 0) charsParagraphs.push(`- Potensi Daerah: ${metadata.potensi.daerah.join(', ')}`);
    if (metadata?.potensi?.kearifanLokal && metadata.potensi.kearifanLokal.length > 0) charsParagraphs.push(`- Kearifan Lokal: ${metadata.potensi.kearifanLokal.join(', ')}`);
    
    if (charsParagraphs.length === 0) {
        charsParagraphs.push("- Nilai-nilai sekolah belum ditetapkan.");
    }

    // 1.6 Background of RKJM Preparation
    const rp = metadata?.relationalPlanning || {};
    const objectives = rp.objectives || [];
    const programs = rp.programs || [];
    
    let bgContext = '';
    if (objectives.length > 0) {
        bgContext = ' ' + objectives.map((o: any) => o.strategicObjective).join(', ') + '.';
    }
    
    const bgParagraphs = [
      `Rencana Kerja Jangka Menengah (RKJM) ini disusun sebagai pedoman strategis ${metadata?.schoolName || 'sekolah'} untuk mengarahkan program perbaikan mutu pendidikan berkelanjutan.`,
      `Penyusunan didasarkan pada analisis kondisi nyata untuk mewujudkan capaian strategis meliputi${bgContext || ' peningkatan kualitas layanan.'}`,
      `Dokumen ini memastikan setiap perencanaan kegiatan dan penganggaran bertumpu pada identifikasi akar masalah dan pemanfaatan bukti (evidence-based).`
    ];

    // 1.7 Legal Foundation
    const rkjmLegalBasis = metadata?.legalReferences?.rkjm || [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional",
      "Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan",
      "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 47 Tahun 2023",
      "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 9 Tahun 2022"
    ];

    const legalParagraphs = [
      "Penyusunan dokumen Perencanaan Berbasis Data tingkat satuan pendidikan ini dilandasi oleh peraturan perundang-undangan berikut:",
      ...rkjmLegalBasis.map((ref: string, idx: number) => `${idx + 1}. ${ref}`)
    ];

    // 1.8 Document Structure
    const structureParagraphs = [
      "Dokumen Rencana Kerja Jangka Menengah (RKJM) ini disusun dengan sistematika sebagai berikut:",
      "- BAB I: Konteks Sekolah & Landasan Perencanaan",
      "- BAB II: Analisis Kondisi Sekolah",
      "- BAB III: Program Strategis Jangka Menengah",
      "- BAB IV: Rencana Operasional dan Penganggaran",
      "- BAB V: Penutup"
    ];

    return {
      id: generateId('DocumentChapter'),
      title: 'BAB I: Konteks Sekolah & Landasan Perencanaan',
      sections: [
        {
          id: generateId('DocumentSection'),
          title: '1.1 Profil Sekolah',
          paragraphs: profileParagraphs,
          references: []
        },
        {
          id: generateId('DocumentSection'),
          title: '1.2 Visi',
          paragraphs: visiParagraphs,
          references: []
        },
        {
          id: generateId('DocumentSection'),
          title: '1.3 Misi',
          paragraphs: misiParagraphs,
          references: []
        },
        {
          id: generateId('DocumentSection'),
          title: '1.4 Tujuan Sekolah',
          paragraphs: tujuanParagraphs,
          references: []
        },
        {
          id: generateId('DocumentSection'),
          title: '1.5 Nilai-Nilai Sekolah',
          paragraphs: charsParagraphs,
          references: []
        },
        {
          id: generateId('DocumentSection'),
          title: '1.6 Latar Belakang Penyusunan RKJM',
          paragraphs: bgParagraphs,
          references: []
        },
        {
          id: generateId('DocumentSection'),
          title: '1.7 Landasan Hukum',
          paragraphs: legalParagraphs,
          references: []
        },
        {
          id: generateId('DocumentSection'),
          title: '1.8 Sistematika Penulisan Dokumen',
          paragraphs: structureParagraphs,
          references: []
        }
      ],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}

