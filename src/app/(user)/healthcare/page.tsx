'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { HeartPulse, Stethoscope, User, Calendar, MapPin, Clock, Syringe, Search, Filter, Info, ShieldPlus } from 'lucide-react';
import HealthAlert from '@/components/ai/HealthAlert';
import RegistrationModal from '@/components/ai/RegistrationModal';

export default function HealthcarePage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [registeringCamp, setRegisteringCamp] = useState<any>(null);

  const [doctors, setDoctors] = useState<any[]>([]);
  const [camps, setCamps] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const savedDocs = localStorage.getItem('smartgram-healthcare');
      if (savedDocs) setDoctors(JSON.parse(savedDocs));
      else {
        setDoctors([
          { id: 1, name: 'Dr. Arul Selvam', spec: language === 'en' ? 'General Physician' : 'பொது மருத்துவர்', avail: '10 AM - 4 PM', status: 'Available' },
          { id: 2, name: 'Dr. K. Meena', spec: language === 'en' ? 'Pediatrician' : 'குழந்தை நல மருத்துவர்', avail: '2 PM - 7 PM', status: 'On Leave' },
        ]);
      }

      const savedCamps = localStorage.getItem('smartgram-camps');
      if (savedCamps) setCamps(JSON.parse(savedCamps));
      else {
        setCamps([
          { id: 1, name: language === 'en' ? 'Free Eye Camp' : 'இலவச கண் மருத்துவ முகாம்', date: 'April 10, 2026', location: language === 'en' ? 'Village School' : 'கிராமப் பள்ளி', details: '9 AM to 2 PM' },
          { id: 2, name: language === 'en' ? 'Polio Vaccination Drive' : 'போலியோ தடுப்பூசி முகாம்', date: 'April 15, 2026', location: language === 'en' ? 'Health Sub-Centre' : 'சுகாதார துணை மையம்', details: '8 AM to 5 PM' },
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
        <HealthAlert />
        
        <header className="mb-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest">
              <ShieldPlus size={16} />
              {language === 'en' ? 'Village Health Hub' : 'கிராம சுகாதார மையம்'}
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{language === 'en' ? 'Healthcare Services' : 'சுகாதார சேவைகள்'}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
              {language === 'en' 
                ? 'Check doctor availability, medical camps and local health drives.' 
                : 'மருத்துவர் இருப்பு, மருத்துவ முகாம்கள் மற்றும் உள்ளூர் சுகாதார இயக்கங்களை சரிபார்க்கவும்.'}
            </p>
          </div>
          <div className="relative w-full max-w-md shrink-0">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-rose-600 transition-colors">
                <Search size={22} />
             </div>
             <input 
               type="text" 
               placeholder={language === 'en' ? 'Search doctors or camps...' : 'மருத்துவர்கள் அல்லது முகாம்களைத் தேடுங்கள்...'} 
               className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-black/20 focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all font-medium text-slate-800 dark:text-white"
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Doctor List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <Stethoscope size={28} className="text-rose-500" />
                  {language === 'en' ? 'Available Doctors' : 'கிடைக்கக்கூடிய மருத்துவர்கள்'}
               </h2>
               <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-rose-600 cursor-pointer transition-colors shadow-sm border border-slate-100 dark:border-white/5">
                  <Filter size={20} />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {doctors.map((doc) => (
                 <div key={doc.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 dark:shadow-black/20 border border-slate-50 dark:border-white/5 group hover:-translate-y-1 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-[1.5rem] group-hover:bg-rose-500 group-hover:text-white transition-colors">
                          <User size={30} className="dark:text-slate-400 group-hover:text-white" />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                          <div className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-tight">{doc.spec}</div>
                       </div>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                          <Clock size={16} className="text-slate-300" />
                          {doc.avail}
                       </div>
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${doc.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${doc.status === 'Available' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                          {doc.status}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Medical Camps */}
          <div className="space-y-8">
             <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Calendar size={28} className="text-rose-500" />
                {language === 'en' ? 'Upcoming Camps' : 'வரவிருக்கும் முகாம்கள்'}
             </h2>
             <div className="space-y-6">
                {camps.map((camp) => (
                   <div key={camp.id} className="bg-gradient-to-br from-rose-600 to-rose-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-rose-900/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                         <Syringe size={80} />
                      </div>
                      <div className="relative space-y-6">
                         <div>
                            <div className="text-rose-200 text-xs font-black uppercase tracking-widest mb-1">{camp.date}</div>
                            <h3 className="text-2xl font-black">{camp.name}</h3>
                         </div>
                         <div className="space-y-3">
                            <div className="flex items-center gap-3 text-rose-100">
                               <MapPin size={18} />
                               <span className="font-bold">{camp.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-rose-100">
                               <Clock size={18} />
                               <span className="font-bold">{camp.details}</span>
                            </div>
                         </div>
                         <button 
                           onClick={() => setRegisteringCamp(camp)}
                           className="w-full bg-white dark:bg-white text-rose-800 dark:text-rose-900 py-3 rounded-2xl font-black uppercase tracking-tighter text-sm hover:bg-rose-50 dark:hover:bg-rose-50 transition-colors shadow-2xl shadow-black/10"
                         >
                            {language === 'en' ? 'Register Now' : 'இப்பொழுதே பதிவு செய்'}
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </section>

        {registeringCamp && (
          <RegistrationModal 
            camp={registeringCamp} 
            onClose={() => setRegisteringCamp(null)} 
          />
        )}

        <section className="mt-16 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl shadow-slate-100 dark:shadow-black/20 border border-slate-50 dark:border-white/5 flex flex-col md:flex-row items-center gap-10 transition-colors">
           <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-8 rounded-[2rem] shrink-0 border border-amber-200 dark:border-amber-900/20">
              <Info size={40} />
           </div>
           <div className="space-y-2 flex-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{language === 'en' ? 'Emergency Contact' : 'அவசர தொடர்பு'}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                 {language === 'en' 
                    ? 'For night-time emergencies, please contact the 24/7 Helpline or visit the Sub-Centre directly.' 
                    : 'இரவு நேர அவசர காலங்களில், 24/7 ஹெல்ப்லைனைத் தொடர்பு கொள்ளவும் அல்லது துணை மையத்தை அணுகவும்.'}
              </p>
           </div>
           <div className="text-center p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-white/5 w-full md:w-auto">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Helpline Number</div>
              <div className="text-3xl font-black text-rose-600">108 / 104</div>
           </div>
        </section>
      </main>
    </div>
  );
}
