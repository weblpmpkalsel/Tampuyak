import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId, formatPlanningYear } from './utils';

export class IntroductionBuilder {
  public build(result: RKTProjectionResult, settings?: any): DocumentChapter {
    const schoolName = settings?.school?.name || 'Satuan Pendidikan';
    const visi = settings?.identitas?.visi || 'Mewujudkan layanan pendidikan yang berkualitas';
    const karakteristik = settings?.identitas?.karakteristik || settings?.karakteristik?.lingkungan || 'memiliki karakteristik unik yang menjadi kekuatan dalam penyelenggaraan pendidikan';
    
    // Extracted from result.projections to represent annual priorities
    const programNames = Array.from(new Set(result.projections.map(p => p.programName))).filter(Boolean);
    const prioritasText = programNames.length > 0 
      ? programNames.slice(0, 2).join(' dan ') 
      : 'peningkatan kualitas pembelajaran dan kompetensi pendidik';

    // Retrieve legal references from centralized registry or use defaults
    const legalReferences = settings?.legalReferences?.rkt || [
      `Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.`,
      `Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 4 Tahun 2022.`,
      `Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 47 Tahun 2023 tentang Standar Pengelolaan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.`,
      `Regulasi daerah serta pedoman teknis yang relevan dengan tata kelola ${schoolName}.`
    ];

    const planningYear = formatPlanningYear(result.context.planningYear);
    
    return {
      id: generateId('ChapterI'),
      title: 'BAB I: Pendahuluan',
      sections: [
        {
          id: generateId('Section'),
          title: '1.1 Latar Belakang',
          paragraphs: [
            `Rencana Kerja Tahunan (RKT) ${schoolName} disusun sebagai instrumen operasional untuk menerjemahkan arah strategis sekolah menjadi langkah-langkah nyata pada tahun pelaksanaan berjalan. Mengingat institusi ${karakteristik}, dokumen perencanaan ini disesuaikan dengan konteks operasional dan karakteristik lingkungan belajar guna menjamin relevansi intervensi terhadap kebutuhan peserta didik.`,
            `Secara hierarkis, penyusunan RKT ini merupakan penjabaran tahunan dari Rencana Kerja Jangka Menengah (RKJM). Seluruh program yang dirancang dalam dokumen ini terikat pada sasaran strategis jangka menengah, sehingga memastikan adanya kesinambungan antara visi besar institusi dengan implementasi program harian.`,
            `Pada tahun berjalan, prioritas operasional diutamakan pada pelaksanaan ${prioritasText}. Fokus operasional ini dipilih berdasarkan evaluasi pencapaian tahun sebelumnya untuk memastikan alokasi sumber daya sekolah dikelola secara efektif, akuntabel, dan berorientasi penuh pada peningkatan mutu layanan pendidikan.`
          ],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '1.2 Landasan Hukum',
          paragraphs: [
            `Penyusunan dokumen perencanaan ini dilandasi oleh kerangka regulasi nasional dan daerah guna menjamin akuntabilitas serta keselarasan dengan Standar Nasional Pendidikan (SNP). Regulasi yang menjadi pijakan utama meliputi:`,
            ...legalReferences.map((ref: string, idx: number) => `${idx + 1}. ${ref}`)
          ],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '1.3 Tujuan',
          paragraphs: [
            `Tujuan penyusunan RKT ini merepresentasikan komitmen ${schoolName} terhadap tata kelola yang berfokus pada kualitas. Secara institusional, tujuan tersebut mencakup:`,
            `1. Memberikan kepastian arah operasionalisasi program strategis RKJM dalam siklus tahunan yang spesifik.`,
            `2. Menjadi instrumen kendali mutu untuk memantau sejauh mana intervensi yang direncanakan mampu mengatasi akar masalah pada area prioritas.`,
            `3. Menyelaraskan antara program operasional dengan perencanaan keuangan (RKAS), memastikan setiap inisiatif memiliki basis pelaksanaan yang logis.`,
            `4. Mewujudkan transparansi dan akuntabilitas publik melalui perencanaan yang terukur dan dapat dievaluasi.`
          ],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '1.4 Sasaran',
          paragraphs: [
            `Sasaran RKT ${planningYear} ini berfokus pada penguatan ekosistem belajar yang berdampak langsung pada peserta didik, tenaga pendidik, maupun tata kelola kelembagaan. Mencakup seluruh aktivitas yang telah diproyeksikan, sasaran ini dirumuskan agar selaras dengan profil lulusan yang diharapkan, serta mempertimbangkan realitas kapasitas institusional ${schoolName} saat ini.`
          ],
          tables: [], figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}