import React from 'react';
import { useLocation, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Contexts
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import AIHubPage from './pages/AIHubPage';
import SeniorsPage from './pages/SeniorsPage';
import YouthPage from './pages/YouthPage';
import KidsPage from './pages/KidsPage';
import CookingPage from './pages/CookingPage';
import TouristsPage from './pages/TouristsPage';
import ArabWorldPage from './pages/ArabWorldPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import { LoginPage, RegisterPage } from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';

import './App.css';

// Route wrapper that checks for auth callback
const AppRouter = () => {
  const location = useLocation();
  const { hasSelectedTheme, darkMode, isHeritage, selectTheme, THEMES } = useTheme();
  
  // Check URL fragment for session_id (OAuth callback)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  // Allow auth pages to work even without theme selection
  const isAuthRoute = ['/login', '/register', '/auth/callback'].includes(location.pathname);
  
  // If user hasn't selected a theme yet and not on auth page, show welcome page
  if (!hasSelectedTheme && !isAuthRoute) {
    return <WelcomePage />;
  }
  
  // If on auth page without theme, temporarily use heritage theme
  if (!hasSelectedTheme && isAuthRoute) {
    // Don't save to localStorage, just use heritage for display
  }

  const effectiveIsHeritage = hasSelectedTheme ? isHeritage : true;
  const effectiveDarkMode = hasSelectedTheme ? darkMode : false;

  return (
    <div className={`min-h-screen flex flex-col ${
      effectiveDarkMode 
        ? effectiveIsHeritage ? 'bg-[#1A1A1A] text-[#FDF6E3]' : 'bg-[#0F172A] text-[#F9FAFB]'
        : effectiveIsHeritage ? 'bg-[#FDF6E3] text-[#1A1A1A]' : 'bg-[#F8FAFC] text-[#0F172A]'
    }`}>
      {hasSelectedTheme && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-hub" element={<AIHubPage />} />
          <Route path="/seniors" element={<SeniorsPage />} />
          <Route path="/youth" element={<YouthPage />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/cooking" element={<CookingPage />} />
          <Route path="/tourists" element={<TouristsPage />} />
          <Route path="/arab-world" element={<ArabWorldPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {hasSelectedTheme && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppRouter />
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                }
              }}
            />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
