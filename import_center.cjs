const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const importCenterCode = `
const EnterpriseImportCenter = () => {
  const { settings, updateSetting, showSuccess, showToast } = useApp();
  const [activeType, setActiveType] = useState<string>("guru");
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<any>({});
  
  const types = [
    { id: "guru", label: "Guru", icon: Users },
    { id: "pesertaDidik", label: "Peserta Didik", icon: Users },
    { id: "tendik", label: "Tenaga Kependidikan", icon: Briefcase },
    { id: "rombel", label: "Rombel/Kelas", icon: Layers },
    { id: "sarpras", label: "Fasilitas (Sarpras)", icon: Home },
    { id: "komite", label: "Komite Sekolah", icon: Users },
    { id: "pengawas", label: "Pengawas", icon: UserCircle },
    { id: "school", label: "Profil Sekolah", icon: Building2 },
  ];

  const handleDownloadTemplate = () => {
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
  };

  const handleFileUpload = (e: any) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;
    setFile(uploaded);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split("\\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      const parsedData = [];
      const errors: any = {};
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(",");
        let rowObj: any = {};
        let rowHasError = false;
        
        headers.forEach((h, index) => {
          const val = values[index]?.trim() || "";
          rowObj[h] = val;
          if (activeType === "guru" && h === "nama" && !val) {
             rowHasError = true;
             if (!errors[i]) errors[i] = [];
             errors[i].push("Nama wajib diisi");
          }
        });
        
        rowObj._index = i;
        rowObj._hasError = rowHasError;
        parsedData.push(rowObj);
      }
      
      setPreviewData(parsedData);
      setValidationErrors(errors);
    };
    reader.readAsText(uploaded);
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
       updateSetting("principal", "name", schoolData.principalName);
       updateSetting("principal", "nip", schoolData.principalNip);
    } else {
       updateSetting(activeType, "", validData);
    }
    
    showSuccess(\`Berhasil mengimpor \${validData.length} baris data.\`);
    setFile(null);
    setPreviewData([]);
    setValidationErrors({});
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Enterprise Import Center</h2>
        <p className="text-slate-500 mb-6">Impor data massal dari file CSV. Unduh template, isi data, dan unggah kembali.</p>
        
        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-6 border-b border-slate-100">
          {types.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setActiveType(t.id); setFile(null); setPreviewData([]); }}
                className={\`flex items-center whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all \${activeType === t.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}\`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 mb-2">Unggah File CSV</h3>
            <p className="text-sm text-slate-500 mb-4">Pastikan file sesuai dengan template {types.find(t => t.id === activeType)?.label}</p>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
              Pilih File
            </label>
          </div>
          
          <div className="border border-slate-200 rounded-2xl p-8 flex flex-col justify-center items-start">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 mb-2">Butuh Template?</h3>
            <p className="text-sm text-slate-500 mb-4">Unduh template CSV kosong beserta contoh pengisian yang benar.</p>
            <Button variant="outline" onClick={handleDownloadTemplate} className="w-full justify-center">
              Unduh Template {types.find(t => t.id === activeType)?.label}
            </Button>
          </div>
        </div>

        {previewData.length > 0 && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">Pratinjau Data</h3>
                <p className="text-sm text-slate-500">{previewData.length} baris terdeteksi. {previewData.filter(r => r._hasError).length} baris memiliki error.</p>
              </div>
              <Button onClick={handleSaveImport} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Simpan Data Valid
              </Button>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-white sticky top-0 border-b border-slate-200 shadow-sm z-10">
                  <tr>
                    <th className="px-4 py-3 font-bold">Status</th>
                    {Object.keys(previewData[0]).filter(k => !k.startsWith("_")).map(h => (
                      <th key={h} className="px-4 py-3 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className={row._hasError ? "bg-rose-50" : "hover:bg-slate-50"}>
                      <td className="px-4 py-3">
                        {row._hasError ? (
                          <div className="flex items-center text-rose-600 font-medium" title={validationErrors[row._index]?.join(", ")}>
                            <AlertTriangle className="w-4 h-4 mr-1" /> Error
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
        )}
      </div>
    </div>
  );
};
`;

code = code.replace(
  'const DataSekolahView = ({ initialTab = "dashboard" }: any) => {',
  importCenterCode + '\nconst DataSekolahView = ({ initialTab = "dashboard" }: any) => {'
);

code = code.replace(
  '{ id: "academicYear", label: "Tahun Pelajaran", icon: Calendar },',
  '{ id: "academicYear", label: "Tahun Pelajaran", icon: Calendar },\n    { id: "import", label: "Pusat Impor Data", icon: Upload },'
);

code = code.replace(
  '      case "academicYear":',
  '      case "import":\n        return <EnterpriseImportCenter />;\n      case "academicYear":'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Enterprise Import Center added");
