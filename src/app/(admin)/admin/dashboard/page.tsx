'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { 
  Tractor, 
  HeartPulse, 
  Droplets, 
  BookOpen, 
  MessageSquare, 
  Users, 
  Activity, 

  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Send,
  X,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isSyncing, setIsSyncing] = useState(false);
  const [broadcastModal, setBroadcastModal] = useState<{ type: string; color: string } | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([
    { t: 'Success', m: 'Seed distribution started.', time: '10m ago', color: 'text-emerald-600 dark:text-emerald-400' },
    { t: 'Warning', m: 'High heat advisory sent.', time: '1h ago', color: 'text-amber-600 dark:text-amber-400' },
    { t: 'Info', m: 'Scholarship data synced.', time: '3h ago', color: 'text-sky-500 dark:text-sky-400' },
  ]);

  const handleBroadcast = () => {
    if (!broadcastMsg.trim() || !broadcastModal) return;
    // Add to live feed
    setLiveAlerts(prev => [{ t: broadcastModal.type, m: broadcastMsg, time: 'Just now', color: broadcastModal.color }, ...prev.slice(0, 4)]);
    // Push to all users via notification system
    addNotification({
      title: `📢 ${broadcastModal.type} from Admin`,
      message: broadcastMsg,
      type: broadcastModal.type === 'Water Alert' ? 'warning' : 'ai',
      target: 'user'
    });
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastModal(null);
      setBroadcastMsg('');
    }, 2000);
  };

  const stats = [
    { label: language === 'en' ? 'Active Complaints' : 'செயலில் உள்ள புகார்கள்', value: '12', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: language === 'en' ? 'Water Level Avg' : 'சராசரி நீர் மட்டம்', value: '78%', icon: Activity, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: language === 'en' ? 'Farmers Registered' : 'பதிவு செய்த விவசாயிகள்', value: '450', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: language === 'en' ? 'Pending Schemes' : 'நிலுவையில் உள்ள திட்டங்கள்', value: '5', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const modules = [
    { title: language === 'en' ? 'Manage Agriculture' : 'விவசாயத்தை நிர்வகி', icon: Tractor, href: '/admin/agriculture', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: language === 'en' ? 'Manage Healthcare' : 'சுகாதாரத்தை நிர்வகி', icon: HeartPulse, href: '/admin/healthcare', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: language === 'en' ? 'Manage Water Supply' : 'நீர் விநியோகத்தை நிர்வகி', icon: Droplets, href: '/admin/water', color: 'text-sky-600', bg: 'bg-sky-50' },
    { title: language === 'en' ? 'Manage Government Schemes' : 'அரசு திட்டங்களை நிர்வகி', icon: BookOpen, href: '/admin/schemes', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: language === 'en' ? 'Manage Complaints' : 'புகார்களை நிர்வகி', icon: MessageSquare, href: '/admin/complaints', color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert(language === 'en' ? 'Data clusters synced successfully!' : 'தரவு தொகுப்புகள் வெற்றிகரமாக ஒத்திசைக்கப்பட்டன!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-700">
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
               <Activity size={14} className="text-emerald-500" />
               Municipal Officer Panel
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Smart-Gram Admin</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
              {language === 'en' 
                ? 'Oversee village development, manage critical infrastructure and address citizen needs efficiently.' 
                : 'கிராம வளர்ச்சியை மேற்பார்வை செய்யவும், முக்கியமான உள்கட்டமைப்பை நிர்வகிக்கவும் மற்றும் குடிமக்கள் தேவைகளை திறம்பட தீர்க்கவும்.'}
            </p>
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
          >
             <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
             {language === 'en' ? 'Sync Data' : 'ஒத்திசைவு'}
          </button>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-white dark:border-white/5 flex items-center gap-5">
               <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                  <stat.icon size={26} />
               </div>
               <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">{stat.label}</div>
               </div>
            </div>
          ))}
        </section>




        <section className="mt-16 bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden">

           {/* Broadcast Modal */}
           {broadcastModal && (
             <div className="absolute inset-0 z-20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm rounded-[3rem] flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
               <div className="w-full max-w-lg space-y-6">
                 {broadcastSent ? (
                   <div className="flex flex-col items-center gap-4 text-center animate-in zoom-in duration-300">
                     <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-6 rounded-full">
                       <CheckCircle2 size={48} />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white">Alert Broadcasted!</h3>
                     <p className="text-slate-500 dark:text-slate-400">All citizens have been notified via the portal.</p>
                   </div>
                 ) : (
                   <>
                     <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white">Broadcast {broadcastModal.type}</h3>
                       <button onClick={() => { setBroadcastModal(null); setBroadcastMsg(''); }} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                         <X size={24} />
                       </button>
                     </div>
                     <textarea
                       rows={4}
                       autoFocus
                       value={broadcastMsg}
                       onChange={(e) => setBroadcastMsg(e.target.value)}
                       placeholder={`Type your ${broadcastModal.type} message to all citizens...`}
                       className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-5 text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 resize-none transition-all"
                     />
                     <button
                       onClick={handleBroadcast}
                       disabled={!broadcastMsg.trim()}
                       className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-emerald-900/10"
                     >
                       <Send size={22} />
                       Send to All Citizens
                     </button>
                   </>
                 )}
               </div>
             </div>
           )}

           <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">
                 <ShieldCheck size={14} />
                 System Alert Engine
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Broadcast Village Alerts</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl">
                 Instantly notify all citizens about water shortages, vaccination drives, or new government welfare schemes directly to their portal.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <button 
                   onClick={() => setBroadcastModal({ type: 'Water Alert', color: 'text-sky-600 dark:text-sky-400' })}
                   className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-rose-700 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-2"
                 >
                    <Droplets size={18} />
                    Trigger Water Alert
                 </button>
                 <button 
                    onClick={() => setBroadcastModal({ type: 'Health Camp', color: 'text-indigo-600 dark:text-indigo-400' })}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-2"
                 >
                    <HeartPulse size={18} />
                    Schedule Health Camp
                 </button>
              </div>
           </div>
           <div className="w-full lg:w-96 shrink-0 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden group/alert">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/alert:scale-125 transition-transform">
                 <MessageSquare size={120} />
              </div>
              <div className="relative space-y-4">
                 <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live Alert Feed</div>
                 {liveAlerts.map((a, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group/row hover:border-emerald-200 transition-colors animate-in fade-in duration-300">
                       <div>
                          <div className={`text-[10px] font-black uppercase tracking-tighter ${a.color} group-hover/row:scale-105 origin-left transition-transform`}>{a.t}</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{a.m}</div>
                       </div>
                       <div className="text-[9px] font-black text-slate-300 dark:text-slate-600 shrink-0 ml-2">{a.time}</div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        <section className="mt-16 space-y-8">
           <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><Activity size={20} /></span>
              Management Modules
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, idx) => (
                 <Link 
                   key={idx} 
                   href={module.href}
                   className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 dark:shadow-black/20 border border-slate-50 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-2xl flex items-center justify-between"
                 >
                    <div className="flex items-center gap-5">
                       <div className={`${module.bg} ${module.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                          <Plus size={24} />
                       </div>
                       <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{module.title}</span>
                    </div>
                   <ArrowRight size={20} className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
}
