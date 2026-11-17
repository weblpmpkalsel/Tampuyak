const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target1 = `              <Input label="Tahun Pelajaran" value={settings.academicYears?.find((y:any)=>y.isActive)?.name || ""} disabled />
              <Input label="Versi Dokumen" value="1.0" disabled />
            </div>`;

const replacement1 = `              <Input label="Tahun Pelajaran" value={settings.academicYears?.find((y:any)=>y.isActive)?.name || ""} disabled />
              <Input label="Semester" value={settings.academicYears?.find((y:any)=>y.isActive)?.semester || ""} disabled />
              <Input label="Versi Dokumen" value="1.0" disabled />
              <Select label="Status Dokumen" value="Draft" options={["Draft", "Final", "Disahkan"]} onChange={() => {}} disabled />
              <Input label="Masa Berlaku" placeholder="Cth: 1 Tahun" />
              <Input label="Catatan Revisi" placeholder="Kosongkan jika bukan dokumen revisi" />
            </div>`;

code = code.replace(target1, replacement1);

const target2 = `              <ul className="space-y-3">
                <li className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-700">Kepala Sekolah</span>
                  <span className="text-slate-500 text-sm">{settings.principal?.name || "Belum diatur"}</span>
                </li>
                <li className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-700">Ketua Komite</span>
                  <span className="text-slate-500 text-sm">{settings.komite?.name || "Belum diatur"}</span>
                </li>
                <li className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-700">Kepala Dinas</span>
                  <span className="text-slate-500 text-sm">{settings.kepalaDinas?.name || "Belum diatur"}</span>
                </li>
              </ul>`;

const replacement2 = `              <ul className="space-y-3">
                {(KSP_TEMPLATE_REGISTRY[settings.school?.jenjang || "SD Negeri"]?.pengesahan || ["Kepala Sekolah", "Ketua Komite", "Kepala Dinas"]).map((pejabat: string, idx: number) => {
                  let value = "Belum diatur";
                  if (pejabat === "Kepala Sekolah") value = settings.principal?.name || "Belum diatur";
                  if (pejabat === "Ketua Komite") value = settings.komite?.name || "Belum diatur";
                  if (pejabat === "Kepala Dinas") value = settings.kepalaDinas?.name || "Belum diatur";
                  if (pejabat === "Pengawas Pembina") value = settings.pengawas?.name || "Belum diatur";
                  return (
                    <li key={idx} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg bg-white">
                      <span className="font-bold text-slate-700">{pejabat}</span>
                      <span className="text-slate-500 text-sm">{value}</span>
                    </li>
                  )
                })}
              </ul>`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done updating penetapan');
