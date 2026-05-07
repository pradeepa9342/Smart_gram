'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

type Role = 'ADMIN' | 'USER' | null;

interface AuthContextProps {
  user: User | null;
  role: Role;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
  setAuthManual: (u: User, r: Role) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Instant Demo Restore (Client Side only)
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('smartgram-role') as Role;
      if (savedRole && !user) {
        setUser({ email: savedRole === 'ADMIN' ? 'admin@smartgram.gov' : 'user@smartgram.gov' } as any);
        setRole(savedRole);
        setLoading(false); // Immediate unlock for demo
      }
    }

    // 2. Background Sync (Supplements demo role)
    const sync = async () => {
       try {
         const { data: { session } } = await supabase.auth.getSession();
         if (session?.user) {
            setSession(session);
            setUser(session.user);
            const userType = session.user.user_metadata.role as Role || 'USER';
            setRole(userType);
            localStorage.setItem('smartgram-role', userType || '');
         }
       } catch (e) {
         // Silently ignore supabase issues in demo
       } finally {
         setLoading(false); // Final unlock
       }
    };

    sync();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        const userType = session.user.user_metadata.role as Role || 'USER';
        setRole(userType);
        localStorage.setItem('smartgram-role', userType || '');
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        localStorage.removeItem('smartgram-role');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    localStorage.removeItem('smartgram-role');
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setRole(null);
    window.location.href = '/';
  };

  const setAuthManual = (u: any, r: Role) => {
    setUser(u);
    setRole(r);
    localStorage.setItem('smartgram-role', r || '');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, session, loading, logout, setAuthManual }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
