'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Tractor, HeartPulse, Droplets, BookOpen, MessageSquare, Plus, ChevronRight, CloudSun } from 'lucide-react';
import Link from 'next/link';
import WeatherCard from '@/components/ai/WeatherCard';
import HealthAlert from '@/components/ai/HealthAlert';
import CropSuggestionCard from '@/components/ai/CropSuggestionCard';

export default function UserDashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const cards = [
    { title: t.nav.agriculture, icon: Tractor, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/agriculture', desc: language === 'en' ? 'Get crop suggestions & seed news' : 'பயிர் ஆலோசனைகள் மற்றும் விதைக் செய்திகள்' },
    { title: t.nav.healthcare, icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-50', href: '/healthcare', desc: language === 'en' ? 'Doctors & vaccination drives' : 'மருத்துவர்கள் மற்றும் தடுப்பூசி முகாம்கள்' },
    { title: t.nav.water, icon: Droplets, color: 'text-sky-600', bg: 'bg-sky-50', href: '/water', desc: language === 'en' ? 'Real-time water level updates' : 'நேரடி நீர் நிலை புதுப்பிப்புகள்' },
    { title: t.nav.schemes, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', href: '/schemes', desc: language === 'en' ? 'Browse active Govt. schemes' : 'அரசுத் திட்டங்களைப் பார்க்க' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-700">
        <header className="mb-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium text-sm border-b border-emerald-100 dark:border-emerald-900/50 pb-4 mb-4 w-fit">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full">{language === 'en' ? 'Village Hub' : 'கிராம மையம்'}</span>
              <span className="hidden sm:inline opacity-50">•</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600">AI Powered</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {language === 'en' ? `Vanakkam, ${user?.email?.split('@')[0] || 'Villager'}!` : `வணக்கம், ${user?.email?.split('@')[0] || 'கிராமவாசி'}!`}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-xl font-medium">
              {language === 'en' 
                ? 'Stay updated with your village services and resources at your fingertips.' 
                : 'உங்கள் கிராம சேவைகள் மற்றும் வளங்களுடன் உங்கள் விரல் நுனியில் இணைந்திருங்கள்.'}
            </p>
          </div>
          
          <div className="w-full lg:w-96 shrink-0 hidden lg:block">
             <WeatherCard />
          </div>
        </header>

        <HealthAlert />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           <div className="lg:hidden">
              <WeatherCard />
           </div>
           <div className="lg:col-span-2">
              <CropSuggestionCard />
           </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, idx) => (
            <Link 
              key={idx} 
              href={card.href} 
              className="group bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-black/20 border border-slate-50 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative"
            >
              <div className={`${card.bg} ${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-white dark:ring-slate-800 group-hover:scale-110 transition-transform`}>
                <card.icon size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{card.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">{card.desc}</p>
              <div className="flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600 transition-all opacity-70 group-hover:opacity-100">
                {language === 'en' ? 'Explore' : 'ஆராயுங்கள்'}
                <ChevronRight size={14} className="ml-1 group-hover:ml-2 transition-all" />
              </div>
            </Link>
          ))}
        </section>

        <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-[2.5rem] p-4 sm:p-10 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 bg-emerald-500/30 px-4 py-1.5 rounded-full border border-emerald-400/30 text-sm font-semibold tracking-wide">
                <MessageSquare size={16} />
                {language === 'en' ? 'Community Support' : 'சமூக ஆதரவு'}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                {language === 'en' ? 'Have a concern or suggestion?' : 'ஏதேனும் கவலை அல்லது ஆலோசனை உள்ளதா?'}
              </h2>
              <p className="text-emerald-50/90 text-lg">
                {language === 'en' 
                  ? 'Submit your complaints regarding water, healthcare or any village issues directly to the Municipal Officer.' 
                  : 'நீர், சுகாதாரம் அல்லது கிராமப்புற பிரச்சனைகள் குறித்த உங்கள் புகார்களை நேரடியாக நகராட்சி அதிகாரியிடம் சமர்ப்பிக்கவும்.'}
              </p>
            </div>
            
            <Link 
              href="/complaints" 
              className="bg-white text-emerald-800 px-8 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-emerald-50 transition-colors shadow-2xl shadow-black/20"
            >
              <Plus size={24} />
              {t.nav.complaints}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
