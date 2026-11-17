const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const emptyStateComponent = `
export const EmptyState = ({ icon: Icon, title, description, ctaText, onCtaClick }: any) => (
  <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh] animate-in fade-in zoom-in-95 duration-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
    <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
      <Icon className="w-10 h-10" />
    </div>
    <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
      {title}
    </h2>
    <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
      {description}
    </p>
    {ctaText && onCtaClick && (
      <Button 
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-2.5 rounded-full shadow-lg shadow-indigo-600/20"
        onClick={onCtaClick}
      >
        {ctaText}
      </Button>
    )}
  </div>
);
`;

const oldThemeNotification = `      case "theme":
      case "notification":
        return (
          <div className="flex flex-col items-center justify-center p-6 text-center h-[60vh] animate-in fade-in zoom-in-95 duration-500 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-slate-200">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              Segera Hadir
            </h2>
            <p className="text-slate-500 max-w-sm">
              Pengaturan ini sedang dalam tahap pengembangan dan akan tersedia
              pada pembaruan berikutnya.
            </p>
          </div>
        );`;

const newThemeNotification = `      case "theme":
      case "notification":
        return (
          <EmptyState
            icon={Clock}
            title={activeTab === "theme" ? "Pengaturan Tema" : "Pusat Notifikasi"}
            description={activeTab === "theme" ? "Kostumisasi tampilan aplikasi sedang dalam tahap penyempurnaan untuk memastikan konsistensi antarmuka pengguna pada versi stabil." : "Sistem pemberitahuan terintegrasi sedang disiapkan untuk rilis mendatang guna memastikan Anda tidak ketinggalan informasi penting."}
            ctaText="Kembali ke Dashboard"
            onCtaClick={() => setCurrentView("beranda")}
          />
        );`;

code = code.replace(oldThemeNotification, newThemeNotification);
code = code.replace('export const TargetPerformanceView = () => {', emptyStateComponent + '\\n\\nexport const TargetPerformanceView = () => {');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Empty states added');
