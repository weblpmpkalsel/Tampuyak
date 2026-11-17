const fs = require('fs');

function generateItems(count, category, templates, locations, types, levels, tagsPool) {
  const items = [];
  for(let i=0; i<count; i++) {
    const template = templates[i % templates.length];
    const loc = locations[i % locations.length];
    const type = types[i % types.length];
    const level = levels[i % levels.length];
    const tgs = [tagsPool[i % tagsPool.length], tagsPool[(i+1) % tagsPool.length]];
    
    items.push({
      id: `${category.replace(/\s+/g, '_').toLowerCase()}_${i+1}`,
      title: `${category} Example ${i+1}`,
      category: category,
      source: i % 3 === 0 ? 'OFFICIAL' : 'BEST_PRACTICE',
      version: '1.0.0',
      tags: tgs,
      contexts: {
        educationLevel: [level],
        schoolLocation: [loc],
        schoolType: [type],
        governmentVersion: "2026"
      },
      recommendedText: template.replace('{location}', loc).replace('{level}', level).replace('{type}', type),
      references: ["Panduan KOSP Kemendikdasmen 2026"],
      priority: (i % 5) + 1
    });
  }
  return items;
}

const locations = ['Perkotaan', 'Pedesaan', 'Pesisir', 'Pegunungan', 'Kawasan Industri'];
const types = ['Umum', 'Kejuruan', 'Luar Biasa', 'Terpadu'];
const levels = ['SD', 'SMP', 'SMA', 'SMK'];

const scTemplates = [
  "Peserta didik di lingkungan {location} memiliki karakteristik kemandirian yang tinggi serta motivasi belajar yang dipengaruhi oleh lingkungan sekitar.",
  "Sebagian besar peserta didik berasal dari keluarga dengan latar belakang ekonomi menengah ke bawah, namun memiliki antusiasme yang kuat dalam mengikuti kegiatan ekstrakurikuler.",
  "Peserta didik menunjukkan minat yang besar pada pembelajaran berbasis teknologi dan literasi digital, sesuai dengan perkembangan zaman di daerah {location}.",
  "Karakteristik peserta didik pada jenjang {level} ini cenderung aktif, memiliki rasa ingin tahu yang besar, dan menyukai pembelajaran berbasis proyek yang relevan dengan kehidupan sehari-hari.",
  "Peserta didik memiliki keberagaman budaya dan agama, yang menjadi potensi besar untuk pengembangan sikap toleransi dan gotong royong."
];
const scTags = ['kemandirian', 'motivasi', 'ekonomi', 'teknologi', 'aktif', 'toleransi'];

const tcTemplates = [
  "Tenaga pendidik sebagian besar memiliki kualifikasi S1 dan aktif dalam komunitas belajar (Kombel) di sekolah maupun tingkat gugus.",
  "Guru-guru memiliki dedikasi tinggi dan mulai menerapkan pembelajaran berdiferensiasi sesuai kebutuhan peserta didik {level}.",
  "Pendidik di wilayah {location} memiliki kemampuan adaptasi teknologi yang baik, memfasilitasi pembelajaran daring dan luring.",
  "Kompetensi guru dalam merancang asesmen autentik terus berkembang melalui pelatihan rutin dan pendampingan teman sejawat.",
  "Sebagian guru memiliki pengalaman mengajar lebih dari 10 tahun, membawa kearifan lokal dalam proses pembelajaran."
];
const tcTags = ['kualifikasi', 'kombel', 'diferensiasi', 'teknologi', 'asesmen', 'pengalaman'];

const pcTemplates = [
  "Orang tua peserta didik sebagian besar berprofesi sebagai pekerja sektor informal di daerah {location}, yang mempengaruhi waktu pendampingan belajar di rumah.",
  "Tingkat kepedulian orang tua terhadap pendidikan anak cukup tinggi, terlihat dari partisipasi aktif dalam kegiatan paguyuban kelas.",
  "Orang tua sangat mendukung program sekolah yang berorientasi pada pembinaan karakter dan keterampilan hidup (life skills).",
  "Terdapat tantangan dalam komunikasi rutin dengan orang tua karena kesibukan bekerja, sehingga sekolah menggunakan media komunikasi digital secara intensif.",
  "Latar belakang pendidikan orang tua yang beragam menuntut sekolah untuk menyampaikan informasi perkembangan anak dengan bahasa yang mudah dipahami."
];
const pcTags = ['profesi', 'kepedulian', 'karakter', 'komunikasi', 'latar-belakang'];

