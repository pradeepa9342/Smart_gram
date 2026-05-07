'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { Tractor, Plus, Edit, Trash2, Sprout, Tag, Leaf, Info, Save, X } from 'lucide-react';
import { INITIAL_CROPS } from '@/lib/mockData';
import { useNotifications } from '@/context/NotificationContext';

export default function AdminAgriculture() {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();
  const [isAdding, setIsAdding] = useState(false);
  const [crops, setCrops] = useState<any[]>([]);
  const [newCrop, setNewCrop] = useState<any>({ name: '', season: '', seeds: 'Available', fertilizer: 'Available', price: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('smartgram-agriculture');
    if (saved) setCrops(JSON.parse(saved));
    else setCrops(INITIAL_CROPS);
    setIsLoading(false);
  }, []);

  const saveToLocal = (newCrops: any[]) => {
    setCrops(newCrops);
    localStorage.setItem('smartgram-agriculture', JSON.stringify(newCrops));
  };

  const handleAdd = () => {
    if (newCrop.name && newCrop.price) {
      const updated = [{ id: Date.now(), ...newCrop }, ...crops];
      saveToLocal(updated);

      // Notify USERS
      addNotification({
        title: 'New Crop Added',
        message: `Admin has added ${newCrop.name} to the Agriculture portal. Check it out!`,
        type: 'success',
        target: 'user'
      });

      setNewCrop({ name: '', season: '', seeds: 'Available', fertilizer: 'Available', price: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: number) => {
    const updated = crops.filter((c: any) => c.id !== id);
    saveToLocal(updated);
  };

  const handleEditSave = (id: number, updated: any) => {
    const newCrops = crops.map((c: any) => c.id === id ? { ...c, ...updated } : c);
    saveToLocal(newCrops);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-500">
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-8 border-slate-200 dark:border-slate-800">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{language === 'en' ? 'Agriculture Management' : 'விவசாய மேலாண்மை'}</h1>
            <p className="text-slate-400 dark:text-slate-500 font-medium">{language === 'en' ? 'Manage village crop data and prices' : 'கிராமப்புற விளையச்சல் மற்றும் விலை விவரங்கள்'}</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${isAdding ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? 'Cancel' : (language === 'en' ? 'Add New Crop' : 'புதிய பயிரைச் சேர்')}
          </button>
        </header>

        {isAdding && (
          <section className="mb-12 animate-in slide-in-from-top-4 duration-300">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/10 border border-emerald-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{language === 'en' ? 'Crop Name' : 'பெயர்'}</label>
                   <input 
                     value={newCrop.name}
                     onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" 
                     placeholder="e.g. Paddy"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{language === 'en' ? 'Season' : 'பருவம்'}</label>
                   <input 
                     value={newCrop.season}
                     onChange={(e) => setNewCrop({...newCrop, season: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-white/5 p-3 rounded-xl dark:text-white" 
                     placeholder="e.g. Samba"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{language === 'en' ? 'Price' : 'விலை'}</label>
                   <input 
                     value={newCrop.price}
                     onChange={(e) => setNewCrop({...newCrop, price: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-white/5 p-3 rounded-xl dark:text-white" 
                     placeholder="₹2000"
                   />
                </div>
                <button 
                  onClick={handleAdd}
                  className="bg-emerald-600 text-white w-full py-4 rounded-xl font-bold shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                >
                   {language === 'en' ? 'Save Crop' : 'சேமி'}
                </button>
             </div>
          </section>
        )}

        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 overflow-hidden min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-emerald-100 dark:border-emerald-900 border-t-emerald-600 rounded-full animate-spin" />
               <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">{language === 'en' ? 'Synchronizing Data...' : 'தரவு ஒத்திசைக்கப்படுகிறது...'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-white/5">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{language === 'en' ? 'Crop Name' : 'பயிர்'}</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{language === 'en' ? 'Season' : 'பருவம்'}</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{language === 'en' ? 'Seeds' : 'விதைகள்'}</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{language === 'en' ? 'Price' : 'விலை'}</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{language === 'en' ? 'Actions' : 'நடவடிக்கை'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {crops.map((crop: any) => (
                  <tr key={crop.id} className="group hover:bg-emerald-50/50 transition-colors">
                    {editingId === crop.id ? (
                      <>
                        <td className="px-8 py-5"><input className="border rounded p-1" defaultValue={crop.name} id={`name-${crop.id}`} /></td>
                        <td className="px-8 py-5"><input className="border rounded p-1 w-24" defaultValue={crop.season} id={`season-${crop.id}`} /></td>
                        <td className="px-8 py-5">
                          <select className="border rounded p-1" id={`seeds-${crop.id}`} defaultValue={crop.seeds}>
                            <option>Available</option>
                            <option>Out of Stock</option>
                          </select>
                        </td>
                        <td className="px-8 py-5"><input className="border rounded p-1 w-24" defaultValue={crop.price} id={`price-${crop.id}`} /></td>
                        <td className="px-8 py-5 text-right space-x-2">
                           <button onClick={() => {
                             const updated = {
                               name: (document.getElementById(`name-${crop.id}`) as HTMLInputElement).value,
                               season: (document.getElementById(`season-${crop.id}`) as HTMLInputElement).value,
                               seeds: (document.getElementById(`seeds-${crop.id}`) as HTMLSelectElement).value,
                               price: (document.getElementById(`price-${crop.id}`) as HTMLInputElement).value,
                             };
                             handleEditSave(crop.id, updated);
                           }} className="text-emerald-600 font-bold">Save</button>
                           <button onClick={() => setEditingId(null)} className="text-slate-400">Exit</button>
                        </td>
                      </>
                    ) : (
                      <>
                         <td className="px-8 py-5">
                           <div className="flex items-center gap-3">
                               <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2 rounded-lg">
                                  <Tractor size={18} />
                               </div>
                               <span className="font-bold text-slate-900 dark:text-white">{crop.name}</span>
                           </div>
                         </td>
                         <td className="px-8 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">{crop.season}</td>
                         <td className="px-8 py-5">
                           <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${crop.seeds === 'Available' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                               {crop.seeds}
                           </span>
                         </td>
                         <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{crop.price}</td>
                         <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100">
                               <button onClick={() => setEditingId(crop.id)} className="p-2.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all">
                                 <Edit size={20} />
                               </button>
                               <button onClick={() => handleDelete(crop.id)} className="p-2.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all">
                                 <Trash2 size={20} />
                               </button>
                           </div>
                         </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
