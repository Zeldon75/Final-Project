import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { 
  Globe, 
  ChevronRight, 
  MapPin, 
  Users, 
  BookOpen, 
  Utensils,
  Play,
  X,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const YouTubeEmbed = ({ videoId, title, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          data-testid="close-video-btn"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const CountryCard = ({ country, isArabic, isHeritage, themeColors, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected 
          ? `ring-4 ${isHeritage ? 'ring-[#8D1C1C]' : 'ring-[#1D4ED8]'}`
          : ''
      }`}
    >
      <SaduCard className="p-0 h-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h3 className={`text-xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? country.name_ar : country.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {isArabic ? country.description_ar : country.description}
              </p>
            </div>
          </div>
          
          {/* Dish Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={country.dish?.image} 
                alt={isArabic ? country.dish?.name_ar : country.dish?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{isArabic ? 'الطبق الوطني' : 'National Dish'}</p>
              <p className="font-medium truncate">{isArabic ? country.dish?.name_ar : country.dish?.name}</p>
            </div>
            <Utensils className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      </SaduCard>
    </motion.div>
  );
};

const CountryDetail = ({ country, isArabic, isHeritage, themeColors, onPlayVideo, onClose }) => {
  if (!country) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`rounded-3xl overflow-hidden ${
        isHeritage 
          ? 'bg-gradient-to-br from-[#E8DCCA] to-[#D4C4A8]' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900'
      }`}
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <span className="text-7xl">{country.flag}</span>
            <div>
              <h2 className={`text-4xl font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? country.name_ar : country.name}
              </h2>
              <p className="text-muted-foreground max-w-xl">
                {isArabic ? country.description_ar : country.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
            data-testid="close-country-detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isHeritage ? 'font-serif' : ''}`}>
              <Play className="w-5 h-5" style={{ color: themeColors.primary }} />
              {isArabic ? 'فيديو ثقافي' : 'Cultural Video'}
            </h3>
            <div 
              className="aspect-video rounded-2xl overflow-hidden bg-black/20 cursor-pointer group relative"
              onClick={onPlayVideo}
              data-testid={`play-country-video-${country.code}`}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-medium">
                  {isArabic ? country.video_title_ar : country.video_title}
                </p>
              </div>
            </div>
          </div>

          {/* Dish Section */}
          <div>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isHeritage ? 'font-serif' : ''}`}>
              <Utensils className="w-5 h-5" style={{ color: themeColors.primary }} />
              {isArabic ? 'الطبق التقليدي' : 'Traditional Dish'}
            </h3>
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="aspect-[16/10] relative">
                <img 
                  src={country.dish?.image} 
                  alt={isArabic ? country.dish?.name_ar : country.dish?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-2xl font-bold text-white mb-1">
                    {isArabic ? country.dish?.name_ar : country.dish?.name}
                  </h4>
                </div>
              </div>
              <div className="p-4">
                <p className="text-muted-foreground">
                  {isArabic ? country.dish?.description_ar : country.dish?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { icon: BookOpen, label: isArabic ? 'التاريخ والتراث' : 'History & Heritage' },
            { icon: Users, label: isArabic ? 'العادات والتقاليد' : 'Customs & Traditions' },
            { icon: MapPin, label: isArabic ? 'الأماكن السياحية' : 'Tourist Spots' }
          ].map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className={`gap-2 ${isHeritage ? 'border-[#8D1C1C]/30 hover:bg-[#8D1C1C]/10' : ''}`}
              data-testid={`country-link-${index}`}
            >
              <item.icon className="w-4 h-4" style={{ color: themeColors.primary }} />
              {item.label}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ArabWorldPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/content/arab-countries`);
      setCountries(response.data.countries || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    {
      name: isArabic ? 'دول الخليج' : 'Gulf Countries',
      countries: ['KW', 'SA', 'AE'],
      color: '#1D4ED8',
      description: isArabic ? 'تراث بحري وحضارة عريقة' : 'Maritime heritage and ancient civilization'
    },
    {
      name: isArabic ? 'بلاد الشام' : 'Levant',
      countries: ['LB', 'EG'],
      color: '#8D1C1C',
      description: isArabic ? 'مهد الحضارات والثقافات' : 'Cradle of civilizations and cultures'
    },
    {
      name: isArabic ? 'شمال أفريقيا' : 'North Africa',
      countries: ['MA'],
      color: '#D97706',
      description: isArabic ? 'تنوع ثقافي فريد' : 'Unique cultural diversity'
    }
  ];

  const handlePlayVideo = (country) => {
    setPlayingVideo({
      videoId: country.video_id,
      title: isArabic ? country.video_title_ar : country.video_title
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <AnimatePresence>
        {playingVideo && (
          <YouTubeEmbed 
            videoId={playingVideo.videoId} 
            title={playingVideo.title}
            onClose={() => setPlayingVideo(null)} 
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'}`}>
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {isArabic ? 'جناح العالم العربي' : 'Pan-Arab Wing'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'اكتشف تنوع وجمال ثقافات وتقاليد العالم العربي من خلال الفيديوهات والأطباق التقليدية.'
              : 'Discover the diversity and beauty of Arab cultures through videos and traditional dishes.'}
          </p>
        </motion.div>

        {/* Regions Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SaduCard className="h-full">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: region.color }}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
                  {region.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{region.description}</p>
                <div className="flex flex-wrap gap-2">
                  {region.countries.map(code => {
                    const country = countries.find(c => c.code === code);
                    return country ? (
                      <span key={code} className="text-2xl" title={isArabic ? country.name_ar : country.name}>
                        {country.flag}
                      </span>
                    ) : null;
                  })}
                </div>
              </SaduCard>
            </motion.div>
          ))}
        </div>

        <SaduDivider className="mb-16" />

        {/* Countries Grid */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'اختر دولة للاستكشاف' : 'Select a Country to Explore'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isArabic 
              ? `${countries.length} دول متاحة - كل دولة بفيديو وطبق تقليدي`
              : `${countries.length} countries available - each with a video and traditional dish`}
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className={`h-48 rounded-2xl ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {countries.map((country, index) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <CountryCard
                  country={country}
                  isArabic={isArabic}
                  isHeritage={isHeritage}
                  themeColors={themeColors}
                  isSelected={selectedCountry?.code === country.code}
                  onClick={() => setSelectedCountry(selectedCountry?.code === country.code ? null : country)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Selected Country Detail */}
        <AnimatePresence mode="wait">
          {selectedCountry && (
            <CountryDetail
              country={selectedCountry}
              isArabic={isArabic}
              isHeritage={isHeritage}
              themeColors={themeColors}
              onPlayVideo={() => handlePlayVideo(selectedCountry)}
              onClose={() => setSelectedCountry(null)}
            />
          )}
        </AnimatePresence>

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
            className={`h-12 px-8 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
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
