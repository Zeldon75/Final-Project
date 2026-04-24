import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

// ==========================================
// قاعدة بيانات فيديوهات الطبخ المدمجة (تعمل بدون سيرفر)
// ==========================================
const categoriesData = [
  { id: 'kuwaiti', name: 'Kuwaiti Cuisine', name_ar: 'المطبخ الكويتي' },
  { id: 'gulf', name: 'Gulf Cuisine', name_ar: 'الطبخ الخليجي' },
  { id: 'levantine', name: 'Levantine Cuisine', name_ar: 'المطبخ الشامي' },
  { id: 'maghreb', name: 'Maghreb Cuisine', name_ar: 'المطبخ المغاربي' },
  { id: 'desserts', name: 'Arabic Desserts', name_ar: 'حلويات عربية' }
];

const videosData = [
  {
    id: 1,
    category: 'kuwaiti',
    title: 'Authentic Kuwaiti Machboos',
    title_ar: 'طريقة عمل المجبوس الكويتي الأصيل',
    description: 'Learn the secrets of making the perfect Kuwaiti Machboos with tender meat and aromatic spices.',
    description_ar: 'تعلم أسرار تحضير المجبوس الكويتي المثالي باللحم الطري والبهارات العطرية الخاصة.',
    youtube_id: 'R7Ww-b4a1fU',
    thumbnail: 'https://images.unsplash.com/photo-1599869152285-8025232810fb?q=80&w=600',
    duration: '15:20'
  },
  {
    id: 2,
    category: 'kuwaiti',
    title: 'Kuwaiti Mutabbaq Zubaidi',
    title_ar: 'مطبق زبيدي كويتي بخطوات سهلة',
    description: 'A comprehensive guide to preparing the famous Zubaidi fish with rice and special stuffing.',
    description_ar: 'دليل شامل لتحضير سمك الزبيدي الشهير مع الأرز والحشو الكويتي المميز.',
    youtube_id: 'EGZvJqpc6uU',
    thumbnail: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600',
    duration: '12:45'
  },
  {
    id: 3,
    category: 'levantine',
    title: 'Syrian Yalanji',
    title_ar: 'يلنجي (ورق عنب) على الطريقة السورية',
    description: 'Step by step to make the best vegetarian stuffed grape leaves with olive oil and pomegranate molasses.',
    description_ar: 'خطوة بخطوة لتحضير أطيب ورق عنب نباتي بزيت الزيتون ودبس الرمان.',
    youtube_id: 'LQ2NoAVLEak',
    thumbnail: 'https://images.unsplash.com/photo-1628151574041-94943f5509a9?q=80&w=600',
    duration: '18:10'
  },
  {
    id: 4,
    category: 'maghreb',
    title: 'Moroccan Meat Tagine',
    title_ar: 'طاجين اللحم بالبرقوق المغربي',
    description: 'The traditional way to cook Moroccan Tagine with meat, plums, and roasted almonds.',
    description_ar: 'الطريقة التقليدية لطبخ الطاجين المغربي باللحم والبرقوق واللوز المحمر.',
    youtube_id: 'eU5qui0Wqk0',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
    duration: '22:30'
  },
  {
    id: 5,
    category: 'desserts',
    title: 'Nabulsi Knafeh',
    title_ar: 'الكنافة النابلسية بالجبن المطاطي',
    description: 'Master the art of making the famous Palestinian Knafeh with gooey cheese at home.',
    description_ar: 'أتقن فن تحضير الكنافة الفلسطينية الشهيرة بالجبن المطاطي في المنزل.',
    youtube_id: 'YMRQ8BaYCOg',
    thumbnail: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?q=80&w=600',
    duration: '10:15'
  },
  {
    id: 6,
    category: 'desserts',
    title: 'Qers Oqaily',
    title_ar: 'قرص عقيلي كويتي هش',
    description: 'Bake the traditional Kuwaiti sponge cake flavored with saffron, cardamom, and toasted sesame.',
    description_ar: 'اخبز الكيكة الكويتية التقليدية الهشة بنكهة الزعفران والهيل والسمسم المحمص.',
    youtube_id: 'X-Xl03oR-8g',
    thumbnail: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=600',
    duration: '08:50'
  }
];

