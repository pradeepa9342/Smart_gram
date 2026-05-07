'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { Droplets, MapPin, Clock, ArrowUp, ArrowDown, Activity, Waves, Info, RefreshCw, CheckCircle, BrainCircuit } from 'lucide-react';
import { INITIAL_WATER_TANKS } from '@/lib/mockData';
import WaterPrediction from '@/components/ai/WaterPrediction';
import { useNotifications } from '@/context/NotificationContext';

export default function WaterPage() {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();
  const [tanks, setTanks] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate an AI-driven water alert after a few seconds
    const timer = setTimeout(() => {
       addNotification({
         title: 'AI Alert: Low Water Level',
         message: 'Main Tank A-12 is below 30%. Supply might be restricted tonight.',
         type: 'ai',
         target: 'user'
       });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('smartgram-water');
      if (saved) setTanks(JSON.parse(saved));
      else setTanks(INITIAL_WATER_TANKS);
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const current = localStorage.getItem('smartgram-water');
      const base = current ? JSON.parse(current) : INITIAL_WATER_TANKS;
      const updated = base.map((t: any) => ({
        ...t,
        level: Math.max(0, Math.min(100, t.level + (Math.random() > 0.5 ? 2 : -2))),
        lastUpdated: 'Just now'
      }));
      setTanks(updated);
      localStorage.setItem('smartgram-water', JSON.stringify(updated));
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-700">
        <header className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-widest">
              <Activity size={16} />
              {language === 'en' ? 'Live Monitoring' : 'நேரடி கண்காணிப்பு'}
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{language === 'en' ? 'Water Supply Status' : 'நீர் விநியோக நிலை'}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
              {language === 'en' 
                ? 'Monitor real-time water levels across village storage tanks.' 
                : 'கிராமப்புற சேமிப்புத் தொட்டிகளில் நிகழ்நேர நீர் நிலைகளைக் கண்காணிக்கவும்.'}
            </p>
          </div>
          <button 
            disabled={isRefreshing}
            onClick={handleRefresh}
            className="bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-white/5 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-sky-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
             <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
             {isRefreshing ? (language === 'en' ? 'Updating...' : 'புதுப்பிக்கிறது...') : (language === 'en' ? 'Refresh Dashboard' : 'புதுப்பிக்கவும்')}
          </button>
        </header>

        <section className="mb-16">
          <WaterPrediction />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {tanks.map((tank) => (
            <div key={tank.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl shadow-slate-100 dark:shadow-black/20 border border-slate-50 dark:border-white/5 group hover:border-sky-200 dark:hover:border-sky-800 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{tank.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-wide">
                    <MapPin size={16} className="text-sky-400" />
                    {tank.location}
                  </div>
                </div>
                <div className="bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 p-4 rounded-2xl flex flex-col items-center group-hover:scale-110 transition-transform">
                   <Droplets size={28} />
                   <span className="text-xs font-black mt-1 uppercase tracking-tighter">H2O</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-inner flex items-center px-4">
                  <div 
                    className={`absolute inset-0 transition-all duration-1000 ease-out border-r-4 ${tank.level > 70 ? 'bg-gradient-to-r from-sky-300 to-sky-500 border-sky-600' : tank.level > 30 ? 'bg-gradient-to-r from-sky-200 to-sky-400 border-sky-500' : 'bg-gradient-to-r from-rose-300 to-rose-500 border-rose-600'}`}
                    style={{ width: `${tank.level}%` }}
                  />
                  <div className="relative z-10 w-full flex justify-between items-center font-black text-lg">
                    <span className={tank.level < 40 ? 'text-slate-900' : 'text-white'}>{tank.level}%</span>
                    <span className="text-[10px] text-white/60 tracking-widest uppercase">Capacity</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider">
                        <Clock size={16} className="text-slate-300" />
                        {tank.lastUpdated}
                      </div>
                   </div>
                   <div className={`flex items-center gap-1.5 font-black uppercase tracking-wider px-3 py-1 rounded-lg ${tank.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : tank.trend === 'down' ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-slate-100'}`}>
                      {tank.trend === 'up' ? <ArrowUp size={16} /> : tank.trend === 'down' ? <ArrowDown size={16} /> : <Waves size={16} />}
                      {tank.trend}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-gradient-to-br from-sky-600 to-blue-800 p-1 rounded-[3rem] shadow-2xl shadow-sky-900/20">
           <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2.9rem] flex flex-col md:flex-row items-center gap-10 text-white">
              <div className="bg-white/20 p-8 rounded-[2.5rem] shadow-2xl border border-white/20 group hover:rotate-12 transition-transform">
                 <Info size={48} />
              </div>
              <div className="space-y-4 flex-1 text-center md:text-left">
                 <h2 className="text-3xl font-black">{language === 'en' ? 'Scheduled Maintenance' : 'திட்டமிடப்பட்ட பராமரிப்பு'}</h2>
                 <p className="text-sky-50 text-xl font-medium opacity-90 leading-relaxed max-w-2xl">
                    {language === 'en' 
                       ? 'General cleaning for Section A-12 Main Tank starts this Saturday (April 5th). Alternative supply channels will be active.' 
                       : 'பிரிவு A-12 பிரதான தொட்டிக்கான பொது சுத்தம் செய்யும் பணி இந்த சனிக்கிழமை (ஏப்ரல் 5) தொடங்குகிறது. மாற்று விநியோக வழித்தடங்கள் செயல்படும்.'}
                 </p>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
                 <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10 text-center uppercase tracking-widest font-black text-sm">
                    Status: Semi-Active
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
