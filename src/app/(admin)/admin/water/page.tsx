'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Droplets, 
  Activity, 
  RefreshCw, 
  Save, 
  Waves, 
  AlertCircle, 
  CheckCircle2, 
  Edit3, 
  X, 
  MapPin, 
  Settings2 
} from 'lucide-react';
import { INITIAL_WATER_TANKS } from '@/lib/mockData';

export default function AdminWater() {
  const { language } = useLanguage();
  const [tanks, setTanks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', location: '', level: 0 });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smartgram-water');
    if (saved) setTanks(JSON.parse(saved));
    else setTanks(INITIAL_WATER_TANKS);
    setIsLoading(false);
  }, []);

  const saveToLocal = (newTanks: any[]) => {
    setTanks(newTanks);
    localStorage.setItem('smartgram-water', JSON.stringify(newTanks));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleUpdateLevel = (id: number, level: number) => {
    const updated = tanks.map(t => t.id === id ? { ...t, level, lastUpdated: 'Just now' } : t);
    saveToLocal(updated);
  };

  const startEditing = (tank: any) => {
    setEditingId(tank.id);
    setEditForm({ name: tank.name, location: tank.location, level: tank.level });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = () => {
    const updated = tanks.map(t => 
      t.id === editingId ? { ...t, ...editForm, lastUpdated: 'Just now' } : t
    );
    saveToLocal(updated);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-500">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-8 border-slate-200 dark:border-slate-800">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'en' ? 'Water Infrastructure' : 'நீர் உள்கட்டமைப்பு'}
            </h1>
            <p className="text-slate-400 dark:text-slate-500 font-medium">
              {language === 'en' 
                ? 'Monitor and manage village water supply levels.' 
                : 'கிராமப்புற நீர் விநியோக நிலைகளைக் கண்காணித்து நிர்வகிக்கவும்.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {showSuccess && (
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-sm animate-in slide-in-from-right-4 fade-in">
                  <CheckCircle2 size={16} />
                  {language === 'en' ? 'Changes Saved!' : 'மாற்றங்கள் சேமிக்கப்பட்டன!'}
               </div>
            )}
            <button onClick={() => window.location.reload()} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-sky-600 transition-all shadow-sm">
              <RefreshCw size={24} />
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 italic text-slate-400">
             Synchronizing Water Data...
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tanks.map((tank) => (
              <div key={tank.id} className={`bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20 border transition-all relative overflow-hidden group ${editingId === tank.id ? 'border-sky-500 ring-4 ring-sky-500/10' : 'border-slate-50 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900'}`}>
                {editingId === tank.id ? (
                  /* Edit Mode Interface */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Settings2 size={24} className="text-sky-500" />
                          {language === 'en' ? 'Edit Tank Details' : 'தொட்டி விவரங்களை மாற்று'}
                       </h3>
                       <button onClick={cancelEditing} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                          <X size={24} />
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tank Name</label>
                          <input 
                            type="text" 
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
                          <input 
                            type="text" 
                            value={editForm.location}
                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                          />
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 space-y-4">
                       <div className="flex items-center justify-between font-black text-slate-900 mb-2">
                          <span className="text-xs uppercase tracking-widest text-slate-400">Current Level</span>
                          <div className="flex items-center gap-2">
                             <input 
                               type="number" 
                               min="0" 
                               max="100" 
                               value={editForm.level}
                               onChange={(e) => setEditForm({...editForm, level: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))})}
                               className="w-20 px-3 py-2 bg-sky-50 text-sky-700 rounded-xl font-black text-center outline-none border border-sky-100"
                             />
                             <span className="font-black text-sky-500">%</span>
                          </div>
                       </div>
                       <input 
                         type="range"
                         min="0"
                         max="100"
                         value={editForm.level}
                         onChange={(e) => setEditForm({...editForm, level: parseInt(e.target.value)})}
                         className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
                       />
                    </div>

                    <button 
                      onClick={saveEditing}
                      className="w-full py-4 bg-sky-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-sky-900/20 hover:bg-sky-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    >
                       <Save size={20} />
                       {language === 'en' ? 'Apply changes' : 'மாற்றங்களைப் பயன்படுத்து'}
                    </button>
                  </div>
                ) : (
                  /* Display Mode Interface */
                  <>
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <div className="bg-sky-50 text-sky-600 p-4 rounded-2xl">
                             <Waves size={30} />
                          </div>
                          <div>
                             <h3 className="text-xl font-black text-slate-900">{tank.name}</h3>
                             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <MapPin size={12} />
                                {tank.location}
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => startEditing(tank)}
                            className="p-2.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                            title="Edit Details"
                          >
                             <Edit3 size={20} />
                          </button>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tank.level < 20 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                             {tank.level < 20 ? 'Low Level Alert' : 'Healthy Supply'}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between font-bold text-slate-600 uppercase text-xs tracking-widest">
                          <span>{language === 'en' ? 'Current Capacity' : 'தற்போதைய கொள்ளளவு'}</span>
                          <span className={`${tank.level < 20 ? 'text-rose-600' : 'text-slate-900'} text-2xl font-black`}>{tank.level}%</span>
                       </div>
                       <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ease-out ${tank.level < 20 ? 'bg-rose-500' : 'bg-sky-500'}`}
                            style={{ width: `${tank.level}%` }}
                          >
                             <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                          </div>
                       </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50 flex items-center gap-4">
                       <div className="flex-1 flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={tank.level}
                            onChange={(e) => handleUpdateLevel(tank.id, parseInt(e.target.value))}
                            className="flex-1 accent-sky-600 h-2"
                          />
                          <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-black text-sm text-sky-700 min-w-[50px] text-center">
                             {tank.level}%
                          </div>
                       </div>
                       <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer">
                          <Save size={20} />
                       </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
