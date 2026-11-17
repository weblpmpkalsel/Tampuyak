export interface KnowledgeObject {
  id: string;
  category: string;
  title: string;
  officialDefinition: string;
  educationalIntent: string;
  implementationGuide: string;
  examples: string[];
  relatedKnowledge: string[];
  relatedDocuments: string[];
  relatedRegulations: string[];
  sourceReference: string;
  issuingInstitution: string;
  policyVersion: string;
  effectiveDate: string;
  revisionHistory: string[];
  status: "ACTIVE" | "DEPRECATED" | "DRAFT" | "UNVERIFIED";
  confidenceScore: number;
}

export const KnowledgeBase: KnowledgeObject[] = [
  // A. Government Identity
  {
    id: "KEMENDIKDASMEN",
    category: "Government Identity",
    title: "Kementerian Pendidikan Dasar dan Menengah",
    officialDefinition: "Kementerian yang menyelenggarakan urusan pemerintahan di bidang pendidikan dasar dan menengah.",
    educationalIntent: "Menjadi otoritas utama dalam merumuskan dan menetapkan kebijakan pendidikan dasar dan menengah nasional.",
    implementationGuide: "Gunakan nama kementerian ini pada semua dokumen resmi mulai tahun 2025.",
    examples: ["Kop Surat KSP", "Regulasi Acuan RKAS"],
    relatedKnowledge: ["BSKAP"],
    relatedDocuments: ["KSP", "RKJM", "RKT"],
    relatedRegulations: ["Perpres Struktur Organisasi Kementerian 2024"],
    sourceReference: "Perpres Struktur Organisasi Kementerian 2024",
    issuingInstitution: "Pemerintah Republik Indonesia",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Initial creation"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "BSKAP",
    category: "Government Identity",
    title: "Badan Standar, Kurikulum, dan Asesmen Pendidikan",
    officialDefinition: "Badan yang menyelenggarakan penyusunan standar, kurikulum, dan asesmen pendidikan.",
    educationalIntent: "Merumuskan standar nasional dan panduan kurikulum operasional.",
    implementationGuide: "Menjadi acuan dalam panduan KSP dan asesmen.",
    examples: ["Panduan KSP"],
    relatedKnowledge: ["KEMENDIKDASMEN", "KSP_GUIDANCE"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["Perpres Struktur Organisasi Kementerian 2024"],
    sourceReference: "Perpres Struktur Organisasi Kementerian 2024",
    issuingInstitution: "Pemerintah Republik Indonesia",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Initial creation"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  // B. Curriculum Development
  {
    id: "KSP_GUIDANCE",
    category: "Curriculum Development",
    title: "Panduan Pengembangan Kurikulum Satuan Pendidikan (Revisi 2025)",
    officialDefinition: "Pedoman resmi pengembangan kurikulum operasional di tingkat satuan pendidikan.",
    educationalIntent: "Memberikan otonomi bagi sekolah untuk menyesuaikan kurikulum dengan karakteristik dan kebutuhannya.",
    implementationGuide: "Sekolah menyusun KSP berdasarkan kerangka dasar nasional namun disesuaikan dengan konteks lokal.",
    examples: ["Penyusunan Visi Misi", "Pengorganisasian Pembelajaran"],
    relatedKnowledge: ["KSP", "SCHOOL_DNA"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["Panduan KSP Revisi 2025"],
    sourceReference: "Panduan KSP Revisi 2025",
    issuingInstitution: "BSKAP Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Initial baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  // C. Graduate Profile
  {
    id: "PROFIL_LULUSAN",
    category: "Graduate Profile",
    title: "8 Dimensi Profil Lulusan",
    officialDefinition: "Kerangka karakter dan kompetensi lulusan pendidikan dasar dan menengah yang terdiri dari 8 dimensi utama.",
    educationalIntent: "Menjadi kompas bagi seluruh praktik pendidikan dalam mengembangkan karakter holistik siswa.",
    implementationGuide: "Dimensi ini harus terintegrasi dalam intrakurikuler, kokurikuler, dan budaya sekolah.",
    examples: ["Kegiatan kokurikuler", "Penilaian sikap"],
    relatedKnowledge: ["DIMENSI_1", "DIMENSI_2", "DIMENSI_3", "DIMENSI_4", "DIMENSI_5", "DIMENSI_6", "DIMENSI_7", "DIMENSI_8"],
    relatedDocuments: ["KSP", "Rapor Pendidikan"],
    relatedRegulations: ["Standar Kompetensi Lulusan (SKL) 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "DIMENSI_1",
    category: "Graduate Profile",
    title: "Keimanan dan Ketakwaan terhadap Tuhan Yang Maha Esa",
    officialDefinition: "Memiliki keyakinan teguh, akhlak mulia, serta menghayati nilai-nilai spiritual dalam kehidupan sehari-hari.",
    educationalIntent: "Membangun landasan moral dan spiritual peserta didik.",
    implementationGuide: "Diintegrasikan melalui pembelajaran agama, pembiasaan ibadah, dan etika keseharian.",
    examples: ["Doa bersama", "Peringatan hari besar keagamaan"],
    relatedKnowledge: ["PROFIL_LULUSAN"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["Standar Kompetensi Lulusan (SKL) 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  // Add other dimensions
  {
    id: "DIMENSI_2",
    category: "Graduate Profile",
    title: "Kewargaan (Civic)",
    officialDefinition: "Menumbuhkan rasa cinta tanah air, kepedulian sosial, serta ketaatan pada norma dan tanggung jawab terhadap lingkungan.",
    educationalIntent: "Membentuk warga negara yang bertanggung jawab dan aktif dalam masyarakat.",
    implementationGuide: "Melalui upacara bendera, kegiatan sosial, dan pembelajaran PPKn.",
    examples: ["Upacara", "Bakti Sosial"],
    relatedKnowledge: ["PROFIL_LULUSAN"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["SKL 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "DIMENSI_3",
    category: "Graduate Profile",
    title: "Penalaran Kritis",
    officialDefinition: "Kemampuan peserta didik untuk memecahkan masalah secara logis, analitis, dan berbasis data.",
    educationalIntent: "Membekali peserta didik dengan kecakapan analitis untuk pengambilan keputusan.",
    implementationGuide: "Pembelajaran berbasis inkuiri dan pemecahan masalah.",
    examples: ["Proyek penelitian", "Debat"],
    relatedKnowledge: ["PROFIL_LULUSAN"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["SKL 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "DIMENSI_4",
    category: "Graduate Profile",
    title: "Kreativitas",
    officialDefinition: "Mendorong daya cipta, inovasi, dan kemampuan beradaptasi dalam menghadapi berbagai situasi.",
    educationalIntent: "Mengembangkan potensi inovatif peserta didik.",
    implementationGuide: "Memberikan ruang untuk kreasi seni, inovasi teknologi, dan pemikiran out-of-the-box.",
    examples: ["Pameran karya", "Klub inovasi"],
    relatedKnowledge: ["PROFIL_LULUSAN"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["SKL 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "DIMENSI_5",
    category: "Graduate Profile",
    title: "Kolaborasi",
    officialDefinition: "Kemampuan bekerja sama, menghargai gagasan, dan menyelesaikan tantangan bersama orang lain.",
    educationalIntent: "Menyiapkan peserta didik untuk berinteraksi dan bekerja dalam tim.",
    implementationGuide: "Tugas kelompok, proyek kolaboratif, dan ekstrakurikuler tim.",
    examples: ["Kerja kelompok", "Olahraga tim"],
    relatedKnowledge: ["PROFIL_LULUSAN"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["SKL 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "DIMENSI_6",
    category: "Graduate Profile",
    title: "Kemandirian",
    officialDefinition: "Memiliki kedisiplinan, tanggung jawab atas proses belajarnya, dan kepercayaan diri.",
    educationalIntent: "Membangun efikasi diri dan kemandirian belajar (self-regulated learning).",
    implementationGuide: "Memberikan otonomi belajar, tugas mandiri, dan refleksi diri.",
    examples: ["Penugasan mandiri", "Jurnal refleksi"],
    relatedKnowledge: ["PROFIL_LULUSAN"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["SKL 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "DIMENSI_7",
    category: "Graduate Profile",
    title: "Kesehatan",
    officialDefinition: "Kesadaran menerapkan prinsip kebugaran fisik dan mental.",
    educationalIntent: "Memastikan kesejahteraan dan kesiapan belajar peserta didik.",
    implementationGuide: "Program sekolah sehat, edukasi gizi, dan layanan bimbingan konseling.",
    examples: ["Senam pagi", "Layanan BK"],
    relatedKnowledge: ["PROFIL_LULUSAN"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["SKL 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "DIMENSI_8",
    category: "Graduate Profile",
    title: "Komunikasi",
    officialDefinition: "Keterampilan menyimak, berbicara, membaca, dan menulis untuk menyampaikan gagasan secara efektif sesuai konteks.",
    educationalIntent: "Meningkatkan kemampuan literasi dan ekspresi komunikasi.",
    implementationGuide: "Presentasi kelas, diskusi, membaca rutin, dan penulisan karya.",
    examples: ["Presentasi", "Mading kelas"],
    relatedKnowledge: ["PROFIL_LULUSAN"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["SKL 2025"],
    sourceReference: "SKL 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  // D. Learning Organization
  {
    id: "INTRAKURIKULER",
    category: "Learning Organization",
    title: "Intrakurikuler",
    officialDefinition: "Kegiatan pembelajaran utama yang dilaksanakan di kelas untuk mencapai kompetensi mata pelajaran.",
    educationalIntent: "Fokus pada penguasaan materi akademik dan kompetensi dasar.",
    implementationGuide: "Dilaksanakan secara terstruktur sesuai jadwal pelajaran.",
    examples: ["Belajar di kelas", "Praktikum"],
    relatedKnowledge: ["KOKURIKULER", "EKSTRAKURIKULER"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["Panduan KSP 2025"],
    sourceReference: "Panduan KSP 2025",
    issuingInstitution: "BSKAP Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "KOKURIKULER",
    category: "Learning Organization",
    title: "Kegiatan Penguatan Karakter Profil Lulusan",
    officialDefinition: "Kegiatan berbasis proyek yang dirancang untuk menguatkan pencapaian 8 Dimensi Profil Lulusan.",
    educationalIntent: "Memberikan pengalaman kontekstual dan lintas disiplin ilmu untuk membentuk karakter.",
    implementationGuide: "Dialokasikan dari total jam pelajaran, dilakukan secara fleksibel dalam bentuk blok atau reguler.",
    examples: ["Proyek kewirausahaan", "Gelar karya"],
    relatedKnowledge: ["PROFIL_LULUSAN", "INTRAKURIKULER"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["Panduan KSP 2025"],
    sourceReference: "Panduan KSP 2025",
    issuingInstitution: "BSKAP Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "EKSTRAKURIKULER",
    category: "Learning Organization",
    title: "Ekstrakurikuler",
    officialDefinition: "Kegiatan pengembangan minat dan bakat peserta didik di luar jam intrakurikuler.",
    educationalIntent: "Menyalurkan dan mengembangkan potensi unik setiap peserta didik.",
    implementationGuide: "Sekolah menyediakan berbagai pilihan ekskul, pramuka sebagai ekskul wajib (jika berlaku).",
    examples: ["Pramuka", "Klub Olahraga", "Kesenian"],
    relatedKnowledge: ["INTRAKURIKULER"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["Panduan KSP 2025"],
    sourceReference: "Panduan KSP 2025",
    issuingInstitution: "BSKAP Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  // E. Planning Documents
  {
    id: "KSP",
    category: "Planning Documents",
    title: "Kurikulum Satuan Pendidikan",
    officialDefinition: "Dokumen kurikulum operasional yang menjadi acuan seluruh penyelenggaraan pembelajaran di sekolah.",
    educationalIntent: "Memastikan proses pembelajaran terarah, terukur, dan sesuai konteks lokal.",
    implementationGuide: "Disusun setiap tahun, melibatkan pemangku kepentingan.",
    examples: ["Dokumen KSP"],
    relatedKnowledge: ["RKJM", "RKT"],
    relatedDocuments: ["KSP"],
    relatedRegulations: ["Panduan KSP 2025"],
    sourceReference: "Panduan KSP 2025",
    issuingInstitution: "BSKAP Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "RKJM",
    category: "Planning Documents",
    title: "Rencana Kerja Jangka Menengah",
    officialDefinition: "Dokumen perencanaan sekolah untuk periode 4 tahun.",
    educationalIntent: "Memberikan panduan strategis jangka menengah untuk pengembangan sekolah.",
    implementationGuide: "Disusun berdasarkan evaluasi diri dan rapor pendidikan.",
    examples: ["Dokumen RKJM"],
    relatedKnowledge: ["RKT", "RKAS"],
    relatedDocuments: ["RKJM"],
    relatedRegulations: ["Pedoman Perencanaan Berbasis Data 2025"],
    sourceReference: "Pedoman PBD 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "RKT",
    category: "Planning Documents",
    title: "Rencana Kerja Tahunan",
    officialDefinition: "Dokumen perencanaan operasional sekolah untuk periode 1 tahun.",
    educationalIntent: "Menjabarkan RKJM ke dalam program dan kegiatan tahunan yang spesifik.",
    implementationGuide: "Menjadi dasar penyusunan anggaran (RKAS).",
    examples: ["Dokumen RKT"],
    relatedKnowledge: ["RKJM", "RKAS"],
    relatedDocuments: ["RKT"],
    relatedRegulations: ["Pedoman Perencanaan Berbasis Data 2025"],
    sourceReference: "Pedoman PBD 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "RKAS",
    category: "Planning Documents",
    title: "Rencana Kegiatan dan Anggaran Sekolah",
    officialDefinition: "Dokumen perencanaan keuangan dan kegiatan sekolah untuk 1 tahun.",
    educationalIntent: "Memastikan efisiensi, efektivitas, dan akuntabilitas penggunaan dana pendidikan.",
    implementationGuide: "Disusun dalam sistem terintegrasi (ARKAS).",
    examples: ["Dokumen RKAS"],
    relatedKnowledge: ["RKT"],
    relatedDocuments: ["RKAS"],
    relatedRegulations: ["Pedoman Perencanaan Berbasis Data 2025"],
    sourceReference: "Pedoman PBD 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  // F. Educational Quality
  {
    id: "RAPOR_PENDIDIKAN",
    category: "Educational Quality",
    title: "Rapor Pendidikan",
    officialDefinition: "Platform yang menyajikan hasil Asesmen Nasional dan data pendidikan lainnya sebagai bahan evaluasi.",
    educationalIntent: "Menjadi sumber data objektif untuk Perencanaan Berbasis Data (PBD).",
    implementationGuide: "Diakses dan dianalisis oleh tim sekolah untuk menyusun RKT/RKAS.",
    examples: ["Analisis Rapor Pendidikan"],
    relatedKnowledge: ["RKJM", "RKT"],
    relatedDocuments: ["RKJM", "RKT"],
    relatedRegulations: ["Evaluasi Sistem Pendidikan 2025"],
    sourceReference: "Evaluasi Sistem Pendidikan 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  },
  {
    id: "PBD",
    category: "Educational Quality",
    title: "Perencanaan Berbasis Data",
    officialDefinition: "Siklus perbaikan berkesinambungan yang mendasarkan perencanaan pada data Rapor Pendidikan.",
    educationalIntent: "Meningkatkan kualitas intervensi sekolah agar tepat sasaran.",
    implementationGuide: "Identifikasi, Refleksi, Benahi.",
    examples: ["Identifikasi masalah literasi"],
    relatedKnowledge: ["RAPOR_PENDIDIKAN"],
    relatedDocuments: ["RKT", "RKAS"],
    relatedRegulations: ["Pedoman PBD 2025"],
    sourceReference: "Pedoman PBD 2025",
    issuingInstitution: "Kemendikdasmen",
    policyVersion: "2025.1",
    effectiveDate: "2025-01-01",
    revisionHistory: ["2025.1: Baseline"],
    status: "ACTIVE",
    confidenceScore: 100
  }
];

export const NEKB = {
  getKnowledge: (id: string): KnowledgeObject | null => {
    const obj = KnowledgeBase.find(k => k.id === id);
    if (!obj || obj.status !== "ACTIVE") {
      console.warn(`[NEKB] Accessing non-active or missing policy module: ${id}`);
      return null;
    }
    return obj;
  },
  
  validatePolicy: (id: string): boolean => {
    const obj = KnowledgeBase.find(k => k.id === id);
    return !!obj && obj.status === "ACTIVE";
  },

  getAllKnowledge: (): KnowledgeObject[] => {
    return KnowledgeBase;
  },
  
  baselineVersion: "2025.1"
};
