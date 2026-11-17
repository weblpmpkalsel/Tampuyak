export const EOFFICE_MENU = [
  { id: 'tugas', label: 'Surat Tugas Pegawai (SPPD)', category: 'Surat Kedinasan' },
  { id: 'undangan', label: 'Surat Undangan Resmi', category: 'Surat Kedinasan' },
  { id: 'keterangan', label: 'Surat Keterangan Aktif', category: 'Surat Kedinasan' },
  { id: 'sk_pbm', label: 'SK Pembagian Tugas (PBM)', category: 'Surat Keputusan (SK)' },
  { id: 'sk_mpls', label: 'SK Panitia & Program MPLS', category: 'Surat Keputusan (SK)' },
  { id: 'sk_ujian', label: 'SK Panitia Kegiatan / Ujian', category: 'Surat Keputusan (SK)' },
  { id: 'sk_perpisahan', label: 'SK Panitia Perpisahan', category: 'Surat Keputusan (SK)' },
  { id: 'sk_tps', label: 'SK Tim Pengembang Sekolah (TPS)', category: 'Surat Keputusan (SK)' },
  { id: 'sk_kombel', label: 'SK Tim Kinerja (Kombel)', category: 'Surat Keputusan (SK)' },
  { id: 'sk_tppk', label: 'SK TPPK (Anti Kekerasan)', category: 'Surat Keputusan (SK)' },
  { id: 'sk_bos', label: 'SK Tim Manajemen BOS', category: 'Surat Keputusan (SK)' },
  { id: 'sk_ekskul', label: 'SK Pembina Ekstrakurikuler', category: 'Surat Keputusan (SK)' },
  { id: 'sk_makan', label: 'SK Tim Pelaksana Makan Bergizi', category: 'Surat Keputusan (SK)' },
  { id: 'sk_7k', label: 'SK Tim Pembina 7K', category: 'Surat Keputusan (SK)' },
  { id: 'sk_literasi', label: 'SK Tim Literasi & Numerasi', category: 'Surat Keputusan (SK)' },
];

