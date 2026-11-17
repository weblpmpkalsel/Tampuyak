const fs = require('fs');
let code = fs.readFileSync('src/portal/RegisterPage.tsx', 'utf-8');

const targetState = `  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    schoolName: '',
    npsn: '',
    position: 'HEADMASTER',
    province: '',
    district: '',
    subdistrict: '',
    agreeTerms: false
  });`;

const replaceState = `  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    agreeTerms: false
  });`;

code = code.replace(targetState, replaceState);

const targetCreate = `      await UserService.createUserProfile({
        uid: user.uid,
        email: user.email || formData.email,
        displayName: formData.fullName,
        schoolName: formData.schoolName,
        principalName: formData.position === 'HEADMASTER' ? formData.fullName : '',
        phone: formData.phone,
        province: formData.province,
        district: formData.district,
        npsn: formData.npsn,
        role: 'SCHOOL_ADMIN',
        status: 'PENDING',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });`;

const replaceCreate = `      await UserService.createUserProfile({
        uid: user.uid,
        email: user.email || formData.email,
        displayName: formData.fullName,
        phone: formData.phone,
        role: 'SCHOOL_ADMIN',
        status: 'PENDING',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });`;

code = code.replace(targetCreate, replaceCreate);

const targetFields = `              {/* School Info */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">Data Instansi (Sekolah)</h3>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Nama Sekolah</label>
                <div className="mt-1">
                  <input name="schoolName" type="text" required value={formData.schoolName} onChange={handleChange} className="block w-full min-h-[48px] appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">NPSN</label>
                <div className="mt-1">
                  <input name="npsn" type="text" required value={formData.npsn} onChange={handleChange} className="block w-full min-h-[48px] appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Jabatan/Peran</label>
                <div className="mt-1">
                  <select name="position" value={formData.position} onChange={handleChange} className="block w-full min-h-[48px] rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                    <option value="HEADMASTER">Kepala Sekolah</option>
                    <option value="OPERATOR">Operator Sekolah</option>
                    <option value="TEACHER">Guru</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Provinsi</label>
                <div className="mt-1">
                  <input name="province" type="text" required value={formData.province} onChange={handleChange} className="block w-full min-h-[48px] appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Kabupaten/Kota</label>
                <div className="mt-1">
                  <input name="district" type="text" required value={formData.district} onChange={handleChange} className="block w-full min-h-[48px] appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Kecamatan</label>
                <div className="mt-1">
                  <input name="subdistrict" type="text" required value={formData.subdistrict} onChange={handleChange} className="block w-full min-h-[48px] appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>`;

code = code.replace(targetFields, '');

fs.writeFileSync('src/portal/RegisterPage.tsx', code);
console.log('done');
