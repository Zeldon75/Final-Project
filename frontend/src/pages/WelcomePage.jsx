import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduDivider } from '../components/SaduPattern';
import { Castle, Rocket, Globe, ChevronRight } from 'lucide-react';

const WelcomePage = () => {
  const { selectTheme } = useTheme();
  const { t, language, setLanguage, languages, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [key, setKey] = useState(0);

  // Force re-render when language changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [language]);

  const handleSelectTheme = (theme) => {
    selectTheme(theme);
    navigate('/');
  };

  return (
    <div key={key} className="min-h-screen bg-gradient-to-br from-[#FDF6E3] via-[#E8DCCA] to-[#FDF6E3] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 sadu-pattern opacity-30" />
      
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <Globe className="w-5 h-5 text-[#8D1C1C]" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white/80 backdrop-blur-sm border-2 border-[#8D1C1C] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          data-testid="welcome-language-select"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-[#8D1C1C] rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_#D97706]">
            <span className="text-white text-5xl font-bold">د</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#8D1C1C] mb-4 font-serif">
            {t('welcome_title')}
          </h1>
          <p className="text-xl md:text-2xl text-[#4A4A4A] max-w-2xl mx-auto">
            {t('welcome_subtitle')}
          </p>
        </motion.div>

        <SaduDivider className="max-w-2xl mb-12" />

        {/* Choose Interface */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8 text-center"
        >
          {t('choose_interface')}
        </motion.h2>

        {/* Interface Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Heritage Interface */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-[#8D1C1C] rounded-2xl transform rotate-2 group-hover:rotate-3 transition-transform" />
            <div className="relative bg-[#FDF6E3] border-4 border-[#8D1C1C] rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#8D1C1C] rounded-xl flex items-center justify-center">
                  <Castle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#8D1C1C] font-serif">
                    {t('heritage_interface')}
                  </h3>
                  <p className="text-[#4A4A4A]">{t('heritage_desc')}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-[#1A1A1A]">
                  <div className="w-2 h-2 bg-[#D97706] rounded-full" />
                  <span>{isRTL ? 'ألوان دافئة وأصيلة' : 'Warm, authentic colors'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#1A1A1A]">
                  <div className="w-2 h-2 bg-[#D97706] rounded-full" />
                  <span>{isRTL ? 'زخارف السدو التقليدية' : 'Traditional Sadu patterns'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#1A1A1A]">
                  <div className="w-2 h-2 bg-[#D97706] rounded-full" />
                  <span>{isRTL ? 'تصميم مستوحى من التراث' : 'Heritage-inspired design'}</span>
                </div>
              </div>

              <Button
                onClick={() => handleSelectTheme(THEMES.HERITAGE)}
                className="w-full h-14 text-lg bg-[#8D1C1C] hover:bg-[#6D1515] text-white rounded-xl shadow-[4px_4px_0px_0px_#D97706] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                data-testid="select-heritage-btn"
              >
                {t('get_started')}
                <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </motion.div>

          {/* Modern Interface */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1D4ED8] to-[#0F172A] rounded-2xl transform -rotate-2 group-hover:-rotate-3 transition-transform" />
            <div className="relative bg-[#0F172A] border border-[#1D4ED8]/50 rounded-2xl p-8 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#1D4ED8] rounded-xl flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1D4ED8]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {t('modern_interface')}
                  </h3>
                  <p className="text-[#94A3B8]">{t('modern_desc')}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-[#F9FAFB]">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full" />
                  <span>{isRTL ? 'تصميم زجاجي عصري' : 'Sleek glassmorphism'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#F9FAFB]">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full" />
                  <span>{isRTL ? 'رسوم متحركة سلسة' : 'Smooth animations'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#F9FAFB]">
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full" />
                  <span>{isRTL ? 'واجهة مظلمة أنيقة' : 'Elegant dark mode'}</span>
                </div>
              </div>

              <Button
                onClick={() => handleSelectTheme(THEMES.MODERN)}
                className="w-full h-14 text-lg bg-[#1D4ED8] hover:bg-[#0B7A70] text-white rounded-xl border border-white/20 backdrop-blur-sm transition-all"
                data-testid="select-modern-btn"
              >
                {t('get_started')}
                <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-sm text-[#4A4A4A] text-center max-w-lg"
        >
          {isRTL
            ? 'يمكنك تغيير الواجهة في أي وقت من إعدادات الملف الشخصي'
            : 'You can switch interfaces anytime from your profile settings'}
        </motion.p>
      </div>
    </div>
  );
};

export default WelcomePage;
