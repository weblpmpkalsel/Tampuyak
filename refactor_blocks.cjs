const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const targetBlocks = `const [blocks, setBlocks] = useState([
    {
      id: "b1",
      type: "AUTO",
      content: "RENCANA KERJA JANGKA MENENGAH (RKJM)\\nTAHUN 2024 - 2028",
      traceability: "Template Registry",
    },
    {
      id: "b2",
      type: "AUTO",
      content: \`Nama Sekolah: \${settings.namaSekolah || "SDN Contoh Terpadu"}
NPSN: \${settings.npsn || "12345678"}\`,
      traceability: "Pusat Data Sekolah",
    },
    {
      id: "b3",
      type: "MANUAL",
      content: "BAB I PENDAHULUAN",
      traceability: "Manual Entry",
    },
    {
      id: "b4",
      type: "AI",
      content:
        "1.1 Latar Belakang\\nBerdasarkan Rapor Pendidikan tahun terakhir, sekolah kami memiliki beberapa kekuatan dan kelemahan yang perlu ditindaklanjuti. Kelemahan utama berada pada kemampuan numerasi siswa kelas 5.",
      traceability: "Analisis Prioritas & Knowledge Base",
    },
    {
      id: "b5",
      type: "AI",
      content:
        "1.2 Tujuan\\nRKJM ini disusun untuk menutupi gap capaian dan mewujudkan Visi Misi sekolah dalam 4 tahun ke depan melalui berbagai program strategis.",
      traceability: "Analisis Prioritas & Visi Misi",
    },
  ]);`;

const newBlocks = `const [blocks, setBlocks] = useState([
    {
      id: "b1",
      type: "AUTO",
      content: "RENCANA KERJA JANGKA MENENGAH (RKJM)\\nTAHUN 2024 - 2028",
      traceability: "Template Registry",
    },
    {
      id: "b2",
      type: "AUTO",
      content: \`Nama Sekolah: \${settings.namaSekolah || "SDN Contoh Terpadu"}
NPSN: \${settings.npsn || "12345678"}
Kepala Sekolah: \${settings.kepsek?.nama || "-"}
Tahun Ajaran: \${settings.tahunAjaran || "2024/2025"}\`,
      traceability: "Pusat Data Sekolah",
    },
    {
      id: "b3",
      type: "MANUAL",
      content: "BAB I PENDAHULUAN\\n\\n1.1 Latar Belakang\\n[Isi latar belakang penyusunan RKJM. Jelaskan kondisi riil sekolah dan dasar hukum yang digunakan.]",
      traceability: "Manual Entry",
    },
    {
      id: "b4",
      type: "MANUAL",
      content:
        "1.2 Tujuan dan Sasaran\\n[Uraikan tujuan yang ingin dicapai berdasarkan Visi, Misi, dan Rapor Pendidikan terbaru.]",
      traceability: "Manual Entry",
    },
    {
      id: "b5",
      type: "MANUAL",
      content:
        "BAB II PROFIL SEKOLAH\\n\\n[Tuliskan deskripsi singkat mengenai karakteristik, demografi, dan lingkungan belajar di sekolah.]",
      traceability: "Manual Entry",
    },
  ]);`;

code = code.replace(targetBlocks, newBlocks);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
