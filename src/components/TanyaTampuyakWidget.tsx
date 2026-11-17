import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, MessageSquare, Maximize2 } from 'lucide-react';

interface TanyaTampuyakWidgetProps {
  settings?: any;
}

export const TanyaTampuyakWidget: React.FC<TanyaTampuyakWidgetProps> = ({ settings }) => {
  const planning = settings?.planning;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Halo! Ulun Tampuyak, asisten pintar pian. Ada yang kawan ulun bantu gasan KSP, RKJM, RKT, atawa RKAS pian hari ini?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mascotUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen, isMinimized]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      const lowerInput = userMessage.toLowerCase();
      let response = "";
      
      // Ambil data asli dari aplikasi
      const rkjmItems = planning?.rkjm || [];
      const rktItems = planning?.rkt || [];
      const rkasItems = planning?.rkas || [];
      const prioritasStrings = settings?.analisis?.data?.prioritas || [];
      const prioritasObjects = settings?.decisionEngine?.data?.prioritas || [];
      const prioritas = prioritasObjects.length > 0 ? prioritasObjects : prioritasStrings;
      const visi = settings?.identitas?.visi;
      const schoolName = settings?.school?.name || "sekolah pian";
      const principalName = settings?.principal?.name;
      const npsn = settings?.school?.npsn;
      const akreditasi = settings?.school?.akreditasi;
      
      // Calculate totals based on real data
      const totalRkasAnggaran = rkasItems.reduce((acc: number, curr: any) => acc + (curr.anggaran || 0), 0);
      const totalKegiatanRkjm = rkjmItems.length;
      
      if (lowerInput.includes('ekstrakurikuler') && lowerInput.includes('pramuka')) {
        response = "Sip! Gasan KSP, deskripsi Ekstrakurikuler Pramuka kawa ditulis kaya ini:\n\n'Ekstrakurikuler Pramuka merupakan kegiatan wajib yang bertujuan untuk membentuk karakter pancasila, kedisiplinan, kemandirian, dan jiwa kepemimpinan peserta didik. Kegiatan ini dilaksanakan rutin setiap minggu, mencakup latihan keterampilan kepramukaan (tali-temali, sandi, baris-berbaris), serta penanaman nilai-nilai moral dan cinta tanah air.'";
      } else if (lowerInput.includes('total anggaran') || (lowerInput.includes('anggaran') && lowerInput.includes('rkas'))) {
        if (totalRkasAnggaran > 0) {
          response = `Berdasarkan data RKAS yang sudah pian isi, total anggaran saat ini adalah Rp ${totalRkasAnggaran.toLocaleString('id-ID')}.`;
        } else {
          response = "Berdasarkan data saat ini, belum ada anggaran yang diinput ke dalam RKAS pian. Silakan isi anggaran di menu Dokumen Sekolah -> Penyusunan RKAS.";
        }
      } else if (lowerInput.includes('kepala sekolah') || lowerInput.includes('kepsek')) {
        if (principalName) {
           response = `Kepala Sekolah nang tercatat di sistem gasan ${schoolName} adalah Bapak/Ibu ${principalName}.`;
        } else {
           response = `Data Kepala Sekolah balum diisi. Pian kawa malengkapinya di menu Data Sekolah -> Kepala Sekolah.`;
        }
      } else if (lowerInput.includes('profil sekolah') || lowerInput.includes('data sekolah') || lowerInput.includes('npsn')) {
         let info = `Profil ${schoolName}:\n`;
         if (npsn) info += `- NPSN: ${npsn}\n`;
         if (akreditasi) info += `- Akreditasi: ${akreditasi}\n`;
         response = npsn ? info + "\nPastikan data ngini sasuai lawan Dapodik." : "Data profil sekolah balum langkap. Silakan cek menu Data Sekolah.";
      } else if ((lowerInput.includes('rekom') || lowerInput.includes('rekomendasi') || lowerInput.includes('kegiatan') || lowerInput.includes('program')) && (lowerInput.includes('rkjm') || lowerInput.includes('rkas') || lowerInput.includes('rkt') || lowerInput.includes('prioritas') || lowerInput.includes('rapor'))) {
        if (prioritas.length > 0) {
          const formattedPrio = prioritas.slice(0,3).map((p: any, i: number) => {
            if (typeof p === 'string') return `${i+1}. ${p}`;
            return `${i+1}. ${p.tujuan || p.dimensi || p.masalah || 'Peningkatan Kualitas'}`;
          }).join('\n');
          response = `Berdasarkan data Rapor Pendidikan ${schoolName}, Ulun merekomendasikan fokus pada masalah prioritas pian, yaitu:\n${formattedPrio}\n\nMasukkan poin di atas ke dalam program RKJM atau RKT pian.`;
        } else if (totalKegiatanRkjm > 0) {
          response = `Saat ini pian sudah baisi ${totalKegiatanRkjm} kegiatan di RKJM. Coba fokus turunkan kegiatan tersebut ke RKT dan buatkan rincian anggarannya di RKAS.`;
        } else {
          response = "Gasan perencanaan RKJM dan turunan RKT/RKAS, Ulun merekomendasikan fokus pada:\n\n1. Peningkatan Literasi dan Numerasi\n2. Penguatan Karakter Profil Pelajar Pancasila\n3. Optimalisasi Lingkungan Belajar\n\nPian kawa manambahkan kegiatan ini langsung di menu Dokumen Perencanaan!";
        }
      } else if (lowerInput.includes('visi') || lowerInput.includes('misi')) {
        if (visi) {
          response = `Visi satuan pendidikan pian saat ini sudah terekam yaitu:\n"${visi}".\n\nPastikan visi ini menjadi landasan gasan semua program kerja di RKT wan RKJM pian lah!`;
        } else {
           response = `Saat ini Visi gasan ${schoolName} belum diatur di sistem. Pian kawa mambuat Visi nang sejalan lawan Profil Pelajar Pancasila di menu Data Sekolah.`;
        }
      } else if (lowerInput.includes('halo') || lowerInput.includes('hai') || lowerInput.includes('assalamualaikum')) {
        response = `Halo! Ulun Tampuyak, siap mambantu pian menyusun dokumen KSP, RKJM, RKT, wan RKAS gasan ${schoolName}. Nak betakun apa hari ini?`;
      } else if (lowerInput.includes('rkt') && lowerInput.includes('prioritas')) {
        if (prioritas.length > 0) {
          const formattedPrio = prioritas.slice(0,3).map((p: any) => typeof p === 'string' ? `- ${p}` : `- ${p.dimensi || p.masalah || 'Masalah kualitas'}`).join('\n');
          response = `Prioritas RKT pian tahun ini sebaiknya fokus pada:\n${formattedPrio}\n\nData ini diambil langsung dari Analisis Rapor Pendidikan pian.`;
        } else {
          response = "Berdasarkan sistem, pian belum melakukan analisis prioritas Rapor Pendidikan. Silakan ke menu Analisis Sekolah gasan menentukan prioritas sebelum manyusun RKT.";
        }
      } else if (lowerInput.includes('ksp') || lowerInput.includes('kurikulum')) {
         response = "Gasan Kurikulum Satuan Pendidikan (KSP), pastikan pian sudah menyusun Karakteristik Satuan Pendidikan, Visi, Misi, Tujuan, serta Pengorganisasian Pembelajaran (Intrakurikuler, Kokurikuler, Ekstrakurikuler) sesuai dengan konteks dan rapor pendidikan sekolah pian.";
      } else {
        const fallbacks = [
          "Ulun mencatat pertanyaan pian. Namun, gasan detail spesifik nang itu, coba pariksa ulang isian di menu Dokumen Perencanaan.",
          `Nah, pertanyaan nang bagus. Pian kawa malihat atawa manyusun detail bagian ngini langsung di menu Dokumen Perencanaan gasan ${schoolName}.`,
          "Sip, Ulun mencatat ngini! Pastikan poin ini diakomodir saat pian manyusun RKJM, RKT, atawa RKAS.",
          "Gasan pertanyaan ngini, Ulun menyarankan pian gasan merujuk ka Rapor Pendidikan sekolah pian sabagai basis data utama penyusunan program."
        ];
        response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="print:hidden fixed bottom-6 right-6 z-50 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform border-4 border-amber-100 group"
      >
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce shadow-sm">
          Tanya Ulun!
        </div>
        <img src={mascotUrl} alt="Tanya Tampuyak" className="w-12 h-12 object-contain group-hover:rotate-12 transition-transform drop-shadow-md" />
      </button>
    );
  }

  return (
    <div className={`print:hidden fixed z-50 bg-white border border-slate-200 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${isMinimized ? 'bottom-6 right-6 w-72 h-14 rounded-2xl' : 'bottom-6 right-6 w-96 h-[500px] rounded-2xl sm:bottom-6 sm:right-6'}`}>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 flex items-center justify-between shadow-sm cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-full shadow-inner">
            <img src={mascotUrl} alt="Tanya Tampuyak" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm leading-tight">Tanya Tampuyak</h3>
            <p className="text-amber-100 text-[10px]">Asisten Pintar Perencanaan</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 text-white/80 hover:bg-white/20 hover:text-white rounded-lg transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 text-white/80 hover:bg-white/20 hover:text-white rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm shadow-sm' : 'bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <img src={mascotUrl} alt="Tampuyak" className="w-4 h-4" />
                      <span className="text-[10px] font-bold text-amber-600">Tampuyak</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
              <textarea maxLength={2000}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya ulun tentang KSP, RKT, dll..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none px-3 py-2.5 text-sm"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 m-0.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-amber-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-slate-400">Tanya Tampuyak didukung oleh Data Sekolah Pian</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
