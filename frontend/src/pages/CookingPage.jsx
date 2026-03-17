import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import {
  ChefHat,
  Utensils,
  Play,
  Sparkles,
  BookOpen,
  FlaskConical,
  Smartphone,
  Lock,
  Star
} from 'lucide-react';

const CookingPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';

  const recipes = [
    {
      name: isArabic ? 'المجبوس' : 'Machboos',
      description: isArabic ? 'طبق الأرز الكويتي الشهير مع اللحم أو الدجاج' : 'Famous Kuwaiti rice dish with meat or chicken',
      difficulty: 'medium',
      time: '90 min',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop'
    },
    {
      name: isArabic ? 'الغريبة' : 'Ghraiba',
      description: isArabic ? 'حلوى تقليدية هشة ولذيذة' : 'Traditional crumbly and delicious cookies',
      difficulty: 'easy',
      time: '45 min',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'
    },
    {
      name: isArabic ? 'الهريس' : 'Harees',
      description: isArabic ? 'طبق رمضاني تقليدي من القمح واللحم' : 'Traditional Ramadan dish of wheat and meat',
      difficulty: 'hard',
      time: '180 min',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop'
    }
  ];

  const features = [
    {
      icon: FlaskConical,
      title: isArabic ? 'مطبخ دروازة الذكي' : 'Smart Darwaza Kitchen',
      description: isArabic
        ? 'ألعاب تفاعلية لتعلم الوصفات الكويتية باستخدام مساحيق طعام آمنة قابلة للخلط.'
        : 'Interactive games to learn Kuwaiti recipes using safe, mixable food powders.',
      color: '#EC4899'
    },
    {
      icon: Smartphone,
      title: isArabic ? 'الواقع المعزز في المطبخ' : 'AR in the Kitchen',
      description: isArabic
        ? 'دليل خطوة بخطوة للطهي التقليدي باستخدام تقنية الواقع المعزز.'
        : 'Step-by-step guide to traditional cooking using AR technology.',
      color: '#8B5CF6'
    }
  ];

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (diff) => {
    if (isArabic) {
      switch (diff) {
        case 'easy': return 'سهل';
        case 'medium': return 'متوسط';
        case 'hard': return 'صعب';
        default: return diff;
      }
    }
    return diff.charAt(0).toUpperCase() + diff.slice(1);
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
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {isArabic ? 'ركن الطبخ التجريبي' : 'Experimental Cooking Corner'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'تعلم الطبخ الكويتي التقليدي بطريقة ممتعة وتفاعلية مع تقنيات حديثة.'
              : 'Learn traditional Kuwaiti cooking in a fun, interactive way with modern technology.'}
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SaduCard className="h-full">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Button
                      className="gap-2"
                      style={{ backgroundColor: feature.color }}
                      data-testid={`feature-${index}-btn`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {isArabic ? 'جرب الآن' : 'Try Now'}
                    </Button>
                  </div>
                </div>
              </SaduCard>
            </motion.div>
          ))}
        </div>

        <SaduDivider className="mb-16" />

        {/* Recipes */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? 'الوصفات الكويتية' : 'Kuwaiti Recipes'}
            </h2>
            <Button variant="outline" data-testid="view-all-recipes">
              {isArabic ? 'عرض الكل' : 'View All'}
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <SaduCard className="overflow-hidden p-0">
                  <div className="aspect-video relative">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{recipe.name}</h3>
                      <p className="text-white/80 text-sm">{recipe.description}</p>
                    </div>
                    <Button
                      size="icon"
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                    >
                      <Play className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {getDifficultyText(recipe.difficulty)}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Utensils className="w-4 h-4" />
                      {recipe.time}
                    </span>
                  </div>
                </SaduCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AR Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-2xl text-center ${isHeritage ? 'bg-[#8D1C1C]/10' : 'bg-[#0D9488]/10'}`}
        >
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#0D9488]'}`}>
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h3 className={`text-2xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'تجربة الواقع المعزز' : 'AR Experience'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            {isArabic
              ? 'قريباً: توجيهات الواقع المعزز ستظهر فوق أدواتك الحقيقية في المطبخ لتعليمك خطوة بخطوة.'
              : 'Coming soon: AR overlays will appear on your real kitchen tools to guide you step by step.'}
          </p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isArabic ? 'مصنف 5 نجوم من المستخدمين التجريبيين' : 'Rated 5 stars by beta testers'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CookingPage;
