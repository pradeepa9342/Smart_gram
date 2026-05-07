'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, RefreshCw, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CropSuggestionCard() {
  const { language } = useLanguage();
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock environmental data (usually from weather API)
      const res = await fetch('/api/crop-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: 29,
          humidity: 62,
          season: 'Summer'
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuggestion(data);
    } catch (err: any) {
      setError(err.message || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuggestion();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 flex flex-col h-full relative overflow-hidden group transition-colors duration-300">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
         <Sprout size={150} />
      </div>

      <header className="flex items-center justify-between mb-8 relative">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl shadow-inner">
            <Sprout size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{language === 'en' ? 'AI Crop Suggestion' : 'AI பயிர் ஆலோசனை'}</h3>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-black uppercase tracking-widest mt-1">
               <Sparkles size={12} />
               {language === 'en' ? 'Powered by Groq' : 'Groq மூலம் இயக்கப்படுகிறது'}
            </div>
          </div>
        </div>
        <button 
          onClick={getSuggestion}
          disabled={loading}
          className="p-3 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all disabled:animate-spin"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="flex-1 relative">
        {loading ? (
          <div className="space-y-4 animate-pulse py-4">
            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-3/4" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full" />
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-rose-600 flex items-start gap-4 h-full">
            <AlertCircle className="shrink-0" size={24} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        ) : suggestion ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-lg shadow-lg">
                {suggestion.recommendedCrop}
             </div>
              <p className="text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                 {suggestion.reason}
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                 <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Expert Tip</div>
                 <div className="text-slate-700 dark:text-slate-200 font-bold text-sm italic">"{suggestion.farmingTip}"</div>
              </div>
          </div>
        ) : (
          <div className="text-slate-400 font-medium py-10 text-center italic">
             Ready to analyze farming data...
          </div>
        )}
      </div>

      <footer className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
         {language === 'en' ? 'View Gardening Cycle' : 'தோட்டக்கலை சுழற்சியைப் பார்க்கவும்'}
         <ChevronRight size={14} />
      </footer>
    </div>
  );
}
