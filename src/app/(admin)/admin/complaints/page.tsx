'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { MessageSquare, ShieldAlert, CheckCircle2, Clock, Reply, Filter, Search, User, MoreVertical, RefreshCcw, X, Trash2 } from 'lucide-react';
import { INITIAL_COMPLAINTS } from '@/lib/mockData';
import { useNotifications } from '@/context/NotificationContext';

export default function AdminComplaints() {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('smartgram-complaints');
    if (saved) setComplaints(JSON.parse(saved));
    else setComplaints(INITIAL_COMPLAINTS);
    setIsLoading(false);
  }, []);

  const saveToLocal = (updated: any[]) => {
     setComplaints(updated);
     localStorage.setItem('smartgram-complaints', JSON.stringify(updated));
  };

  const handleDelete = (id: number) => {
    saveToLocal(complaints.filter((c: any) => c.id !== id));
  };

  const handleReply = (id: number) => {
    if (replyText.trim()) {
      const updated = complaints.map((c: any) => c.id === id ? { ...c, status: 'Resolved', reply: replyText } : c);
      saveToLocal(updated);
      
      // Notify USER
      addNotification({
        title: 'Complaint Resolved',
        message: `Admin has replied to your complaint: "${replyText.substring(0, 50)}..."`,
        type: 'success',
        target: 'user'
      });
      
      setSelectedId(null);
      setReplyText('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-500">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-8 border-slate-200">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{language === 'en' ? 'Complaint Management' : 'புகார் மேலாண்மை'}</h1>
            <p className="text-slate-400 dark:text-slate-500 font-medium">{language === 'en' ? 'Track and resolve citizen queries with ease.' : 'குடிமக்கள் கேள்விகளைக் கண்காணித்து தீர்வு காணுங்கள்.'}</p>
          </div>
          <div className="flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert size={14} />
                 {complaints.filter(c => c.status !== 'Resolved').length} Active
              </div>
              <button onClick={() => window.location.reload()} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:rotate-180 duration-500 shadow-sm">
                 <RefreshCcw size={20} />
              </button>
          </div>
        </header>

        <section className="min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                 <MessageSquare size={32} className="text-slate-400 dark:text-slate-600" />
                 {language === 'en' ? 'Complaint Inbox' : 'புகார் பெட்டி'}
              </h2>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors shadow-sm border border-slate-100 dark:border-white/5">
                 <Filter size={20} />
              </div>
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-800 rounded-full animate-spin" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{language === 'en' ? 'Fetching Messages...' : 'செய்திகள் பெறப்படுகின்றன...'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
              {complaints.map((comp) => (
                <div key={comp.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-slate-100 dark:border-white/5 relative group transition-all hover:scale-[1.02]">
                   <div className="flex items-start justify-between mb-6">
                      <div className={`p-3 rounded-2xl ${comp.status === 'Resolved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                         <ShieldAlert size={24} />
                      </div>
                      <div className="text-right">
                         <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${comp.status === 'Resolved' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                            {comp.status}
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 mt-2 flex items-center justify-end gap-1">
                            <Clock size={10} />
                            {comp.date}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4 mb-10">
                      <div className="flex items-center gap-2">
                         <User size={14} className="text-slate-300 dark:text-slate-600" />
                         <span className="text-sm font-black text-slate-900 dark:text-white">{comp.user}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-tight">{comp.description}</h3>
                   </div>

                   <div className="pt-6 border-t border-slate-100 mt-auto">
                       {selectedId === comp.id ? (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                          <textarea 
                            rows={3}
                            placeholder="Write official response..."
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleReply(comp.id)}
                              className="flex-1 bg-slate-900 dark:bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all"
                            >
                               <Reply size={18} />
                               {language === 'en' ? 'Send Reply' : 'பதிலளி'}
                            </button>
                            <button onClick={() => setSelectedId(null)} className="px-6 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold font-sans hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
                               X
                            </button>
                          </div>
                        </div>
                      ) : (
                         <div className="flex gap-2 w-full">
                          <button 
                            onClick={() => setSelectedId(comp.id)}
                            className="flex-1 bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-slate-800 dark:hover:bg-slate-700"
                          >
                             {language === 'en' ? 'Reply' : 'பதிலளி'}
                          </button>
                          <button 
                            onClick={() => handleDelete(comp.id)}
                            className="px-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all shadow-sm"
                          >
                             <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
