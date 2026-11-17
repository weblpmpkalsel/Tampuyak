const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const importCenterRegex = /const EnterpriseImportCenter = \(\) => \{[\s\S]*?(?=const DataSekolahView = \(\{)/;

const newImportCenter = `const EnterpriseImportCenter = () => {
  const { settings, updateSetting, showSuccess, showToast } = useApp();
  const [activeView, setActiveView] = useState("dashboard"); // dashboard, preview
  const [activeType, setActiveType] = useState<string>("guru");
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const importHistory = settings.importHistory || [];

  const types = [
    { id: "guru", label: "Guru", icon: Users, desc: "Data pendidik dan kualifikasi" },
    { id: "pesertaDidik", label: "Peserta Didik", icon: Users, desc: "Data siswa per rombel" },
    { id: "tendik", label: "Tenaga Kependidikan", icon: Briefcase, desc: "Data staf dan admin" },
    { id: "rombel", label: "Rombel", icon: Layers, desc: "Data rombongan belajar" },
    { id: "sarpras", label: "Sarana & Prasarana", icon: Home, desc: "Aset dan fasilitas fisik" },
    { id: "komite", label: "Komite Sekolah", icon: Users, desc: "Data pengurus komite" },
    { id: "school", label: "Profil Sekolah", icon: Building2, desc: "Data institusi utama" },
  ];

  const handleDownloadTemplate = (typeId: string) => {
    let headers = "";
    let example = "";
    if (typeId === "guru") {
      headers = "nama,nip,nuptk,golongan,jabatan,pendidikan,status\\n";
      example = "Budi Santoso,198001012005011001,1234567890,III/a,Guru Kelas,S1,PNS";
    }
    if (typeId === "pesertaDidik") {
      headers = "nisn,nama,kelas,jenisKelamin\\n";
      example = "0012345678,Ahmad Dahlan,I A,L";
    }
    if (typeId === "tendik") {
      headers = "nama,nip,jabatan,pendidikan,status\\n";
      example = "Siti Aminah,198502022010012001,Tata Usaha,SMA,Honorer";
    }
    if (typeId === "rombel") {
      headers = "namaKelas,waliKelas,jumlahSiswa,ruang\\n";
      example = "Kelas I A,Budi Santoso,30,Ruang 1";
    }
    if (typeId === "sarpras") {
      headers = "jenis,jumlah,kondisiBaik,kondisiRusakRingan,kondisiRusakBerat\\n";
      example = "Ruang Kelas,6,4,2,0\\nPerpustakaan,1,1,0,0";
    }
    if (typeId === "komite") {
      headers = "nama,jabatan,pekerjaan,noTelp\\n";
      example = "Agus Setiawan,Ketua,Wiraswasta,081234567890";
    }
    if (typeId === "school") {
      headers = "name,npsn,address,principalName,principalNip\\n";
      example = "SDN 1 Contoh,10101010,Jl. Pendidikan No. 1,Supriyanto,196504041990031002";
    }
    
    const blob = new Blob([headers + example], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = \`template_\${typeId}.csv\`;
    link.click();
  };

  const handleFileUpload = (e: any, typeId: string) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;
    setActiveType(typeId);
    setFile(uploaded);
    setIsImporting(true);
    setImportProgress(0);
    setActiveView("preview");
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split("\\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      const parsedData: any[] = [];
      const errors: any = {};
      
      let currentIndex = 1;
      const chunkSize = 50;
      
      const uniqueTracker: any = { nip: new Set(), nisn: new Set(), npsn: new Set() };

      const processChunk = () => {
        const end = Math.min(currentIndex + chunkSize, lines.length);
        
        for (let i = currentIndex; i < end; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(",");
          let rowObj: any = {};
          let rowHasError = false;
          let rowErrors: string[] = [];
          
          headers.forEach((h, index) => {
            let val = values[index]?.trim() || "";
            // simple cleanup
            val = val.replace(/^"|"$/g, '');
            rowObj[h] = val;
            
            // Required validations
            if ((h === "nama" || h === "name" || h === "nisn" || h === "npsn") && !val) {
               rowHasError = true;
               rowErrors.push(\`\${h} wajib diisi\`);
            }
            // Duplicate validations
            if (h === "nip" && val && val !== "-") {
              if (uniqueTracker.nip.has(val)) { rowHasError = true; rowErrors.push(\`Duplikat NIP: \${val}\`); }
              else uniqueTracker.nip.add(val);
            }
            if (h === "nisn" && val) {
              if (uniqueTracker.nisn.has(val)) { rowHasError = true; rowErrors.push(\`Duplikat NISN: \${val}\`); }
              else uniqueTracker.nisn.add(val);
            }
            if (h === "npsn" && val) {
              if (uniqueTracker.npsn.has(val)) { rowHasError = true; rowErrors.push(\`Duplikat NPSN: \${val}\`); }
              else uniqueTracker.npsn.add(val);
            }
            // Format validations
            if (h === "noTelp" && val && !/^\\d+$/.test(val.replace(/[\\s\\+\\-]/g, ''))) {
               rowHasError = true; rowErrors.push("Format telepon tidak valid");
            }
            if (h === "email" && val && !val.includes("@")) {
               rowHasError = true; rowErrors.push("Format email tidak valid");
            }
          });
          
          rowObj._index = i;
          rowObj._hasError = rowHasError;
          if (rowHasError) errors[i] = rowErrors;
          parsedData.push(rowObj);
        }
        
        currentIndex = end;
        setImportProgress(Math.round((currentIndex / lines.length) * 100));
        
        if (currentIndex < lines.length) {
          setTimeout(processChunk, 0); 
        } else {
          setPreviewData(parsedData);
          setValidationErrors(errors);
          setIsImporting(false);
          setImportProgress(0);
        }
      };
      
      processChunk();
    };
    reader.readAsText(uploaded);
    
    // reset input
    e.target.value = null;
  };

  const handleSaveImport = () => {
    const validData = previewData.filter(r => !r._hasError);
    if (validData.length === 0) {
       showToast("Tidak ada data valid untuk diimpor", "error");
       return;
    }
    
    if (activeType === "school") {
       const schoolData = validData[0];
       updateSetting("school", "name", schoolData.name);
       updateSetting("school", "npsn", schoolData.npsn);
       updateSetting("school", "address", schoolData.address);
       if (schoolData.principalName) {
           updateSetting("principal", "name", schoolData.principalName);
           updateSetting("principal", "nip", schoolData.principalNip);
       }
    } else {
       // Append or replace? Usually append for master data. Let's replace for simplicity or append.
       // The user requested onboarding tool, so maybe append. We will replace to avoid complexity of id generation if they re-import.
       updateSetting(activeType, "", validData);
    }
    
    // Save to history
    const historyItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      module: types.find(t => t.id === activeType)?.label || activeType,
      fileName: file?.name || "Unknown.csv",
      totalRows: previewData.length,
      success: validData.length,
      failed: previewData.length - validData.length,
      importedBy: "Admin"
    };
    
    updateSetting("importHistory", "", [historyItem, ...importHistory]);
    
    showSuccess(\`Berhasil mengimpor \${validData.length} baris data.\`);
    setFile(null);
    setPreviewData([]);
    setValidationErrors({});
    setActiveView("dashboard");
  };

  if (activeView === "preview") {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Review Impor: {types.find(t=>t.id===activeType)?.label}</h2>
              <p className="text-slate-500">Periksa data sebelum disimpan secara permanen.</p>
            </div>
            <Button variant="outline" onClick={() => setActiveView("dashboard")}>Batal</Button>
          </div>
          
          {isImporting ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-bold">Memproses File ({importProgress}%)...</p>
            </div>
          ) : previewData.length > 0 ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800">Hasil Validasi</h3>
                  <p className="text-sm text-slate-500">{previewData.length} baris dibaca • <span className="text-emerald-600 font-bold">{previewData.filter(r => !r._hasError).length} Valid</span> • <span className="text-rose-600 font-bold">{previewData.filter(r => r._hasError).length} Error</span></p>
                </div>
                <Button onClick={handleSaveImport} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20" disabled={previewData.filter(r => !r._hasError).length === 0}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Impor Data Valid
                </Button>
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-white sticky top-0 border-b border-slate-200 shadow-sm z-10">
                    <tr>
                      <th className="px-4 py-3 font-bold bg-white">Status</th>
                      {Object.keys(previewData[0]).filter(k => !k.startsWith("_")).map(h => (
                        <th key={h} className="px-4 py-3 font-bold bg-white">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewData.map((row, idx) => (
                      <tr key={idx} className={row._hasError ? "bg-rose-50/50" : "hover:bg-slate-50"}>
                        <td className="px-4 py-3">
                          {row._hasError ? (
                            <div className="flex flex-col text-rose-600 font-medium text-xs">
                              <span className="flex items-center mb-1"><AlertTriangle className="w-3 h-3 mr-1" /> Error</span>
                              <span className="text-rose-500">{validationErrors[row._index]?.join(", ")}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-emerald-600 font-medium">
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Valid
                            </div>
                          )}
                        </td>
                        {Object.keys(row).filter(k => !k.startsWith("_")).map(h => (
                          <td key={h} className="px-4 py-3 text-slate-700 whitespace-nowrap">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500">Tidak ada data ditemukan dalam file.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center">
            <Upload className="w-6 h-6 mr-3 text-indigo-600" />
            Pusat Impor Data
          </h2>
          <p className="text-slate-500 mt-2">Gunakan menu ini untuk mengimpor data sekolah dalam jumlah besar menggunakan Template Excel/CSV resmi.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {types.map(t => {
            const Icon = t.icon;
            const history = importHistory.find((h: any) => h.module === t.label);
            return (
              <div key={t.id} className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors bg-slate-50/50 flex flex-col h-full">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mr-3 shrink-0 text-indigo-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{t.label}</h3>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 space-y-3">
                  {history ? (
                    <div className="text-[11px] text-slate-500 flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                      <span>Terakhir: {new Date(history.date).toLocaleDateString("id-ID")}</span>
                      <span className="font-bold text-emerald-600">{history.success} Baris</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic bg-white p-2 rounded-lg border border-slate-100 text-center">
                      Belum pernah diimpor
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate(t.id)} className="w-full text-xs h-9">
                      <Download className="w-3 h-3 mr-1.5" /> Template
                    </Button>
                    <div className="relative">
                      <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, t.id)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Impor File" />
                      <Button size="sm" className="w-full text-xs h-9 bg-indigo-600 hover:bg-indigo-700 pointer-events-none">
                        <Upload className="w-3 h-3 mr-1.5" /> Impor
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <History className="w-5 h-5 mr-2 text-slate-400" />
            Riwayat Impor
          </h3>
          
          {importHistory.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">Tanggal</th>
                      <th className="px-4 py-3 font-bold">Modul</th>
                      <th className="px-4 py-3 font-bold">Nama File</th>
                      <th className="px-4 py-3 font-bold text-center">Total</th>
                      <th className="px-4 py-3 font-bold text-center text-emerald-600">Sukses</th>
                      <th className="px-4 py-3 font-bold text-center text-rose-600">Gagal</th>
                      <th className="px-4 py-3 font-bold">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importHistory.map((h: any) => (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{new Date(h.date).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-3 font-bold text-slate-700">{h.module}</td>
                        <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]" title={h.fileName}>{h.fileName}</td>
                        <td className="px-4 py-3 text-center">{h.totalRows}</td>
                        <td className="px-4 py-3 text-center text-emerald-600 font-bold">{h.success}</td>
                        <td className="px-4 py-3 text-center text-rose-600 font-bold">{h.failed}</td>
                        <td className="px-4 py-3 text-slate-500">{h.importedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-3">
                 <Upload className="w-6 h-6" />
               </div>
               <h4 className="font-bold text-slate-700 mb-1">Belum Ada Riwayat Impor</h4>
               <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">Mulai lengkapi data sekolah Anda dengan mengunduh template dan mengunggahnya kembali.</p>
               <Button onClick={() => handleDownloadTemplate("school")} className="bg-indigo-600 hover:bg-indigo-700">
                 Download Template Pertama
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`;

code = code.replace(importCenterRegex, newImportCenter);

fs.writeFileSync('src/Tampuyak.tsx', code);
