import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // تم إضافة هذا للتنقل بين الصفحات
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import {
  ChefHat,
  Utensils,
  Play,
  Sparkles,
  FlaskConical,
  Filter,
  Clock,
  X
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const YouTubePlayer = ({ videoId, title, onClose }) => {
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

const VideoCard = ({ video, isArabic, isHeritage, themeColors, onPlay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <SaduCard className="overflow-hidden p-0 h-full flex flex-col">
        <div className="aspect-video relative group cursor-pointer" onClick={onPlay}>
          <img
            src={video.thumbnail}
            alt={isArabic ? video.title_ar : video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: themeColors.primary }}
            >
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className={`font-bold mb-2 line-clamp-2 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? video.title_ar : video.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {isArabic ? video.description_ar : video.description}
          </p>
          <Button 
            className="mt-4 w-full gap-2" 
            style={{ backgroundColor: themeColors.primary }}
            onClick={onPlay}
            data-testid={`play-video-${video.id}`}
          >
            <Play className="w-4 h-4" />
            {isArabic ? 'شاهد الآن' : 'Watch Now'}
          </Button>
        </div>
      </SaduCard>
    </motion.div>
  );
};

const CookingPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const navigate = useNavigate(); // لتفعيل التنقل
  
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodData();
  }, []);

  const fetchFoodData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/content/food-videos`);
      setVideos(response.data.videos || []);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching food data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  const getCategoryIcon = (id) => {
    const icons = {
      kuwaiti: '🇰🇼',
      gulf: '🌊',
      levantine: '🌿',
      maghreb: '🌶️',
      desserts: '🍰'
    };
    return icons[id] || '🍽️';
  };

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <AnimatePresence>
        {playingVideo && (
          <YouTubePlayer 
            videoId={playingVideo.youtube_id} 
            title={isArabic ? playingVideo.title_ar : playingVideo.title}
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
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {isArabic ? 'ركن الطبخ التجريبي' : 'Experimental Cooking Corner'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'تعلم الطبخ الكويتي والعربي التقليدي من أفضل الطهاة مع دروس فيديو تفاعلية.'
              : 'Learn traditional Kuwaiti and Arab cooking from top chefs with interactive video tutorials.'}
          </p>
        </motion.div>

        {/* الميزة الرئيسية: مطبخ دروازة الذكي */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16 max-w-3xl mx-auto"
        >
          <SaduCard className="h-full text-center p-8 border-4 border-pink-500/20 hover:border-pink-500 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-pink-500 text-white shadow-xl">
                <FlaskConical className="w-10 h-10" />
              </div>
              <div>
                <h3 className={`text-3xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
                  {isArabic ? 'مطبخ دروازة الذكي' : 'Smart Darwaza Kitchen'}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {isArabic
                    ? 'تجربة تفاعلية خطوة بخطوة! تعلم تحضير أشهر الأطباق الكويتية مثل المجبوس والقرص عقيلي، وتعرف على أفضل المنتجات المحلية (مثل مطاحن الدقيق و KDD) لنجاح وصفتك.'
                    : 'Interactive step-by-step experience! Learn to prepare famous Kuwaiti dishes like Machboos, using the best local products.'}
                </p>
                <Button
                  onClick={() => navigate('/smart-kitchen')} // الزر يأخذك للصفحة الجديدة
                  className="gap-2 text-lg px-8 py-6 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  {isArabic ? 'ادخل المطبخ الآن' : 'Enter Kitchen Now'}
                </Button>
              </div>
            </div>
          </SaduCard>
        </motion.div>

        <SaduDivider className="mb-16" />

        {/* Video Tutorials Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? 'دروس الطبخ بالفيديو' : 'Video Cooking Tutorials'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {isArabic ? `${videos.length} فيديو متاح` : `${videos.length} videos available`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{isArabic ? 'تصفية:' : 'Filter:'}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              style={selectedCategory === 'all' ? { backgroundColor: themeColors.primary } : {}}
              data-testid="filter-all"
            >
              {isArabic ? 'الكل' : 'All'}
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2"
                style={selectedCategory === cat.id ? { backgroundColor: themeColors.primary } : {}}
                data-testid={`filter-${cat.id}`}
              >
                <span>{getCategoryIcon(cat.id)}</span>
                {isArabic ? cat.name_ar : cat.name}
              </Button>
            ))}
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className={`aspect-video rounded-t-xl ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                  <div className={`p-4 rounded-b-xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className={`h-4 rounded mb-2 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <div className={`h-3 rounded w-2/3 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isArabic ? 'لا توجد فيديوهات في هذه الفئة' : 'No videos in this category'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VideoCard
                    video={video}
                    isArabic={isArabic}
                    isHeritage={isHeritage}
                    themeColors={themeColors}
                    onPlay={() => setPlayingVideo(video)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookingPage;