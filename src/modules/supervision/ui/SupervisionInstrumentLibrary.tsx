import React, { useState, useEffect } from 'react';
import { FileSignature, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { SupervisionInstrument, RubricCategory, RubricItem } from '../types/SupervisionTypes';


export const SupervisionInstrumentLibrary = ({ onClose }: { onClose?: () => void }) => {
  const { repositories } = useSupervision();
  const instrumentRepo = repositories.getInstrumentRepository();
  const { applicationService } = useSupervision();
  const [instruments, setInstruments] = useState<SupervisionInstrument[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Draft Form State
  const [name, setName] = useState('');
  const [categories, setCategories] = useState<Array<{ id: string; name: string; weight: number }>>([]);
  const [items, setItems] = useState<Array<{ categoryId: string; description: string; maxScore: number }>>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    loadInstruments();
  }, []);

  const loadInstruments = async () => {
    const data = await instrumentRepo.findAll();
    setInstruments(data);
  };

  const handleAddCategory = () => {
    const newId = `cat-${Date.now()}`;
    setCategories([...categories, { id: newId, name: 'Kategori Baru', weight: 1 }]);
    setActiveCategory(newId);
  };

  const handleUpdateCategory = (id: string, name: string, weight: number) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name, weight } : c));
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setItems(items.filter(i => i.categoryId !== id));
    if (activeCategory === id) setActiveCategory(null);
  };

  const handleAddItem = (categoryId: string) => {
    setItems([...items, { categoryId, description: 'Indikator Baru', maxScore: 4 }]);
  };

  const handleUpdateItem = (idx: number, description: string, maxScore: number) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], description, maxScore };
    setItems(newItems);
  };

  const handleRemoveItem = (idx: number) => {
    const newItems = [...items];
    newItems.splice(idx, 1);
    setItems(newItems);
  };

  const handleSaveDraft = async () => {
    try {
      const instrument = applicationService.createInstrument({
        name,
        categories,
        items
      });
      await instrumentRepo.create(instrument);
      
      // Reset
      setShowForm(false);
      setName('');
      setCategories([]);
      setItems([]);
      setActiveCategory(null);
      
      loadInstruments();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] overflow-hidden mt-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 border-b border-[var(--color-eds-border)] flex items-center justify-between bg-slate-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-4">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Pustaka Instrumen Supervisi</h3>
            <p className="text-sm text-slate-500">Master Data: Kelola template rubrik dan indikator penilaian observasi.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold rounded-lg shadow-sm hover:bg-emerald-100 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Template Baru
            </button>
          )}
          {onClose && (
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Tutup
            </button>
          )}
        </div>
      </div>

      {showForm ? (
        <div className="p-6 space-y-6">
          {/* Instrument Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Instrumen <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Instrumen Supervisi Guru Kelas Tahun 2026"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories Sidebar */}
            <div className="md:col-span-1 border-r border-slate-200 pr-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800">Kategori Penilaian</h4>
                <button onClick={handleAddCategory} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {categories.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Belum ada kategori. Tambahkan kategori baru.</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li 
                      key={cat.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${activeCategory === cat.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-full mr-2">
                          <input 
                            type="text" 
                            value={cat.name} 
                            onChange={(e) => handleUpdateCategory(cat.id, e.target.value, cat.weight)} 
                            className="w-full text-sm font-bold bg-transparent border-none p-0 focus:ring-0 text-slate-800"
                            placeholder="Nama Kategori"
                            onClick={e => e.stopPropagation()}
                          />
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-slate-500 mr-2">Bobot:</span>
                            <input 
                              type="number" 
                              value={cat.weight} 
                              onChange={(e) => handleUpdateCategory(cat.id, cat.name, parseFloat(e.target.value) || 0)} 
                              className="w-16 text-xs border border-slate-300 rounded px-1 py-0.5"
                              step="0.1"
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRemoveCategory(cat.id); }}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Rubric Items */}
            <div className="md:col-span-2">
              {activeCategory ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Indikator Penilaian ({categories.find(c => c.id === activeCategory)?.name})</h4>
                    <button 
                      onClick={() => handleAddItem(activeCategory)} 
                      className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Indikator
                    </button>
                  </div>
                  
                  {items.filter(i => i.categoryId === activeCategory).length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      <p className="text-slate-500">Belum ada indikator di kategori ini.</p>
                      <button onClick={() => handleAddItem(activeCategory)} className="text-emerald-600 font-bold text-sm mt-2">Tambah Indikator Baru</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item, index) => item.categoryId === activeCategory && (
                        <div key={index} className="flex items-start bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="flex-grow mr-4">
                            <textarea
                              value={item.description}
                              onChange={e => handleUpdateItem(index, e.target.value, item.maxScore)}
                              placeholder="Deskripsi indikator..."
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 resize-none h-16"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Skala Max</label>
                            <input 
                              type="number"
                              value={item.maxScore}
                              onChange={e => handleUpdateItem(index, item.description, parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 border border-slate-300 rounded-lg text-sm"
                              min="1"
                            />
                          </div>
                          <button 
                            onClick={() => handleRemoveItem(index)}
                            className="ml-3 mt-6 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-400 font-medium text-center">
                    Pilih atau buat kategori di sebelah kiri <br/> untuk mengelola indikator.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-200 space-x-3">
            <button 
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleSaveDraft}
              disabled={!name || categories.length === 0}
              className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg shadow-sm hover:bg-slate-800 transition-colors flex items-center disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Simpan Draft
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {instruments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 font-medium">Belum ada instrumen supervisi yang dibuat.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instruments.map(inst => (
                <div key={inst.id} className="border border-slate-200 p-4 rounded-xl hover:border-emerald-300 transition-colors cursor-pointer bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">{inst.name}</h4>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">
                      {inst.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {inst.categories.length} Kategori &bull; {inst.items.length} Indikator
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
