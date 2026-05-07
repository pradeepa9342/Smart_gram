'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useNotifications } from '@/context/NotificationContext';
import { HeartPulse, User, Plus, Trash2, Edit, Save, X, Calendar, Syringe, ShieldPlus, Clock, MapPin } from 'lucide-react';

const INITIAL_DOCTORS = [
  { id: 1, name: 'Dr. Arul Selvam', spec: 'General Physician', avail: '10 AM - 4 PM', status: 'Available' },
  { id: 2, name: 'Dr. K. Meena', spec: 'Pediatrician', avail: '2 PM - 7 PM', status: 'On Leave' },
];

export default function AdminHealthcare() {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', spec: '', avail: '', status: 'Available' });
  const [camps, setCamps] = useState<any[]>([]);
  const [isAddingCamp, setIsAddingCamp] = useState(false);
  const [newCamp, setNewCamp] = useState({ name: '', date: '', location: '', details: '' });
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('smartgram-healthcare');
    if (saved) setDoctors(JSON.parse(saved));
    else setDoctors(INITIAL_DOCTORS);

    const savedCamps = localStorage.getItem('smartgram-camps');
    if (savedCamps) setCamps(JSON.parse(savedCamps));
    else setCamps([
      { id: 1, name: 'Free Eye Camp', date: 'April 10, 2026', location: 'Village School', details: '9 AM to 2 PM' },
      { id: 2, name: 'Polio Vaccination Drive', date: 'April 15, 2026', location: 'Health Sub-Centre', details: '8 AM to 5 PM' },
    ]);

    const savedRegs = localStorage.getItem('smartgram-registrations');
    if (savedRegs) setRegistrations(JSON.parse(savedRegs));
    
    setIsLoading(false);
  }, []);

  const refreshRegistrations = () => {
    const savedRegs = localStorage.getItem('smartgram-registrations');
    if (savedRegs) setRegistrations(JSON.parse(savedRegs));
  };

  const saveToLocal = (updated: any[]) => {
    setDoctors(updated);
    localStorage.setItem('smartgram-healthcare', JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (newDoc.name && newDoc.spec) {
       const updated = [{ id: Date.now(), ...newDoc }, ...doctors];
       saveToLocal(updated);
       setNewDoc({ name: '', spec: '', avail: '', status: 'Available' });
       setIsAdding(false);
    }
  };

  const handleDelete = (id: number) => {
    saveToLocal(doctors.filter(d => d.id !== id));
  };

  const saveCampsToLocal = (updated: any[]) => {
    setCamps(updated);
    localStorage.setItem('smartgram-camps', JSON.stringify(updated));
  };

  const handleAddCamp = () => {
    if (newCamp.name && newCamp.date) {
      const updated = [{ id: Date.now(), ...newCamp }, ...camps];
      saveCampsToLocal(updated);

      // Notify USERS
      addNotification({
        title: 'New Health Camp Scheduled',
        message: `A new ${newCamp.name} is scheduled for ${newCamp.date} at ${newCamp.location}. Register now!`,
        type: 'ai',
        target: 'user'
      });

      setNewCamp({ name: '', date: '', location: '', details: '' });
      setIsAddingCamp(false);
    }
  };

  const handleDeleteCamp = (id: number) => {
    saveCampsToLocal(camps.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-500">
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-8 border-slate-200">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{language === 'en' ? 'Healthcare Dashboard' : 'சுகாதார டாஷ்போர்டு'}</h1>
            <p className="text-slate-400 dark:text-slate-500 font-medium">{language === 'en' ? 'Manage medical professionals and ongoing health camps.' : 'மருத்துவ நிபுணர்கள் மற்றும் முகாம்களை நிர்வகிக்கவும்.'}</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${isAdding ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? 'Cancel' : (language === 'en' ? 'Add Doctor' : 'மருத்துவரைச் சேர்')}
          </button>
        </header>

        {isAdding && (
          <section className="mb-12 animate-in slide-in-from-top-4 duration-300">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-rose-100 dark:border-rose-900/20 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Doctor Name</label>
                   <input value={newDoc.name} onChange={(e) => setNewDoc({...newDoc, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white" placeholder="e.g. Dr. Arul" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Specialty</label>
                   <input value={newDoc.spec} onChange={(e) => setNewDoc({...newDoc, spec: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl text-slate-900 dark:text-white" placeholder="e.g. Physician" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Availability</label>
                   <input value={newDoc.avail} onChange={(e) => setNewDoc({...newDoc, avail: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl text-slate-900 dark:text-white" placeholder="e.g. 10 AM - 4 PM" />
                </div>
                <button onClick={handleAdd} className="bg-rose-600 text-white w-full py-4 rounded-xl font-bold shadow-lg hover:bg-rose-700 transition-all active:scale-95">Save Changes</button>
             </div>
          </section>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
           {doctors.map((doc) => (
             <div key={doc.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-slate-50 dark:border-white/5 group hover:border-rose-200 dark:hover:border-rose-900 transition-all relative overflow-hidden">
                <div className="flex items-center gap-6 mb-8">
                   <div className="p-5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-[2rem] group-hover:bg-rose-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                      <User size={30} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{doc.name}</h3>
                      <div className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">{doc.spec}</div>
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-white/5">
                   <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <Clock size={14} className="text-slate-300 dark:text-slate-600" />
                      {doc.avail}
                   </div>
                   <div className="flex items-center justify-between">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${doc.status === 'Available' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                         {doc.status}
                      </div>
                      <div className="flex gap-2 opacity-60 group-hover:opacity-100">
                         <button className="p-2.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"><Edit size={18} /></button>
                         <button onClick={() => handleDelete(doc.id)} className="p-2.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><Trash2 size={18} /></button>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </section>


        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 mt-16 border-b pb-8 border-slate-200">
           <div className="space-y-1 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{language === 'en' ? 'Health Camps' : 'சுகாதார முகாம்கள்'}</h2>
              <p className="text-slate-400 dark:text-slate-500 font-medium">{language === 'en' ? 'Organize vaccination drives and medical camps.' : 'தடுப்பூசி இயக்கங்கள் மற்றும் மருத்துவ முகாம்களை ஏற்பாடு செய்யவும்.'}</p>
           </div>
           <button 
             onClick={() => setIsAddingCamp(!isAddingCamp)}
             className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${isAddingCamp ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
           >
             {isAddingCamp ? <X size={20} /> : <Plus size={20} />}
             {isAddingCamp ? 'Cancel' : (language === 'en' ? 'Add Camp' : 'முகாமைச் சேர்')}
           </button>
        </header>

        {isAddingCamp && (
           <section className="mb-12 animate-in slide-in-from-top-4 duration-300">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-indigo-100 dark:border-indigo-900/20 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Vaccination Name / Camp Name</label>
                       <input value={newCamp.name} onChange={(e) => setNewCamp({...newCamp, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" placeholder="e.g. Polio Vaccination" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Date Conducted</label>
                       <input type="date" value={newCamp.date} onChange={(e) => setNewCamp({...newCamp, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Location</label>
                       <input value={newCamp.location} onChange={(e) => setNewCamp({...newCamp, location: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" placeholder="e.g. Village Sub-Centre" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Additional Details</label>
                       <input value={newCamp.details} onChange={(e) => setNewCamp({...newCamp, details: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" placeholder="e.g. 9 AM - 5 PM, for age 0-5" />
                    </div>
                 </div>
                 <button onClick={handleAddCamp} className="bg-indigo-600 text-white w-full py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95">Save Camp Details</button>
              </div>
           </section>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
           {camps.map((camp) => (
              <div key={camp.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-slate-50 dark:border-white/5 group hover:border-indigo-200 dark:hover:border-indigo-900 transition-all relative overflow-hidden">
                 <div className="flex items-center gap-6 mb-8">
                    <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-[2rem] group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                       <Syringe size={30} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 dark:text-white">{camp.name}</h3>
                       <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{camp.date}</div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-white/5">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                       <MapPin size={14} className="text-slate-300 dark:text-slate-600" />
                       {camp.location}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                       <Clock size={14} className="text-slate-300 dark:text-slate-600" />
                       {camp.details}
                    </div>
                    <div className="flex items-center justify-end">
                       <div className="flex gap-2">
                          <button onClick={() => handleDeleteCamp(camp.id)} className="p-2.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </section>

         <section className="mt-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden transition-colors">
           <header className="p-8 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-4">
                 <div className="bg-rose-600 text-white p-3 rounded-2xl shadow-lg ring-4 ring-rose-50 dark:ring-rose-900/20">
                    <User size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{language === 'en' ? 'Registered Citizens' : 'பதிவு செய்யப்பட்ட குடிமக்கள்'}</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">{language === 'en' ? 'People who have signed up for ongoing camps and drives.' : 'நடந்து வரும் முகாம்களுக்குப் பதிவு செய்தவர்கள்.'}</p>
                 </div>
              </div>
              <button 
                onClick={() => {
                   localStorage.removeItem('smartgram-registrations');
                   setRegistrations([]);
                }}
                className="text-slate-400 hover:text-red-600 font-bold text-sm px-4 py-2 hover:bg-red-50 rounded-xl transition-all"
              >
                 {language === 'en' ? 'Clear All Data' : 'அனைத்து தரவையும் அழி'}
              </button>
           </header>
           
           <div className="overflow-x-auto">
              {registrations.length > 0 ? (
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                         <th className="px-8 py-4">Citizen Name</th>
                         <th className="px-8 py-4">Contact Info</th>
                         <th className="px-8 py-4">Target Camp</th>
                         <th className="px-8 py-4">Registered On</th>
                         <th className="px-8 py-4">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                      {registrations.map((reg, idx) => (
                        <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="font-bold text-slate-900 dark:text-white">{reg.name}</div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter">{reg.id}</div>
                           </td>
                           <td className="px-8 py-6 text-slate-600 dark:text-slate-400 font-medium">{reg.phone}</td>
                           <td className="px-8 py-6">
                              <span className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-lg text-xs font-bold ring-1 ring-rose-200 dark:ring-rose-900/30">{reg.campName}</span>
                           </td>
                           <td className="px-8 py-6 text-slate-500 dark:text-slate-400 text-sm">{reg.timestamp}</td>
                           <td className="px-8 py-6">
                              <span className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                 Confirmed
                              </span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              ) : (
                <div className="p-20 text-center space-y-4">
                   <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600">
                      <User size={40} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{language === 'en' ? 'No registrations yet' : 'இன்னும் பதிவுகள் இல்லை'}</h3>
                      <p className="text-slate-400 dark:text-slate-500">{language === 'en' ? 'Data will appear here once villagers register through the portal.' : 'கிராம மக்கள் போர்டல் மூலம் பதிவு செய்தவுடன் தரவு இங்கே தோன்றும்.'}</p>
                   </div>
                </div>
              )}
           </div>
         </section>

        <section className="mt-12 bg-gradient-to-br from-rose-600 to-rose-800 p-10 rounded-[3rem] text-white shadow-2xl shadow-rose-900/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <ShieldPlus size={150} />
           </div>
           <div className="relative flex flex-col md:flex-row items-center gap-10">
              <div className="bg-white/10 p-10 rounded-[4rem] backdrop-blur-sm border border-white/20">
                 <HeartPulse size={60} />
              </div>
              <div className="space-y-6 flex-1 text-center md:text-left">
                 <h2 className="text-3xl font-black">{language === 'en' ? 'Healthcare Administration' : 'சுகாதார நிர்வாகம்'}</h2>
                 <p className="text-rose-50/90 text-xl font-medium max-w-2xl leading-relaxed">
                    Monitor health drives and manage doctor availability to ensure seamless healthcare services for our citizens.
                 </p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                    <div className="bg-rose-100/10 px-6 py-3 rounded-2xl border border-white/20 font-bold text-sm">Active Doctors: {doctors.filter(d => d.status === 'Available').length}</div>
                    <div className="bg-rose-100/10 px-6 py-3 rounded-2xl border border-white/20 font-bold text-sm">Scheduled Camps: {camps.length}</div>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
