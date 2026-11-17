const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const smartGuidanceComponent = `
const SmartGuidance = ({ type }: { type: string }) => {
  const guidance: Record<string, any> = {
    visi: {
      title: "Kriteria Visi yang Baik",
      points: [
        "Berorientasi ke masa depan (visioner)",
        "Menggambarkan profil murid yang dicita-citakan",
        "Singkat, jelas, dan mudah diingat",
        "Tidak memuat langkah operasional (langkah ada di Misi)"
      ]
    },
    misi: {
      title: "Kriteria Misi yang Baik",
      points: [
        "Merupakan langkah nyata untuk mewujudkan Visi",
        "Dapat diukur dan dievaluasi",
        "Menggunakan kata kerja aktif (misal: 'Mewujudkan', 'Meningkatkan')",
        "Fokus pada proses pembelajaran dan pengembangan karakter"
      ]
    },
    tujuan: {
      title: "Prinsip SMART Goals",
      points: [
        "Specific (Spesifik/Khusus)",
        "Measurable (Dapat diukur capaiannya)",
        "Achievable (Realistis/Dapat dicapai)",
        "Relevant (Relevan dengan Visi & Misi)",
        "Time-bound (Memiliki batas waktu penyelesaian)"
      ]
    },
    indikator: {
      title: "Indikator Kinerja Terukur",
      points: [
        "Mengandung angka/persentase target (misal: '80% lulusan...')",
        "Objektif dan dapat dibuktikan dengan data",
        "Hindari kata sifat abstrak (misal: 'menjadi lebih baik')"
      ]
    }
  };

  const item = guidance[type];
  if (!item) return null;

  return (
    <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm">
      <h5 className="text-[13px] font-bold text-indigo-800 flex items-center gap-1.5 mb-2"><Info className="w-4 h-4" /> {item.title}</h5>
      <ul className="space-y-1.5">
        {item.points.map((p: string, i: number) => (
          <li key={i} className="text-xs text-indigo-700/80 flex items-start gap-1.5 leading-snug">
            <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
`;

if (!content.includes('const SmartGuidance =')) {
  // Put it before `const Input =`
  content = content.replace('const Input = ({', smartGuidanceComponent + '\nconst Input = ({');
}

const textareaOld = `const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 3,
}) => {
  const isMissing = required && !value;
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-[13px] font-bold text-slate-700 tracking-wide">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={\`w-full px-4 py-3.5 bg-slate-50/50 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:bg-white transition-all duration-300 resize-y \${isMissing ? "border-amber-200 bg-amber-50/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10" : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-200"}\`}
      />
    </div>
  );
};`;

const textareaNew = `const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 3,
  guidanceType
}: any) => {
  const isMissing = required && !value;
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-[13px] font-bold text-slate-700 tracking-wide">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className={\`w-full px-4 py-3.5 bg-slate-50/50 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:bg-white transition-all duration-300 resize-y \${isMissing ? "border-amber-200 bg-amber-50/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10" : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-200"}\`}
      />
      {guidanceType && isFocused && <SmartGuidance type={guidanceType} />}
    </div>
  );
};`;

if (content.includes(textareaOld)) {
  content = content.replace(textareaOld, textareaNew);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
