import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// قاموس دروازة المطور (عربي وإنجليزي فقط)
const resources = {
  ar: { translation: { 
    "home": "الرئيسية", 
    "login": "تسجيل الدخول",
    "explore": "استكشف",
    "filter": "تصفية",
    "search_placeholder": "ابحث عن التحف...",
    "ai_hub": "الذكاء الاصطناعي", 
    "seniors": "بوابة المتقاعدين", 
    "youth": "تمكين الشباب", 
    "kids": "عالم الأطفال",
    "tourist_title": "دليل السياح والمغتربين", 
    "tourist_subtitle": "دليلك الشامل لاكتشاف الكويت.",
    "etiquette": "الآداب", 
    "cuisine": "المطبخ", 
    "landmarks": "المعالم", 
    "social": "الاجتماعية",
    "useful_phrases": "عبارات مفيدة",
    "marketplace": "سوق التحف",
    "tale_councils": "مجالس الحكايات",
    "expertise_academy": "أكاديمية الخبرات",
    
    // كلمات صفحة الاشتراكات
    "choose_plan": "اختر الخطة",
    "yearly": "سنوي (وفر 20%)",
    "monthly": "شهري",
    "payment_method": "طريقة الدفع",
    "faq": "الأسئلة الشائعة"
  }},
  en: { translation: { 
    "home": "Home", 
    "login": "Login", 
    "explore": "Explore", 
    "filter": "Filter", 
    "search_placeholder": "Search Antiquities...",
    "ai_hub": "AI Hub", 
    "seniors": "Seniors Gateway", 
    "youth": "Youth Empowerment", 
    "kids": "Kids World",
    "tourist_title": "Tourist & Expat Guide", 
    "tourist_subtitle": "Your Complete Guide To Discovering Kuwait.",
    "etiquette": "Etiquette", 
    "cuisine": "Cuisine", 
    "landmarks": "Landmarks", 
    "social": "Social", 
    "useful_phrases": "Useful Phrases",
    "marketplace": "Marketplace", 
    "tale_councils": "Tale Councils", 
    "expertise_academy": "Expertise Academy",
    
    // Subscriptions Page Keys (Capitalized)
    "choose_plan": "Choose Plan",
    "yearly": "Yearly (Save 20%)",
    "monthly": "Monthly",
    "payment_method": "Payment Method",
    "faq": "Frequently Asked Questions"
  }}
};

// إبقاء لغتين فقط للقائمة المنسدلة
const languages = [
  { code: 'ar', name: 'العربية', flag: 'KW' },
  { code: 'en', name: 'English', flag: 'GB' }
];

const savedLanguage = localStorage.getItem('darwaza_lang') || 'ar';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(i18n.language);

  useEffect(() => {
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('darwaza_lang', language);
  }, [language]);

  const setLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageState(lng);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages, isRTL: language === 'ar', t: i18n.t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);