'use client';

import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always force light mode — remove any saved dark class
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('smartgram-theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
