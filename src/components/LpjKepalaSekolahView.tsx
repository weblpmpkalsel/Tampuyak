import React, { useState, useEffect } from 'react';
import { Printer, Edit3, Check, FileText, Download } from 'lucide-react';
import { useApp } from '../Tampuyak';

export const LpjKepalaSekolahView = ({ settings: propSettings }: { settings?: any }) => {
  const appCtx = useApp();
  const settings = propSettings || appCtx?.settings || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const school = settings?.school || {};
  const principal = settings?.principal || {};
  
  // SAFE ARRAYS TO PREVENT MAP/FILTER CRASHES
  const guruList = Array.isArray(settings?.guru) ? settings.guru : [];
  const tendikList = Array.isArray(settings?.tendik) ? settings.tendik : [];
  const rombelList = Array.isArray(settings?.rombel) ? settings.rombel : [];

  const handlePrint = () => {
    setIsEditMode(false);
    setTimeout(() => {
      try {
        let printRoot = document.getElementById('print-root');
        if (!printRoot) {
          printRoot = document.createElement('div');
          printRoot.id = 'print-root';
          document.body.appendChild(printRoot);
        }
        
        const content = document.getElementById('lpj-paper');
        if (content) {
          printRoot.innerHTML = '';
          printRoot.appendChild(content.cloneNode(true));
          window.print();
          setTimeout(() => {
            if (printRoot) printRoot.innerHTML = '';
          }, 500);
        } else {
          window.print();
        }
      } catch (error) {
        console.error("Print blocked:", error);
        window.print();
      }
    }, 100);
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row h-full w-full max-h-[85vh] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden print:max-h-none print:border-none print:rounded-none">
      
      {/* Sidebar Controls (Hidden on Print) */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col print:hidden shadow-sm z-10 relative">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            LPJ Kepala Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Laporan Pertanggungjawaban (LPJ) Kepala Sekolah akhir tahun atau masa jabatan. Dokumen dapat diedit langsung sebelum dicetak.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Panduan</h3>
              <ul className="text-xs text-blue-800 space-y-2">
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Laporan ini mengagregasi data sekolah Anda secara otomatis.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Gunakan <strong>Mode Edit Manual</strong> untuk mengubah teks/tabel.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Simpan dokumen dalam format PDF melalui tombol Cetak. (Pilih ukuran kertas A4, margin Default/Minimum)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 space-y-3">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-xl border-2 transition-colors shadow-sm ${isEditMode ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {isEditMode ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditMode ? 'Selesai Edit Manual' : 'Mode Edit Manual'}
          </button>
          
          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
          >
            <Printer className="w-5 h-5" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Preview Area (Ikut terprint) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-300 flex flex-col items-center print:bg-white print:p-0 print:overflow-visible relative custom-scrollbar space-y-8 print:space-y-0 print:block">
        
        <div className={`print-info hidden md:flex absolute top-4 right-8 px-4 py-2 rounded-lg text-xs font-medium shadow-sm print:hidden items-center gap-2 z-20 ${isEditMode ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
           <FileText className="w-4 h-4" />
           {isEditMode ? 'Mode Edit aktif. Anda bebas mengubah isi LPJ sebelum dicetak.' : 'Tips: Klik "Mode Edit Manual" untuk menyunting.'}
        </div>
        
        <div id="lpj-paper" className="w-full flex flex-col items-center space-y-8 print:space-y-0 print:block">
           {/* HALAMAN 1: COVER */}
        <div 
          className={`page-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative font-serif text-slate-900 mx-auto transition-all print:shadow-none print:w-[210mm] print:h-[297mm] print:min-h-[297mm] print:mx-0 print:break-after-page ${isEditMode ? 'ring-4 ring-orange-400 ring-dashed cursor-text' : ''}`}
          contentEditable={isEditMode} 
          suppressContentEditableWarning
        >
          {/* Border Frame */}
          <div className="absolute top-10 bottom-10 left-10 right-10 border-8 border-double border-slate-900 p-10 flex flex-col items-center justify-between text-center print:top-10 print:bottom-10 print:left-10 print:right-10">
            
            <div className="mt-6 w-full">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-6 leading-relaxed">
                LAPORAN PERTANGGUNGJAWABAN<br />KEPALA SEKOLAH
              </h1>
              <p className="text-xl font-bold uppercase tracking-widest">
                TAHUN PELAJARAN {settings?.academicYears?.[0]?.name || "2023/2024"}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-48 h-48 mb-16 flex items-center justify-center">
                {typeof (settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl || settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo) === 'string' ? (
                  <img src={settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl || settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo} alt="Logo" className="w-44 h-44 object-contain drop-shadow-sm" />
                ) : (
                  <div className="w-40 h-40 border-[6px] border-slate-800 rounded-full flex items-center justify-center text-2xl text-slate-800 font-black tracking-widest shadow-inner">LOGO</div>
                )}
              </div>
              
              <div className="w-full">
                <p className="text-lg font-semibold uppercase tracking-wider mb-6">Disusun Oleh:</p>
                <div className="inline-block">
                  <p className="text-2xl font-bold uppercase tracking-wide pb-2 px-8">
                    {principal?.name || "NAMA KEPALA SEKOLAH"}
                  </p>
                  <div className="h-0.5 bg-slate-900 w-full"></div>
                </div>
                <p className="text-lg font-semibold tracking-widest mt-3">
                  NIP. {principal?.nip || "-"}
                </p>
              </div>
            </div>
            
            <div className="mb-2 w-full">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-2">
                PEMERINTAH {
                    ['SMA', 'SMK', 'SLB'].includes(school?.level) 
                      ? (school?.province ? (String(school.province).toUpperCase().includes('PROVINSI') ? String(school.province).toUpperCase() : `PROVINSI ${String(school.province).toUpperCase()}`) : "PROVINSI") 
                      : (school?.regency ? (
                          String(school.regency).toUpperCase().includes('KAB') || String(school.regency).toUpperCase().includes('KOTA') 
                            ? String(school.regency).toUpperCase() 
                            : `KABUPATEN ${String(school.regency).toUpperCase()}`
                        ) : "KABUPATEN/KOTA")
                  }
              </h2>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4">
                {school?.instansi ? String(school.instansi).toUpperCase() : "DINAS PENDIDIKAN DAN KEBUDAYAAN"}
              </h2>
              <h2 className="text-[28px] font-bold uppercase tracking-widest mb-4">
                {school?.name || "NAMA SEKOLAH"}
              </h2>
              <p className="text-base font-medium tracking-wide max-w-lg mx-auto leading-relaxed">
                {school?.address || "Alamat Sekolah"}
              </p>
              <p className="text-xl font-bold tracking-widest mt-6">
                {new Date().getFullYear()}
              </p>
            </div>

          </div>
        </div>

        {/* HALAMAN 2: LEMBAR PENGESAHAN */}
        <div 
          className={`page-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative font-serif text-slate-900 mx-auto transition-all print:shadow-none print:w-[210mm] print:h-[297mm] print:min-h-[297mm] print:mx-0 print:break-after-page ${isEditMode ? 'ring-4 ring-orange-400 ring-dashed cursor-text' : ''}`}
          contentEditable={isEditMode} 
          suppressContentEditableWarning
          style={{ padding: '20mm' }}
        >
          {/* Kop Surat yang Diperbaiki */}
          <div className="flex items-center justify-between pb-2 mb-1">
            <div className="w-24 flex justify-center items-center">
              {typeof (settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo) === 'string' ? (
                <img src={settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo} alt="Logo Pemda" className="w-20 h-20 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-center">LOGO<br/>PEMDA</div>
              )}
            </div>
            <div className="flex-1 text-center px-4 leading-snug">
              <h2 className="text-lg font-bold uppercase tracking-wide">
                PEMERINTAH {
                    ['SMA', 'SMK', 'SLB'].includes(school?.level) 
                      ? (school?.province ? (String(school.province).toUpperCase().includes('PROVINSI') ? String(school.province).toUpperCase() : `PROVINSI ${String(school.province).toUpperCase()}`) : "PROVINSI") 
                      : (school?.regency ? (
                          String(school.regency).toUpperCase().includes('KAB') || String(school.regency).toUpperCase().includes('KOTA') 
                            ? String(school.regency).toUpperCase() 
                            : `KABUPATEN ${String(school.regency).toUpperCase()}`
                        ) : "KABUPATEN/KOTA")
                  }
              </h2>
              <h2 className="text-lg font-bold uppercase tracking-wide">{school?.instansi ? String(school.instansi).toUpperCase() : "DINAS PENDIDIKAN DAN KEBUDAYAAN"}</h2>
              <h1 className="text-2xl font-black uppercase tracking-wider mt-1">{school?.name || "NAMA SEKOLAH"}</h1>
              <p className="text-sm mt-1">{school?.address || "Alamat Sekolah"}, {school?.village || "Desa"}, {school?.district || "Kecamatan"}</p>
              <p className="text-xs mt-1">NPSN: {school?.npsn || "-"} | Email: {school?.email || "-"} | Telp: {school?.phone || "-"}</p>
            </div>
            <div className="w-24 flex justify-center items-center">
               {typeof (settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl) === 'string' ? (
                 <img src={settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl} alt="Logo Sekolah" className="w-20 h-20 object-contain" />
               ) : null}
            </div>
          </div>
          {/* Double line for standard indonesian letterhead */}
          <div className="border-t-[3px] border-black w-full mb-[2px]"></div>
          <div className="border-t border-black w-full mb-12"></div>
          
          <h3 className="text-xl font-bold text-center uppercase mb-12 underline">LEMBAR PENGESAHAN</h3>
          
          <p className="text-justify mb-8 leading-relaxed indent-10">
            Laporan Pertanggungjawaban (LPJ) Kepala Sekolah ini telah diperiksa, dievaluasi, dan disahkan penggunaannya sebagai bentuk pertanggungjawaban pelaksanaan tugas pokok dan fungsi manajerial, pengembangan kewirausahaan, dan supervisi guru serta tenaga kependidikan pada {school?.name || "Sekolah"} Tahun Pelajaran {settings?.academicYears?.[0]?.name || "2023/2024"}.
          </p>
          
          <div className="grid grid-cols-2 gap-8 mt-24">
            <div className="text-center">
              <p className="mb-24">Mengetahui,<br/>Pengawas Sekolah</p>
              <p className="font-bold underline uppercase">{settings?.pengawas?.name || "NAMA PENGAWAS"}</p>
              <p>NIP. {settings?.pengawas?.nip || "..........................."}</p>
            </div>
            <div className="text-center">
              <p className="mb-24">Mengesahkan,<br/>Kepala {school?.name || "Sekolah"}</p>
              <p className="font-bold underline uppercase">{principal?.name || "NAMA KEPALA SEKOLAH"}</p>
              <p>NIP. {principal?.nip || "..........................."}</p>
            </div>
          </div>
        </div>

        {/* HALAMAN 3: KATA PENGANTAR */}
        <div 
          className={`page-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative font-serif text-slate-900 mx-auto transition-all print:shadow-none print:w-[210mm] print:h-[297mm] print:min-h-[297mm] print:mx-0 print:break-after-page ${isEditMode ? 'ring-4 ring-orange-400 ring-dashed cursor-text' : ''}`}
          contentEditable={isEditMode} 
          suppressContentEditableWarning
          style={{ padding: '20mm' }}
        >
          <h3 className="text-xl font-bold text-center uppercase mb-12">KATA PENGANTAR</h3>
          <p className="text-justify mb-6 leading-relaxed indent-10">
            Puji syukur kehadirat Tuhan Yang Maha Esa, karena atas limpahan rahmat dan karunia-Nya, Laporan Pertanggungjawaban (LPJ) Kepala Sekolah {school?.name || "Sekolah"} Tahun Pelajaran {settings?.academicYears?.[0]?.name || "2023/2024"} dapat diselesaikan dengan baik. Laporan ini disusun sebagai bentuk transparansi dan akuntabilitas kinerja Kepala Sekolah dalam memimpin dan mengelola penyelenggaraan pendidikan selama satu tahun terakhir.
          </p>
          <p className="text-justify mb-6 leading-relaxed indent-10">
            LPJ ini memuat berbagai capaian dari penjabaran Rencana Kerja Tahunan (RKT) dan Rencana Kegiatan dan Anggaran Sekolah (RKAS), realisasi program kerja, capaian prestasi akademik maupun non-akademik, serta kendala-kendala yang dihadapi beserta solusi yang telah diupayakan.
          </p>
          <p className="text-justify mb-10 leading-relaxed indent-10">
            Kami menyadari bahwa laporan ini masih belum sempurna, namun kami berharap LPJ ini dapat memberikan gambaran komprehensif mengenai kondisi riil di {school?.name || "Sekolah"}. Kritik dan saran yang konstruktif sangat kami harapkan untuk perbaikan di masa yang akan datang.
          </p>
          
          <div className="flex justify-end mt-16 break-inside-avoid">
            <div className="w-64 text-center">
              <p className="mb-24">{school?.district || school?.regency || "Kabupaten/Kota"}, {currentDate}</p>
              <p className="font-bold underline uppercase">{principal?.name || "NAMA KEPALA SEKOLAH"}</p>
              <p>NIP. {principal?.nip || "-"}</p>
            </div>
          </div>
        </div>

        {/* HALAMAN 4: BAB I & II (Part 1) */}
        <div 
          className={`page-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative font-serif text-slate-900 mx-auto transition-all print:shadow-none print:w-[210mm] print:h-auto print:min-h-[297mm] print:mx-0 print:break-after-page ${isEditMode ? 'ring-4 ring-orange-400 ring-dashed cursor-text' : ''}`}
          contentEditable={isEditMode} 
          suppressContentEditableWarning
          style={{ padding: '20mm' }}
        >
          <h3 className="text-xl font-bold uppercase mb-8 text-center">BAB I<br/>PENDAHULUAN</h3>
          <h4 className="font-bold text-md mb-2">A. Latar Belakang</h4>
          <p className="text-justify mb-6 leading-relaxed indent-10">
            Dalam rangka mewujudkan tata kelola sekolah yang baik (Good School Governance), setiap unsur pimpinan sekolah diwajibkan untuk menyusun Laporan Pertanggungjawaban (LPJ). LPJ ini merupakan wujud pertanggungjawaban pelaksanaan tugas, pokok, dan fungsi Kepala Sekolah dalam mengelola {school?.name || "Sekolah"} selama kurun waktu satu tahun pelajaran.
          </p>

          <h4 className="font-bold text-md mb-2">B. Dasar Hukum</h4>
          <ol className="list-decimal pl-10 text-justify mb-6 space-y-2">
            <li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;</li>
            <li>Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Perubahan Atas PP Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan;</li>
            <li>Permendikbudristek Nomor 40 Tahun 2021 tentang Penugasan Guru sebagai Kepala Sekolah;</li>
            <li>Rencana Kerja Jangka Menengah (RKJM) dan Rencana Kerja Tahunan (RKT) {school?.name || "Sekolah"}.</li>
          </ol>
          
          <h4 className="font-bold text-md mb-2">C. Tujuan</h4>
          <ol className="list-decimal pl-10 text-justify mb-10 space-y-2">
            <li>Mengukur tingkat ketercapaian program kerja yang telah direncanakan;</li>
            <li>Memberikan laporan realisasi penggunaan anggaran sekolah (BOS, BOP, Komite, dll);</li>
            <li>Menjadi bahan evaluasi dan refleksi untuk perencanaan program tahun berikutnya;</li>
            <li>Wujud akuntabilitas publik kepada seluruh pemangku kepentingan (stakeholders).</li>
          </ol>

          {/* Start of BAB II */}
          <h3 className="text-xl font-bold uppercase mb-8 text-center mt-12">BAB II<br/>PROFIL SEKOLAH</h3>
          <table className="w-full text-sm mb-8 leading-relaxed">
            <tbody>
              <tr>
                <td className="w-48 py-1 align-top font-bold">Nama Sekolah</td>
                <td className="w-4 py-1 align-top">:</td>
                <td className="py-1 align-top">{school?.name || "-"}</td>
              </tr>
              <tr>
                <td className="w-48 py-1 align-top font-bold">NPSN</td>
                <td className="w-4 py-1 align-top">:</td>
                <td className="py-1 align-top">{school?.npsn || "-"}</td>
              </tr>
              <tr>
                <td className="w-48 py-1 align-top font-bold">Alamat Sekolah</td>
                <td className="w-4 py-1 align-top">:</td>
                <td className="py-1 align-top">{school?.address || "-"}</td>
              </tr>
              <tr>
                <td className="w-48 py-1 align-top font-bold">Desa/Kelurahan</td>
                <td className="w-4 py-1 align-top">:</td>
                <td className="py-1 align-top">{school?.village || "-"}</td>
              </tr>
              <tr>
                <td className="w-48 py-1 align-top font-bold">Kecamatan</td>
                <td className="w-4 py-1 align-top">:</td>
                <td className="py-1 align-top">{school?.district || "-"}</td>
              </tr>
              <tr>
                <td className="w-48 py-1 align-top font-bold">Kabupaten/Kota</td>
                <td className="w-4 py-1 align-top">:</td>
                <td className="py-1 align-top">{school?.regency || "-"}</td>
              </tr>
              <tr>
                <td className="w-48 py-1 align-top font-bold">Provinsi</td>
                <td className="w-4 py-1 align-top">:</td>
                <td className="py-1 align-top">{school?.province || "-"}</td>
              </tr>
              <tr>
                <td className="w-48 py-1 align-top font-bold">Nama Kepala Sekolah</td>
                <td className="w-4 py-1 align-top">:</td>
                <td className="py-1 align-top uppercase">{principal?.name || "-"}</td>
              </tr>
            </tbody>
          </table>
          
          <h4 className="font-bold text-md mb-3">A. Visi Sekolah</h4>
          <p className="text-justify mb-6 italic p-4 bg-slate-50 border border-slate-200">
            "{settings?.identitas?.visi || "Mewujudkan lulusan yang beriman, bertaqwa, berakhlak mulia, cerdas, terampil, dan berwawasan lingkungan."}"
          </p>
        </div>

        {/* HALAMAN 5: BAB II (Part 2) */}
        <div 
          className={`page-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative font-serif text-slate-900 mx-auto transition-all print:shadow-none print:w-[210mm] print:h-auto print:min-h-[297mm] print:mx-0 print:break-after-page ${isEditMode ? 'ring-4 ring-orange-400 ring-dashed cursor-text' : ''}`}
          contentEditable={isEditMode} 
          suppressContentEditableWarning
          style={{ padding: '20mm' }}
        >
          <h4 className="font-bold text-md mb-4">B. Keadaan Pendidik dan Tenaga Kependidikan (PTK)</h4>
          <table className="w-full border-collapse border border-black mb-8 text-sm break-inside-avoid">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-slate-100">Keterangan</th>
                <th className="border border-black p-2 bg-slate-100">PNS/PPPK</th>
                <th className="border border-black p-2 bg-slate-100">Non-ASN</th>
                <th className="border border-black p-2 bg-slate-100">Sertifikasi</th>
                <th className="border border-black p-2 bg-slate-100">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold">Guru Kelas / Mata Pelajaran</td>
                <td className="border border-black p-2 text-center">{(guruList.filter((t: any) => t.status === 'PNS' || t.status === 'PPPK').length) || 12}</td>
                <td className="border border-black p-2 text-center">{(guruList.filter((t: any) => t.status === 'Non-ASN' || t.status === 'Honorer').length) || 4}</td>
                <td className="border border-black p-2 text-center">{(guruList.filter((t: any) => t.isCertified).length) || 8}</td>
                <td className="border border-black p-2 text-center font-bold">{(guruList.length) || 16}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Tenaga Kependidikan (TU, dll)</td>
                <td className="border border-black p-2 text-center">{(tendikList.filter((t: any) => t.status === 'PNS' || t.status === 'PPPK').length) || 1}</td>
                <td className="border border-black p-2 text-center">{(tendikList.filter((t: any) => t.status === 'Non-ASN' || t.status === 'Honorer').length) || 2}</td>
                <td className="border border-black p-2 text-center">{(tendikList.filter((t: any) => t.isCertified).length) || 0}</td>
                <td className="border border-black p-2 text-center font-bold">{(tendikList.length) || 3}</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="border border-black p-2 text-center">TOTAL</td>
                <td className="border border-black p-2 text-center">{((guruList.filter((t: any) => t.status === 'PNS' || t.status === 'PPPK').length) || 12) + ((tendikList.filter((t: any) => t.status === 'PNS' || t.status === 'PPPK').length) || 1)}</td>
                <td className="border border-black p-2 text-center">{((guruList.filter((t: any) => t.status === 'Non-ASN' || t.status === 'Honorer').length) || 4) + ((tendikList.filter((t: any) => t.status === 'Non-ASN' || t.status === 'Honorer').length) || 2)}</td>
                <td className="border border-black p-2 text-center">{((guruList.filter((t: any) => t.isCertified).length) || 8) + ((tendikList.filter((t: any) => t.isCertified).length) || 0)}</td>
                <td className="border border-black p-2 text-center">{((guruList.length) || 16) + ((tendikList.length) || 3)}</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-md mb-4 mt-8">C. Kondisi Peserta Didik</h4>
          <table className="w-full border-collapse border border-black mb-2 text-sm break-inside-avoid">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-slate-100">Kelas / Rombel</th>
                <th className="border border-black p-2 bg-slate-100">Laki-Laki</th>
                <th className="border border-black p-2 bg-slate-100">Perempuan</th>
                <th className="border border-black p-2 bg-slate-100">Jumlah</th>
                <th className="border border-black p-2 bg-slate-100">Mutasi In/Out</th>
              </tr>
            </thead>
            <tbody>
              {rombelList.length > 0 ? rombelList.map((r: any, idx: number) => (
                <tr key={idx}>
                  <td className="border border-black p-2 text-center">{r.name || r.nama || `Kelas ${idx + 1}`}</td>
                  <td className="border border-black p-2 text-center">{r.lakiLaki || 0}</td>
                  <td className="border border-black p-2 text-center">{r.perempuan || 0}</td>
                  <td className="border border-black p-2 text-center font-bold">{((r.lakiLaki || 0) + (r.perempuan || 0)) > 0 ? ((r.lakiLaki || 0) + (r.perempuan || 0)) : (r.total || r.siswa || 0)}</td>
                  <td className="border border-black p-2 text-center">0 / 0</td>
                </tr>
              )) : (
                <>
                  <tr><td className="border border-black p-2 text-center">Kelas I (Satu)</td><td className="border border-black p-2 text-center">15</td><td className="border border-black p-2 text-center">17</td><td className="border border-black p-2 text-center font-bold">32</td><td className="border border-black p-2 text-center">0 / 0</td></tr>
                  <tr><td className="border border-black p-2 text-center">Kelas II (Dua)</td><td className="border border-black p-2 text-center">14</td><td className="border border-black p-2 text-center">18</td><td className="border border-black p-2 text-center font-bold">32</td><td className="border border-black p-2 text-center">1 / 0</td></tr>
                  <tr><td className="border border-black p-2 text-center">Kelas III (Tiga)</td><td className="border border-black p-2 text-center">16</td><td className="border border-black p-2 text-center">15</td><td className="border border-black p-2 text-center font-bold">31</td><td className="border border-black p-2 text-center">0 / 1</td></tr>
                  <tr><td className="border border-black p-2 text-center">Kelas IV (Empat)</td><td className="border border-black p-2 text-center">12</td><td className="border border-black p-2 text-center">16</td><td className="border border-black p-2 text-center font-bold">28</td><td className="border border-black p-2 text-center">0 / 0</td></tr>
                  <tr><td className="border border-black p-2 text-center">Kelas V (Lima)</td><td className="border border-black p-2 text-center">18</td><td className="border border-black p-2 text-center">12</td><td className="border border-black p-2 text-center font-bold">30</td><td className="border border-black p-2 text-center">0 / 0</td></tr>
                  <tr><td className="border border-black p-2 text-center">Kelas VI (Enam)</td><td className="border border-black p-2 text-center">15</td><td className="border border-black p-2 text-center">15</td><td className="border border-black p-2 text-center font-bold">30</td><td className="border border-black p-2 text-center">0 / 0</td></tr>
                </>
              )}
              <tr className="bg-slate-50 font-bold">
                <td className="border border-black p-2 text-center">TOTAL KESELURUHAN</td>
                <td className="border border-black p-2 text-center">{settings?.pesertaDidik?.lakiLaki || 90}</td>
                <td className="border border-black p-2 text-center">{settings?.pesertaDidik?.perempuan || 93}</td>
                <td className="border border-black p-2 text-center text-indigo-700">{settings?.pesertaDidik?.total || 183}</td>
                <td className="border border-black p-2 text-center">-</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm mb-6 italic text-slate-700">Keterangan: Persentase kelulusan pada tahun ajaran sebelumnya mencapai 100%.</p>

          <h4 className="font-bold text-md mb-4 mt-8">D. Kondisi Sarana dan Prasarana</h4>
          <table className="w-full border-collapse border border-black mb-8 text-sm break-inside-avoid">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-slate-100">No</th>
                <th className="border border-black p-2 bg-slate-100">Jenis Ruangan/Fasilitas</th>
                <th className="border border-black p-2 bg-slate-100">Jumlah</th>
                <th className="border border-black p-2 bg-slate-100">Kondisi Baik</th>
                <th className="border border-black p-2 bg-slate-100">Kondisi Rusak</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center">1</td>
                <td className="border border-black p-2">Ruang Kelas</td>
                <td className="border border-black p-2 text-center">{settings?.sarpras?.ruangKelas || 6}</td>
                <td className="border border-black p-2 text-center">{(settings?.sarpras?.ruangKelas || 6) > 2 ? (settings?.sarpras?.ruangKelas || 6) - 2 : (settings?.sarpras?.ruangKelas || 6)}</td>
                <td className="border border-black p-2 text-center">{(settings?.sarpras?.ruangKelas || 6) > 2 ? '2 (Ringan)' : '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">2</td>
                <td className="border border-black p-2">Perpustakaan</td>
                <td className="border border-black p-2 text-center">{settings?.sarpras?.perpustakaan || 1}</td>
                <td className="border border-black p-2 text-center">{settings?.sarpras?.perpustakaan || 1}</td>
                <td className="border border-black p-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">3</td>
                <td className="border border-black p-2">Laboratorium</td>
                <td className="border border-black p-2 text-center">{settings?.sarpras?.laboratorium || 1}</td>
                <td className="border border-black p-2 text-center">-</td>
                <td className="border border-black p-2 text-center">{settings?.sarpras?.laboratorium ? '1 (Butuh Rehab Atap)' : '-'}</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">4</td>
                <td className="border border-black p-2">Ruang Guru & Kepala Sekolah</td>
                <td className="border border-black p-2 text-center">{settings?.sarpras?.ruangGuru || 2}</td>
                <td className="border border-black p-2 text-center">{settings?.sarpras?.ruangGuru || 2}</td>
                <td className="border border-black p-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">5</td>
                <td className="border border-black p-2">Sanitasi (Toilet)</td>
                <td className="border border-black p-2 text-center">{settings?.sarpras?.toilet || 4}</td>
                <td className="border border-black p-2 text-center">{(settings?.sarpras?.toilet || 4) > 1 ? (settings?.sarpras?.toilet || 4) - 1 : (settings?.sarpras?.toilet || 4)}</td>
                <td className="border border-black p-2 text-center">{(settings?.sarpras?.toilet || 4) > 1 ? '1 (Rusak Sedang)' : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* HALAMAN 6: BAB III */}
        <div 
          className={`page-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative font-serif text-slate-900 mx-auto transition-all print:shadow-none print:w-[210mm] print:h-auto print:min-h-[297mm] print:mx-0 print:break-after-page ${isEditMode ? 'ring-4 ring-orange-400 ring-dashed cursor-text' : ''}`}
          contentEditable={isEditMode} 
          suppressContentEditableWarning
          style={{ padding: '20mm' }}
        >
          <h3 className="text-xl font-bold uppercase mb-8 text-center">BAB III<br/>REALISASI PROGRAM & ANGGARAN</h3>
          <p className="text-justify mb-6 leading-relaxed indent-10">
            Berikut adalah rekapitulasi realisasi program kerja berdasarkan RKT dan realisasi anggaran yang bersumber dari Bantuan Operasional Sekolah (BOS) serta sumber dana lainnya.
          </p>

          <h4 className="font-bold text-md mb-4">A. Realisasi Program Kerja (Standar Nasional)</h4>
          <table className="w-full border-collapse border border-black mb-8 text-sm break-inside-avoid">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-slate-100">No</th>
                <th className="border border-black p-2 bg-slate-100">Standar Pendidikan</th>
                <th className="border border-black p-2 bg-slate-100">Target RKT</th>
                <th className="border border-black p-2 bg-slate-100">Realisasi / Ketercapaian</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center">1</td>
                <td className="border border-black p-2 font-bold">Standar Kompetensi Lulusan</td>
                <td className="border border-black p-2">Lulus 100%, Nilai rata-rata naik</td>
                <td className="border border-black p-2">Tercapai (100% Lulus)</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">2</td>
                <td className="border border-black p-2 font-bold">Standar Isi</td>
                <td className="border border-black p-2">Penyusunan KSP selesai</td>
                <td className="border border-black p-2">Tercapai 100%</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">3</td>
                <td className="border border-black p-2 font-bold">Standar Proses</td>
                <td className="border border-black p-2">Pembelajaran berbasis Proyek</td>
                <td className="border border-black p-2">Terlaksana pada 85% rombel</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">4</td>
                <td className="border border-black p-2 font-bold">Standar Penilaian</td>
                <td className="border border-black p-2">Penilaian Berbasis Komputer/CBT</td>
                <td className="border border-black p-2">Terlaksana penuh (100%)</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-md mb-4 mt-8">B. Prestasi Sekolah (Akademik & Non-Akademik)</h4>
          <table className="w-full border-collapse border border-black mb-8 text-sm break-inside-avoid">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-slate-100">No</th>
                <th className="border border-black p-2 bg-slate-100">Nama Prestasi / Kejuaraan</th>
                <th className="border border-black p-2 bg-slate-100">Tingkat</th>
                <th className="border border-black p-2 bg-slate-100">Capaian</th>
                <th className="border border-black p-2 bg-slate-100">Peserta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center">1</td>
                <td className="border border-black p-2">Olimpiade Sains Nasional (Matematika)</td>
                <td className="border border-black p-2 text-center">Kab/Kota</td>
                <td className="border border-black p-2 text-center">Juara 2</td>
                <td className="border border-black p-2 text-center">Siswa</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">2</td>
                <td className="border border-black p-2">FLS2N (Tari Tradisional)</td>
                <td className="border border-black p-2 text-center">Kecamatan</td>
                <td className="border border-black p-2 text-center">Juara 1</td>
                <td className="border border-black p-2 text-center">Siswa</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">3</td>
                <td className="border border-black p-2">Guru Berprestasi / Inovatif</td>
                <td className="border border-black p-2 text-center">Kab/Kota</td>
                <td className="border border-black p-2 text-center">Finalis</td>
                <td className="border border-black p-2 text-center">Guru</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-md mb-4 mt-8">C. Ringkasan Realisasi Anggaran (BOS)</h4>
          <table className="w-full border-collapse border border-black mb-8 text-sm break-inside-avoid">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-slate-100">No</th>
                <th className="border border-black p-2 bg-slate-100">Komponen Pembiayaan</th>
                <th className="border border-black p-2 bg-slate-100">Pagu (Rp)</th>
                <th className="border border-black p-2 bg-slate-100">Realisasi (Rp)</th>
                <th className="border border-black p-2 bg-slate-100">%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center">1</td>
                <td className="border border-black p-2">Pengembangan Perpustakaan</td>
                <td className="border border-black p-2 text-right">0</td>
                <td className="border border-black p-2 text-right">0</td>
                <td className="border border-black p-2 text-center">0%</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">2</td>
                <td className="border border-black p-2">Kegiatan Pembelajaran dan Ekstrakurikuler</td>
                <td className="border border-black p-2 text-right">0</td>
                <td className="border border-black p-2 text-right">0</td>
                <td className="border border-black p-2 text-center">0%</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center">3</td>
                <td className="border border-black p-2">Pemeliharaan Sarana Prasarana</td>
                <td className="border border-black p-2 text-right">0</td>
                <td className="border border-black p-2 text-right">0</td>
                <td className="border border-black p-2 text-center">0%</td>
              </tr>
              <tr className="font-bold bg-slate-50">
                <td colSpan={2} className="border border-black p-2 text-center">TOTAL</td>
                <td className="border border-black p-2 text-right">0</td>
                <td className="border border-black p-2 text-right">0</td>
                <td className="border border-black p-2 text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* HALAMAN 7: BAB IV & PENUTUP */}
        <div 
          className={`page-container bg-white w-[210mm] min-h-[297mm] shadow-2xl relative font-serif text-slate-900 mx-auto transition-all print:shadow-none print:w-[210mm] print:h-[297mm] print:min-h-[297mm] print:mx-0 ${isEditMode ? 'ring-4 ring-orange-400 ring-dashed cursor-text' : ''}`}
          contentEditable={isEditMode} 
          suppressContentEditableWarning
          style={{ padding: '20mm' }}
        >
          <h4 className="font-bold text-md mb-4">D. Permasalahan & Solusi (Tindak Lanjut)</h4>
          <table className="w-full border-collapse border border-black mb-12 text-sm break-inside-avoid">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-slate-100">No</th>
                <th className="border border-black p-2 bg-slate-100 w-1/2">Permasalahan / Kendala</th>
                <th className="border border-black p-2 bg-slate-100 w-1/2">Solusi / Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center align-top">1</td>
                <td className="border border-black p-2 align-top text-justify">Rendahnya motivasi belajar sebagian siswa pasca pembelajaran jarak jauh, berdampak pada tingkat literasi awal yang masih kurang di kelas bawah.</td>
                <td className="border border-black p-2 align-top text-justify">Sekolah menerapkan program pendampingan khusus literasi setiap 15 menit sebelum pembelajaran, serta menyediakan pojok baca di setiap kelas.</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center align-top">2</td>
                <td className="border border-black p-2 align-top text-justify">Dua (2) ruang kelas dan laboratorium komputer membutuhkan rehabilitasi pada bagian atap yang sering bocor saat musim hujan.</td>
                <td className="border border-black p-2 align-top text-justify">Telah diajukan usulan perbaikan (rehab ringan/sedang) melalui aplikasi Dapodik dan proposal langsung ke Dinas Pendidikan Kabupaten/Kota.</td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center align-top">3</td>
                <td className="border border-black p-2 align-top text-justify">Terbatasnya anggaran kegiatan ekstrakurikuler yang menyebabkan beberapa program tidak berjalan optimal.</td>
                <td className="border border-black p-2 align-top text-justify">Melakukan kolaborasi dengan komite sekolah dan paguyuban orang tua untuk subsidi silang serta mencari sumber dana CSR dari perusahaan sekitar (masih dalam penjajakan).</td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-xl font-bold uppercase mb-8 text-center mt-12">BAB IV<br/>PENUTUP</h3>
          <p className="text-justify mb-4 leading-relaxed indent-10">
            Demikian Laporan Pertanggungjawaban (LPJ) ini disusun sebagai rekam jejak pelaksanaan tugas dan pengabdian kami selama memimpin {school?.name || "Sekolah"}. Berbagai pencapaian yang diraih merupakan hasil kerja keras dan sinergi dari seluruh elemen: pendidik, tenaga kependidikan, komite sekolah, peserta didik, dan dinas terkait.
          </p>
          <p className="text-justify mb-4 leading-relaxed indent-10">
            Kami menyadari sepenuhnya bahwa masih terdapat kekurangan dan program yang belum terlaksana dengan optimal. Oleh karena itu, evaluasi berkelanjutan sangat diperlukan untuk peningkatan mutu pendidikan ke arah yang lebih baik.
          </p>
          <p className="text-justify mb-10 leading-relaxed indent-10">
            Akhir kata, kami mengucapkan terima kasih yang sebesar-besarnya kepada semua pihak yang telah mendukung program pendidikan di {school?.name || "Sekolah"}. Semoga dedikasi kita bernilai ibadah dan membawa manfaat bagi kemajuan pendidikan bangsa.
          </p>
          
          <div className="flex justify-end mt-20 text-sm break-inside-avoid">
            <div className="w-72 text-center">
              <p className="mb-2">
                {school?.district || school?.regency || "..................."},{" "}
                {currentDate}
              </p>
              <p className="font-bold mb-24">Kepala {school?.name || "Sekolah"},</p>
              <p className="font-bold underline uppercase">{principal?.name || "NAMA KEPALA SEKOLAH"}</p>
              <p>NIP. {principal?.nip || "..........................."}</p>
            </div>
          </div>
        </div>
        </div>

        <style>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: white !important;
            }
            .page-container {
              box-shadow: none !important;
              margin: 0 !important;
              page-break-after: always;
              break-after: page;
            }
            @page {
              size: A4 portrait;
              margin: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
