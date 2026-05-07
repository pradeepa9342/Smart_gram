'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X, Send, User, CreditCard, Phone, CheckCircle2 } from 'lucide-react';

interface SchemeModalProps {
  scheme: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: any) => void;
}

export default function SchemeModal({ scheme, isOpen, onClose, onSubmit }: SchemeModalProps) {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    aadhar: '',
    phone: '',
    agreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ fullName: '', aadhar: '', phone: '', agreed: false });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 transition-colors">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t.schemes.form_title}</h2>
              <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-4 py-1 rounded-full text-sm font-bold inline-block border border-amber-100 dark:border-amber-900/40">
                {scheme.name}
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-500">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-8 rounded-full border-8 border-emerald-50 dark:border-emerald-900/20">
                <CheckCircle2 size={64} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t.schemes.success}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{language === 'en' ? 'Your application is being processed.' : 'உங்கள் விண்ணப்பம் பரிசீலிக்கப்படுகிறது.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    required
                    type="text"
                    placeholder={t.schemes.name}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-amber-50 dark:focus:ring-amber-900/20 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    required
                    type="text"
                    pattern="\d{12}"
                    maxLength={12}
                    placeholder={t.schemes.aadhar}
                    value={formData.aadhar}
                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value.replace(/\D/g, '') })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-amber-50 dark:focus:ring-amber-900/20 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    required
                    type="tel"
                    pattern="\d{10}"
                    maxLength={10}
                    placeholder={t.schemes.phone}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-amber-50 dark:focus:ring-amber-900/20 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
                <input
                  required
                  id="terms"
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded-lg accent-amber-600 dark:accent-amber-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer">
                  {language === 'en' 
                    ? 'I hereby declare that the information provided above is true and correct to the best of my knowledge.' 
                    : 'மேலே வழங்கப்பட்ட தகவல்கள் எனது அறிவுக்கு எட்டிய வரையில் உண்மையானவை மற்றும் சரியானவை என்று நான் இதன் மூலம் அறிவிக்கிறேன்.'}
                </label>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-slate-900 dark:bg-amber-600 text-white dark:text-slate-950 py-5 rounded-[1.5rem] font-black shadow-xl shadow-slate-900/10 dark:shadow-amber-900/20 hover:bg-slate-800 dark:hover:bg-amber-500 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                   <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    {t.schemes.submit}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