const YouTubePlayer = ({ videoId, title, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="aspect-video w-full">
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
      <SaduCard className="overflow-hidden p-0 h-full flex flex-col border-2 transition-all hover:shadow-xl">
        <div className="aspect-video relative group cursor-pointer" onClick={onPlay}>
          <img
            src={video.thumbnail}
            alt={isArabic ? video.title_ar : video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-blue-600'}`}
            >
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded bg-black/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col bg-white dark:bg-slate-800">
          <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? video.title_ar : video.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
            {isArabic ? video.description_ar : video.description}
          </p>
          <Button 
            className={`mt-4 w-full gap-2 font-bold h-12 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] rounded-none' : 'bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md'}`}
            onClick={onPlay}
          >
            <Play className="w-5 h-5 fill-current" />
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
  const navigate = useNavigate(); 
  
  // استخدام البيانات المحلية مباشرة
  const videos = videosData;
  const categories = categoriesData;
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState(null);

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
          <div className={`w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-lg ${isHeritage ? 'bg-[#8D1C1C] rounded-none rotate-3' : 'bg-blue-600 rounded-[2rem]'}`}>
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h1 className={`text-5xl md:text-6xl font-black mb-6 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
            {isArabic ? 'ركن الطبخ التجريبي' : 'Experimental Cooking Corner'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'تعلم الطبخ الكويتي والعربي التقليدي من أفضل الطهاة مع دروس فيديو تفاعلية تجعلك طاهياً محترفاً.'
              : 'Learn traditional Kuwaiti and Arab cooking from top chefs with interactive video tutorials.'}
          </p>
        </motion.div>

        {/* الميزة الرئيسية: مطبخ دروازة الذكي */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-20 max-w-4xl mx-auto"
        >
          <SaduCard className={`h-full text-center p-10 md:p-12 border-4 transition-all ${isHeritage ? 'border-[#8D1C1C]/20 hover:border-[#8D1C1C]' : 'border-pink-500/20 hover:border-pink-500 shadow-xl'}`}>
            <div className="flex flex-col items-center gap-6">
              <div className={`w-24 h-24 flex items-center justify-center text-white shadow-2xl ${isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-gradient-to-br from-pink-500 to-rose-500 rounded-full'}`}>
                <FlaskConical className="w-12 h-12" />
              </div>
              <div>
                <h3 className={`text-4xl font-black mb-4 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-slate-800 dark:text-white'}`}>
                  {isArabic ? 'مطبخ دروازة الذكي' : 'Smart Darwaza Kitchen'}
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                  {isArabic
                    ? 'تجربة تفاعلية خطوة بخطوة! تعلم تحضير أشهر الأطباق الكويتية مثل المجبوس والقرص عقيلي، وتعرف على أفضل المنتجات المحلية لضمان نجاح وصفتك.'
                    : 'Interactive step-by-step experience! Learn to prepare famous Kuwaiti dishes like Machboos, using the best local products.'}
                </p>
                <Button
                  onClick={() => navigate('/smart-kitchen')} 
                  className={`gap-3 text-xl px-10 py-8 font-bold shadow-lg transition-transform hover:scale-105 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] rounded-none' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full'}`}
                >
                  <Sparkles className="w-6 h-6" />
                  {isArabic ? 'ادخل المطبخ الآن' : 'Enter Kitchen Now'}
                </Button>
              </div>
            </div>
          </SaduCard>
        </motion.div>

        <SaduDivider className="mb-16 opacity-50" />

        {/* Video Tutorials Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className={`text-3xl font-black ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-slate-800 dark:text-white'}`}>
                {isArabic ? 'دروس الطبخ بالفيديو' : 'Video Cooking Tutorials'}
              </h2>
              <p className="text-lg text-muted-foreground mt-2 font-medium">
                {isArabic ? `${filteredVideos.length} فيديوهات متاحة` : `${filteredVideos.length} videos available`}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-full">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-bold text-muted-foreground">{isArabic ? 'تصفية حسب المطبخ:' : 'Filter by Cuisine:'}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={`text-lg px-6 h-12 font-bold ${selectedCategory === 'all' ? (isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-blue-600 rounded-full') : (isHeritage ? 'border-[#8D1C1C] text-[#8D1C1C] rounded-none' : 'border-gray-300 rounded-full')}`}
            >
              {isArabic ? 'الكل' : 'All'}
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className={`gap-2 text-lg h-12 px-6 font-bold ${selectedCategory === cat.id ? (isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-blue-600 rounded-full') : (isHeritage ? 'border-[#8D1C1C] text-[#8D1C1C] rounded-none' : 'border-gray-300 rounded-full')}`}
              >
                <span className="text-xl">{getCategoryIcon(cat.id)}</span>
                {isArabic ? cat.name_ar : cat.name}
              </Button>
            ))}
          </div>

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-3xl">
              <Utensils className="w-24 h-24 mx-auto text-gray-400 mb-6" />
              <p className="text-2xl font-bold text-gray-500">
                {isArabic ? 'لا توجد فيديوهات في هذه الفئة حالياً' : 'No videos in this category currently'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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