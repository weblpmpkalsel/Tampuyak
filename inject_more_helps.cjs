const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// DataSekolahView
code = code.replace(
  '<div className="flex-1 overflow-x-hidden p-6 md:p-8">',
  '<div className="flex-1 overflow-x-hidden p-6 md:p-8">\n        <PageHelp title="Data Sekolah" description="Pusat pengaturan profil, identitas, sarana prasarana, dan tenaga pendidik." importance="Menjadi sumber data utama bagi seluruh dokumen yang akan dihasilkan secara otomatis." nextStep="Lengkapi seluruh informasi secara akurat pada setiap tab." />'
);

// RaporPendidikanView
code = code.replace(
  'const RaporPendidikanView = () => {\n  const { settings, updateSetting } = useApp();\n  const [isSyncing, setIsSyncing] = useState(false);\n  const [showRapor, setShowRapor] = useState(settings.rapor?.isLocked || false);\n\n  const handleSync = () => {\n    setIsSyncing(true);\n    setTimeout(() => {\n      setIsSyncing(false);\n      setShowRapor(true);\n      updateSetting("rapor", "data", "SYNC_2025");\n      updateSetting("rapor", "isLocked", true);\n    }, 2000);\n  };\n\n  return (\n    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">',
  'const RaporPendidikanView = () => {\n  const { settings, updateSetting } = useApp();\n  const [isSyncing, setIsSyncing] = useState(false);\n  const [showRapor, setShowRapor] = useState(settings.rapor?.isLocked || false);\n\n  const handleSync = () => {\n    setIsSyncing(true);\n    setTimeout(() => {\n      setIsSyncing(false);\n      setShowRapor(true);\n      updateSetting("rapor", "data", "SYNC_2025");\n      updateSetting("rapor", "isLocked", true);\n    }, 2000);\n  };\n\n  return (\n    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">\n      <PageHelp title="Rapor Pendidikan" description="Halaman untuk memasukkan dan menyinkronkan hasil Evaluasi Diri Sekolah atau Rapor Pendidikan." importance="Merupakan dasar evaluasi untuk menentukan program prioritas sekolah secara tepat." nextStep="Unggah data rapor pendidikan terbaru Anda dan kunci data jika sudah sesuai." />'
);

// DecisionEngineView
code = code.replace(
  'const DecisionEngineView = ({ navigateToView }: any) => {\n  const { settings, updateSetting } = useApp();\n  const [isProcessing, setIsProcessing] = useState(false);\n  const [showResults, setShowResults] = useState(settings.diagnosis?.isLocked || false);\n\n  const handleProcess = () => {\n    setIsProcessing(true);\n    setTimeout(() => {\n      setIsProcessing(false);\n      setShowResults(true);\n      updateSetting("diagnosis", "isLocked", true);\n      updateSetting("diagnosis", "results", [\n        { id: "p1", title: "Peningkatan Literasi Digital", category: "Mutu Lulusan" },\n        { id: "p2", title: "Pengembangan Karakter Siswa", category: "Iklim Keamanan" }\n      ]);\n    }, 2500);\n  };\n\n  return (\n    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">',
  'const DecisionEngineView = ({ navigateToView }: any) => {\n  const { settings, updateSetting } = useApp();\n  const [isProcessing, setIsProcessing] = useState(false);\n  const [showResults, setShowResults] = useState(settings.diagnosis?.isLocked || false);\n\n  const handleProcess = () => {\n    setIsProcessing(true);\n    setTimeout(() => {\n      setIsProcessing(false);\n      setShowResults(true);\n      updateSetting("diagnosis", "isLocked", true);\n      updateSetting("diagnosis", "results", [\n        { id: "p1", title: "Peningkatan Literasi Digital", category: "Mutu Lulusan" },\n        { id: "p2", title: "Pengembangan Karakter Siswa", category: "Iklim Keamanan" }\n      ]);\n    }, 2500);\n  };\n\n  return (\n    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">\n      <PageHelp title="Analisis Prioritas" description="Halaman untuk menganalisis capaian rapor dan menentukan program strategis." importance="Menjadi fondasi program kerja yang akan dituangkan dalam RKJM dan RKT." nextStep="Evaluasi rekomendasi program dan setujui jika sesuai dengan visi sekolah." />'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