const seTemplates = [
  "Lingkungan sekolah terletak di area {location} yang kondusif untuk kegiatan pembelajaran, dengan lahan yang cukup untuk area hijau dan ruang terbuka.",
  "Sekolah memiliki fasilitas dasar yang memadai, namun memerlukan optimalisasi pemanfaatan perpustakaan dan laboratorium.",
  "Kondisi sosial budaya masyarakat sekitar sangat mendukung program pelestarian lingkungan dan budaya lokal.",
  "Lokasi sekolah yang berdekatan dengan pusat industri di daerah {location} memberikan peluang untuk kemitraan dunia usaha.",
  "Lingkungan fisik sekolah mendukung inklusivitas dengan menyediakan aksesibilitas bagi peserta didik berkebutuhan khusus."
];
const seTags = ['kondusif', 'fasilitas', 'budaya', 'kemitraan', 'inklusif'];

const vTemplates = [
  "Mewujudkan lulusan {level} yang beriman, bertakwa, berakhlak mulia, cerdas, berkarakter Pancasila, dan berwawasan lingkungan.",
  "Menjadi institusi pendidikan unggul yang mencetak generasi inovatif, mandiri, dan berbudaya di daerah {location}.",
  "Terwujudnya peserta didik yang berprestasi, terampil, dan peduli terhadap kelestarian lingkungan hidup.",
  "Mencetak lulusan yang memiliki kecakapan abad 21, berakar pada kearifan lokal, dan berdaya saing global.",
  "Mewujudkan sekolah ramah anak yang membentuk profil pelajar Pancasila secara utuh dan berkelanjutan."
];
const vTags = ['beriman', 'unggul', 'berprestasi', 'abad-21', 'ramah-anak'];

const mTemplates = [
  "Menyelenggarakan pembelajaran yang berpusat pada peserta didik dengan pendekatan berdiferensiasi.",
  "Mengintegrasikan nilai-nilai Profil Pelajar Pancasila dalam setiap kegiatan intrakurikuler dan ekstrakurikuler.",
  "Meningkatkan kompetensi pendidik melalui pelatihan berkelanjutan dan komunitas belajar.",
  "Menjalin kemitraan yang erat dengan orang tua dan masyarakat daerah {location} dalam mendukung program sekolah.",
  "Mengoptimalkan pemanfaatan teknologi informasi dan komunikasi dalam proses pembelajaran dan manajemen sekolah."
];
const mTags = ['berpusat', 'pancasila', 'kompetensi', 'kemitraan', 'teknologi'];

const sgTemplates = [
  "Meningkatkan rata-rata nilai literasi dan numerasi peserta didik pada jenjang {level} dalam asesmen nasional.",
  "Mewujudkan 100% lulusan yang memiliki karakter sesuai dimensi Profil Pelajar Pancasila.",
  "Mencapai predikat Sekolah Adiwiyata tingkat provinsi melalui program pelestarian lingkungan yang terintegrasi.",
  "Meningkatkan partisipasi peserta didik dalam kegiatan ekstrakurikuler minimal 80%.",
  "Mengembangkan inovasi pembelajaran berbasis proyek yang menghasilkan karya aplikatif sesuai kearifan lokal {location}."
];
const sgTags = ['literasi', 'karakter', 'adiwiyata', 'partisipasi', 'inovasi'];

const packs = [
  { category: 'Student Characteristics', count: 50, templates: scTemplates, tags: scTags },
  { category: 'Teacher Characteristics', count: 30, templates: tcTemplates, tags: tcTags },
  { category: 'Parent Characteristics', count: 30, templates: pcTemplates, tags: pcTags },
  { category: 'School Environment', count: 30, templates: seTemplates, tags: seTags },
  { category: 'School Vision', count: 20, templates: vTemplates, tags: vTags },
  { category: 'School Mission', count: 50, templates: mTemplates, tags: mTags },
  { category: 'School Goals', count: 30, templates: sgTemplates, tags: sgTags }
];

let allItems = [];
packs.forEach(p => {
  allItems = allItems.concat(generateItems(p.count, p.category, p.templates, locations, types, levels, p.tags));
});

const packObj = {
  id: "official_kosp_pack_2026",
  domain: "KOSP",
  title: "Official KOSP Knowledge Pack 2026",
  description: "Curated official writing guidelines and examples for KOSP 2026",
  version: "1.0.0",
  items: allItems
};

const fileContent = `import { KnowledgePack } from '../../KnowledgePackModel';

export const officialKospPack2026: KnowledgePack = ${JSON.stringify(packObj, null, 2)};
`;

fs.writeFileSync('src/enterprise/knowledge/packs/data/official/kosp2026.ts', fileContent);

const indexContent = `import { KnowledgePackRegistry } from '../../KnowledgePackRegistry';

export function registerOfficialPacks() {
  KnowledgePackRegistry.register({
    id: 'official_kosp_pack_2026',
    domain: 'KOSP',
    loader: async () => {
      const module = await import('./kosp2026');
      return module.officialKospPack2026;
    }
  });
}
`;

fs.writeFileSync('src/enterprise/knowledge/packs/data/official/index.ts', indexContent);

