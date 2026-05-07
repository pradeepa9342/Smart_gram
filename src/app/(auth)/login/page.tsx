'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ChevronRight, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t, language } = useLanguage();
  const { setAuthManual } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const isDummy = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (isDummy) {
      if (email === 'user@smartgram.gov' && password === 'user123') {
        setAuthManual({ email } as any, 'USER');
        router.push('/dashboard');
      } else {
        setError(language === 'en' ? 'Demo Login: use user@smartgram.gov / user123' : 'டெமோ உள்நுழைவு: user@smartgram.gov / user123 ஐப் பயன்படுத்தவும்');
        setIsLoading(false);
      }
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else if (data.user) {
      // For demo purposes, we will ensure metadata role is set if not already
      setAuthManual(data.user, 'USER');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center p-6">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-emerald-700 transition-colors">
        <ArrowLeft size={20} />
        {language === 'en' ? 'Back' : 'திரும்பிச் செல்க'}
      </Link>

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-sky-400" />
        
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.auth.user_login}</h1>
            <p className="text-slate-500">{language === 'en' ? 'Welcome back, Villager!' : 'மீண்டும் வருக, கிராமவாசி!'}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder={t.auth.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder={t.auth.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.auth.login}</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center space-y-4 text-sm font-medium">
            <div className="text-slate-500">
              {t.auth.no_account} <span className="text-emerald-600 hover:underline cursor-pointer">{t.auth.signup}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
