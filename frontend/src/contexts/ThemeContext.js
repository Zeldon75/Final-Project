import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  HERITAGE: 'heritage',
  MODERN: 'modern'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('darwaza-theme');
    return saved || null; // null means user hasn't chosen yet
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darwaza-dark-mode');
    return saved === 'true';
  });
  
  const [seniorMode, setSeniorMode] = useState(() => {
    const saved = localStorage.getItem('darwaza-senior-mode');
    return saved === 'true';
  });

  useEffect(() => {
    if (theme) {
      localStorage.setItem('darwaza-theme', theme);
      document.documentElement.classList.remove('theme-heritage', 'theme-modern');
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('darwaza-dark-mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('darwaza-senior-mode', seniorMode);
    if (seniorMode) {
      document.documentElement.classList.add('senior-mode');
    } else {
      document.documentElement.classList.remove('senior-mode');
    }
  }, [seniorMode]);

  const selectTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const toggleSeniorMode = () => {
    setSeniorMode(prev => !prev);
  };

  const resetTheme = () => {
    setTheme(null);
    localStorage.removeItem('darwaza-theme');
  };

  const themeColors = theme === THEMES.HERITAGE ? {
    primary: '#8D1C1C',
    primaryForeground: '#FDF6E3',
    background: darkMode ? '#1A1A1A' : '#FDF6E3',
    foreground: darkMode ? '#FDF6E3' : '#1A1A1A',
    accent: '#D97706',
    muted: darkMode ? '#2A2A2A' : '#E8DCCA',
    card: darkMode ? '#2A2A2A' : '#FDF6E3',
    border: '#8D1C1C'
  } : {
    primary: '#1D4ED8',
    primaryForeground: '#F9FAFB',
    background: darkMode ? '#0F172A' : '#F8FAFC',
    foreground: darkMode ? '#F9FAFB' : '#0F172A',
    accent: '#F59E0B',
    muted: darkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
    card: darkMode ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    border: darkMode ? 'rgba(255,255,255,0.2)' : '#E2E8F0'
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      selectTheme,
      resetTheme,
      darkMode,
      toggleDarkMode,
      seniorMode,
      toggleSeniorMode,
      themeColors,
      isHeritage: theme === THEMES.HERITAGE,
      isModern: theme === THEMES.MODERN,
      hasSelectedTheme: theme !== null
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
