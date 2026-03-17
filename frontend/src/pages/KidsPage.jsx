import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Progress } from '../components/ui/progress';
import {
  Gamepad2,
  Package,
  Trophy,
  Star,
  Gift,
  BookOpen,
  Mic,
  Puzzle,
  Lock,
  ChevronRight
} from 'lucide-react';

const KidsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';

  // Kids mode uses brighter colors and more playful design
  const kidsColors = {
    primary: '#F59E0B',
    secondary: '#EC4899',
    accent: '#8B5CF6',
    success: '#10B981'
  };

  const games = [
    {
      title: isArabic ? 'رحلة عبر الزمن' : 'Journey Through Time',
      description: isArabic ? 'استكشف تاريخ الكويت عبر العصور' : 'Explore Kuwait history through ages',
      progress: 45,
      icon: BookOpen,
      color: kidsColors.primary
    },
    {
      title: isArabic ? 'ألغاز التراث' : 'Heritage Puzzles',
      description: isArabic ? 'حل الألغاز واكتشف الأسرار' : 'Solve puzzles and discover secrets',
      progress: 30,
      icon: Puzzle,
      color: kidsColors.secondary
    },
    {
      title: isArabic ? 'صانع الحكايات' : 'Story Maker',
      description: isArabic ? 'أنشئ قصصك الخاصة مع المرشد الذكي' : 'Create your own stories with AI mentor',
      progress: 0,
      icon: Mic,
      color: kidsColors.accent,
      locked: true
    }
  ];

  const achievements = [
    { name: isArabic ? 'المستكشف الصغير' : 'Little Explorer', earned: true },
    { name: isArabic ? 'حافظ الأمثال' : 'Proverb Keeper', earned: true },
    { name: isArabic ? 'صديق التراث' : 'Heritage Friend', earned: false },
    { name: isArabic ? 'الحكواتي' : 'Storyteller', earned: false }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1A1A2E]' : 'bg-gradient-to-br from-amber-50 via-pink-50 to-purple-50'}`}>
      {/* Playful background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='4' fill='%23F59E0B'/%3E%3Ccircle cx='10' cy='10' r='3' fill='%23EC4899'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%238B5CF6'/%3E%3C/svg%3E")`
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
          >
            <Gamepad2 className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            {isArabic ? 'عالم تراث الأطفال' : 'Kids Heritage World'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'تعلم واستمتع! اكتشف تراث الكويت من خلال الألعاب والمغامرات الممتعة.'
              : 'Learn and have fun! Discover Kuwait heritage through games and exciting adventures.'}
          </p>
        </motion.div>

        {/* Games Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {games.map((game, index) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="relative"
            >
              <div className={`p-6 rounded-3xl ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-xl border-4 ${game.locked ? 'border-gray-300 opacity-60' : ''}`} style={{ borderColor: game.locked ? undefined : game.color }}>
                {game.locked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl">
                    <Lock className="w-12 h-12 text-white" />
                  </div>
                )}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: game.color }}
                >
                  <game.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                {!game.locked && (
                  <>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>{isArabic ? 'التقدم' : 'Progress'}</span>
                      <span className="font-bold">{game.progress}%</span>
                    </div>
                    <Progress value={game.progress} className="h-3 rounded-full" />
                  </>
                )}
                <Button
                  className="w-full mt-4 rounded-xl h-12"
                  style={{ backgroundColor: game.color }}
                  disabled={game.locked}
                  data-testid={`game-${index}-btn`}
                >
                  {game.locked ? (isArabic ? 'قريباً' : 'Coming Soon') : (isArabic ? 'العب الآن' : 'Play Now')}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heritage Box & Achievements */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Heritage Box */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-3xl ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-xl border-4 border-pink-400`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isArabic ? 'صندوق التراث' : 'Heritage Box'}</h2>
                <p className="text-sm text-muted-foreground">{isArabic ? 'اشتراك شهري' : 'Monthly subscription'}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              {isArabic
                ? 'صندوق شهري يطور آداب الطفل وخطابه. يتضمن أنشطة وقصص ومفاجآت!'
                : 'Monthly box developing children\'s etiquette and speech. Includes activities, stories, and surprises!'}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { icon: BookOpen, label: isArabic ? 'قصص' : 'Stories' },
                { icon: Puzzle, label: isArabic ? 'أنشطة' : 'Activities' },
                { icon: Gift, label: isArabic ? 'مفاجآت' : 'Surprises' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 mx-auto bg-pink-100 rounded-xl flex items-center justify-center mb-2">
                    <item.icon className="w-6 h-6 text-pink-500" />
                  </div>
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>
            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              data-testid="subscribe-heritage-box-btn"
            >
              {isArabic ? 'اشترك الآن - 5 د.ك/شهر' : 'Subscribe Now - 5 KWD/month'}
            </Button>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-3xl ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-xl border-4 border-purple-400`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isArabic ? 'صندوق الإنجازات' : 'Achievement Box'}</h2>
                <p className="text-sm text-muted-foreground">{isArabic ? 'اجمع النقاط واحصل على هدايا' : 'Collect points and get prizes'}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    achievement.earned
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100'
                      : darkMode ? 'bg-white/5' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star className={`w-5 h-5 ${achievement.earned ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                    <span className={achievement.earned ? 'font-medium' : 'text-muted-foreground'}>{achievement.name}</span>
                  </div>
                  {achievement.earned && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {isArabic ? 'مكتمل' : 'Earned'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-purple-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{isArabic ? 'النقاط المجمعة' : 'Points Collected'}</span>
                <span className="font-bold text-purple-600">250 / 500</span>
              </div>
              <Progress value={50} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {isArabic ? '250 نقطة أخرى لفتح المستوى التالي!' : '250 more points to unlock the next level!'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* AI Mentor Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-12 p-8 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white text-center`}
        >
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🤖</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {isArabic ? 'المرشد الذكي الكويتي' : 'Kuwaiti AI Mentor'}
          </h3>
          <p className="mb-6 max-w-lg mx-auto opacity-90">
            {isArabic
              ? 'صديقك الذكي يتحدث اللهجة الكويتية ويساعدك في الكتابة والقراءة والتعلم!'
              : 'Your smart friend speaks Kuwaiti dialect and helps you with writing, reading, and learning!'}
          </p>
          <Button
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-white/90 rounded-xl h-12 px-8"
            data-testid="meet-ai-mentor-btn"
          >
            {isArabic ? 'قابل المرشد' : 'Meet the Mentor'}
            <ChevronRight className={`w-5 h-5 ms-2 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default KidsPage;
