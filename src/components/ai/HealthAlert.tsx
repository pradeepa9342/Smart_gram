'use client';

import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, Syringe, Heart, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import RegistrationModal from './RegistrationModal';

export default function HealthAlert() {
  const { language } = useLanguage();
  const [showAlert, setShowAlert] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  if (!showAlert) return null;

  const advisoryCamp = {
    id: 'advisory-camp',
    name: language === 'en' ? 'Mega Vaccination Drive' : 'மெகா தடுப்பூசி முகாம்',
    date: 'Next Monday, April 20',
    location: language === 'en' ? 'Village Primary Health Centre' : 'கிராம ஆரம்ப சுகாதார நிலையம்',
    details: language === 'en' ? 'Children under 5 years' : '5 வயதிற்குட்பட்ட குழந்தைகள்'
  };

  return (
    <>
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500 mb-8 mt-12">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <Sparkles size={120} />
        </div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/20 p-5 rounded-[2rem] backdrop-blur-md border border-white/20 shadow-xl">
            <Bell size={40} className="animate-bounce" />
          </div>
          
          <div className="flex-1 space-y-2 text-center md:text-left">
             <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/20 mb-2">
               <Sparkles size={12} />
               {language === 'en' ? 'AI Smart Notification' : 'AI ஸ்மார்ட் அறிவிப்பு'}
             </div>
             <h2 className="text-3xl font-black">{language === 'en' ? 'Health Checkup Advisory' : 'சுகாதார பரிசோதனை ஆலோசனை'}</h2>
             <p className="text-rose-50 text-xl font-medium opacity-90 leading-relaxed max-w-2xl">
                {language === 'en' 
                   ? 'Based on your area trends, a free vaccination drive is suggested for children under 5 next week. Please register early.' 
                   : 'உங்கள் பகுதி போக்குகளின் அடிப்படையில், அடுத்த வாரம் 5 வயதிற்குட்பட்ட குழந்தைகளுக்கு இலவச தடுப்பூசி முகாம் பரிந்துரைக்கப்படுகிறது.'}
             </p>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={() => setShowBooking(true)}
               className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-rose-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
             >
               {language === 'en' ? 'Book Slot' : 'முன்பதிவு செய்'}
             </button>
             <button 
               onClick={() => setShowAlert(false)}
               className="bg-white/10 text-white p-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10"
             >
               <X size={24} />
             </button>
          </div>
        </div>
      </div>

      {showBooking && (
        <RegistrationModal 
          camp={advisoryCamp} 
          onClose={() => setShowBooking(false)} 
        />
      )}
    </>
  );
}
