import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Globe, ChevronRight, MapPin, Users, BookOpen, Utensils } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ArabWorldPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/content/arab-countries`);
      setCountries(response.data.countries || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback data
      setCountries([
        { code: 'KW', name: 'Kuwait', name_ar: 'الكويت' },
        { code: 'SA', name: 'Saudi Arabia', name_ar: 'السعودية' },
        { code: 'AE', name: 'UAE', name_ar: 'الإمارات' },
        { code: 'EG', name: 'Egypt', name_ar: 'مصر' },
        { code: 'MA', name: 'Morocco', name_ar: 'المغرب' },
        { code: 'JO', name: 'Jordan', name_ar: 'الأردن' }
      ]);
    }
  };

  const regions = [
    {
      name: isArabic ? 'دول الخليج' : 'Gulf Countries',
      countries: ['KW', 'SA', 'AE', 'QA', 'BH', 'OM'],
      color: '#0D9488'
    },
    {
      name: isArabic ? 'بلاد الشام' : 'Levant',
      countries: ['JO', 'LB', 'SY', 'PS'],
      color: '#8D1C1C'
    },
    {
      name: isArabic ? 'شمال أفريقيا' : 'North Africa',
      countries: ['EG', 'MA', 'TN', 'DZ', 'LY'],
      color: '#D97706'
    },
    {
      name: isArabic ? 'شبه الجزيرة العربية' : 'Arabian Peninsula',
      countries: ['YE', 'OM'],
      color: '#8B5CF6'
    }
  ];

  const countryFlags = {
    'KW': '🇰🇼', 'SA': '🇸🇦', 'AE': '🇦🇪', 'QA': '🇶🇦', 'BH': '🇧🇭', 'OM': '🇴🇲',
    'EG': '🇪🇬', 'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾', 'IQ': '🇮🇶', 'MA': '🇲🇦',
    'TN': '🇹🇳', 'DZ': '🇩🇿', 'LY': '🇱🇾', 'SD': '🇸🇩', 'YE': '🇾🇪', 'PS': '🇵🇸'
  };

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#0D9488]'}`}>
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {isArabic ? 'جناح العالم العربي' : 'Pan-Arab Wing'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'اكتشف تنوع وجمال ثقافات وتقاليد جميع البلدان العربية.'
              : 'Discover the diversity and beauty of cultures and traditions from all Arab countries.'}
          </p>
        </motion.div>

        {/* Regions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SaduCard className="cursor-pointer h-full">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: region.color }}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-3 ${isHeritage ? 'font-serif' : ''}`}>
                  {region.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {region.countries.slice(0, 4).map(code => (
                    <span key={code} className="text-2xl">{countryFlags[code]}</span>
                  ))}
                  {region.countries.length > 4 && (
                    <span className="text-sm text-muted-foreground">+{region.countries.length - 4}</span>
                  )}
                </div>
              </SaduCard>
            </motion.div>
          ))}
        </div>

        <SaduDivider className="mb-16" />

        {/* All Countries Grid */}
        <h2 className={`text-2xl font-bold mb-8 ${isHeritage ? 'font-serif' : ''}`}>
          {isArabic ? 'جميع البلدان العربية' : 'All Arab Countries'}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
          {countries.map((country, index) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedCountry(country)}
              className={`p-4 rounded-xl cursor-pointer text-center transition-all ${
                selectedCountry?.code === country.code
                  ? isHeritage ? 'bg-[#8D1C1C]/20 border-2 border-[#8D1C1C]' : 'bg-[#0D9488]/20 border-2 border-[#0D9488]'
                  : darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50 shadow-sm'
              }`}
              data-testid={`country-${country.code}`}
            >
              <span className="text-4xl mb-2 block">{countryFlags[country.code] || '🏳️'}</span>
              <h4 className="font-medium text-sm">{isArabic ? country.name_ar : country.name}</h4>
            </motion.div>
          ))}
        </div>

        {/* Selected Country Info */}
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl ${isHeritage ? 'bg-[#E8DCCA]' : darkMode ? 'bg-white/5' : 'bg-gray-100'}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-6xl">{countryFlags[selectedCountry.code]}</span>
              <div>
                <h2 className={`text-3xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
                  {isArabic ? selectedCountry.name_ar : selectedCountry.name}
                </h2>
                <p className="text-muted-foreground">
                  {isArabic ? 'استكشف ثقافة وتراث هذا البلد' : 'Explore the culture and heritage of this country'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: BookOpen, label: isArabic ? 'التاريخ والتراث' : 'History & Heritage' },
                { icon: Utensils, label: isArabic ? 'المطبخ التقليدي' : 'Traditional Cuisine' },
                { icon: Users, label: isArabic ? 'العادات والتقاليد' : 'Customs & Traditions' }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto py-4 flex-col gap-2 ${isHeritage ? 'border-[#8D1C1C]/30' : ''}`}
                  data-testid={`explore-${index}`}
                >
                  <item.icon className="w-6 h-6" style={{ color: themeColors.primary }} />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>

            <p className="text-center text-muted-foreground mt-6">
              {isArabic ? 'المحتوى قيد التطوير - قريباً!' : 'Content under development - Coming soon!'}
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className={`text-xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'شارك في إثراء المحتوى' : 'Contribute to Enrich Content'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            {isArabic
              ? 'هل أنت خبير في ثقافة بلدك؟ ساعدنا في توثيق التراث العربي!'
              : 'Are you an expert in your country\'s culture? Help us document Arab heritage!'}
          </p>
          <Button
            className={`h-12 px-8 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
            data-testid="contribute-btn"
          >
            {isArabic ? 'ساهم الآن' : 'Contribute Now'}
            <ChevronRight className={`w-5 h-5 ms-2 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArabWorldPage;
