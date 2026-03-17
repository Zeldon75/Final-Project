import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import {
  GraduationCap,
  Palette,
  Video,
  Award,
  ArrowRight,
  Briefcase,
  Sparkles,
  Users
} from 'lucide-react';

const YouthPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';

  const programs = [
    {
      icon: GraduationCap,
      title: isArabic ? 'مسار المهن التراثية' : 'Heritage Career Path',
      description: isArabic
        ? 'دورات معتمدة في الحرف التقليدية تؤهلك للعمل في قطاع السياحة والتراث.'
        : 'Certified courses in traditional crafts qualifying you for tourism and heritage jobs.',
      features: isArabic
        ? ['شهادات معتمدة', 'تدريب عملي', 'فرص توظيف']
        : ['Certified diplomas', 'Hands-on training', 'Job opportunities'],
      color: '#8D1C1C'
    },
    {
      icon: Palette,
      title: isArabic ? 'مختبر التصميم الحديث' : 'Modern Design Lab',
      description: isArabic
        ? 'استخدم الذكاء الاصطناعي لدمج أنماط السدو التقليدية في تصاميم الأزياء العصرية.'
        : 'Use AI to merge traditional Sadu patterns into contemporary fashion designs.',
      features: isArabic
        ? ['أدوات AI متقدمة', 'ورش تصميم', 'معارض افتراضية']
        : ['Advanced AI tools', 'Design workshops', 'Virtual exhibitions'],
      color: '#0D9488'
    },
    {
      icon: Video,
      title: isArabic ? 'التعلم التفاعلي' : 'Interactive Learning',
      description: isArabic
        ? 'ورش عمل حية يشرف عليها كبار الحرفيين والخبراء.'
        : 'Live workshops supervised by senior craftsmen and experts.',
      features: isArabic
        ? ['بث مباشر', 'تفاعل مع الخبراء', 'مشاريع عملية']
        : ['Live streaming', 'Expert interaction', 'Practical projects'],
      color: '#D97706'
    }
  ];

  const careers = [
    { title: isArabic ? 'مرشد سياحي تراثي' : 'Heritage Tour Guide', openings: 12 },
    { title: isArabic ? 'حرفي نسيج السدو' : 'Sadu Weaving Artisan', openings: 8 },
    { title: isArabic ? 'مصمم أزياء تراثية' : 'Heritage Fashion Designer', openings: 5 },
    { title: isArabic ? 'منسق متاحف' : 'Museum Curator', openings: 3 }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}
        >
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#0D9488]'}`}>
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {isArabic ? 'تمكين الشباب' : 'Youth Empowerment'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'حوّل شغفك بالتراث إلى مهنة. تعلم، صمم، وابدأ مسيرتك المهنية.'
              : 'Transform your passion for heritage into a career. Learn, design, and start your professional journey.'}
          </p>
        </motion.div>

        {/* Programs */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SaduCard className="h-full">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: program.color }}
                >
                  <program.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isHeritage ? 'font-serif' : ''}`}>
                  {program.title}
                </h3>
                <p className="text-muted-foreground mb-4">{program.description}</p>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4" style={{ color: program.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  style={{ backgroundColor: program.color }}
                  data-testid={`program-${index}-btn`}
                >
                  {isArabic ? 'استكشف' : 'Explore'}
                  <ArrowRight className={`w-4 h-4 ms-2 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </SaduCard>
            </motion.div>
          ))}
        </div>

        <SaduDivider className="mb-16" />

        {/* Career Opportunities */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Briefcase className="w-12 h-12 mb-4" style={{ color: themeColors.primary }} />
            <h2 className={`text-3xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? 'فرص العمل المتاحة' : 'Available Career Opportunities'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isArabic
                ? 'شركاؤنا في قطاع السياحة والتراث يبحثون عن مواهب شابة. أكمل الدورات واحصل على فرصتك.'
                : 'Our partners in the tourism and heritage sector are looking for young talents. Complete courses and get your opportunity.'}
            </p>
            <div className="space-y-3">
              {careers.map((career, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}
                >
                  <span className="font-medium">{career.title}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${isHeritage ? 'bg-[#8D1C1C]/10 text-[#8D1C1C]' : 'bg-[#0D9488]/10 text-[#0D9488]'}`}>
                    {career.openings} {isArabic ? 'فرصة' : 'openings'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-2xl ${isHeritage ? 'bg-[#8D1C1C]/10' : 'bg-[#0D9488]/10'}`}
          >
            <Users className="w-12 h-12 mb-4" style={{ color: themeColors.primary }} />
            <h3 className={`text-2xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? 'انضم لمجتمع المبدعين' : 'Join the Creators Community'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isArabic
                ? 'تواصل مع شباب يشاركونك الشغف بالتراث. شارك أعمالك واحصل على إلهام جديد.'
                : 'Connect with youth who share your passion for heritage. Share your work and get inspired.'}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 ${darkMode ? 'border-[#0F172A]' : 'border-white'} ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#0D9488]'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                +500 {isArabic ? 'عضو نشط' : 'active members'}
              </span>
            </div>
            <Button
              className={`w-full h-12 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
              data-testid="join-community-btn"
            >
              {isArabic ? 'انضم الآن' : 'Join Now'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default YouthPage;
