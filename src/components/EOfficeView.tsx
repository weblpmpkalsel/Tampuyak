import React, { useState, useEffect } from 'react';
import { Mail, Printer, FileText, FileSignature, Save, Clock, Edit3, Check } from 'lucide-react';
import { EOFFICE_MENU, SK_TEMPLATES } from '../utils/eofficeTemplates';

export const EOfficeView = ({ settings }: { settings?: any }) => {
  const [jenisSurat, setJenisSurat] = useState('tugas');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State for Surat Tugas
  const [formData, setFormData] = useState({
    nomorSurat: `090/     /${new Date().getFullYear()}`,
    namaPegawai: '',
    nipPegawai: '',
    pangkatGolongan: '',
    jabatanPegawai: '',
    tujuan: '',
    tempat: '',
    tanggalPelaksanaan: '',
    tanggalSurat: new Date().toISOString().split('T')[0],
  });

  // State for Surat Undangan
  const [undanganData, setUndanganData] = useState({
    nomorSurat: `005/     /${new Date().getFullYear()}`,
    sifat: 'Penting',
    lampiran: '-',
    hal: 'Undangan Rapat Wali Murid',
    tujuanSurat: 'Bapak/Ibu Orang Tua / Wali Murid',
    tempatTujuan: 'Tempat',
    hariTanggal: '',
    waktu: '08:00 WIB - Selesai',
    tempat: 'Aula Sekolah',
    acara: 'Sosialisasi Program Sekolah dan Rapat Komite',
    tanggalSurat: new Date().toISOString().split('T')[0],
  });

  // State for Surat Keterangan
  const [keteranganData, setKeteranganData] = useState({
    nomorSurat: `421.2/     /${new Date().getFullYear()}`,
    namaSiswa: '',
    nisn: '',
    tempatLahir: '',
    tanggalLahir: '',
    kelas: '',
    namaOrangTua: '',
    pekerjaanOrangTua: '',
    alamat: '',
    keperluan: 'Syarat administrasi pendaftaran beasiswa',
    tanggalSurat: new Date().toISOString().split('T')[0],
  });

  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);

  useEffect(() => {
    try {
      const drafts = JSON.parse(localStorage.getItem('eoffice_drafts') || '[]');
      setSavedDrafts(drafts);
    } catch (e) {
      console.error("Could not load drafts");
    }
  }, []);

  const handleSaveDraft = () => {
    const draft = {
      id: Date.now(),
      jenisSurat,
      title: jenisSurat === 'tugas' ? `ST - ${formData.namaPegawai || 'Tanpa Nama'}` : 
             jenisSurat === 'undangan' ? `Undangan - ${undanganData.hal}` :
             `Ket - ${keteranganData.namaSiswa || 'Tanpa Nama'}`,
      formData,
      undanganData,
      keteranganData,
      date: new Date().toISOString()
    };
    const newDrafts = [draft, ...savedDrafts].slice(0, 20); // Keep last 20
    setSavedDrafts(newDrafts);
    localStorage.setItem('eoffice_drafts', JSON.stringify(newDrafts));
    alert("Surat berhasil disimpan ke Arsip Draft.");
  };

  const loadDraft = (draft: any) => {
    setJenisSurat(draft.jenisSurat);
    setFormData(draft.formData);
    setUndanganData(draft.undanganData);
    setKeteranganData(draft.keteranganData);
    setShowDrafts(false);
  };

  const deleteDraft = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const newDrafts = savedDrafts.filter(d => d.id !== id);
    setSavedDrafts(newDrafts);
    localStorage.setItem('eoffice_drafts', JSON.stringify(newDrafts));
  };

  const handlePrint = () => {
    try {
      let printRoot = document.getElementById('print-root');
      if (!printRoot) {
        printRoot = document.createElement('div');
        printRoot.id = 'print-root';
        document.body.appendChild(printRoot);
      }
      
      const content = document.getElementById('eoffice-paper');
      if (content) {
        printRoot.innerHTML = '';
        printRoot.appendChild(content.cloneNode(true));
        window.print();
        setTimeout(() => {
          printRoot.innerHTML = '';
        }, 500);
      } else {
        window.print();
      }
    } catch (error) {
      console.error("Print blocked by iframe restrictions:", error);
      alert("Fitur cetak terblokir oleh browser preview. Silakan buka aplikasi di tab baru (Open in new tab) untuk mencetak dokumen ini.");
    }
  };

  const handleChangeTugas = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeUndangan = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUndanganData({ ...undanganData, [e.target.name]: e.target.value });
  };

  const handleChangeKeterangan = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setKeteranganData({ ...keteranganData, [e.target.name]: e.target.value });
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const autoTahunPelajaran = currentMonth >= 6 ? `${currentYear}/${currentYear + 1}` : `${currentYear - 1}/${currentYear}`;

  const [skData, setSkData] = useState({
    nomorSurat: `421.2/     /${currentYear}`,
    tahunPelajaran: autoTahunPelajaran,
    tanggalSurat: new Date().toISOString().split('T')[0],
  });

  const handleChangeSk = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSkData({ ...skData, [e.target.name]: e.target.value });
  };

  const school = settings?.school || {};
  const principal = settings?.principal || {};

  const formatDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return dateString || "-";
      return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch(e) {
      return dateString || "-";
    }
  };

  return (
    <div className="flex h-full bg-slate-50 relative">
      {/* Sidebar Form (Tidak ikut terprint) */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto print:hidden shadow-sm z-10">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
                <FileSignature className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">E-Office</h2>
                <p className="text-xs text-slate-500 font-medium">Sistem Persuratan Elektronik</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDrafts(!showDrafts)}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative"
              title="Arsip Draft"
            >
              <Clock className="w-5 h-5" />
              {savedDrafts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {showDrafts ? (
          <div className="p-4 space-y-3 flex-1 bg-slate-50/50">
            <h3 className="font-bold text-sm text-slate-700 mb-4 px-2">Arsip Surat Terakhir</h3>
            {savedDrafts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Belum ada surat yang disimpan.</p>
            ) : (
              savedDrafts.map(draft => (
                <div 
                  key={draft.id} 
                  onClick={() => loadDraft(draft)}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group relative"
                >
                  <p className="text-xs font-bold text-indigo-700 mb-1">{draft.title}</p>
                  <p className="text-[10px] text-slate-500">{new Date(draft.date).toLocaleString('id-ID')}</p>
                  <button 
                    onClick={(e) => deleteDraft(e, draft.id)}
                    className="absolute right-2 top-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-6 space-y-6 flex-1">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Klasifikasi Dokumen</label>
              <div className="grid grid-cols-1 gap-1.5 max-h-[30vh] overflow-y-auto pr-2 pb-2">
                 {EOFFICE_MENU.map(menu => (
                   <button
                     key={menu.id}
                     onClick={() => setJenisSurat(menu.id)}
                     className={`text-left p-2.5 rounded-lg text-[11px] font-bold border transition-all ${jenisSurat === menu.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'}`}
                   >
                     {menu.label}
                   </button>
                 ))}
              </div>
            </div>

            {jenisSurat === 'tugas' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-xs text-blue-800 mb-4 font-medium leading-relaxed">
                  Formulir Surat Tugas. Kop surat dan penandatangan otomatis disesuaikan dengan konfigurasi <b>Identitas Sekolah</b> dan <b>Pejabat Penandatangan</b>.
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Surat</label>
                  <input maxLength={255} type="text" name="nomorSurat" value={formData.nomorSurat} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pegawai / Guru</label>
                  <input maxLength={255} type="text" name="namaPegawai" placeholder="Cth: Budi Santoso, S.Pd." value={formData.namaPegawai} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">NIP</label>
                    <input maxLength={255} type="text" name="nipPegawai" placeholder="Cth: 19800101..." value={formData.nipPegawai} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pangkat/Gol.</label>
                    <input maxLength={255} type="text" name="pangkatGolongan" placeholder="Cth: Penata / III.c" value={formData.pangkatGolongan} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan Pegawai</label>
                  <input maxLength={255} type="text" name="jabatanPegawai" placeholder="Cth: Guru Kelas" value={formData.jabatanPegawai} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Maksud / Tujuan Penugasan</label>
                  <textarea maxLength={2000} name="tujuan" placeholder="Cth: Mengikuti Bimbingan Teknis Kurikulum Merdeka..." value={formData.tujuan} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors resize-none" rows={3} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Kegiatan</label>
                  <input maxLength={255} type="text" name="tempat" placeholder="Cth: Hotel Aston, Kota..." value={formData.tempat} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Kegiatan</label>
                  <input maxLength={255} type="text" name="tanggalPelaksanaan" placeholder="Cth: 15 - 17 Agustus 2026" value={formData.tanggalPelaksanaan} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Penetapan Surat</label>
                  <input type="date" name="tanggalSurat" value={formData.tanggalSurat} onChange={handleChangeTugas} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
              </div>
            )}

            {jenisSurat === 'undangan' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg text-xs text-indigo-800 mb-4 font-medium leading-relaxed">
                  Formulir Surat Undangan Resmi. Digunakan untuk mengundang pihak internal maupun eksternal sekolah.
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Surat</label>
                    <input maxLength={255} type="text" name="nomorSurat" value={undanganData.nomorSurat} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sifat</label>
                    <input maxLength={255} type="text" name="sifat" value={undanganData.sifat} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lampiran</label>
                    <input maxLength={255} type="text" name="lampiran" value={undanganData.lampiran} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hal / Perihal</label>
                  <input maxLength={255} type="text" name="hal" value={undanganData.hal} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kepada Yth. (Tujuan)</label>
                  <input maxLength={255} type="text" name="tujuanSurat" value={undanganData.tujuanSurat} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Di (Tempat Tujuan)</label>
                  <input maxLength={255} type="text" name="tempatTujuan" value={undanganData.tempatTujuan} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-3 text-indigo-700">WAKTU & TEMPAT PELAKSANAAN</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hari, Tanggal</label>
                      <input maxLength={255} type="text" name="hariTanggal" placeholder="Cth: Senin, 15 Juli 2026" value={undanganData.hariTanggal} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Waktu</label>
                      <input maxLength={255} type="text" name="waktu" value={undanganData.waktu} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tempat</label>
                      <input maxLength={255} type="text" name="tempat" value={undanganData.tempat} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Acara</label>
                      <textarea maxLength={2000} name="acara" value={undanganData.acara} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors resize-none" rows={2} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Penetapan Surat</label>
                  <input type="date" name="tanggalSurat" value={undanganData.tanggalSurat} onChange={handleChangeUndangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
              </div>
            )}

            {jenisSurat === 'keterangan' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg text-xs text-emerald-800 mb-4 font-medium leading-relaxed">
                  Formulir Surat Keterangan Aktif Siswa. Digunakan untuk keperluan administrasi siswa yang masih aktif belajar.
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Surat</label>
                  <input maxLength={255} type="text" name="nomorSurat" value={keteranganData.nomorSurat} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Siswa</label>
                  <input maxLength={255} type="text" name="namaSiswa" value={keteranganData.namaSiswa} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIS / NISN</label>
                  <input maxLength={255} type="text" name="nisn" value={keteranganData.nisn} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
                    <input maxLength={255} type="text" name="tempatLahir" value={keteranganData.tempatLahir} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tgl Lahir</label>
                    <input maxLength={255} type="text" name="tanggalLahir" placeholder="Cth: 15 Mei 2010" value={keteranganData.tanggalLahir} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelas Saat Ini</label>
                  <input maxLength={255} type="text" name="kelas" value={keteranganData.kelas} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-3 text-emerald-700">DATA ORANG TUA / WALI</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Orang Tua/Wali</label>
                      <input maxLength={255} type="text" name="namaOrangTua" value={keteranganData.namaOrangTua} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pekerjaan</label>
                      <input maxLength={255} type="text" name="pekerjaanOrangTua" value={keteranganData.pekerjaanOrangTua} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                      <textarea maxLength={2000} name="alamat" value={keteranganData.alamat} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors resize-none" rows={3} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan / Keperluan Surat</label>
                    <input maxLength={255} type="text" name="keperluan" value={keteranganData.keperluan} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Penetapan Surat</label>
                    <input type="date" name="tanggalSurat" value={keteranganData.tanggalSurat} onChange={handleChangeKeterangan} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {jenisSurat.startsWith('sk_') && (
              <div className="space-y-4 animate-in fade-in duration-300 border-t border-slate-200 pt-4 mt-4">
                <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-lg text-xs text-orange-800 mb-4 font-medium leading-relaxed">
                  Pengaturan <b>Surat Keputusan (SK)</b>. Konsideran (Menimbang, Mengingat) dan Diktum disesuaikan secara otomatis sesuai jenis SK.
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Surat</label>
                  <input maxLength={255} type="text" name="nomorSurat" value={skData.nomorSurat} onChange={handleChangeSk} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Pelajaran</label>
                  <input maxLength={255} type="text" name="tahunPelajaran" value={skData.tahunPelajaran} onChange={handleChangeSk} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Penetapan SK</label>
                  <input type="date" name="tanggalSurat" value={skData.tanggalSurat} onChange={handleChangeSk} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 space-y-2">
          {!showDrafts && (
            <button 
              onClick={handleSaveDraft}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-indigo-100 text-indigo-700 font-bold py-2.5 px-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Simpan Draft
            </button>
          )}
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
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200 flex justify-center print:bg-white print:p-0 print:overflow-visible relative">
        <div className={`print-info hidden md:flex absolute top-4 right-8 px-4 py-2 rounded-lg text-xs font-medium shadow-sm print:hidden items-center gap-2 ${isEditMode ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
           <FileText className="w-4 h-4" />
           {isEditMode ? 'Mode Edit aktif. Anda bebas mengubah teks, tabel, atau tata letak pada dokumen di bawah ini sebelum dicetak/disimpan.' : 'Tips: Klik tombol "Mode Edit Manual" untuk mengedit teks secara bebas sebelum dicetak.'}
        </div>
        
        {/* Kertas A4 */}
        <div 
          id="eoffice-paper" 
          className={`bg-white w-[210mm] min-h-[297mm] shadow-2xl rounded-sm p-[20mm] print:shadow-none print:w-full print:h-auto print:rounded-none print:p-0 relative font-serif text-slate-900 mx-auto transition-all ${isEditMode ? 'ring-4 ring-orange-400 ring-dashed cursor-text' : ''}`}
          contentEditable={isEditMode} 
          suppressContentEditableWarning
        >
          
          <div id="eoffice-print-content" className="print-container w-full bg-white">
          
          {/* Style Print khusus untuk menyesuaikan margin & menyembunyikan elemen UI */}
          <style>{`
            @media print {
              body {
                background: white;
              }
              @page {
                size: A4 portrait;
                margin: 1.5cm 1.5cm 1.5cm 2cm !important;
              }
              /* Hindari terpotong */
              table, tr, td, p, h1, h2, h3, h4, h5, h6 {
                page-break-inside: avoid;
              }
            }
          `}</style>
            
            {/* KOP SURAT PROFESIONAL */}
            <div className="flex items-center border-b-[3px] border-black pb-2 mb-[2px]">
              <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] flex-shrink-0 flex items-center justify-center mr-2 md:mr-4">
                {typeof (settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo) === 'string' ? (
                  <img src={settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center border-2 border-slate-800 border-dashed">
                    <span className="text-[10px] text-slate-800 font-bold text-center leading-tight">Logo<br/>Pemda</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center px-1">
                <h3 className="text-[14pt] md:text-[16pt] font-bold uppercase leading-tight font-serif text-black m-0 p-0">
                  PEMERINTAH {
                    ['SMA', 'SMK', 'SLB'].includes(school?.level) 
                      ? (school?.province ? (String(school.province).toUpperCase().includes('PROVINSI') ? String(school.province).toUpperCase() : `PROVINSI ${String(school.province).toUpperCase()}`) : "PROVINSI") 
                      : (school?.regency ? (
                          String(school.regency).toUpperCase().includes('KAB') || String(school.regency).toUpperCase().includes('KOTA') 
                            ? String(school.regency).toUpperCase() 
                            : `KABUPATEN ${String(school.regency).toUpperCase()}`
                        ) : "KABUPATEN/KOTA")
                  }
                </h3>
                <h3 className="text-[14pt] md:text-[16pt] font-bold uppercase leading-tight font-serif text-black m-0 p-0">{school?.instansi ? String(school.instansi).toUpperCase() : "DINAS PENDIDIKAN"}</h3>
                <h2 className="text-[16pt] md:text-[20pt] font-black uppercase mt-1 mb-1 leading-tight font-serif text-black">{school?.name || "NAMA SEKOLAH"}</h2>
                <p className="text-[10pt] md:text-[11pt] leading-tight mb-0 font-serif text-black">{school?.address || "Jalan Alamat Sekolah"}{school?.village ? `, ${school?.village}` : ''}{school?.district ? `, ${school?.district}` : ''}{school?.regency ? `, ${school?.regency}` : ''}</p>
                <p className="text-[10pt] md:text-[11pt] leading-tight font-serif text-black">NPSN: {school?.npsn || "-"} | Surel: {school?.email || "-"} | Website: {school?.website || "-"}</p>
              </div>
              <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] flex-shrink-0 flex items-center justify-center ml-2 md:ml-4">
                 {typeof (settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl) === 'string' ? (
                  <img src={settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
                 ) : (
                    <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px]"></div>
                 )}
              </div>
            </div>
            {/* Garis ganda kop surat */}
            <div className="border-b-[1px] border-black mb-8 w-full"></div>

            {/* KONTEN SURAT */}
            {jenisSurat === 'tugas' && (
              <div className="px-6 md:px-10">
                <div className="text-center mb-8">
                  <h3 className="font-bold underline text-xl uppercase tracking-widest leading-tight">Surat Tugas</h3>
                  <p className="mt-1 text-[11pt]">Nomor: {formData.nomorSurat}</p>
                </div>

                <div className="mb-6 leading-relaxed text-justify text-[12pt]">
                  Yang bertanda tangan di bawah ini, Kepala {school.name || "Sekolah"}, dengan ini menugaskan kepada:
                </div>

                <table className="w-full mb-6 text-[12pt] ml-4 md:ml-8">
                  <tbody>
                    <tr>
                      <td className="w-48 py-1.5 align-top">Nama</td>
                      <td className="w-4 py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top font-bold">{formData.namaPegawai || "..................................................."}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 align-top">NIP</td>
                      <td className="py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top">{formData.nipPegawai || "-"}</td>
                    </tr>
                    {formData.pangkatGolongan && (
                      <tr>
                        <td className="py-1.5 align-top">Pangkat / Gol. Ruang</td>
                        <td className="py-1.5 align-top">:</td>
                        <td className="py-1.5 align-top">{formData.pangkatGolongan}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-1.5 align-top">Jabatan</td>
                      <td className="py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top">{formData.jabatanPegawai || "..................................................."}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mb-4 leading-relaxed text-[12pt]">
                  Untuk melaksanakan tugas kedinasan sebagai berikut:
                </div>

                <div className="ml-4 md:ml-8 mb-8 text-[12pt]">
                  <p className="font-bold text-justify mb-4 min-h-[3rem]">{formData.tujuan || "...................................................................................................................................."}</p>
                  
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-40 py-1.5 align-top">Tempat</td>
                        <td className="w-4 py-1.5 align-top">:</td>
                        <td className="py-1.5 align-top">{formData.tempat || "..................................................."}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 align-top">Waktu Pelaksanaan</td>
                        <td className="py-1.5 align-top">:</td>
                        <td className="py-1.5 align-top">{formData.tanggalPelaksanaan || "..................................................."}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-10 leading-relaxed text-justify text-[12pt]">
                  Demikian Surat Tugas ini diberikan untuk dapat dilaksanakan dengan penuh tanggung jawab. Setelah selesai melaksanakan tugas kedinasan, diwajibkan untuk menyampaikan laporan hasil pelaksanaan tugas kepada atasan langsung.
                </div>

                {/* Tanda Tangan */}
                <div className="flex justify-end mt-6 text-[12pt] break-inside-avoid">
                  <div className="w-72 text-center">
                    <p className="mb-1">
                      {school?.district || school?.regency || "Ditetapkan di ..................."},{" "}
                      {formatDate(formData.tanggalSurat)}
                    </p>
                    <p className="font-bold mb-10">Kepala {school?.name || "Sekolah"},</p>
                    <p className="font-bold underline uppercase">{principal?.name || "NAMA KEPALA SEKOLAH"}</p>
                    <p>NIP. {principal?.nip || "..........................."}</p>
                  </div>
                </div>
              </div>
            )}

            {jenisSurat === 'undangan' && (
              <div className="px-6 md:px-10">
                {/* Meta Surat Undangan */}
                <div className="flex justify-between text-[12pt] mb-8">
                  <div>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="w-24 py-1 align-top">Nomor</td>
                          <td className="w-4 py-1 align-top">:</td>
                          <td className="py-1 align-top">{undanganData.nomorSurat}</td>
                        </tr>
                        <tr>
                          <td className="py-1 align-top">Sifat</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1 align-top">{undanganData.sifat}</td>
                        </tr>
                        <tr>
                          <td className="py-1 align-top">Lampiran</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1 align-top">{undanganData.lampiran}</td>
                        </tr>
                        <tr>
                          <td className="py-1 align-top">Hal</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1 align-top font-bold">{undanganData.hal}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-right">
                    <p>{school?.district || school?.regency || "..................."}, {formatDate(undanganData.tanggalSurat)}</p>
                  </div>
                </div>

                {/* Tujuan */}
                <div className="mb-8 text-[12pt] leading-relaxed">
                  <p>Yth. <strong>{undanganData.tujuanSurat || "..................................................."}</strong></p>
                  <p>di -</p>
                  <p className="indent-8">{undanganData.tempatTujuan || "Tempat"}</p>
                </div>

                <div className="mb-6 leading-relaxed text-justify text-[12pt]">
                  <p className="mb-4">Dengan hormat,</p>
                  <p>Sehubungan dengan pelaksanaan program kegiatan sekolah dan upaya peningkatan kualitas pendidikan di {school?.name || "Satuan Pendidikan"}, dengan ini kami mengharap kehadiran Bapak/Ibu pada acara yang akan diselenggarakan pada:</p>
                </div>

                <div className="ml-8 md:ml-12 mb-6 text-[12pt]">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-40 py-1.5 align-top">Hari, Tanggal</td>
                        <td className="w-4 py-1.5 align-top">:</td>
                        <td className="py-1.5 align-top font-bold">{undanganData.hariTanggal || "..................................................."}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 align-top">Waktu</td>
                        <td className="py-1.5 align-top">:</td>
                        <td className="py-1.5 align-top">{undanganData.waktu || "..................................................."}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 align-top">Tempat</td>
                        <td className="py-1.5 align-top">:</td>
                        <td className="py-1.5 align-top font-bold">{undanganData.tempat || "..................................................."}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 align-top">Acara</td>
                        <td className="py-1.5 align-top">:</td>
                        <td className="py-1.5 align-top">{undanganData.acara || "..................................................."}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-10 leading-relaxed text-justify text-[12pt]">
                  Mengingat pentingnya acara tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya. Demikian undangan ini kami sampaikan, atas perhatian dan kerja samanya kami ucapkan terima kasih.
                </div>

                {/* Tanda Tangan */}
                <div className="flex justify-end mt-6 text-[12pt] break-inside-avoid">
                  <div className="w-72 text-center">
                    <p className="font-bold mb-10">Kepala {school?.name || "Sekolah"},</p>
                    <p className="font-bold underline uppercase">{principal?.name || "NAMA KEPALA SEKOLAH"}</p>
                    <p>NIP. {principal?.nip || "..........................."}</p>
                  </div>
                </div>
              </div>
            )}

            {jenisSurat === 'keterangan' && (
              <div className="px-6 md:px-10">
                <div className="text-center mb-10">
                  <h3 className="font-bold underline text-xl uppercase tracking-widest leading-tight">Surat Keterangan Aktif Belajar</h3>
                  <p className="mt-1 text-[12pt]">Nomor: {keteranganData.nomorSurat}</p>
                </div>

                <div className="mb-6 leading-relaxed text-justify text-[12pt]">
                  Yang bertanda tangan di bawah ini Kepala {school.name || "Sekolah"}, menerangkan dengan sesungguhnya bahwa:
                </div>

                <table className="w-full mb-6 text-[12pt] ml-4 md:ml-8">
                  <tbody>
                    <tr>
                      <td className="w-48 py-1.5 align-top">Nama</td>
                      <td className="w-4 py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top font-bold uppercase">{keteranganData.namaSiswa || "..................................................."}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 align-top">NIS / NISN</td>
                      <td className="py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top">{keteranganData.nisn || "........................."}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 align-top">Tempat, Tanggal Lahir</td>
                      <td className="py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top">
                        {keteranganData.tempatLahir ? keteranganData.tempatLahir + ", " : "........................., "} 
                        {keteranganData.tanggalLahir || "........................."}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 align-top">Kelas</td>
                      <td className="py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top font-bold">{keteranganData.kelas || "........................."}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mb-4 leading-relaxed text-justify text-[12pt]">
                  Adalah benar nama tersebut di atas siswa/siswi yang berstatus aktif belajar di {school.name || "sekolah kami"} pada Tahun Pelajaran berjalan. Anak tersebut adalah anak kandung/anak tida/anak asuh dari:
                </div>
                
                <table className="w-full mb-6 text-[12pt] ml-4 md:ml-8">
                  <tbody>
                    <tr>
                      <td className="w-48 py-1.5 align-top">Nama Orang Tua / Wali</td>
                      <td className="w-4 py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top font-bold">{keteranganData.namaOrangTua || "..................................................."}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 align-top">Pekerjaan</td>
                      <td className="py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top">{keteranganData.pekerjaanOrangTua || "..................................................."}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 align-top">Alamat</td>
                      <td className="py-1.5 align-top">:</td>
                      <td className="py-1.5 align-top">{keteranganData.alamat || "..........................................................................................."}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mb-10 leading-relaxed text-justify text-[12pt]">
                  Surat Keterangan ini diberikan untuk dipergunakan sebagai kelengkapan administrasi <strong>{keteranganData.keperluan || "..................................................."}</strong>. Demikian surat keterangan ini kami buat agar dapat dipergunakan sebagaimana mestinya.
                </div>

                {/* Tanda Tangan */}
                <div className="flex justify-end mt-6 text-[12pt] break-inside-avoid">
                  <div className="w-72 text-center">
                    <p className="mb-1">
                      {school?.district || school?.regency || "Ditetapkan di ..................."},{" "}
                      {formatDate(keteranganData.tanggalSurat)}
                    </p>
                    <p className="font-bold mb-10">Kepala {school?.name || "Sekolah"},</p>
                    <p className="font-bold underline uppercase">{principal?.name || "NAMA KEPALA SEKOLAH"}</p>
                    <p>NIP. {principal?.nip || "..........................."}</p>
                  </div>
                </div>
              </div>
            )}

            {jenisSurat.startsWith('sk_') && SK_TEMPLATES[jenisSurat] && (
              <div className="px-2 md:px-6">
                <div className="text-center mb-6">
                  <h3 className="font-bold text-[12pt] uppercase leading-tight">KEPUTUSAN</h3>
                  <h3 className="font-bold text-[12pt] uppercase leading-tight">KEPALA {school?.name || "SEKOLAH"}</h3>
                  <p className="mt-1 text-[12pt]">Nomor: {skData.nomorSurat}</p>
                  <p className="mt-2 font-bold text-[12pt] uppercase leading-tight">TENTANG</p>
                  <p className="font-bold text-[12pt] uppercase leading-tight">{SK_TEMPLATES[jenisSurat].title}</p>
                  <p className="mt-2 font-bold text-[12pt] uppercase leading-tight">TAHUN PELAJARAN {skData.tahunPelajaran}</p>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="font-bold text-[12pt] uppercase leading-tight">DENGAN RAHMAT TUHAN YANG MAHA ESA</h3>
                  <h3 className="font-bold text-[12pt] uppercase leading-tight">KEPALA {school?.name || "SEKOLAH"}</h3>
                </div>

                <div className="mb-4 text-[12pt]">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-24 py-1 align-top">Menimbang</td>
                        <td className="w-4 py-1 align-top">:</td>
                        <td className="py-1 align-top text-justify">
                          <ol className="list-[lower-alpha] pl-4 m-0 space-y-1">
                            {SK_TEMPLATES[jenisSurat].menimbang.map((item: string, i: number) => (
                              <li key={i} className="pl-1">{item}</li>
                            ))}
                          </ol>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-24 py-1 align-top pt-4">Mengingat</td>
                        <td className="w-4 py-1 align-top pt-4">:</td>
                        <td className="py-1 align-top text-justify pt-4">
                          <ol className="list-decimal pl-4 m-0 space-y-1">
                            {SK_TEMPLATES[jenisSurat].mengingat.map((item: string, i: number) => (
                              <li key={i} className="pl-1">{item}</li>
                            ))}
                          </ol>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-center mb-6 mt-8">
                  <h3 className="font-bold text-[12pt] uppercase leading-tight">MEMUTUSKAN:</h3>
                </div>

                <div className="mb-6 text-[12pt]">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-24 py-1 align-top">Menetapkan</td>
                        <td className="w-4 py-1 align-top">:</td>
                        <td className="py-1 align-top text-justify font-bold">{SK_TEMPLATES[jenisSurat].menetapkan}</td>
                      </tr>
                      {SK_TEMPLATES[jenisSurat].dictum.map((dictum: any, i: number) => (
                        <tr key={i}>
                          <td className="w-24 py-1 align-top pt-3 uppercase">{dictum.label}</td>
                          <td className="w-4 py-1 align-top pt-3">:</td>
                          <td className="py-1 align-top text-justify pt-3">{dictum.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tanda Tangan */}
                <div className="flex justify-end mt-6 text-[12pt] break-inside-avoid">
                  <div className="w-72 text-left ml-auto pl-8">
                    <p className="mb-0 leading-tight">
                      Ditetapkan di: {school?.district || school?.regency || "..................."}
                    </p>
                    <p className="mb-2 leading-tight border-b pb-2 border-slate-400">
                      Pada Tanggal: {formatDate(skData.tanggalSurat)}
                    </p>
                    <p className="font-bold mb-10 mt-2">Kepala {school?.name || "Sekolah"},</p>
                    <p className="font-bold underline uppercase mb-0 leading-tight">{principal?.name || "NAMA KEPALA SEKOLAH"}</p>
                    <p className="leading-tight">NIP. {principal?.nip || "..........................."}</p>
                  </div>
                </div>
                
                {/* Lampiran Placeholders */}
                <div className="break-before-page pt-[20mm]">
                  <p className="text-right text-[10pt] mb-8">Lampiran SK Kepala {school?.name || "Sekolah"}<br/>Nomor: {skData.nomorSurat}<br/>Tanggal: {formatDate(skData.tanggalSurat)}</p>
                  <h3 className="font-bold text-[12pt] uppercase text-center mb-10">LAMPIRAN: {SK_TEMPLATES[jenisSurat].title}</h3>
                  <div className="w-full mt-4">
                    <table className="w-full border-collapse border border-black text-[11pt]">
                      <thead>
                        <tr>
                          <th className="border border-black p-2 text-center w-12">No</th>
                          <th className="border border-black p-2 text-center">Nama Lengkap</th>
                          <th className="border border-black p-2 text-center">NIP / NUPTK</th>
                          <th className="border border-black p-2 text-center">Jabatan / Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <tr key={num}>
                            <td className="border border-black p-2 text-center">{num}</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-slate-400 text-sm mt-4 italic print:hidden text-center">
                      Tips: Klik pada tabel di atas untuk mulai mengetik daftar lampiran. Anda dapat menambah baris dengan klik kanan atau menggunakan tombol Tab di akhir baris.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
