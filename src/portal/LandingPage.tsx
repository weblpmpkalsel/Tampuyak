import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, CheckCircle2, ArrowRight, Activity, Wallet, Users, BarChart, Building2, BarChart3, Mail, Shield, Layers, RefreshCw, Briefcase, GraduationCap, Monitor, Database, Settings } from 'lucide-react';
import { motion } from 'motion/react';

const MASCOT_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            <div className="flex items-center space-x-4">
              <img src={MASCOT_URL} alt="Tampuyak Logo" className="w-14 h-14 object-contain" />
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">TAMPUYAK</span>
                <span className="text-xs font-semibold text-slate-500 leading-tight mt-1.5 hidden md:block">
                  Tata Kelola Administrasi dan Manajemen Pendidikan<br/>Upaya Akselerasi Kualitas
                </span>
              </div>
            </div>
            <div className="hidden lg:flex space-x-8">
              <a href="#ecosystem" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Ekosistem</a>
              <a href="#features" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Kapabilitas</a>
              <a href="#why" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Mengapa TAMPUYAK</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-blue-600 px-3 py-2 transition-colors">Masuk</Link>
              <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md">
                Daftarkan Sekolah
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white relative overflow-hidden flex items-center pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/60 via-white to-white"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-[55%] text-center lg:text-left z-10"
            >
              <div className="inline-flex items-center px-6 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs md:text-sm font-bold tracking-wide mb-8 shadow-sm">
                Sistem Operasi Sekolah Terpadu
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.15]">
                Dari Analisis Rapor Pendidikan Menuju <span className="text-blue-600">Tata Kelola Berkualitas</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Satu platform terintegrasi. Analisis Rapor Pendidikan kini menjadi fondasi otomatis untuk KSP, RKJM, RKT, RKAS, Administrasi, Monitoring, Evaluasi, dan Dashboard.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register" className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 px-8 py-4.5 rounded-full text-base font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center justify-center group">
                  Daftarkan Sekolah
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#ecosystem" className="w-full sm:w-auto bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-8 py-4.5 rounded-full text-base font-bold transition-all flex items-center justify-center">
                  Lihat Demo Platform
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="lg:w-[45%] flex justify-center lg:justify-end relative"
            >
              <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-[80px] -z-10 scale-125"></div>
              <img 
                src={MASCOT_URL} 
                alt="Tampuyak Mascot" 
                className="w-full max-w-[28rem] lg:max-w-[36rem] object-contain drop-shadow-2xl z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Flow / Ecosystem - Simplified Input -> Engine -> Output */}
      <section id="ecosystem" className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Transformasi Data</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Alur Tata Kelola Profesional</h3>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative">
              {/* Desktop connecting lines */}
              <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -translate-y-1/2 z-0 rounded-full opacity-50"></div>

              {/* INPUT */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-1/3 z-10"
              >
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-6">
                    <Database className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Tahap 1</h4>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Input Data</h3>
                  <p className="text-slate-600 font-medium">Analisis Rapor Pendidikan & Identifikasi Masalah Prioritas.</p>
                </div>
              </motion.div>

              {/* Arrow Mobile */}
              <div className="lg:hidden text-blue-400 py-4">
                <ArrowRight className="w-8 h-8 rotate-90" />
              </div>

              {/* ENGINE */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full lg:w-1/3 z-10"
              >
                <div className="bg-blue-600 p-8 rounded-[2rem] shadow-xl border border-blue-500 flex flex-col items-center text-center h-full transform lg:scale-105">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Settings className="w-8 h-8 animate-[spin_8s_linear_infinite]" />
                  </div>
                  <h4 className="text-sm font-bold tracking-widest text-blue-200 uppercase mb-2">Tahap 2</h4>
                  <h3 className="text-2xl font-bold text-white mb-4">Engine TAMPUYAK</h3>
                  <p className="text-blue-100 font-medium">Pemrosesan, Harmonisasi, dan Integrasi Perencanaan Otomatis.</p>
                </div>
              </motion.div>

              {/* Arrow Mobile */}
              <div className="lg:hidden text-blue-400 py-4">
                <ArrowRight className="w-8 h-8 rotate-90" />
              </div>

              {/* OUTPUT */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full lg:w-1/3 z-10"
              >
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Tahap 3</h4>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Output Dokumen</h3>
                  <p className="text-slate-600 font-medium">KSP, RKJM, RKT, RKAS, Monitoring, Evaluasi, dan Dashboard.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Kapabilitas Enterprise</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Dirancang Untuk Akuntabilitas</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Analisis Rapor Pendidikan', 
                desc: 'Otomatisasi penarikan data capaian sekolah dan rekomendasi strategis peningkatan kualitas berdasarkan data objektif yang valid.',
                icon: BarChart
              },
              { 
                title: 'Perencanaan Sekolah', 
                desc: 'Dokumen KSP, RKJM, dan RKT tersusun harmonis. Setiap program sekolah dijamin selaras dengan visi, misi, dan rapor pendidikan.',
                icon: BookOpen
              },
              { 
                title: 'RKAS Berbasis Prioritas', 
                desc: 'Alokasi anggaran presisi. Platform memastikan setiap rupiah merujuk langsung pada penyelesaian masalah prioritas sekolah.',
                icon: Wallet
              },
              { 
                title: 'Administrasi & Surat Menyurat', 
                desc: 'Digitalisasi manajemen persuratan. Produksi dokumen otomatis lengkap dengan tata naskah, sistem penomoran, dan arsip terpusat.',
                icon: Mail
              },
              { 
                title: 'Monitoring Program', 
                desc: 'Visibilitas real-time untuk realisasi kegiatan dan serapan anggaran. Mencegah hambatan eksekusi sebelum menjadi temuan kepatuhan.',
                icon: Activity
              },
              { 
                title: 'Kolaborasi Multi Workspace', 
                desc: 'Ruang kerja aman untuk Kepala Sekolah, Bendahara, Guru, dan Dinas. Alur persetujuan digital transparan tanpa kertas.',
                icon: Users
              }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-white text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed text-base">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mengapa Tampuyak */}
      <section id="why" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-3">Nilai Strategis</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold">Mengapa TAMPUYAK</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: 'Single Source of Truth', desc: 'Satu data terpusat. Perubahan pada satu tahap perencanaan akan secara otomatis memperbarui dokumen terkait secara akurat.', icon: Layers },
              { title: 'Data-driven Planning', desc: 'Setiap perencanaan dipastikan berdasar pada akar masalah yang teridentifikasi langsung dari Rapor Pendidikan nasional.', icon: BarChart3 },
              { title: 'Integrated Documents', desc: 'Menghilangkan inkonsistensi. KSP, RKJM, RKT, dan RKAS terangkai sebagai satu kesatuan dokumen utuh yang selaras.', icon: FileText },
              { title: 'Automatic Workflow', desc: 'Alur kerja, disposisi, dan sistem persetujuan berjalan otomatis mengikuti hierarki birokrasi yang sah.', icon: RefreshCw },
              { title: 'Enterprise Security', desc: 'Keamanan data pemerintah tingkat tinggi. Isolasi data antar entitas sekolah yang ketat dan otorisasi berlapis.', icon: Shield },
              { title: 'Multi Workspace', desc: 'Akses disesuaikan peran. Kepala Sekolah, Guru, Operator, dan Bendahara memiliki antarmuka yang terfokus pada tupoksi.', icon: Briefcase }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                className="flex flex-col"
              >
                <div className="w-14 h-14 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
                  <item.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-100 mb-3">{item.title}</h4>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Solusi Ekosistem Pendidikan</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              TAMPUYAK OS menyediakan ruang kerja khusus yang dioptimalkan untuk setiap pemangku kepentingan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { role: 'Kepala Sekolah', desc: 'Pemantauan komprehensif, persetujuan strategis, dan evaluasi kinerja secara real-time.', icon: Briefcase },
              { role: 'Guru', desc: 'Fokus pada pedagogi dengan dukungan dokumen perencanaan pembelajaran yang terintegrasi.', icon: GraduationCap },
              { role: 'Operator', desc: 'Kemudahan sinkronisasi data, otomatisasi pelaporan, dan manajemen administrasi tersentralisasi.', icon: Monitor },
              { role: 'Pengawas', desc: 'Akses audit terstruktur untuk verifikasi dokumen dan penilaian kinerja yang lebih objektif.', icon: Shield },
              { role: 'Dinas Pendidikan', desc: 'Dashboard agregasi untuk memantau kepatuhan dan tren kualitas pendidikan di tingkat daerah.', icon: Building2 }
            ].map((user, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                  <user.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-3">{user.role}</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{user.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-blue-600 to-blue-600"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Standar Baru Tata Kelola Sekolah
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
            Gunakan platform resmi TAMPUYAK OS untuk memastikan perencanaan, pelaksanaan, dan evaluasi sekolah Anda berjalan sesuai standar nasional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-slate-50 px-8 py-4.5 rounded-full text-base font-bold transition-all shadow-lg">
              Daftarkan Sekolah
            </Link>
            <a href="#ecosystem" className="w-full sm:w-auto bg-transparent text-white hover:bg-white/10 px-8 py-4.5 rounded-full text-base font-bold transition-all border border-blue-400">
              Lihat Demo Platform
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img src={MASCOT_URL} alt="Tampuyak OS" className="w-10 h-10 object-contain grayscale opacity-80" />
                <span className="text-lg font-extrabold text-slate-800 tracking-tight">TAMPUYAK</span>
              </div>
              <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                Tata Kelola Administrasi dan Manajemen Pendidikan Upaya Akselerasi Kualitas.
              </p>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Versi 1.0.0
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Legal</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Akses</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-600">
                <li><Link to="/login" className="hover:text-blue-600 transition-colors">Portal Masuk</Link></li>
                <li><Link to="/register" className="hover:text-blue-600 transition-colors">Registrasi Sekolah</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} Hak Cipta Dilindungi. Platform Pemerintahan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
