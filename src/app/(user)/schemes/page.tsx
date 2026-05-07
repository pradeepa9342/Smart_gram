'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SchemeModal from '@/components/SchemeModal';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Search, Filter, ArrowUpRight, CheckCircle2, AlertCircle, Bookmark, Share2, HelpCircle } from 'lucide-react';

export default function SchemesPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [schemes, setSchemes] = useState<any[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      // 1. Load Schemes
      const savedSchemes = localStorage.getItem('smartgram-schemes');
      if (savedSchemes) setSchemes(JSON.parse(savedSchemes));
      else {
        setSchemes([
          { id: 1, name: language === 'en' ? 'Farmer Crop Insurance' : 'விவசாய பயிர் காப்பீடு', desc: language === 'en' ? 'Financial support to farmers in the event of crop failure.' : 'பயிர் இழப்பு ஏற்பட்டால் விவசாயிகளுக்கு நிதியுதவி.', eligibility: language === 'en' ? 'Registered Farmers' : 'பதிவு செய்த விவசாயிகள்', deadline: 'May 30, 2026', status: 'Active', category: 'Agriculture' },
          { id: 2, name: language === 'en' ? 'Old Age Pension' : 'முதியோர் ஓய்வூதியம்', desc: language === 'en' ? 'Monthly financial assistance for senior citizens above 60.' : '60 வயதுக்கு மேற்பட்ட மூத்த குடிமக்களுக்கு மாதாந்திர நிதி உதவி.', eligibility: language === 'en' ? 'Residents > 60 years' : '60 வயதிற்கு மேற்பட்ட குடியிருப்பாளர்கள்', deadline: 'Ongoing', status: 'Active', category: 'Social' },
          { id: 3, name: language === 'en' ? 'Skill Development' : 'திறன் மேம்பாட்டுப் பயிற்சி', desc: language === 'en' ? 'Free vocational training for village youth.' : 'கிராமப்புற இளைஞர்களுக்கு இலவச தொழில் பயிற்சி.', eligibility: language === 'en' ? 'Youth aged 18-35' : '18-35 வயதுடைய இளைஞர்கள்', deadline: 'April 20, 2026', status: 'Expiring Soon', category: 'Education' },
        ]);
      }

      // 2. Load Applications
      const savedApps = localStorage.getItem('smartgram-applications');
      if (savedApps) setApplications(JSON.parse(savedApps));
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [language]);

  const handleApply = (details: any) => {
    if (!selectedScheme) return;
    
    const newApp = {
      id: Date.now(),
      schemeId: selectedScheme.id,
      userEmail: user?.email || 'demo@user.com',
      details,
      status: 'Pending',
      appliedAt: new Date().toISOString()
    };

    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    localStorage.setItem('smartgram-applications', JSON.stringify(updatedApps));
    
    // Also notify storage listeners
    window.dispatchEvent(new Event('storage'));
  };

  const isApplied = (schemeId: number) => {
    return applications.some(app => app.schemeId === schemeId && (app.userEmail === user?.email || app.userEmail === 'demo@user.com'));
  };

  const filteredSchemes = schemes.filter(s => 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.desc.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === 'All' || s.category === filter)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      
      <SchemeModal 
         isOpen={!!selectedScheme}
         onClose={() => setSelectedScheme(null)}
         scheme={selectedScheme || {}}
         onSubmit={handleApply}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-700">
        <header className="mb-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-50 dark:bg-amber-900/10 w-fit px-4 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/20 mx-auto md:mx-0">
              <Bookmark size={16} />
              {language === 'en' ? 'Official Village Schemes' : 'அதிகாரப்பூர்வ கிராமத் திட்டங்கள்'}
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1]">{language === 'en' ? 'Government Schemes' : 'அரசுத் திட்டங்கள்'}</h1>
            <p className="text-slate-400 dark:text-slate-500 font-medium max-w-xl text-lg">
              {language === 'en' 
                ? 'Discover and apply for welfare schemes tailored for your community.' 
                : 'உங்கள் சமூகத்திற்கென பிரத்யேகமாக வடிவமைக்கப்பட்ட நலத்திட்டங்களைக் கண்டறிந்து விண்ணப்பிக்கவும்.'}
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={20} />
                <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder={language === 'en' ? 'Search schemes...' : 'திட்டங்களைத் தேடுக...'}
                   className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[1.5rem] shadow-sm shadow-slate-900/5 dark:shadow-black/20 focus:outline-none focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/30 transition-all font-bold text-slate-900 dark:text-white"
                />
             </div>
             <button className="bg-white dark:bg-slate-900 p-4 rounded-[1.5rem] text-slate-400 dark:text-slate-500 hover:text-amber-600 border border-slate-200 dark:border-white/5 shadow-sm transition-all hover:scale-110 active:scale-95">
                <Filter size={24} />
             </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredSchemes.map((scheme) => (
             <div key={scheme.id} className={`bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border transition-all flex flex-col justify-between relative overflow-hidden group ${isApplied(scheme.id) ? 'border-amber-200 dark:border-amber-800 ring-4 ring-amber-50 dark:ring-amber-900/20 opacity-95' : 'border-slate-50 dark:border-white/5 hover:border-amber-200 dark:hover:border-amber-900'}`}>
                {isApplied(scheme.id) && (
                   <div className="absolute -right-12 top-8 rotate-45 bg-amber-500 text-white px-12 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Applied
                   </div>
                )}
                
                <div>
                   <div className="flex justify-between items-start mb-8">
                      <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${scheme.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'}`}>
                         {scheme.status}
                      </div>
                      <div className={`text-slate-100 dark:text-slate-800 group-hover:scale-110 transition-transform ${isApplied(scheme.id) ? 'text-amber-100 dark:text-amber-900/40' : 'group-hover:text-amber-100 dark:group-hover:text-amber-900/40'}`}>
                         <BookOpen size={48} strokeWidth={1.5} />
                      </div>
                   </div>
                   
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                      {scheme.name}
                   </h3>
                   
                   <p className="text-slate-500 dark:text-slate-400 font-bold mb-8 leading-relaxed line-clamp-3">
                      {scheme.desc}
                   </p>
  
                   <div className="space-y-4 pt-8 border-t border-slate-50 dark:border-white/5">
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-100 dark:border-white/5">
                         <div className="bg-white dark:bg-slate-800 p-2 rounded-xl text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-tighter shadow-sm shrink-0">Eligibility</div>
                         <div className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">{scheme.eligibility}</div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-100 dark:border-white/5">
                         <div className="bg-white dark:bg-slate-800 p-2 rounded-xl text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-tighter shadow-sm shrink-0">Deadline</div>
                         <div className={`text-xs font-black ${scheme.status === 'Expiring Soon' ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>{scheme.deadline}</div>
                      </div>
                   </div>
                </div>
                  <div className="flex items-center gap-4 mt-10">
                   <button 
                      disabled={isApplied(scheme.id)}
                      onClick={() => setSelectedScheme(scheme)}
                      className={`flex-1 py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                         isApplied(scheme.id) 
                         ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-none cursor-default' 
                         : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-amber-600 dark:hover:bg-amber-700 shadow-slate-900/10 dark:shadow-black/20'
                      }`}
                   >
                      {isApplied(scheme.id) ? (
                         <>
                            <CheckCircle2 size={24} />
                            {t.schemes.already_applied}
                         </>
                      ) : (
                         <>
                            {t.schemes.apply}
                            <ArrowUpRight size={20} />
                         </>
                      )}
                   </button>
                   <button 
                      onClick={() => alert('Shared!')}
                      className="bg-slate-50 dark:bg-slate-950 p-5 rounded-[1.5rem] text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl dark:shadow-black/20 transition-all"
                   >
                      <Share2 size={24} />
                   </button>
                </div>
             </div>
           ))}
        </section>
         <section className="mt-20 flex flex-col md:flex-row items-center gap-12 bg-amber-50 dark:bg-amber-900/10 p-12 rounded-[4rem] border border-amber-100 dark:border-amber-900/20 overflow-hidden relative transition-colors">
           <div className="absolute right-0 bottom-0 p-8 opacity-5">
              <HelpCircle size={150} />
           </div>
           <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-amber-100 dark:border-amber-900/20 shrink-0">
              <AlertCircle size={48} className="text-amber-600 dark:text-amber-400" />
           </div>
           <div className="space-y-4 flex-1">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">{language === 'en' ? 'Help with Application' : 'விண்ணப்பிக்க உதவி'}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-xl font-medium leading-relaxed max-w-3xl">
                 {language === 'en' 
                    ? 'Facing issues while applying? Visit your nearby E-Seva centre or call the designated Scheme Officer available every Tuesday at the Municipal Office.' 
                    : 'விண்ணப்பிக்கும் போது சிக்கல்கள் ஏற்படுகிறதா? உங்களுக்கு அருகிலுள்ள இ-சேவை மையத்திற்குச் செல்லவும் அல்லது ஒவ்வொரு செவ்வாய்க்கிழமையும் நகராட்சி அலுவலகத்தில் உள்ள திட்ட அதிகாரியை அழைக்கவும்.'}
              </p>
           </div>
        </section>
      </main>
    </div>
  );
}
