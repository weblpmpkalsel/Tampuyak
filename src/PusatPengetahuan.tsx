import React, { useState, useEffect } from "react";
import { BookOpen, Search, FileText, Bookmark, Info, CheckCircle2, AlertTriangle, Link as LinkIcon, ChevronRight } from "lucide-react";
import knowledgeRegistry from "./knowledge_registry.json";

export const PusatPengetahuanView = ({ initialArticleId }: { initialArticleId?: string }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialArticleId || null);

  const categories = [
    { id: "all", label: "Semua Topik" },
    { id: "perencanaan", label: "Perencanaan (RKJM/RKT/RKAS)" },
    { id: "kurikulum", label: "Kurikulum (KSP)" },
    { id: "data", label: "Data Sekolah" },
    { id: "evaluasi", label: "Evaluasi & Monitoring" },
    { id: "regulasi", label: "Regulasi & Dasar Hukum" },
    { id: "faq", label: "Tanya Jawab (FAQ)" },
  ];

  useEffect(() => {
    if (initialArticleId) {
      setSelectedArticleId(initialArticleId);
    }
  }, [initialArticleId]);

  useEffect(() => {
    const handleOpenKnowledge = (e: any) => {
      if (e.detail) {
        setSelectedArticleId(e.detail);
      }
    };
    window.addEventListener('openKnowledge', handleOpenKnowledge);
    return () => window.removeEventListener('openKnowledge', handleOpenKnowledge);
  }, []);

  const articles = knowledgeRegistry;

  const filteredArticles = articles.filter(a => 
    (activeCategory === "all" || a.category === activeCategory) &&
    (a.Title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     a.Purpose.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Knowledge Center
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Pusat Pengetahuan dan Panduan Lengkap
          </p>
        </div>
        {!selectedArticleId && (
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input maxLength={255}
              type="text"
              placeholder="Cari panduan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {selectedArticleId ? (
        <div className="flex-1 overflow-auto animate-in fade-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => setSelectedArticleId(null)}
            className="mb-4 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            &larr; Kembali ke Daftar
          </button>
          
          {selectedArticle ? (
            <div className="bg-white rounded-md border border-slate-300 p-8 shadow-sm">
              <h3 className="text-3xl font-black text-slate-900 mb-2">{selectedArticle.Title}</h3>
              <p className="text-slate-600 text-lg mb-8">{selectedArticle.Summary}</p>
              
              <div className="space-y-8 text-sm">
                <div className="bg-slate-50 p-6 rounded-md border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-base">
                    <Info className="w-5 h-5 text-blue-500" /> Tujuan Utama
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-base">{selectedArticle.Purpose}</p>
                </div>

                {selectedArticle["Step-by-step guidance"] && selectedArticle["Step-by-step guidance"].length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Langkah-langkah
                    </h4>
                    <div className="space-y-4">
                      {selectedArticle["Step-by-step guidance"].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-md border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-slate-700 pt-1.5 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedArticle["Common mistakes"] && selectedArticle["Common mistakes"].length > 0 && (
                  <div className="bg-rose-50/50 p-6 rounded-md border border-rose-100">
                    <h4 className="font-bold text-rose-900 mb-4 flex items-center gap-2 text-base">
                      <AlertTriangle className="w-5 h-5 text-rose-500" /> Kesalahan Umum
                    </h4>
                    <ul className="space-y-3">
                      {selectedArticle["Common mistakes"].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-rose-700/90">
                          <span className="text-rose-500 font-bold mt-0.5 shrink-0 text-lg">✕</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-200">
                  {selectedArticle["Related regulations"] && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-blue-500" /> Regulasi Terkait
                      </h4>
                      <p className="text-slate-600 italic bg-slate-50 p-4 rounded-md border border-slate-200">{selectedArticle["Related regulations"]}</p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {selectedArticle["Related templates"] && selectedArticle["Related templates"].length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-amber-500" /> Template Terkait
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedArticle["Related templates"].map((item, i) => (
                            <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-md text-xs font-bold border border-amber-100">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedArticle["Related workspace"] && selectedArticle["Related workspace"].length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                          <Bookmark className="w-4 h-4 text-emerald-500" /> Ruang Kerja Terkait
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedArticle["Related workspace"].map((item, i) => (
                            <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-md border border-slate-300 p-12 text-center shadow-sm">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Konten sedang disiapkan</h3>
              <p className="text-slate-600">Materi untuk topik ini sedang dalam proses penyusunan.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`whitespace-nowrap px-4 py-2 rounded text-sm font-bold transition-all ${activeCategory === c.id ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-300"}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8">
            {filteredArticles.length > 0 ? filteredArticles.map((article) => (
              <div 
                key={article.id} 
                onClick={() => setSelectedArticleId(article.id)}
                className="bg-white rounded-md border border-slate-300 p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider">
                      {categories.find(c => c.id === article.category)?.label || article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{article.Title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{article.Summary}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-blue-600 text-sm font-bold">
                  <span>Baca panduan lengkap</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )) : (
              <div className="col-span-full bg-white rounded-md border border-slate-300 p-12 text-center text-slate-600 shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Konten sedang disiapkan</h3>
                <p>Tidak ada panduan yang cocok dengan pencarian Anda.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
