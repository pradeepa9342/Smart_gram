'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LogOut, Globe, Home, Tractor, HeartPulse, Droplets, BookOpen, MessageSquare, Menu, X } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { user, role, logout, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  // If we are definitely logged out and not loading, don't show navbar
  if (!loading && !user) return null;

  // During initial hydration/loading, show a skeleton bar to prevent jump
  if (loading) {
     return <div className="bg-emerald-700 h-16 sm:h-20 w-full sticky top-0 z-50 animate-pulse flex items-center px-8 text-emerald-200/50 font-bold">SMART-GRAM</div>;
  }

  const isAdmin = role === 'ADMIN';

  const links = [
    { href: isAdmin ? '/admin/dashboard' : '/dashboard', icon: Home, label: t.nav.dashboard },
    { href: isAdmin ? '/admin/agriculture' : '/agriculture', icon: Tractor, label: t.nav.agriculture },
    { href: isAdmin ? '/admin/healthcare' : '/healthcare', icon: HeartPulse, label: t.nav.healthcare },
    { href: isAdmin ? '/admin/water' : '/water', icon: Droplets, label: t.nav.water },
    { href: isAdmin ? '/admin/schemes' : '/schemes', icon: BookOpen, label: t.nav.schemes },
    { href: isAdmin ? '/admin/complaints' : '/complaints', icon: MessageSquare, label: t.nav.complaints },
  ];

  return (
    <nav className="bg-emerald-700 dark:bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 font-bold text-lg sm:text-xl">
              <span className="bg-white text-emerald-700 p-1 rounded">SG</span>
              <span className="tracking-tight">SMART-GRAM</span>
            </Link>
            <div className="hidden xl:ml-6 xl:flex xl:space-x-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className="flex items-center justify-center p-2.5 rounded-xl hover:bg-white/10 transition-all active:scale-95"
                >
                  <link.icon size={20} />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationCenter role={isAdmin ? 'admin' : 'user'} />
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/20 bg-white/5 hover:bg-white/15 transition-all"
            >
              <Globe size={18} className="opacity-70" />
              <span className="hidden lg:inline">{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
            <button
              onClick={logout}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white text-emerald-800 hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
            >
              <LogOut size={18} />
              {t.nav.logout}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-emerald-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-emerald-600 pb-4 pt-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold hover:bg-emerald-600 transition-colors"
                >
                  <link.icon size={22} className="text-emerald-200" />
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-emerald-600 mt-2">
                 <button
                   onClick={logout}
                   className="flex w-full items-center gap-3 px-4 py-4 rounded-xl text-base font-bold bg-white/10 hover:bg-white/20 transition-colors"
                 >
                   <LogOut size={22} />
                   {t.nav.logout}
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
