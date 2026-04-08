import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// قاموس دروازة المطور بعد مطابقة الكلمات الموجودة في الصورة بدقة
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
    "faq": "الأسئلة الشائعة",

    // كلمات صفحة بوابة المتقاعدين
    "seniors_desc": "شارك خبراتك، بيع تحفك الثمينة، واستضف مجالس الحكايات الحية.",
    "sell_item": "بيع تحفة",
    "host_council": "استضافة مجلس",
    "join_now": "انضم الآن",
    "start_stream": "ابدأ البث",
    "live_status": "مباشر",
    "upcoming_status": "قادم",
    "year_of_making": "سنة الصنع:",
    "item_description": "وصف التحفة:",
    "contact_seller": "تواصل مع البائع",
    "redirect_whatsapp": "سيتم تحويلك للواتساب",
    "login_first": "يرجى تسجيل الدخول أولاً",
    "joined_successfully": "تم الانضمام للمجلس بنجاح",
    "stream_started": "بدأ البث المباشر!",
    "error_occurred": "حدث خطأ ما",

    // --- مفاتيح صفحة الواجهة الترحيبية (المطابقة للصورة) ---
    "welcome_title": "مرحباً بك في دروازة",
    "welcome_subtitle": "بوابتك نحو التراث والحداثة",
    "choose_interface": "يرجى اختيار الواجهة المفضلة لك لتبدأ رحلتك",
    "heritage_interface": "الواجهة التراثية",
    "heritage_desc": "تصميم كلاسيكي يعكس أصالة الماضي بلمسات سدو وتطريز.",
    "modern_interface": "الواجهة العصرية",
    "modern_desc": "تصميم حديث وسلس يواكب المستقبل بألوان حيوية.",
    "get_started": "ابدأ الآن"
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
    
    // Subscriptions Page Keys 
    "choose_plan": "Choose Plan",
    "yearly": "Yearly (Save 20%)",
    "monthly": "Monthly",
    "payment_method": "Payment Method",
    "faq": "Frequently Asked Questions",

    // Seniors Page Keys
    "seniors_desc": "Share your expertise, sell your precious antiques, and host live tale councils.",
    "sell_item": "Sell Item",
    "host_council": "Host Council",
    "join_now": "Join Now",
    "start_stream": "Start Stream",
    "live_status": "Live",
    "upcoming_status": "Upcoming",
    "year_of_making": "Year of making:",
    "item_description": "Item Description:",
    "contact_seller": "Contact Seller",
    "redirect_whatsapp": "You will be redirected to WhatsApp",
    "login_first": "Please login first",
    "joined_successfully": "Joined council successfully",
    "stream_started": "Stream started!",
    "error_occurred": "An error occurred",

    // --- Welcome Interface Page Keys ---
    "welcome_title": "Welcome to Darwaza",
    "welcome_subtitle": "Your gateway to heritage and modernity",
    "choose_interface": "Please select your preferred interface to start your journey",
    "heritage_interface": "Heritage Interface",
    "heritage_desc": "A classic design reflecting the authenticity of the past with Sadu touches.",
    "modern_interface": "Modern Interface",
    "modern_desc": "A sleek, modern design that keeps pace with the future in vibrant colors.",
    "get_started": "Get Started"
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