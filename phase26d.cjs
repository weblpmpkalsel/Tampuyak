const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldRaporImport = `      {viewMode === "impor" && (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-24 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <FileSpreadsheet className="w-12 h-12 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 text-center">
            Impor Data Rapor Pendidikan
          </h3>
          <p className="text-slate-500 text-center max-w-lg mb-10 text-lg font-medium">
            Pilih sumber file unduhan dari platform Rapor Pendidikan untuk
            mengisi capaian indikator secara otomatis.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="outline"
              icon={FileSpreadsheet}
              className="opacity-60 cursor-not-allowed"
            >
              Impor Excel (Segera Hadir)
            </Button>
            <Button
              variant="outline"
              icon={FileText}
              className="opacity-60 cursor-not-allowed"
            >
              Impor PDF (Segera Hadir)
            </Button>
            <Button
              variant="outline"
              icon={Database}
              className="opacity-60 cursor-not-allowed"
            >
              Impor JSON (Segera Hadir)
            </Button>
          </div>
        </div>
      )}`;

const newRaporImport = `      {viewMode === "impor" && (
        <EmptyState
          icon={FileSpreadsheet}
          title="Impor Data Rapor Pendidikan"
          description="Fitur impor profil sekolah dari platform Rapor Pendidikan sedang diintegrasikan untuk pembaruan berikutnya."
          ctaText="Isi Data Manual"
          onCtaClick={() => setViewMode("manual")}
        />
      )}`;

code = code.replace(oldRaporImport, newRaporImport);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Rapor Import Empty State added');
