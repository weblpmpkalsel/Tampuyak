const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldDownloadTemplate = `  const handleDownloadTemplate = () => {
    let headers = "";
    if (activeType === "guru") headers = "nama,nip,nuptk,golongan,jabatan,pendidikan,status";
    if (activeType === "pesertaDidik") headers = "kelas,jumlahLaki,jumlahPerempuan,total";
    if (activeType === "tendik") headers = "nama,nip,jabatan,pendidikan,status";
    if (activeType === "rombel") headers = "namaKelas,waliKelas,jumlahSiswa,ruang";
    if (activeType === "sarpras") headers = "jenis,jumlah,kondisiBaik,kondisiRusakRingan,kondisiRusakBerat";
    if (activeType === "komite") headers = "nama,jabatan,pekerjaan,noTelp";
    if (activeType === "pengawas") headers = "nama,nip,instansi,noTelp";
    if (activeType === "school") headers = "name,npsn,address,principalName,principalNip";
    
    const blob = new Blob([headers], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = \`template_\${activeType}.csv\`;
    link.click();
  };`;

const newDownloadTemplate = `  const handleDownloadTemplate = () => {
    let headers = "";
    let example = "";
    if (activeType === "guru") {
      headers = "nama,nip,nuptk,golongan,jabatan,pendidikan,status";
      example = "\\nBudi Santoso,198001012005011001,1234567890,III/c,Guru Kelas,S1,PNS";
    }
    if (activeType === "pesertaDidik") {
      headers = "kelas,jumlahLaki,jumlahPerempuan,total";
      example = "\\nI,15,15,30\\nII,12,18,30";
    }
    if (activeType === "tendik") {
      headers = "nama,nip,jabatan,pendidikan,status";
      example = "\\nSiti Aminah,198502022010012001,Tenaga Administrasi,SMA,PNS";
    }
    if (activeType === "rombel") {
      headers = "namaKelas,waliKelas,jumlahSiswa,ruang";
      example = "\\nKelas I A,Budi Santoso,30,Ruang 1";
    }
    if (activeType === "sarpras") {
      headers = "jenis,jumlah,kondisiBaik,kondisiRusakRingan,kondisiRusakBerat";
      example = "\\nRuang Kelas,6,4,2,0\\nPerpustakaan,1,1,0,0";
    }
    if (activeType === "komite") {
      headers = "nama,jabatan,pekerjaan,noTelp";
      example = "\\nAgus Setiawan,Ketua,Wiraswasta,081234567890";
    }
    if (activeType === "pengawas") {
      headers = "nama,nip,instansi,noTelp";
      example = "\\nDrs. H. Ahmad,197003031995121001,Dinas Pendidikan,081122334455";
    }
    if (activeType === "school") {
      headers = "name,npsn,address,principalName,principalNip";
      example = "\\nSDN 1 Contoh,10101010,Jl. Pendidikan No. 1,Supriyanto,196504041990031002";
    }
    
    const blob = new Blob([headers + example], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = \`template_\${activeType}.csv\`;
    link.click();
  };`;

code = code.replace(oldDownloadTemplate, newDownloadTemplate);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Import templates updated.');
