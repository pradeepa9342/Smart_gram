'use client';

import React, { useState } from 'react';
import { X, CheckCircle, BrainCircuit, User, Phone, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface RegistrationModalProps {
  camp: any;
  onClose: () => void;
}

export default function RegistrationModal({ camp, onClose }: RegistrationModalProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', age: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save to "smartgram-registrations" for Admin Dashboard
    const registration = {
      id: `REG-${Date.now()}`,
      ...formData,
      campName: camp.name,
      campId: camp.id,
      timestamp: new Date().toLocaleString()
    };

    const existingRaw = localStorage.getItem('smartgram-registrations');
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    localStorage.setItem('smartgram-registrations', JSON.stringify([registration, ...existing]));

    // Simulate AI processing
    setTimeout(() => {
      setStep(3);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-rose-600 p-8 text-white flex justify-between items-start relative">
          <div className="space-y-1">
            <div className="text-rose-200 text-xs font-black uppercase tracking-widest">{language === 'en' ? 'Camp Registration' : 'முகாம் பதிவு'}</div>
            <h3 className="text-3xl font-black">{camp.name}</h3>
          </div>
          <button onClick={onClose} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-8">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 flex items-center gap-4">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl text-rose-600 shadow-sm">
                  <BrainCircuit size={24} />
                </div>
                <div>
                   <div className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-1">{language === 'en' ? 'AI Suggestion' : 'AI ஆலோசனை'}</div>
                   <p className="text-rose-900/70 dark:text-rose-300/70 font-bold text-sm leading-relaxed">
                      {language === 'en' 
                        ? 'For this camp, we recommend bringing your ID card and any previous medical records for a faster checkup.' 
                        : 'இந்த முகாமிற்கு, விரைவான பரிசோதனைக்காக உங்கள் அடையாள அட்டை மற்றும் முந்தைய மருத்துவ பதிவுகளை எடுத்து வருமாறு பரிந்துரைக்கிறோம்.'}
                   </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest px-2">
                   <Calendar size={16} /> {camp.date} 
                   <span className="opacity-20">•</span>
                   <MapPin size={16} /> {camp.location}
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/20 active:scale-95"
                >
                  {language === 'en' ? 'Proceed to Register' : 'பதிவு செய்ய தொடரவும்'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">{language === 'en' ? 'Full Name' : 'முழு பெயர்'}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-4 focus:ring-rose-100 dark:focus:ring-rose-900/30 transition-all outline-none"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">{language === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-4 focus:ring-rose-100 dark:focus:ring-rose-900/30 transition-all outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/20 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  language === 'en' ? 'Confirm Registration' : 'பதிவை உறுதிப்படுத்து'
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-500">
               <div className="bg-emerald-100 text-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle size={48} />
               </div>
               <div>
                  <h4 className="text-3xl font-black text-slate-900">{language === 'en' ? 'Registered!' : 'பதிவு செய்யப்பட்டது!'}</h4>
                  <p className="text-slate-500 font-medium mt-2">
                    {language === 'en' 
                      ? 'You have successfully registered for the camp. A confirmation SMS has been sent.' 
                      : 'நீங்கள் முகாமிற்கு வெற்றிகரமாக பதிவு செய்துள்ளீர்கள். உறுதிப்படுத்தல் SMS அனுப்பப்பட்டுள்ளது.'}
                  </p>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration ID</div>
                  <div className="text-xl font-black text-slate-900">SG-CAMP-{Math.floor(Math.random() * 9000) + 1000}</div>
               </div>
               <button 
                onClick={onClose}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
               >
                 {language === 'en' ? 'Close Window' : 'சாளரத்தை மூடு'}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
