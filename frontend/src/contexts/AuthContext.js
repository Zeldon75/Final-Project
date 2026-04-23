import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('darwaza-token'));

  const checkAuth = useCallback(async () => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }

    // 🚀 [التعديل الجديد]: إذا كانت التذكرة هي تذكرة العرض الوهمية، لا تسأل السيرفر!
    if (token === "darwaza_vip_pass_2026") {
      setUser({ name: "ناصر الخالدي", email: "user@darwaza.com" });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('darwaza-token');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    // تسجيل دخول وهمي (للعرض فقط)
    const fakeToken = "darwaza_vip_pass_2026";
    const fakeUser = { name: "ناصر الخالدي", email: email };

    setToken(fakeToken);
    setUser(fakeUser);
    localStorage.setItem('darwaza-token', fakeToken);
    return fakeUser;
  };

  const register = async (userData) => {
    // إنشاء حساب وهمي (للعرض فقط)
    const fakeToken = "darwaza_vip_pass_2026";
    const fakeUser = { 
      name: userData.name || "ناصر الخالدي", 
      email: userData.email 
    };

    setToken(fakeToken);
    setUser(fakeUser);
    localStorage.setItem('darwaza-token', fakeToken);
    return fakeUser;
  };

  const loginWithGoogle = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const exchangeSession = async (sessionId) => {
    const response = await axios.post(
      `${API_URL}/api/auth/session`,
      { session_id: sessionId },
      { withCredentials: true }
    );
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('darwaza-token');
  };

  const updatePreferences = async (preferences) => {
    const response = await axios.put(
      `${API_URL}/api/auth/preferences`,
      preferences,
      {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    setUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      token,
      isAuthenticated: !!user,
      login,
      register,
      loginWithGoogle,
      exchangeSession,
      logout,
      updatePreferences,
      checkAuth
    }}>
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