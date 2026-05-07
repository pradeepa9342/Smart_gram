'use client';

import React, { useState } from 'react';
import { Bell, X, Info, CheckCircle, AlertTriangle, AlertCircle, BrainCircuit } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';

export default function NotificationCenter({ role }: { role: 'user' | 'admin' }) {
  const { notifications, removeNotification, unreadCount } = useNotifications();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const filtered = notifications.filter(n => n.target === role);
  const count = unreadCount(role);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
      >
        <Bell size={20} className="text-white opacity-80" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-emerald-700 dark:ring-slate-900 transition-all">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-96 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 z-50 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-slate-900 dark:bg-black p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-rose-400" />
                <h3 className="font-black text-lg">{language === 'en' ? 'Notifications' : 'அறிவிப்புகள்'}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
              {filtered.length > 0 ? filtered.map((n) => (
                <div key={n.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex gap-4 group hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                  <div className={`p-3 rounded-2xl shrink-0 h-fit ${
                    n.type === 'ai' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                    n.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                    n.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                    'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                  }`}>
                    {n.type === 'ai' ? <BrainCircuit size={20} /> : <Info size={20} />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">{n.title}</h4>
                      <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-tighter">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">{n.message}</p>
                  </div>
                  <button 
                    onClick={() => removeNotification(n.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              )) : (
                <div className="text-center py-12 space-y-3">
                   <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                     <Bell size={28} className="text-slate-300" />
                   </div>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                     {language === 'en' ? 'All caught up!' : 'அறிவிப்புகள் எதுவுமில்லை!'}
                   </p>
                </div>
              )}
            </div>
            
            {filtered.length > 0 && (
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-white/5 text-center">
                 <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                    Mark all as read
                 </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
