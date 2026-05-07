'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Bookmark, 
  Search,
  Filter,
  Users,
  Calendar,
  Phone,
  CreditCard,
  ChevronRight,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

const INITIAL_SCHEMES = [
  { id: 1, name: 'Farmer Crop Insurance', desc: 'Financial support to farmers in the event of crop failure.', eligibility: 'Registered Farmers', deadline: 'May 30, 2026', status: 'Active', category: 'Agriculture' },
  { id: 2, name: 'Old Age Pension', desc: 'Monthly financial assistance for senior citizens above 60.', eligibility: 'Residents > 60 years', deadline: 'Ongoing', status: 'Active', category: 'Social' },
  { id: 3, name: 'Skill Development', desc: 'Free vocational training for village youth.', eligibility: 'Youth aged 18-35', deadline: 'April 20, 2026', status: 'Expiring Soon', category: 'Education' },
];

export default function AdminSchemes() {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'schemes' | 'registrations'>('schemes');
  const [newScheme, setNewScheme] = useState({ name: '', desc: '', eligibility: '', deadline: '', status: 'Active', category: 'Social' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = () => {
      // Load Schemes
      const savedSchemes = localStorage.getItem('smartgram-schemes');
      if (savedSchemes) setSchemes(JSON.parse(savedSchemes));
      else {
        setSchemes(INITIAL_SCHEMES);
        localStorage.setItem('smartgram-schemes', JSON.stringify(INITIAL_SCHEMES));
      }

      // Load Applications
      const savedApps = localStorage.getItem('smartgram-applications');
      if (savedApps) setApplications(JSON.parse(savedApps));
      
      setIsLoading(false);
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const saveToLocal = (updated: any[]) => {
    setSchemes(updated);
    localStorage.setItem('smartgram-schemes', JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (newScheme.name && newScheme.desc) {
        const updated = [{ id: Date.now(), ...newScheme }, ...schemes];
        saveToLocal(updated);

        // Notify USERS
        addNotification({
          title: 'New Welfare Scheme Launched!',
          message: `The "${newScheme.name}" scheme is now open for applications. Target: ${newScheme.eligibility}.`,
          type: 'success',
          target: 'user'
        });

        setNewScheme({ name: '', desc: '', eligibility: '', deadline: '', status: 'Active', category: 'Social' });
        setIsAdding(false);
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      saveToLocal(schemes.filter(s => s.id !== id));
    }
  };

  const getSchemeName = (id: number) => {
    return schemes.find(s => s.id === id)?.name || 'Unknown Scheme';
  };

  const filteredApps = applications.filter(app => 
    app.details.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSchemeName(app.schemeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.details.aadhar.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-500">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200">
            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === 'en' ? 'Welfare Schemes' : 'நலத்திட்டங்கள்'}
              </h1>
              <p className="text-slate-400 dark:text-slate-500 font-medium">
                {language === 'en' 
                  ? 'Manage and monitor all welfare and assistance programs for citizens.' 
                  : 'குடிமக்களுக்கான அனைத்து நல மற்றும் உதவித் திட்டங்களை நிர்வகிக்கவும்.'}
              </p>
            </div>
            {activeTab === 'schemes' && (
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${isAdding ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
              >
                {isAdding ? <X size={20} /> : <Plus size={20} />}
                {isAdding ? 'Cancel' : (language === 'en' ? 'New Scheme' : 'புதிய திட்டம்')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mt-8 p-1.5 bg-slate-100 dark:bg-slate-900 w-fit rounded-2xl border border-slate-200 dark:border-white/5">
            <button 
              onClick={() => setActiveTab('schemes')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'schemes' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <BookOpen size={18} />
              {language === 'en' ? 'Manage Schemes' : 'திட்டங்களை நிர்வகி'}
            </button>
            <button 
              onClick={() => setActiveTab('registrations')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'registrations' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <Users size={18} />
              {language === 'en' ? 'Registered People' : 'பதிவு செய்தவர்கள்'}
              {applications.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                  {applications.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {activeTab === 'schemes' ? (
          <>
            {isAdding && (
              <section className="mb-16 animate-in slide-in-from-top-4 duration-300">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl shadow-amber-900/5 dark:shadow-black/20 border border-amber-50 dark:border-white/5 mx-auto space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{language === 'en' ? 'Scheme Name' : 'பெயர்'}</label>
                          <input value={newScheme.name} onChange={(e) => setNewScheme({...newScheme, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 font-medium text-slate-900 dark:text-white" placeholder="Paddy Insurance" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{language === 'en' ? 'Eligibility' : 'தகுதி'}</label>
                          <input value={newScheme.eligibility} onChange={(e) => setNewScheme({...newScheme, eligibility: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 font-medium text-slate-900 dark:text-white" placeholder="Farmers" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{language === 'en' ? 'Category' : 'வகை'}</label>
                          <select value={newScheme.category} onChange={(e) => setNewScheme({...newScheme, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 font-medium text-slate-900 dark:text-white">
                            <option value="Agriculture">Agriculture</option>
                            <option value="Social">Social</option>
                            <option value="Education">Education</option>
                            <option value="Health">Health</option>
                          </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Deadline</label>
                          <input type="date" value={newScheme.deadline} onChange={(e) => setNewScheme({...newScheme, deadline: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 font-medium text-slate-900 dark:text-white" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description</label>
                          <input value={newScheme.desc} onChange={(e) => setNewScheme({...newScheme, desc: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 font-medium text-slate-900 dark:text-white" placeholder="Short description..." />
                      </div>
                    </div>
                    <button onClick={handleAdd} className="bg-amber-600 text-white w-full py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-amber-700 transition-all active:scale-95 shadow-amber-900/10">Save Record</button>
                </div>
              </section>
            )}

            {isLoading ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center italic text-slate-300">Loading Database...</div>
            ) : (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {schemes.map((scheme) => (
                  <div key={scheme.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-slate-50 dark:border-white/5 group hover:border-amber-200 dark:hover:border-amber-900 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-8">
                          <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all transform group-hover:scale-110">
                              <BookOpen size={30} />
                          </div>
                          <div className="text-right">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${scheme.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                                {scheme.status}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">{scheme.deadline}</div>
                          </div>
                        </div>

                        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-all">{scheme.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">{scheme.desc}</p>
                      </div>

                      <div className="mt-10 pt-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{scheme.eligibility}</span>
                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-slate-50 dark:bg-slate-950 text-slate-400 rounded-xl hover:text-amber-600 transition-all"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(scheme.id)} className="p-3 bg-slate-50 dark:bg-slate-950 text-slate-400 rounded-xl hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                        </div>
                      </div>
                  </div>
                ))}
              </section>
            )}
          </>
        ) : (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl shadow-slate-200/60 dark:shadow-black/20 overflow-hidden border border-slate-100 dark:border-white/5">
               <div className="p-8 border-b border-slate-50 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-950/50">
                  <div className="flex items-center gap-4">
                     <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm">
                        <Users className="text-amber-600" size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white">Registration Records</h2>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500">Total {applications.length} applications received</p>
                     </div>
                  </div>
                  <div className="relative w-full md:w-96">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                        type="text"
                        placeholder="Search by name, scheme or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-[1.25rem] font-bold text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-amber-50 dark:focus:ring-amber-900/20 outline-none transition-all shadow-sm"
                     />
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Applicant</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Scheme Applied</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Contact Details</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Applied On</th>
                           <th className="px-8 py-6 text-right"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {filteredApps.length > 0 ? (
                          filteredApps.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-lg group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-all">
                                        {app.details.fullName.charAt(0)}
                                     </div>
                                     <div>
                                        <div className="font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{app.details.fullName}</div>
                                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate max-w-[150px]">{app.userEmail}</div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                     <Bookmark size={14} className="text-amber-500" />
                                     <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{getSchemeName(app.schemeId)}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="space-y-1.5">
                                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                                        <Phone size={12} /> {app.details.phone}
                                     </div>
                                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                                        <CreditCard size={12} /> {app.details.aadhar.replace(/(\d{4})/g, '$1 ').trim()}
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${app.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                       app.status === 'Approved' 
                                       ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                                       : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                                     }`}>
                                        {app.status}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500">
                                     <Calendar size={14} />
                                     {new Date(app.appliedAt).toLocaleDateString()}
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  {app.status !== 'Approved' ? (
                                    <button 
                                      onClick={() => {
                                        const updated = applications.map(a => a.id === app.id ? { ...a, status: 'Approved' } : a);
                                        setApplications(updated);
                                        localStorage.setItem('smartgram-applications', JSON.stringify(updated));
                                        
                                        // Notify USER
                                        addNotification({
                                          title: 'Application Approved!',
                                          message: `Your application for "${getSchemeName(app.schemeId)}" has been officially approved.`,
                                          type: 'success',
                                          target: 'user'
                                        });

                                        window.dispatchEvent(new Event('storage'));
                                        alert('Application approved successfully!');
                                      }}
                                      title="Approve Application"
                                      className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-xl text-slate-300 dark:text-slate-500 hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all shadow-sm group-hover:scale-110 active:scale-95"
                                    >
                                       <UserCheck size={18} />
                                    </button>
                                  ) : (
                                    <div className="p-3 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 inline-block">
                                       <CheckCircle2 size={18} />
                                    </div>
                                  )}
                               </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-8 py-20 text-center text-slate-300 dark:text-slate-600 font-bold italic">
                               No registration records found.
                            </td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
