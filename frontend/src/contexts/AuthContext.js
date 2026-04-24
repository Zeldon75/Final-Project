import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('darwaza-token'));

  const checkAuth = useCallback(async () => {
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }

    if (token === "darwaza_vip_pass_2026") {
      const savedUser = localStorage.getItem('darwaza-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({ name: "ناصر الخالدي", email: "user@darwaza.com", category: "youth", avatar: null });
      }
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
      localStorage.removeItem('darwaza-user');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const fakeToken = "darwaza_vip_pass_2026";
    const savedUser = localStorage.getItem('darwaza-user');
    const fakeUser = savedUser ? JSON.parse(savedUser) : { name: "مستخدم جديد", email: email, category: "youth" };

    setToken(fakeToken);
    setUser(fakeUser);
    localStorage.setItem('darwaza-token', fakeToken);
    
    if (!savedUser) {
      localStorage.setItem('darwaza-user', JSON.stringify(fakeUser));
    }
    return fakeUser;
  };

  const register = async (userData) => {
    const fakeToken = "darwaza_vip_pass_2026";
    const fakeUser = { 
      name: userData.name, 
      email: userData.email,
      username: userData.username,
      phone: userData.phone,
      gender: userData.gender,
      category: userData.category || 'youth',
      avatar: null // الصورة الافتراضية فارغة
    };

    setToken(fakeToken);
    setUser(fakeUser);
    localStorage.setItem('darwaza-token', fakeToken);
    localStorage.setItem('darwaza-user', JSON.stringify(fakeUser)); 
    return fakeUser;
  };

  // 🚀 [الجديد]: دالة تحديث بيانات المستخدم (الصورة، الاسم، الخ)
  const updateProfile = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('darwaza-user', JSON.stringify(newUser));
    return newUser;
  };

  const loginWithGoogle = () => {
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('darwaza-token');
    // لا نحذف 'darwaza-user' لنحتفظ ببياناته عند تسجيل الدخول مجدداً (في الوضع الوهمي)
  };

  return (
    <AuthContext.Provider value={{
      user, loading, token, isAuthenticated: !!user,
      login, register, loginWithGoogle, logout, updateProfile, checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};