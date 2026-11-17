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
    <div className="mt-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
      <h5 className="text-xs font-bold text-blue-800 flex items-center gap-1 mb-1.5"><Info className="w-3.5 h-3.5" /> {item.title}</h5>
      <ul className="space-y-1">
        {item.points.map((p: string, i: number) => (
          <li key={i} className="text-[11px] text-blue-700/80 flex items-start gap-1.5">
            <span className="text-blue-400 shrink-0 mt-0.5">•</span>
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
  content = content.replace('const Input = forwardRef(', smartGuidanceComponent + '\nconst Input = forwardRef(');
}

const textareaOld = `const Textarea = forwardRef(
  ({ label, required, className = "", ...props }: any, ref) => (
    <div className={\`space-y-1.5 \${className}\`}>
      {label && (
        <label className="block text-[13px] font-bold text-slate-700 tracking-wide">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors custom-scrollbar"
        {...props}
      />
    </div>
  ),
);
Textarea.displayName = "Textarea";`;

const textareaNew = `const Textarea = forwardRef(
  ({ label, required, guidanceType, className = "", ...props }: any, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
      <div className={\`space-y-1.5 \${className}\`}>
        {label && (
          <label className="block text-[13px] font-bold text-slate-700 tracking-wide">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors custom-scrollbar"
          {...props}
        />
        {guidanceType && isFocused && <SmartGuidance type={guidanceType} />}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";`;

if (content.includes(textareaOld)) {
  content = content.replace(textareaOld, textareaNew);
} else {
    // maybe it has some difference
    console.log("Textarea not replaced exactly");
}

fs.writeFileSync('src/Tampuyak.tsx', content);
