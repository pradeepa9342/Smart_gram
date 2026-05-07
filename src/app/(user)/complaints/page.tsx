'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Plus, CheckCircle2, AlertCircle, History, Send, Droplets, Tractor, HeartPulse, MoreHorizontal, Info, BrainCircuit } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

export default function ComplaintsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isSubmitMode, setIsSubmitMode] = useState(false);
  const [category, setCategory] = useState('Water');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('smartgram-complaints');
      if (saved) setComplaints(JSON.parse(saved));
      else {
        setComplaints([
          { id: 1, user: 'Arun Kumar', category: 'Water', description: language === 'en' ? 'Low pressure in Main Tank A-12.' : 'மெயின் டேங்க் A-12 இல் குறைந்த அழுத்தம்.', status: 'Resolved', date: '20/03/2026', email: 'arun@example.com', reply: language === 'en' ? 'Resolved motor issue. Please check.' : 'மோட்டார் பிரச்சனை சரிசெய்யப்பட்டது. சரிபார்க்கவும்.' },
        ]);
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let detectedCategory = category;
    
    try {
      const response = await fetch('/api/complaints/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      if (response.ok && data.category) {
        detectedCategory = data.category;
      }
    } catch (err) {
      console.error('Categorization Error:', err);
      // Fallback to local basic logic if API fails
      const text = description.toLowerCase();
      if (text.includes('water') || text.includes('தண்ணீர்')) detectedCategory = 'Water';
      else if (text.includes('crop') || text.includes('பயிர்')) detectedCategory = 'Agriculture';
      else if (text.includes('health') || text.includes('மருந்து')) detectedCategory = 'Healthcare';
    }

    const newComplaint = {
      id: Date.now(),
      user: 'Demo User',
      email: user?.email || 'user@smartgram.gov',
      category: detectedCategory,
      description,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      reply: '',
      isAiClassified: true
    };
    
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('smartgram-complaints', JSON.stringify(updated));
    
    // Notify ADMIN
    addNotification({
      title: 'New Complaint Received',
      message: `${user?.email || 'A user'} has submitted a new complaint in ${detectedCategory}.`,
      type: 'warning',
      target: 'admin'
    });
    
    setIsSubmitMode(false);
    setDescription('');
    setIsSubmitting(false);

    if (detectedCategory !== category) {
      // Just a small notification instead of alert for smoother UX
      addNotification({
        title: 'AI Department Assignment',
        message: `Your complaint was automatically assigned to ${detectedCategory} based on its content.`,
        type: 'ai',
        target: 'user'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-700">
        <header className="mb-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
              <MessageSquare size={16} />
              {language === 'en' ? 'Citizen Support' : 'குடிமக்கள் ஆதரவு'}
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{language === 'en' ? 'Complaints & Queries' : 'புகார்கள் மற்றும் கேள்விகள்'}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
              {language === 'en' 
                ? 'Report issues or ask questions directly to village authorities.' 
                : 'கிராம அதிகாரிகளிடம் நேரடியாக பிரச்சனைகளைப் புகார் செய்யுங்கள் அல்லது கேள்விகளைக் கேளுங்கள்.'}
            </p>
          </div>
          <button 
            onClick={() => setIsSubmitMode(!isSubmitMode)}
            className={`px-8 py-5 rounded-[2rem] font-black text-lg flex items-center gap-3 transition-all shadow-2xl active:scale-95 ${isSubmitMode ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/10'}`}
          >
            {isSubmitMode ? language === 'en' ? 'Cancel' : 'ரத்துசெய்' : (
              <>
                <Plus size={24} />
                {language === 'en' ? 'New Complaint' : 'புதிய புகார்'}
              </>
            )}
          </button>
        </header>

        {isSubmitMode && (
          <section className="mb-16 animate-in slide-in-from-top-10 duration-500">
             <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl shadow-emerald-900/5 dark:shadow-black/20 border border-emerald-50 dark:border-white/5 max-w-4xl mx-auto space-y-10 transition-colors">
                <div className="space-y-6">
                   <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{language === 'en' ? 'Pick a Department' : 'துறையைத் தேர்ந்தெடுக்கவும்'}</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[ 
                        { id: 'Water', icon: Droplets, color: 'text-sky-600', bg: 'bg-sky-50', darkBg: 'dark:bg-sky-900/20' },
                        { id: 'Agriculture', icon: Tractor, color: 'text-emerald-600', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20' },
                        { id: 'Healthcare', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-50', darkBg: 'dark:bg-rose-900/20' },
                        { id: 'Others', icon: Info, color: 'text-slate-500', bg: 'bg-slate-100', darkBg: 'dark:bg-slate-800' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all transition-transform active:scale-95 ${category === cat.id ? `border-emerald-600 ${cat.bg} ${cat.darkBg} shadow-lg scale-105` : 'border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-400 opacity-70'}`}
                        >
                           <cat.icon size={32} className={category === cat.id ? cat.color : 'text-slate-400 dark:text-slate-600'} />
                           <span className="font-black text-xs uppercase tracking-tighter">{cat.id}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{language === 'en' ? 'How can we help you?' : 'நாங்கள் உங்களுக்கு எப்படி உதவ முடியும்?'}</label>
                   <textarea 
                     rows={5} 
                     placeholder={language === 'en' ? 'Describe your issue in detail...' : 'உங்கள் பிரச்சனையை விரிவாக விவரிக்கவும்...'} 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-4 text-lg font-medium text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                     required
                   />
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
                >
                   {isSubmitting ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : (
                     <>
                        <Send size={28} />
                        {language === 'en' ? 'Submit Complaint' : 'புகாரை சமர்ப்பிக்கவும்'}
                     </>
                   )}
                </button>
             </form>
          </section>
        )}

         <section className="space-y-8 mb-12">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 px-2">
              <History size={28} className="text-emerald-600" />
              {language === 'en' ? 'Tracking History' : 'கண்காணிப்பு வரலாறு'}
           </h2>

            <div className="space-y-6">
              {complaints.length > 0 ? complaints.map((comp, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl shadow-slate-100 dark:shadow-black/20 border border-slate-50 dark:border-white/5 group hover:border-emerald-200 dark:hover:border-emerald-900 transition-all flex flex-col md:flex-row gap-8 items-start">
                   <div className={`p-5 rounded-[2.5rem] shrink-0 transform group-hover:-rotate-6 transition-transform ${comp.category === 'Water' ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' : comp.category === 'Agriculture' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'}`}>
                      {comp.category === 'Water' ? <Droplets size={40} /> : comp.category === 'Agriculture' ? <Tractor size={40} /> : <HeartPulse size={40} />}
                   </div>
                   
                   <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{comp.date}</span>
                             <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${comp.status === 'Resolved' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : comp.status === 'In Progress' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                                {comp.status}
                             </div>
                             {comp.isAiClassified && (
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/40">
                                  <BrainCircuit size={12} />
                                  AI Classified
                                </div>
                              )}
                          </div>
                          <MoreHorizontal className="text-slate-200 dark:text-slate-700 group-hover:text-slate-400 cursor-pointer transition-colors" />
                       </div>
                       <p className="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{comp.description}</p>
                                            {comp.reply && (
                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 relative group-hover:bg-white dark:group-hover:bg-slate-950 group-hover:shadow-lg dark:group-hover:shadow-black/20 group-hover:border-white dark:group-hover:border-white/10 transition-all overflow-hidden mt-4">
                           <div className="absolute top-0 right-0 p-4 font-black text-[8px] text-slate-100 dark:text-slate-900 uppercase vertical-text tracking-widest select-none pointer-events-none">Official Response</div>
                           <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <CheckCircle2 size={14} />
                              Admin Response:
                           </div>
                           <p className="text-slate-600 dark:text-slate-400 italic font-medium">{comp.reply}</p>
                        </div>
                      )}
                   </div>
                </div>
              )) : (
                 <div className="bg-white dark:bg-slate-900 p-20 rounded-[4rem] text-center space-y-4 border-2 border-dashed border-slate-100 dark:border-white/5 opacity-50">
                   <div className="bg-slate-50 dark:bg-slate-950 w-24 h-24 rounded-full mx-auto flex items-center justify-center">
                     <MessageSquare size={40} className="text-slate-300 dark:text-slate-700" />
                   </div>
                   <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{language === 'en' ? 'No history recorded yet.' : 'பதிவுசெய்யப்பட்ட வரலாறு எதுவும் இல்லை.'}</p>
                </div>
              )}
           </div>
        </section>
      </main>
    </div>
  );
}
