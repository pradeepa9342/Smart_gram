'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Tractor, Info, CheckCircle2, ShoppingBag, Leaf, Wrench, Sprout, Tag, CloudRain } from 'lucide-react';
import CropRecommendation from '@/components/ai/CropRecommendation';

export default function AgriculturePage() {
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('smartgram-agriculture');
      if (saved) setCrops(JSON.parse(saved));
      else {
        setCrops([
          { id: 1, name: language === 'en' ? 'Paddy' : 'நெல்', season: 'Samba', seeds: 'Available', fertilizer: 'Available', price: '₹2200/quintal' },
          { id: 2, name: language === 'en' ? 'Groundnut' : 'நிலக்கடலை', season: 'Thai Pattam', seeds: 'Out of Stock', fertilizer: 'Available', price: '₹6000/quintal' },
          { id: 3, name: language === 'en' ? 'Sugarcane' : 'கரும்பு', season: 'Annual', seeds: 'Available', fertilizer: 'Limited', price: '₹2850/ton' },
        ]);
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [language]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-700">
        <header className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
              <Sprout size={16} />
              {language === 'en' ? 'Agriculture Hub' : 'விவசாய மையம்'}
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.nav.agriculture}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
              {language === 'en' 
                ? 'Check seed stock, fertilizer status and current market prices.' 
                : 'விதை இருப்பு, உர நிலை மற்றும் தற்போதைய சந்தை விலைகளை சரிபார்க்கவும்.'}
            </p>
          </div>
          <div className="bg-emerald-100/50 dark:bg-emerald-900/20 p-4 rounded-3xl border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-4">
             <div className="bg-emerald-600 text-white p-3 rounded-2xl">
               <CloudRain size={24} />
             </div>
             <div>
                <div className="text-slate-900 dark:text-emerald-100 font-bold">{language === 'en' ? 'Suggested for Monsoon' : 'பருவமழைக்கான பரிந்துரை'}</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-medium">{language === 'en' ? 'Samba Paddy (Co-51)' : 'சம்பா நெல் (Co-51)'}</div>
             </div>
          </div>
        </header>

        <section className="mb-16">
          <CropRecommendation />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 overflow-hidden group hover:scale-[1.02] transition-all">
              <div className="bg-emerald-600 p-8 text-white relative flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest">{crop.season}</div>
                  <h3 className="text-2xl font-black">{crop.name}</h3>
                </div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-xl">
                  <Tractor size={24} />
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between group-hover:px-2 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 p-2 rounded-xl">
                      <Leaf size={20} />
                    </div>
                    <span className="font-bold text-slate-600 dark:text-slate-300">{language === 'en' ? 'Seeds' : 'விதைகள்'}</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${crop.seeds === 'Available' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                    {crop.seeds}
                  </span>
                </div>

                <div className="flex items-center justify-between group-hover:px-2 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-2 rounded-xl">
                      <Wrench size={20} />
                    </div>
                    <span className="font-bold text-slate-600 dark:text-slate-300">{language === 'en' ? 'Fertilizer' : 'உரம்'}</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${crop.fertilizer === 'Available' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
                    {crop.fertilizer}
                  </span>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Tag size={18} />
                    <span className="text-sm font-bold uppercase tracking-widest">{language === 'en' ? 'Market Rate' : 'சந்தை விலை'}</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {crop.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-16 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-100 dark:shadow-black/20 border border-slate-50 dark:border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full translate-x-1/2 -translate-y-1/2" />
             <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-6 rounded-[2rem] shadow-inner">
                   <Info size={40} />
                </div>
                <div className="space-y-2 flex-1 text-center md:text-left">
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white">{language === 'en' ? 'Government Assistance' : 'அரசு உதவி'}</h2>
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
                     {language === 'en' 
                        ? 'Subsidies are currently active for Organic Fertilizers. Contact your local agriculture office for more details.' 
                        : 'இயற்கை உரங்களுக்கு தற்போது மானியங்கள் செயல்படுகின்றன. கூடுதல் விவரங்களுக்கு உங்கள் உள்ளூர் விவசாய அலுவலகத்தைத் தொடர்பு கொள்ளவும்.'}
                   </p>
                </div>
                <button 
                  onClick={() => alert(language === 'en' ? 'Registration Request Sent! We will contact you soon.' : 'பதிவு கோரிக்கை அனுப்பப்பட்டது! விரைவில் உங்களைத் தொடர்புகொள்வோம்.')}
                  className="bg-slate-900 dark:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-xl active:scale-95"
                >
                   <ShoppingBag size={20} />
                   {language === 'en' ? 'Register Req' : 'தேவையை பதிவுசெய்'}
                </button>
             </div>
        </section>
      </main>
    </div>
  );
}
