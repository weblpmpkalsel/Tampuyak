const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionTeacherView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => setUploadingFor('mock-schedule-id')}
                className="flex-1 py-3 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Unggah Modul Ajar
              </button>
              <button 
                onClick={() => setReflectionFor('mock-schedule-id')}
                className="flex-1 py-3 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Isi Refleksi Awal
              </button>
            </div>`,
  `            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <button 
                onClick={() => setUploadingFor('mock-schedule-id')}
                className="flex-1 py-3 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Unggah Modul Ajar
              </button>
              <button 
                onClick={() => setReflectionFor('mock-schedule-id')}
                className="flex-1 py-3 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Isi Refleksi Awal
              </button>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-blue-900">Pasca Observasi (Coaching)</h4>
                <p className="text-sm text-blue-700">Kepala sekolah telah mengirimkan catatan coaching untuk Anda tanggapi.</p>
              </div>
              <button 
                onClick={() => alert("Buka modal respon coaching")}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Tanggapi Coaching
              </button>
            </div>`
);
fs.writeFileSync(file, code);
