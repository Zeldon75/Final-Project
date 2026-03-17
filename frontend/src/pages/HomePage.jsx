import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduDivider, SaduCard } from '../components/SaduPattern';
import {
  Brain,
  Users,
  Sparkles,
  Gamepad2,
  ChefHat,
  Map,
  Globe,
  ArrowRight,
  Play,
  ShoppingBag,
  GraduationCap
} from 'lucide-react';

const ModuleCard = ({ icon: Icon, title, titleAr, description, descriptionAr, to, color, delay }) => {
  const { isHeritage, darkMode, isRTL } = useTheme();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Link to={to} data-testid={`module-card-${to.replace('/', '')}`}>
        <SaduCard className="h-full cursor-pointer group">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`} style={{ backgroundColor: color }}>
            <Icon className="w-7 h-7 text-white" strokeWidth={isHeritage ? 2.5 : 1.5} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isHeritage ? 'font-serif' : ''} ${darkMode ? 'text-white' : 'text-foreground'}`}>
            {isArabic ? titleAr : title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isArabic ? descriptionAr : description}
          </p>
        </SaduCard>
      </Link>
    </motion.div>
  );
};

const HomePage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === 'ar';

  const modules = [
    {
      icon: Brain,
      title: 'AI Hub',
      titleAr: 'مركز الذكاء الاصطناعي',
      description: 'Chat with 3 AI models. Get help with writing, learning, and exploring heritage.',
      descriptionAr: 'تحدث مع 3 نماذج ذكاء اصطناعي. احصل على المساعدة في الكتابة والتعلم واستكشاف التراث.',
      to: '/ai-hub',
      color: '#8B5CF6'
    },
    {
      icon: Users,
      title: 'Seniors Gateway',
      titleAr: 'بوابة المتقاعدين',
      description: 'Sell antiques, host live tale councils, share your expertise.',
      descriptionAr: 'بيع التحف، استضافة مجالس الحكايات الحية، مشاركة خبراتك.',
      to: '/seniors',
      color: '#8D1C1C'
    },
    {
      icon: Sparkles,
      title: 'Youth Empowerment',
      titleAr: 'تمكين الشباب',
      description: 'Certified heritage courses, modern design lab, live workshops.',
      descriptionAr: 'دورات تراثية معتمدة، مختبر التصميم الحديث، ورش عمل حية.',
      to: '/youth',
      color: '#0D9488'
    },
    {
      icon: Gamepad2,
      title: 'Kids Heritage World',
      titleAr: 'عالم تراث الأطفال',
      description: 'Fun games, heritage box subscription, achievement rewards.',
      descriptionAr: 'ألعاب ممتعة، اشتراك صندوق التراث، مكافآت الإنجازات.',
      to: '/kids',
      color: '#F59E0B'
    },
    {
      icon: ChefHat,
      title: 'Cooking Corner',
      titleAr: 'ركن الطبخ',
      description: 'Learn traditional recipes with interactive games and AR guides.',
      descriptionAr: 'تعلم الوصفات التقليدية مع ألعاب تفاعلية ودليل الواقع المعزز.',
      to: '/cooking',
      color: '#EC4899'
    },
    {
      icon: Map,
      title: 'Tourist Guide',
      titleAr: 'دليل السياح',
      description: 'Explore Kuwait culture, customs, locations, and etiquette.',
      descriptionAr: 'استكشف ثقافة الكويت وعاداتها ومواقعها وآدابها.',
      to: '/tourists',
      color: '#3B82F6'
    },
    {
      icon: Globe,
      title: 'Arab World',
      titleAr: 'العالم العربي',
      description: 'Discover traditions and cultures from all Arab countries.',
      descriptionAr: 'اكتشف التقاليد والثقافات من جميع البلدان العربية.',
      to: '/arab-world',
      color: '#10B981'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {isHeritage && <div className="absolute inset-0 sadu-pattern opacity-20" />}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={isRTL ? 'text-right' : 'text-left'}
            >
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
                {isArabic ? 'دروازة' : 'Darwaza'}
              </h1>
              <p className={`text-xl md:text-2xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {isArabic
                  ? 'بوابتك إلى التراث الكويتي الأصيل. نربط الأجيال عبر التكنولوجيا والذكاء الاصطناعي.'
                  : 'Your gateway to authentic Kuwaiti heritage. Bridging generations through technology and AI.'}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className={`h-14 px-8 text-lg ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] shadow-[4px_4px_0px_0px_#D97706]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
                  data-testid="hero-explore-btn"
                >
                  <Link to="/seniors">
                    {t('explore')}
                    <ArrowRight className={`ms-2 w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg"
                  data-testid="hero-watch-btn"
                >
                  <Play className="me-2 w-5 h-5" />
                  {isArabic ? 'شاهد الفيديو' : 'Watch Video'}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className={`aspect-video rounded-2xl overflow-hidden ${isHeritage ? 'border-4 border-[#8D1C1C] shadow-[8px_8px_0px_0px_#D97706]' : 'border border-white/20'}`}>
                <img
                  src="https://images.unsplash.com/photo-1571986204936-76077adb51f9?w=800&h=450&fit=crop"
                  alt="Kuwait Towers"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <p className="text-white text-lg font-medium">
                    {isArabic ? 'أبراج الكويت - رمز الحداثة والتراث' : 'Kuwait Towers - Symbol of Modernity & Heritage'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SaduDivider className="max-w-7xl mx-auto" />

      {/* Modules Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
              {isArabic ? 'استكشف عالم دروازة' : 'Explore Darwaza World'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isArabic
                ? 'رحلة عبر الزمن تجمع الأجيال. من حكايات الأجداد إلى تقنيات المستقبل.'
                : 'A journey through time connecting generations. From ancestral tales to future technology.'}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <ModuleCard key={module.to} {...module} delay={0.1 * index} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className={`py-16 ${isHeritage ? (darkMode ? 'bg-[#2A2A2A]' : 'bg-[#E8DCCA]') : (darkMode ? 'bg-white/5' : 'bg-gray-100')}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: isArabic ? 'مستخدم نشط' : 'Active Users', icon: Users },
              { value: '500+', label: isArabic ? 'منتج تراثي' : 'Heritage Items', icon: ShoppingBag },
              { value: '50+', label: isArabic ? 'دورة تدريبية' : 'Courses', icon: GraduationCap },
              { value: '18', label: isArabic ? 'دولة عربية' : 'Arab Countries', icon: Globe }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: themeColors.primary }} />
                <div className={`text-3xl md:text-4xl font-bold mb-1 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
              {isArabic ? 'ابدأ رحلتك التراثية اليوم' : 'Start Your Heritage Journey Today'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {isArabic
                ? 'انضم إلى آلاف العائلات الكويتية والعربية في الحفاظ على تراثنا للأجيال القادمة.'
                : 'Join thousands of Kuwaiti and Arab families in preserving our heritage for future generations.'}
            </p>
            <Button
              asChild
              size="lg"
              className={`h-16 px-12 text-xl ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] shadow-[4px_4px_0px_0px_#D97706]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
              data-testid="cta-subscribe-btn"
            >
              <Link to="/subscriptions">
                {isArabic ? 'اشترك الآن' : 'Subscribe Now'}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
