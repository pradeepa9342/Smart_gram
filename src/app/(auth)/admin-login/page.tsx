'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
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
      if (email === 'admin@smartgram.gov' && password === 'admin123') {
        setAuthManual({ email } as any, 'ADMIN');
        router.push('/admin/dashboard');
      } else {
        setError(language === 'en' ? 'Demo Admin: admin@smartgram.gov / admin123' : 'நிர்வாகி டெமோ: admin@smartgram.gov / admin123 ஐப் பயன்படுத்தவும்');
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
      setAuthManual(data.user, 'ADMIN');
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={20} />
        {language === 'en' ? 'Back' : 'திரும்பிச் செல்க'}
      </Link>

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-800 to-emerald-600" />
        
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="text-center space-y-2">
            <div className="bg-slate-800 text-white w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg ring-4 ring-slate-100">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.auth.admin_login}</h1>
            <p className="text-slate-500">{language === 'en' ? 'Village Authority Control' : 'கிராம அதிகாரம் கட்டுப்பாட்டுத் மையம்'}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 animate-pulse text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder={t.auth.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all caret-slate-800"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder={t.auth.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all caret-slate-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-slate-800/20"
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
          
          <div className="text-center pt-4 text-xs text-slate-400 italic">
            {language === 'en' ? 'Authorized personnel access only.' : 'அங்கீகரிக்கப்பட்ட பணியாளர்கள் மட்டுமே அணுக முடியும்.'}
          </div>
        </div>
      </div>
    </div>
  );
}
