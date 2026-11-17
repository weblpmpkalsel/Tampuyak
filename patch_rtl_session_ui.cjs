const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionRtlSession.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Judul RTL</label>`,
  `              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Pelatihan">Pelatihan / Diklat</option>
                    <option value="Mentoring">Mentoring / Coaching</option>
                    <option value="Tugas Tambahan">Tugas Tambahan</option>
                    <option value="Pengembangan Diri">Pengembangan Diri</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Judul RTL</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="Misal: Ikut Pelatihan Media Interaktif"
                  />
                </div>
              </div>`
);

code = code.replace(
  `              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Judul RTL</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                  placeholder="Misal: Ikut Pelatihan Media Interaktif"
                />
              </div>`,
  ``
);

code = code.replace(
  `              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Prioritas</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as RecommendationPriority)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value={RecommendationPriority.LOW}>Rendah (LOW)</option>
                  <option value={RecommendationPriority.MEDIUM}>Sedang (MEDIUM)</option>
                  <option value={RecommendationPriority.HIGH}>Tinggi (HIGH)</option>
                </select>
              </div>`,
  `              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Evidence yang Diharapkan</label>
                  <input
                    type="text"
                    value={expectedEvidence}
                    onChange={e => setExpectedEvidence(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="Misal: Sertifikat PDF, Foto Kegiatan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Prioritas</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as RecommendationPriority)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value={RecommendationPriority.LOW}>Rendah (LOW)</option>
                    <option value={RecommendationPriority.MEDIUM}>Sedang (MEDIUM)</option>
                    <option value={RecommendationPriority.HIGH}>Tinggi (HIGH)</option>
                  </select>
                </div>
              </div>`
);

fs.writeFileSync(file, code);
