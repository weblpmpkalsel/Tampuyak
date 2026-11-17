import React, { useState, useEffect } from 'react';
import { Lightbulb, Check, Eye, EyeOff, Info } from 'lucide-react';
import { KnowledgeCategory } from '../../knowledge/packs/KnowledgePackModel';
import { SuggestionService } from '../../knowledge/suggestion/SuggestionService';
import { KnowledgePackRepository } from '../../knowledge/packs/KnowledgePackRepository';
import { SuggestionResult } from '../../knowledge/suggestion/SuggestionModel';

// Initialize the repository and service globally to avoid recreating them
const repository = new KnowledgePackRepository();
repository.initialize();
const suggestionService = new SuggestionService(repository);

export interface KnowledgeSuggestionPanelProps {
  category: KnowledgeCategory;
  context: any;
  onSelect: (text: string, mode: 'replace' | 'append') => void;
}

export const KnowledgeSuggestionPanel: React.FC<KnowledgeSuggestionPanelProps> = ({ category, context, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [insertingId, setInsertingId] = useState<string | null>(null);
  const [insertMode, setInsertMode] = useState<'replace' | 'append'>('replace');

  useEffect(() => {
    setLoading(true);
    // Process asynchronously to avoid blocking UI during initial render
    setTimeout(() => {
      const results = suggestionService.getCategorySuggestions(category, { context });
      setSuggestions(results);
      setLoading(false);
    }, 50);
  }, [category, context]);

  return (
    <div className="mb-4">
      {!isOpen && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-blue-900">
                💡 Rekomendasi Penulisan
              </span>
              <span className="block text-xs text-blue-700 mt-0.5">
                {loading ? 'Mencari rekomendasi...' : `Kami menemukan ${suggestions.length} contoh rekomendasi yang sesuai.`}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-xs font-bold bg-white text-blue-700 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Lihat Rekomendasi
          </button>
        </div>
      )}

      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Rekomendasi Penulisan</h3>
                <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                  Temukan contoh penulisan yang sesuai dengan karakteristik sekolah Anda. Pilih salah satu sebagai dasar, lalu sesuaikan dengan kondisi sekolah.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
          <div className="p-5 bg-slate-50/50 max-h-[500px] overflow-y-auto space-y-4">
             {loading ? (
                <div className="text-center py-12 text-sm text-slate-500 animate-pulse">Memuat rekomendasi...</div>
             ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, idx) => (
                  <div key={suggestion.id || idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-800">{suggestion.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {suggestion.source === 'OFFICIAL' ? 'KEMENDIKBUDRISTEK' : suggestion.source}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Kecocokan: {Math.min(100, Math.round(suggestion.confidenceScore))}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      {previewId === suggestion.id ? suggestion.recommendedText : (suggestion.summary || suggestion.recommendedText.substring(0, 150) + '...')}
                    </p>
                    
                    {suggestion.tags && suggestion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {suggestion.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setInsertingId(suggestion.id);
                          setInsertMode('replace'); // Default
                        }}
                        className="flex items-center gap-1.5 text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        Gunakan
                      </button>
                      <button
                        onClick={() => setPreviewId(previewId === suggestion.id ? null : suggestion.id)}
                        className="flex items-center gap-1.5 text-sm font-bold bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        {previewId === suggestion.id ? (
                          <><EyeOff className="w-4 h-4" /> Tutup Pratinjau</>
                        ) : (
                          <><Eye className="w-4 h-4" /> Pratinjau</>
                        )}
                      </button>
                    </div>

                    {insertingId === suggestion.id && (
                      <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                        <p className="text-sm font-bold text-slate-800 mb-3">Pilih Opsi Penyisipan Teks:</p>
                        <div className="space-y-2 mb-4">
                          <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer p-2.5 rounded-lg hover:bg-blue-100/50 transition-colors border border-transparent hover:border-blue-200">
                            <input 
                              type="radio" 
                              name={`insertMode-${suggestion.id}`} 
                              value="replace" 
                              checked={insertMode === 'replace'} 
                              onChange={() => setInsertMode('replace')}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" 
                            />
                            <span className="font-medium">Gantikan teks yang ada</span>
                          </label>
                          <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer p-2.5 rounded-lg hover:bg-blue-100/50 transition-colors border border-transparent hover:border-blue-200">
                            <input 
                              type="radio" 
                              name={`insertMode-${suggestion.id}`} 
                              value="append" 
                              checked={insertMode === 'append'} 
                              onChange={() => setInsertMode('append')}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" 
                            />
                            <span className="font-medium">Tambahkan ke teks yang ada</span>
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { 
                              onSelect(suggestion.recommendedText, insertMode); 
                              setIsOpen(false); 
                              setInsertingId(null); 
                            }} 
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            Konfirmasi & Terapkan
                          </button>
                          <button 
                            onClick={() => setInsertingId(null)} 
                            className="px-4 py-2 bg-white text-slate-600 border border-slate-200 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
             ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                    <Info className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Tidak ditemukan contoh yang sesuai. Anda tetap dapat menulis sendiri.</p>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
