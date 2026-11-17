const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const academicYearCode = `
  AcademicYear: ({ data, appCtx }: any) => {
    const { addAcademicYear, switchAcademicYear } = appCtx;
    const [isAdding, setIsAdding] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [newSemester, setNewSemester] = React.useState("Ganjil");
    
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHelp title="Tahun Pelajaran" description="Kelola tahun pelajaran aktif." importance="Penting untuk sinkronisasi dokumen." nextStep="Pilih atau tambahkan tahun pelajaran." />
        <Card title="Daftar Tahun Pelajaran" description="Tahun pelajaran yang terdaftar.">
          <div className="space-y-4">
            {data.map((y: any, idx: number) => (
              <div key={idx} className={\`p-4 rounded-xl border flex items-center justify-between \${y.isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}\`}>
                <div>
                  <h4 className="font-bold text-slate-800">{y.name}</h4>
                  <p className="text-sm text-slate-500">{y.semester}</p>
                </div>
                <div>
                  {!y.isActive && (
                    <Button variant="outline" onClick={() => switchAcademicYear(y.id)}>Aktifkan</Button>
                  )}
                  {y.isActive && (
                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">Aktif</span>
                  )}
                </div>
              </div>
            ))}
            
            {isAdding ? (
              <div className="p-4 rounded-xl border bg-slate-50 space-y-4">
                <Input label="Tahun Pelajaran" value={newName} onChange={setNewName} placeholder="Contoh: 2024/2025" />
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Semester</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl" value={newSemester} onChange={e => setNewSemester(e.target.value)}>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { addAcademicYear(newName, newSemester, [], true); setIsAdding(false); }} className="bg-indigo-600 text-white">Simpan</Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAdding(true)} icon={Plus}>Tambah Tahun Pelajaran</Button>
            )}
          </div>
        </Card>
      </div>
    );
  },
`;

if (!code.includes('AcademicYear: ({ data, appCtx }: any) => {')) {
  code = code.replace(/const SettingsTabs = \{/, 'const SettingsTabs = {\n' + academicYearCode);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Injected AcademicYear");
}