export const SK_TEMPLATES: Record<string, any> = {
  sk_pbm: {
    title: "PEMBAGIAN TUGAS GURU DALAM PROSES BELAJAR MENGAJAR ATAU BIMBINGAN",
    menimbang: [
      "bahwa proses belajar mengajar merupakan inti pelaksanaan kurikulum pada satuan pendidikan;",
      "bahwa guna memperlancar proses belajar mengajar, perlu ditetapkan pembagian tugas guru dalam mengajar dan tugas tambahan lainnya."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Undang-Undang Nomor 14 Tahun 2005 tentang Guru dan Dosen;",
      "Peraturan Pemerintah Nomor 19 Tahun 2017 tentang Perubahan atas PP Nomor 74 Tahun 2008 tentang Guru;",
      "Peraturan Menteri Pendidikan dan Kebudayaan Nomor 15 Tahun 2018 tentang Pemenuhan Beban Kerja Guru, Kepala Sekolah, dan Pengawas Sekolah."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBAGIAN TUGAS GURU DALAM PROSES BELAJAR MENGAJAR ATAU BIMBINGAN.",
    dictum: [
      { label: "KESATU", text: "Menetapkan pembagian tugas guru dalam proses belajar mengajar atau bimbingan sebagaimana tercantum dalam lampiran I keputusan ini." },
      { label: "KEDUA", text: "Menugaskan guru untuk melaksanakan tugas bimbingan, tugas tambahan, dan tugas-tugas lainnya yang relevan sebagaimana tercantum dalam lampiran II." },
      { label: "KETIGA", text: "Masing-masing guru wajib melaporkan pelaksanaan tugasnya secara berkala kepada Kepala Sekolah." },
      { label: "KEEMPAT", text: "Segala biaya yang timbul akibat pelaksanaan keputusan ini dibebankan pada anggaran yang sesuai." },
      { label: "KELIMA", text: "Keputusan ini berlaku sejak tanggal ditetapkan, dan apabila terdapat kekeliruan akan diperbaiki sebagaimana mestinya." }
    ]
  },
  sk_tppk: {
    title: "PEMBENTUKAN TIM PENCEGAHAN DAN PENANGANAN KEKERASAN (TPPK)",
    menimbang: [
      "bahwa untuk menciptakan lingkungan satuan pendidikan yang aman, nyaman, dan bebas dari kekerasan, perlu dilakukan upaya pencegahan dan penanganan kekerasan secara sistematis;",
      "bahwa berdasarkan pertimbangan sebagaimana dimaksud, perlu menetapkan Keputusan Kepala Sekolah tentang Pembentukan Tim Pencegahan dan Penanganan Kekerasan (TPPK)."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Undang-Undang Nomor 35 Tahun 2014 tentang Perubahan atas UU Nomor 23 Tahun 2002 tentang Perlindungan Anak;",
      "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN TIM PENCEGAHAN DAN PENANGANAN KEKERASAN (TPPK).",
    dictum: [
      { label: "KESATU", text: "Membentuk Tim Pencegahan dan Penanganan Kekerasan (TPPK) dengan susunan keanggotaan sebagaimana tercantum dalam Lampiran Keputusan ini." },
      { label: "KEDUA", text: "Tim TPPK bertugas menyusun program pencegahan, menerima laporan, memfasilitasi penanganan kasus kekerasan, serta melaporkan pelaksanaannya kepada Kepala Sekolah dan Dinas Pendidikan." },
      { label: "KETIGA", text: "Segala biaya yang timbul akibat pelaksanaan keputusan ini dibebankan pada Anggaran Pendapatan dan Belanja Sekolah (APBS) / Dana BOSP yang relevan." },
      { label: "KEEMPAT", text: "Keputusan ini mulai berlaku pada tanggal ditetapkan, dengan masa bakti sesuai ketentuan peraturan perundang-undangan." }
    ]
  },
  sk_bos: {
    title: "PEMBENTUKAN TIM MANAJEMEN BANTUAN OPERASIONAL SATUAN PENDIDIKAN (BOSP)",
    menimbang: [
      "bahwa untuk meringankan beban masyarakat dan meningkatkan mutu pendidikan, pemerintah mengalokasikan Dana Bantuan Operasional Satuan Pendidikan (BOSP);",
      "bahwa agar pengelolaan Dana BOSP di tingkat sekolah dapat dilaksanakan secara tertib, efisien, efektif, transparan, dan akuntabel, perlu dibentuk Tim Manajemen BOSP Tingkat Sekolah."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Peraturan Pemerintah Nomor 48 Tahun 2008 tentang Pendanaan Pendidikan;",
      "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 63 Tahun 2022 tentang Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN TIM MANAJEMEN BANTUAN OPERASIONAL SATUAN PENDIDIKAN (BOSP).",
    dictum: [
      { label: "KESATU", text: "Membentuk Tim Manajemen BOSP tingkat satuan pendidikan dengan susunan keanggotaan sebagaimana tercantum dalam Lampiran Keputusan ini." },
      { label: "KEDUA", text: "Tim Manajemen BOSP bertugas merencanakan (menyusun RKAS), melaksanakan, menatausahakan, dan mempertanggungjawabkan penggunaan Dana BOSP sesuai petunjuk teknis yang berlaku." },
      { label: "KETIGA", text: "Semua biaya yang timbul akibat pelaksaaan kegiatan tim dibebankan pada Dana BOSP atau Anggaran Sekolah yang relevan." },
      { label: "KEEMPAT", text: "Keputusan ini mulai berlaku pada tanggal ditetapkan dan berlaku selama tahun anggaran berjalan." }
    ]
  },
  sk_mpls: {
    title: "PEMBENTUKAN PANITIA MASA PENGENALAN LINGKUNGAN SEKOLAH (MPLS)",
    menimbang: [
      "bahwa dalam rangka penerimaan peserta didik baru, perlu dilakukan pengenalan lingkungan sekolah yang bersifat edukatif, kreatif, dan menyenangkan;",
      "bahwa untuk menjamin kelancaran, ketertiban, dan keamanan pelaksanaan MPLS, dipandang perlu membentuk Panitia Pelaksana."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Peraturan Menteri Pendidikan dan Kebudayaan Nomor 18 Tahun 2016 tentang Pengenalan Lingkungan Sekolah Bagi Siswa Baru;",
      "Peraturan Menteri Pendidikan dan Kebudayaan Nomor 1 Tahun 2021 tentang Penerimaan Peserta Didik Baru pada TK, SD, SMP, SMA, dan SMK."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN PANITIA MASA PENGENALAN LINGKUNGAN SEKOLAH (MPLS).",
    dictum: [
      { label: "KESATU", text: "Membentuk Panitia Pelaksana Masa Pengenalan Lingkungan Sekolah (MPLS) dengan susunan panitia sebagaimana tercantum dalam Lampiran Keputusan ini." },
      { label: "KEDUA", text: "Panitia bertugas merencanakan, melaksanakan, dan mengevaluasi kegiatan MPLS dengan mengedepankan kegiatan edukatif serta menjamin tidak ada praktik perpeloncoan/kekerasan." },
      { label: "KETIGA", text: "Segala biaya yang timbul akibat pelaksanaan keputusan ini dibebankan pada Rencana Kegiatan dan Anggaran Sekolah (RKAS)." },
      { label: "KEEMPAT", text: "Keputusan ini mulai berlaku pada tanggal ditetapkan sampai dengan berakhirnya kegiatan MPLS." }
    ]
  },
  sk_ujian: {
    title: "PEMBENTUKAN PANITIA PELAKSANA ASESMEN / UJIAN SEKOLAH",
    menimbang: [
      "bahwa untuk mengukur pencapaian kompetensi peserta didik, perlu diselenggarakan asesmen atau ujian sekolah yang tertib, aman, dan lancar;",
      "bahwa demi kelancaran pelaksanaan kegiatan tersebut, perlu dibentuk Panitia Pelaksana Asesmen/Ujian Sekolah."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan sebagaimana telah diubah dengan PP Nomor 4 Tahun 2022;",
      "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 21 Tahun 2022 tentang Standar Penilaian Pendidikan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN PANITIA PELAKSANA ASESMEN / UJIAN SEKOLAH.",
    dictum: [
      { label: "KESATU", text: "Membentuk Panitia Pelaksana Asesmen/Ujian Sekolah dengan susunan keanggotaan sebagaimana tercantum dalam Lampiran Keputusan ini." },
      { label: "KEDUA", text: "Panitia bertugas merencanakan, menyiapkan perangkat, mengawasi pelaksanaan, serta menyusun laporan hasil penyelenggaraan asesmen/ujian." },
      { label: "KETIGA", text: "Seluruh pembiayaan penyelenggaraan asesmen/ujian dibebankan pada Anggaran Pendapatan dan Belanja Sekolah (APBS) / Dana BOSP." },
      { label: "KEEMPAT", text: "Keputusan ini berlaku sejak tanggal ditetapkan." }
    ]
  },
  sk_tps: {
    title: "PEMBENTUKAN TIM PENGEMBANG SEKOLAH (TPS)",
    menimbang: [
      "bahwa dalam rangka peningkatan mutu pendidikan dan percepatan pemenuhan Standar Nasional Pendidikan (SNP), diperlukan perencanaan, pelaksanaan, dan evaluasi program yang sistematis;",
      "bahwa untuk merealisasikan hal tersebut, perlu dibentuk Tim Pengembang Sekolah (TPS)."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan;"
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN TIM PENGEMBANG SEKOLAH (TPS).",
    dictum: [
      { label: "KESATU", text: "Membentuk Tim Pengembang Sekolah (TPS) dengan susunan personel sebagaimana terdapat dalam lampiran." },
      { label: "KEDUA", text: "Tim bertugas mengkoordinasikan penyusunan Rapor Pendidikan, Rencana Kerja Jangka Menengah (RKJM), dan Rencana Kegiatan dan Anggaran Sekolah (RKAS)." },
      { label: "KETIGA", text: "Keputusan ini berlaku pada tahun pelajaran berjalan." }
    ]
  },
  sk_kombel: {
    title: "PEMBENTUKAN KOMUNITAS BELAJAR (KOMBEL) DALAM SEKOLAH",
    menimbang: [
      "bahwa untuk meningkatkan kompetensi pendidik dan tenaga kependidikan secara berkelanjutan, perlu dibangun budaya belajar kolaboratif di lingkungan sekolah;",
      "bahwa untuk mewadahi kegiatan kolaboratif tersebut, perlu dibentuk Komunitas Belajar (Kombel) dalam satuan pendidikan."
    ],
    mengingat: [
      "Undang-Undang Nomor 14 Tahun 2005 tentang Guru dan Dosen;",
      "Surat Edaran Direktur Jenderal Guru dan Tenaga Kependidikan Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi mengenai Optimalisasi Komunitas Belajar."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN KOMUNITAS BELAJAR (KOMBEL).",
    dictum: [
      { label: "KESATU", text: "Membentuk Pengurus Komunitas Belajar (Kombel) dengan susunan sebagaimana tercantum dalam lampiran." },
      { label: "KEDUA", text: "Komunitas Belajar bertugas memfasilitasi diskusi rutin, berbagi praktik baik (best practice), dan memecahkan permasalahan pembelajaran guna meningkatkan hasil belajar peserta didik." },
      { label: "KETIGA", text: "Keputusan ini mulai berlaku sejak tanggal ditetapkan." }
    ]
  },
  sk_ekskul: {
    title: "PENETAPAN PEMBINA KEGIATAN EKSTRAKURIKULER",
    menimbang: [
      "bahwa untuk menyalurkan dan mengembangkan bakat, minat, serta potensi peserta didik, perlu diselenggarakan kegiatan ekstrakurikuler;",
      "bahwa guna kelancaran pelaksanaan kegiatan ekstrakurikuler tersebut, perlu ditetapkan Guru Pembina Ekstrakurikuler."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Peraturan Menteri Pendidikan dan Kebudayaan Nomor 62 Tahun 2014 tentang Kegiatan Ekstrakurikuler pada Pendidikan Dasar dan Pendidikan Menengah."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PENETAPAN PEMBINA KEGIATAN EKSTRAKURIKULER.",
    dictum: [
      { label: "KESATU", text: "Menetapkan nama-nama pendidik yang tercantum dalam lampiran keputusan ini sebagai Pembina Kegiatan Ekstrakurikuler." },
      { label: "KEDUA", text: "Pembina bertugas menyusun program kerja, melaksanakan pembimbingan, dan melaporkan hasil capaian peserta didik pada kegiatan ekstrakurikuler." },
      { label: "KETIGA", text: "Keputusan ini berlaku selama tahun pelajaran berjalan." }
    ]
  },
  sk_makan: {
    title: "PEMBENTUKAN TIM PELAKSANA PROGRAM MAKAN BERGIZI",
    menimbang: [
      "bahwa dalam rangka menunjang kesehatan fisik, gizi, dan konsentrasi belajar peserta didik, sekolah turut serta melaksanakan Program Makan Bergizi;",
      "bahwa agar pelaksanaan program dapat berjalan dengan higienis, tepat sasaran, dan tertib, perlu dibentuk Tim Pelaksana."
    ],
    mengingat: [
      "Undang-Undang Nomor 36 Tahun 2009 tentang Kesehatan;",
      "Kebijakan Pemerintah Pusat dan Daerah terkait Peningkatan Gizi Anak Sekolah."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN TIM PELAKSANA PROGRAM MAKAN BERGIZI.",
    dictum: [
      { label: "KESATU", text: "Membentuk Tim Pelaksana Program Makan Bergizi dengan susunan panitia sebagaimana tercantum pada lampiran." },
      { label: "KEDUA", text: "Tim bertugas mengawasi penyediaan konsumsi, memastikan kebersihan (higienitas), gizi, dan kelancaran distribusi kepada peserta didik." },
      { label: "KETIGA", text: "Segala biaya terkait pemenuhan logistik dan operasional didanai melalui sumber anggaran yang sah dan tidak mengikat." },
      { label: "KEEMPAT", text: "Keputusan ini berlaku sejak tanggal ditetapkan." }
    ]
  },
  sk_literasi: {
    title: "PEMBENTUKAN TIM LITERASI DAN NUMERASI SEKOLAH",
    menimbang: [
      "bahwa kemampuan literasi dan numerasi merupakan kompetensi mendasar yang harus dimiliki peserta didik untuk menunjang pembelajaran sepanjang hayat;",
      "bahwa untuk menguatkan pembudayaan literasi dan numerasi di lingkungan sekolah, dipandang perlu membentuk Tim Literasi dan Numerasi."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Peraturan Menteri Pendidikan dan Kebudayaan Nomor 23 Tahun 2015 tentang Penumbuhan Budi Pekerti (Gerakan Literasi Sekolah)."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN TIM LITERASI DAN NUMERASI SEKOLAH.",
    dictum: [
      { label: "KESATU", text: "Membentuk Tim Literasi dan Numerasi Sekolah dengan susunan personel sebagaimana tercantum dalam lampiran." },
      { label: "KEDUA", text: "Tim bertugas merancang program pembudayaan literasi/numerasi, mengelola pojok baca/perpustakaan, serta mengintegrasikan praktik literasi ke dalam proses pembelajaran." },
      { label: "KETIGA", text: "Keputusan ini berlaku pada tahun pelajaran berjalan." }
    ]
  },
  sk_7k: {
    title: "PEMBENTUKAN TIM PEMBINA 7K (KEAMANAN, KEBERSIHAN, KETERTIBAN, KEINDAHAN, KEKELUARGAAN, KERINDANGAN, DAN KESEHATAN)",
    menimbang: [
      "bahwa lingkungan sekolah yang kondusif, bersih, tertib, dan sehat sangat berpengaruh terhadap kenyamanan dan keberhasilan proses pembelajaran;",
      "bahwa untuk mewujudkan hal tersebut, perlu dibentuk Tim Pembina 7K di lingkungan sekolah."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Undang-Undang Nomor 36 Tahun 2009 tentang Kesehatan;"
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN TIM PEMBINA 7K.",
    dictum: [
      { label: "KESATU", text: "Membentuk Tim Pembina 7K dengan susunan keanggotaan sebagaimana terlampir." },
      { label: "KEDUA", text: "Tim bertugas memantau, membina, dan mengevaluasi kebersihan, ketertiban, keamanan, keindahan, kekeluargaan, kerindangan, dan kesehatan lingkungan sekolah." },
      { label: "KETIGA", text: "Keputusan ini berlaku sejak tanggal ditetapkan." }
    ]
  },
  sk_perpisahan: {
    title: "PEMBENTUKAN PANITIA PELEPASAN / PERPISAHAN PESERTA DIDIK",
    menimbang: [
      "bahwa sehubungan dengan telah berakhirnya masa studi peserta didik kelas akhir, sekolah akan menyelenggarakan kegiatan pelepasan/perpisahan;",
      "bahwa demi kelancaran dan ketertiban acara pelepasan tersebut, perlu dibentuk susunan kepanitiaan."
    ],
    mengingat: [
      "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "Kalender Pendidikan Tahun Pelajaran Berjalan."
    ],
    menetapkan: "KEPUTUSAN KEPALA SEKOLAH TENTANG PEMBENTUKAN PANITIA PELEPASAN / PERPISAHAN PESERTA DIDIK.",
    dictum: [
      { label: "KESATU", text: "Membentuk Panitia Pelepasan / Perpisahan dengan struktur organisasi sebagaimana tercantum dalam lampiran." },
      { label: "KEDUA", text: "Panitia bertugas menyusun konsep acara, mempersiapkan kebutuhan, dan bertanggung jawab penuh atas pelaksanaan kegiatan hingga selesai." },
      { label: "KETIGA", text: "Pembiayaan acara ini bersumber dari partisipasi orang tua/wali murid secara sukarela dan tidak mengikat sesuai ketentuan perundang-undangan." },
      { label: "KEEMPAT", text: "Keputusan ini mulai berlaku sejak ditetapkan." }
    ]
  }
};
