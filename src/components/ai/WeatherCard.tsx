'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WeatherCard() {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setWeather({
          temp: data.temperature,
          condition: data.weatherCondition,
          humidity: data.humidity,
          wind: data.wind,
          location: data.location
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-white dark:border-white/5 shadow-xl animate-pulse flex items-center gap-6 h-32">
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md shadow-xl border border-white/30">
            {weather.condition === 'Sunny' ? <Sun size={40} className="animate-spin-slow" /> : <Cloud size={40} />}
          </div>
          <div>
            <div className="text-4xl font-black">{weather.temp}°C</div>
            <div className="text-sky-100 font-bold tracking-tight opacity-90">
              {language === 'en' ? weather.condition : 'வெயில்'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-black uppercase tracking-widest text-white/60 mb-1">{weather.location}</div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <Droplets size={16} className="text-sky-200 mb-1" />
              <span className="text-xs font-bold">{weather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center">
              <Wind size={16} className="text-sky-200 mb-1" />
              <span className="text-xs font-bold">{weather.wind}km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
