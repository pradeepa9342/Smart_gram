'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WaterPrediction() {
  const { language } = useLanguage();

  const currentHour = new Date().getHours();
  const dynamicData = Array.from({ length: 8 }).map((_, i) => {
    const hour = (currentHour - 7 + i + 24) % 24;
    const isPrediction = i > 5;
    const timeLabel = hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
    return {
      time: i === 7 ? (language === 'en' ? 'Predicted' : 'கணிக்கப்பட்டது') : timeLabel,
      level: isPrediction ? 60 + Math.floor(Math.random() * 20) : 40 + Math.floor(Math.random() * 40),
      isPrediction
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 p-4 rounded-3xl">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{language === 'en' ? 'AI Water Prediction' : 'AI நீர் மட்ட கணிப்பு'}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{language === 'en' ? 'Smart forecasting based on consumption trends' : 'பயன்பாட்டு போக்குகளின் அடிப்படையில் ஸ்மார்ட் முன்னறிவிப்பு'}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle size={14} />
            {language === 'en' ? 'Stable Supply' : 'நிலையான விநியோகம்'}
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dynamicData}>
            <defs>
              <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="level" 
              stroke="#0ea5e9" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorLevel)" 
              dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-50 dark:border-white/5">
        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[2rem] flex items-center gap-4 border border-transparent dark:border-white/5">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm text-sky-600 dark:text-sky-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{language === 'en' ? 'Prediction for Tomorrow' : 'நாளைக்கான கணிப்பு'}</div>
            <div className="text-xl font-black text-slate-800 dark:text-slate-200">85% Capacity Peak</div>
          </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2rem] flex items-center gap-4 border border-amber-100 dark:border-amber-900/20">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-600/60 dark:text-amber-400/60">{language === 'en' ? 'Demand Alert' : 'தேவை எச்சரிக்கை'}</div>
            <div className="text-xl font-black text-amber-900 dark:text-amber-200">{language === 'en' ? 'High usage expected at 12PM' : 'மதியம் 12 மணிக்கு அதிக பயன்பாடு'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
