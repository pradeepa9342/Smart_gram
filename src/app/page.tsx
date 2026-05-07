'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { User, ShieldCheck, MapPin, Droplets, Info, ChevronRight } from 'lucide-react';

export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="flex-1 bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
          className="bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
        >
          {language === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </div>

      <div className="space-y-4 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg ring-4 ring-emerald-100">
            <MapPin size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            SMART<span className="text-emerald-600">-GRAM</span>
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-slate-600 font-medium">
          {language === 'en' ? 'Empowering Villages through Digital Innovation' : 'டிஜிட்டல் கண்டுபிடிப்புகள் மூலம் கிராமங்களுக்கு அதிகாரம் அளித்தல்'}
        </p>
        <p className="text-slate-500 max-w-lg mx-auto">
          {language === 'en' 
            ? 'A unified platform for agriculture, healthcare, water monitoring, and efficient government services.'
            : 'விவசாயம், சுகாதாரம், நீர் கண்காணிப்பு மற்றும் திறமையான அரசு சேவைகளுக்கான ஒரு ஒருங்கிணைந்த தளம்.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <Link href="/login" className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="absolute -right-8 -top-8 bg-emerald-50 w-32 h-32 rounded-full transform group-hover:scale-110 transition-transform duration-500" />
          <div className="relative flex flex-col items-center text-center space-y-4">
            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <User size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t.auth.user_login}</h2>
            <p className="text-slate-500">
              {language === 'en' 
                ? 'Access farming tips, water status, medical info, and government schemes.' 
                : 'விவசாயக் குறிப்புகள், நீர் நிலை, மருத்துவத் தகவல் மற்றும் அரசுத் திட்டங்களை அணுகலாம்.'}
            </p>
            <div className="pt-4 flex items-center text-emerald-600 font-semibold gap-1 group-hover:gap-2 transition-all">
              <span>{t.auth.login}</span>
              <ChevronRight size={18} />
            </div>
          </div>
        </Link>

        <Link href="/admin-login" className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="absolute -right-8 -top-8 bg-slate-50 w-32 h-32 rounded-full transform group-hover:scale-110 transition-transform duration-500" />
          <div className="relative flex flex-col items-center text-center space-y-4">
            <div className="bg-slate-100 text-slate-700 p-4 rounded-2xl group-hover:bg-slate-800 group-hover:text-white transition-colors duration-300">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t.auth.admin_login}</h2>
            <p className="text-slate-500">
              {language === 'en' 
                ? 'Manage village resources, healthcare drives, and respond to citizen complaints.' 
                : 'கிராமப்புற வளங்கள், சுகாதார இயக்கங்களை நிர்வகித்தல் மற்றும் குடிமக்களின் புகார்களுக்கு பதிலளித்தல்.'}
            </p>
            <div className="pt-4 flex items-center text-slate-700 font-semibold gap-1 group-hover:gap-2 transition-all">
              <span>{t.auth.login}</span>
              <ChevronRight size={18} />
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-6 text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Droplets size={18} />
            <span>{language === 'en' ? 'Water Monitoring' : 'தண்ணீர் கண்காணிப்பு'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={18} />
            <span>{language === 'en' ? 'Live Updates' : 'நேரடி புதுப்பிப்புகள்'}</span>
          </div>
        </div>


      </div>
    </div>
  );
}
