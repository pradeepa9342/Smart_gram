'use client';

import React, { useState } from 'react';
import { Sprout, Search, Thermometer, CloudRain, CalendarDays, ArrowRight, BrainCircuit } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CropRecommendation() {
  const { language } = useLanguage();
  const [temp, setTemp] = useState<string>('25');
  const [season, setSeason] = useState<string>('Summer');
  const [humidity, setHumidity] = useState<string>('60');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const getRecommendation = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/crop-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          temperature: parseInt(temp), 
          humidity: parseInt(humidity), 
          season 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendation({ 
          crop: data.recommendedCrop, 
          alternative: data.alternativeCrop,
          reason: data.reason,
          tip: data.farmingTip
        });
      } else {
        throw new Error(data.error || 'Failed to get recommendation');
      }
    } catch (err) {
      console.error('AI Suggestion Error:', err);
      // Fallback
      setRecommendation({ 
        crop: language === 'en' ? 'Paddy' : 'நெல்', 
        reason: language === 'en' ? 'AI service temporarily unavailable. Standard recommendation provided.' : 'AI சேவை தற்காலிகமாக இல்லை. வழக்கமான பரிந்துரை வழங்கப்படுகிறது.' 
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-2xl">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{language === 'en' ? 'AI Crop Suggestion' : 'AI பயிர் பரிந்துரை'}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{language === 'en' ? 'Smart analysis based on environmental factors' : 'சுற்றுச்சூழல் காரணிகளின் அடிப்படையில் ஸ்மார்ட் பகுப்பாய்வு'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">{language === 'en' ? 'Temperature (°C)' : 'வெப்பநிலை'}</label>
          <div className="relative">
            <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
            <input 
              type="number" 
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">{language === 'en' ? 'Season' : 'பருவம்'}</label>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
            <select 
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 transition-all outline-none appearance-none"
            >
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
              <option value="Monsoon">Monsoon</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">{language === 'en' ? 'Humidity (%)' : 'ஈரப்பதம்'}</label>
          <div className="relative">
            <CloudRain className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
            <input 
              type="number" 
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={getRecommendation}
        disabled={analyzing}
        className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 disabled:opacity-50"
      >
        {analyzing ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
            {language === 'en' ? 'Analyzing Data...' : 'பகுப்பாய்வு செய்கிறது...'}
          </div>
        ) : (
          <>
            <Search size={24} />
            {language === 'en' ? 'Get AI Recommendation' : 'AI பரிந்துரையைப் பெறுங்கள்'}
          </>
        )}
      </button>

      {recommendation && (
        <div className="mt-8 p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800/30 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-emerald-200/50 dark:shadow-black/40 flex flex-col items-center gap-2 min-w-[140px]">
              <Sprout size={48} className="text-emerald-600 dark:text-emerald-400" />
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50">Recommended</div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-emerald-700 dark:text-emerald-300 font-black text-3xl mb-1">{recommendation.crop}</div>
                <p className="text-emerald-800/70 dark:text-emerald-400/80 font-medium text-lg leading-relaxed">{recommendation.reason}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-100 dark:border-emerald-800/30">
                {recommendation.alternative && (
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 dark:text-emerald-400/50 mb-1">Alternative</div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-100">{recommendation.alternative}</div>
                  </div>
                )}
                {recommendation.tip && (
                  <div className="bg-emerald-600 text-white p-4 rounded-2xl">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Expert Tip</div>
                    <div className="font-bold text-sm">{recommendation.tip}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
