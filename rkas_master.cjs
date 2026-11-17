const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const rkasMasterCode = `
const RKAS_MASTER_DATA = [
  {
    code: "03.01.01",
    snp: "Standar Isi",
    component: "Pengembangan Kompetensi Lulusan",
    activity: "Pelatihan Guru Matematika Terapan",
    defaultHarga: 500000,
    defaultSatuan: "Keg",
  },
  {
    code: "04.02.05",
    snp: "Standar Pendidik dan Tenaga Kependidikan",
    component: "Pengembangan Profesi Guru",
    activity: "Honor Narasumber Diklat",
    defaultHarga: 300000,
    defaultSatuan: "O/J",
  },
  {
    code: "08.01.02",
    snp: "Standar Pembiayaan",
    component: "Penyediaan Alat Tulis Kantor",
    activity: "Pembelian Kertas HVS",
    defaultHarga: 55000,
    defaultSatuan: "Rim",
  }
];
`;

if (!code.includes('const RKAS_MASTER_DATA')) {
  code = code.replace('const RKASDerivationView = ({ navigateToView }: any) => {', rkasMasterCode + '\nconst RKASDerivationView = ({ navigateToView }: any) => {');
}

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("RKAS_MASTER_DATA added");
