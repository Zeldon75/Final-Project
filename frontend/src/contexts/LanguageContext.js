import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  ar: {
    translation: {
      // Navigation
      "home": "الرئيسية",
      "ai_hub": "مركز الذكاء الاصطناعي",
      "seniors": "بوابة المتقاعدين",
      "youth": "تمكين الشباب",
      "kids": "عالم الأطفال",
      "cooking": "ركن الطبخ",
      "tourists": "دليل السياح",
      "arab_world": "العالم العربي",
      "subscriptions": "الاشتراكات",
      "profile": "الملف الشخصي",
      "login": "تسجيل الدخول",
      "logout": "تسجيل الخروج",
      "register": "إنشاء حساب",
      
      // Welcome Page
      "welcome_title": "مرحباً بك في دروازة",
      "welcome_subtitle": "بوابتك إلى التراث الكويتي",
      "choose_interface": "اختر واجهتك",
      "heritage_interface": "الواجهة التراثية",
      "heritage_desc": "تجربة أصيلة مع لمسات تقليدية",
      "modern_interface": "الواجهة العصرية",
      "modern_desc": "تصميم حديث وأنيق",
      
      // Common
      "explore": "استكشف",
      "learn_more": "اعرف المزيد",
      "get_started": "ابدأ الآن",
      "view_all": "عرض الكل",
      "search": "بحث",
      "filter": "تصفية",
      "sort": "ترتيب",
      "price": "السعر",
      "category": "الفئة",
      "date": "التاريخ",
      "status": "الحالة",
      "active": "نشط",
      "live": "مباشر",
      "upcoming": "قادم",
      "completed": "مكتمل",
      
      // AI Hub
      "ai_mentor": "المرشد الذكي",
      "select_model": "اختر النموذج",
      "type_message": "اكتب رسالتك...",
      "send": "إرسال",
      "chat_history": "سجل المحادثات",
      
      // Seniors
      "marketplace": "سوق التحف",
      "tale_councils": "مجالس الحكايات",
      "expertise_academy": "أكاديمية الخبرات",
      "sell_item": "بيع منتج",
      "host_council": "استضافة مجلس",
      
      // Subscriptions
      "choose_plan": "اختر خطتك",
      "monthly": "شهري",
      "yearly": "سنوي",
      "subscribe": "اشترك",
      "features": "المميزات",
      "free": "مجاني",
      "family": "العائلة",
      "heritage_plus": "التراث المميز",
      
      // Auth
      "email": "البريد الإلكتروني",
      "password": "كلمة المرور",
      "confirm_password": "تأكيد كلمة المرور",
      "name": "الاسم",
      "continue_with_google": "المتابعة مع جوجل",
      "or": "أو",
      "already_have_account": "لديك حساب؟",
      "dont_have_account": "ليس لديك حساب؟",
      
      // Footer
      "about_us": "من نحن",
      "contact": "اتصل بنا",
      "privacy": "الخصوصية",
      "terms": "الشروط",
      "copyright": "© 2025 دروازة. جميع الحقوق محفوظة."
    }
  },
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "ai_hub": "AI Hub",
      "seniors": "Seniors Gateway",
      "youth": "Youth Empowerment",
      "kids": "Kids World",
      "cooking": "Cooking Corner",
      "tourists": "Tourist Guide",
      "arab_world": "Arab World",
      "subscriptions": "Subscriptions",
      "profile": "Profile",
      "login": "Login",
      "logout": "Logout",
      "register": "Register",
      
      // Welcome Page
      "welcome_title": "Welcome to Darwaza",
      "welcome_subtitle": "Your Gateway to Kuwaiti Heritage",
      "choose_interface": "Choose Your Interface",
      "heritage_interface": "Heritage Interface",
      "heritage_desc": "An authentic experience with traditional touches",
      "modern_interface": "Modern Interface",
      "modern_desc": "Sleek and contemporary design",
      
      // Common
      "explore": "Explore",
      "learn_more": "Learn More",
      "get_started": "Get Started",
      "view_all": "View All",
      "search": "Search",
      "filter": "Filter",
      "sort": "Sort",
      "price": "Price",
      "category": "Category",
      "date": "Date",
      "status": "Status",
      "active": "Active",
      "live": "Live",
      "upcoming": "Upcoming",
      "completed": "Completed",
      
      // AI Hub
      "ai_mentor": "AI Mentor",
      "select_model": "Select Model",
      "type_message": "Type your message...",
      "send": "Send",
      "chat_history": "Chat History",
      
      // Seniors
      "marketplace": "Antique Market",
      "tale_councils": "Tale Councils",
      "expertise_academy": "Expertise Academy",
      "sell_item": "Sell Item",
      "host_council": "Host Council",
      
      // Subscriptions
      "choose_plan": "Choose Your Plan",
      "monthly": "Monthly",
      "yearly": "Yearly",
      "subscribe": "Subscribe",
      "features": "Features",
      "free": "Free",
      "family": "Family",
      "heritage_plus": "Heritage Plus",
      
      // Auth
      "email": "Email",
      "password": "Password",
      "confirm_password": "Confirm Password",
      "name": "Name",
      "continue_with_google": "Continue with Google",
      "or": "or",
      "already_have_account": "Already have an account?",
      "dont_have_account": "Don't have an account?",
      
      // Footer
      "about_us": "About Us",
      "contact": "Contact",
      "privacy": "Privacy",
      "terms": "Terms",
      "copyright": "© 2025 Darwaza. All rights reserved."
    }
  },
  es: {
    translation: {
      "home": "Inicio",
      "ai_hub": "Centro de IA",
      "seniors": "Portal de Mayores",
      "youth": "Empoderamiento Juvenil",
      "kids": "Mundo Infantil",
      "cooking": "Rincón de Cocina",
      "tourists": "Guía Turística",
      "arab_world": "Mundo Árabe",
      "subscriptions": "Suscripciones",
      "profile": "Perfil",
      "login": "Iniciar Sesión",
      "logout": "Cerrar Sesión",
      "register": "Registrarse",
      "welcome_title": "Bienvenido a Darwaza",
      "welcome_subtitle": "Tu Puerta al Patrimonio Kuwaití",
      "choose_interface": "Elige Tu Interfaz",
      "heritage_interface": "Interfaz Patrimonial",
      "heritage_desc": "Una experiencia auténtica con toques tradicionales",
      "modern_interface": "Interfaz Moderna",
      "modern_desc": "Diseño elegante y contemporáneo"
    }
  },
  fr: {
    translation: {
      "home": "Accueil",
      "ai_hub": "Centre IA",
      "seniors": "Portail des Aînés",
      "welcome_title": "Bienvenue à Darwaza",
      "welcome_subtitle": "Votre Porte vers le Patrimoine Koweïtien"
    }
  },
  ja: {
    translation: {
      "home": "ホーム",
      "ai_hub": "AIハブ",
      "welcome_title": "ダルワザへようこそ",
      "welcome_subtitle": "クウェートの遺産への入り口"
    }
  },
  zh: {
    translation: {
      "home": "首页",
      "ai_hub": "AI中心",
      "welcome_title": "欢迎来到Darwaza",
      "welcome_subtitle": "通往科威特遗产的大门"
    }
  },
  ru: {
    translation: {
      "home": "Главная",
      "ai_hub": "AI Центр",
      "welcome_title": "Добро пожаловать в Darwaza",
      "welcome_subtitle": "Ваши врата к кувейтскому наследию"
    }
  },
  hi: {
    translation: {
      "home": "होम",
      "ai_hub": "AI हब",
      "welcome_title": "Darwaza में आपका स्वागत है",
      "welcome_subtitle": "कुवैती विरासत का द्वार"
    }
  }
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

const RTL_LANGUAGES = ['ar'];

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇰🇼' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('darwaza-language') || 'ar';
  });

  const isRTL = RTL_LANGUAGES.includes(language);

  useEffect(() => {
    localStorage.setItem('darwaza-language', language);
    i18n.changeLanguage(language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      isRTL,
      languages: LANGUAGES,
      t: i18n.t.bind(i18n)
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default i18n;
