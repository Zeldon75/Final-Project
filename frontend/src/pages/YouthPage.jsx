import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  GraduationCap,
  Palette,
  Video,
  Award,
  ArrowRight,
  Briefcase,
  Sparkles,
  Users,
  Clock,
  BookOpen,
  Play,
  Star,
  CheckCircle,
  Lock,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  Heart,
  Share2,
  MessageSquare
} from 'lucide-react';

const YouthPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Demo Courses Data
  const courses = [
    {
      id: 'sadu-weaving',
      title: 'Sadu Weaving Fundamentals',
      title_ar: 'أساسيات نسيج السدو',
      instructor: 'Fatima Al-Sabah',
      instructor_ar: 'فاطمة الصباح',
      duration: '8 weeks',
      duration_ar: '8 أسابيع',
      level: 'Beginner',
      level_ar: 'مبتدئ',
      students: 234,
      rating: 4.9,
      price: '45 KWD',
      progress: 65,
      lessons: 24,
      completedLessons: 16,
      certified: true,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      description: 'Learn the ancient art of Sadu weaving from master craftswomen. This comprehensive course covers traditional patterns, color theory, and weaving techniques.',
      description_ar: 'تعلم فن نسيج السدو القديم من الحرفيات المتمرسات. تغطي هذه الدورة الشاملة الأنماط التقليدية ونظرية الألوان وتقنيات النسيج.',
      modules: [
        { title: 'Introduction to Sadu', title_ar: 'مقدمة في السدو', completed: true },
        { title: 'Materials & Tools', title_ar: 'المواد والأدوات', completed: true },
        { title: 'Basic Patterns', title_ar: 'الأنماط الأساسية', completed: true },
        { title: 'Color Theory', title_ar: 'نظرية الألوان', completed: false },
        { title: 'Advanced Techniques', title_ar: 'التقنيات المتقدمة', completed: false }
      ]
    },
    {
      id: 'dhow-building',
      title: 'Traditional Dhow Building',
      title_ar: 'بناء المراكب الشراعية التقليدية',
      instructor: 'Mohammed Al-Rashid',
      instructor_ar: 'محمد الرشيد',
      duration: '12 weeks',
      duration_ar: '12 أسبوع',
      level: 'Intermediate',
      level_ar: 'متوسط',
      students: 89,
      rating: 4.8,
      price: '120 KWD',
      progress: 0,
      lessons: 36,
      completedLessons: 0,
      certified: true,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      description: 'Master the craft of building traditional Kuwaiti dhows. Learn woodworking, naval architecture, and the history of Gulf maritime traditions.',
      description_ar: 'أتقن حرفة بناء المراكب الشراعية الكويتية التقليدية. تعلم النجارة والهندسة البحرية وتاريخ التقاليد البحرية الخليجية.'
    },
    {
      id: 'heritage-guide',
      title: 'Heritage Tour Guide Certificate',
      title_ar: 'شهادة مرشد سياحي تراثي',
      instructor: 'Dr. Ahmed Al-Mutairi',
      instructor_ar: 'د. أحمد المطيري',
      duration: '6 weeks',
      duration_ar: '6 أسابيع',
      level: 'All Levels',
      level_ar: 'جميع المستويات',
      students: 567,
      rating: 4.9,
      price: '75 KWD',
      progress: 30,
      lessons: 18,
      completedLessons: 5,
      certified: true,
      image: 'https://images.unsplash.com/photo-1571986204936-76077adb51f9?w=600&h=400&fit=crop',
      description: 'Become a certified heritage tour guide. Learn Kuwaiti history, storytelling techniques, and visitor management.',
      description_ar: 'كن مرشداً سياحياً معتمداً. تعلم تاريخ الكويت وتقنيات السرد وإدارة الزوار.'
    },
    {
      id: 'calligraphy',
      title: 'Arabic Calligraphy Mastery',
      title_ar: 'إتقان الخط العربي',
      instructor: 'Khalid Al-Duaij',
      instructor_ar: 'خالد الدعيج',
      duration: '10 weeks',
      duration_ar: '10 أسابيع',
      level: 'Beginner',
      level_ar: 'مبتدئ',
      students: 412,
      rating: 4.7,
      price: '55 KWD',
      progress: 0,
      lessons: 30,
      completedLessons: 0,
      certified: true,
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&h=400&fit=crop',
      description: 'Learn the beautiful art of Arabic calligraphy. Master Thuluth, Naskh, and Diwani scripts with traditional tools.',
      description_ar: 'تعلم فن الخط العربي الجميل. أتقن خطوط الثلث والنسخ والديواني بالأدوات التقليدية.'
    }
  ];

  // Design Lab Projects
  const designProjects = [
    {
      id: 'project-1',
      title: 'Modern Sadu Jacket',
      title_ar: 'جاكيت سدو عصري',
      author: 'Sara Al-Hajri',
      author_ar: 'سارة الهاجري',
      likes: 234,
      comments: 45,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=400&fit=crop',
      tags: ['Fashion', 'Sadu', 'Modern']
    },
    {
      id: 'project-2',
      title: 'Heritage Phone Case',
      title_ar: 'غطاء هاتف تراثي',
      author: 'Noor Al-Salem',
      author_ar: 'نور السالم',
      likes: 189,
      comments: 32,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      tags: ['Accessories', 'Tech', 'Sadu']
    },
    {
      id: 'project-3',
      title: 'Kuwaiti Pattern Sneakers',
      title_ar: 'أحذية رياضية بنقوش كويتية',
      author: 'Faisal Al-Roumi',
      author_ar: 'فيصل الرومي',
      likes: 567,
      comments: 89,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
      tags: ['Footwear', 'Fashion', 'Innovative']
    },
    {
      id: 'project-4',
      title: 'Traditional Motif Laptop Bag',
      title_ar: 'حقيبة لابتوب بزخارف تقليدية',
      author: 'Maryam Al-Shatti',
      author_ar: 'مريم الشطي',
      likes: 312,
      comments: 56,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
      tags: ['Bags', 'Tech', 'Heritage']
    }
  ];

  // Career Opportunities
  const careers = [
    {
      id: 'job-1',
      title: 'Heritage Tour Guide',
      title_ar: 'مرشد سياحي تراثي',
      company: 'Kuwait Tourism Authority',
      company_ar: 'هيئة السياحة الكويتية',
      location: 'Kuwait City',
      location_ar: 'مدينة الكويت',
      type: 'Full-time',
      type_ar: 'دوام كامل',
      salary: '800-1200 KWD',
      posted: '2 days ago',
      posted_ar: 'منذ يومين',
      requirements: ['Certificate in Heritage Tourism', 'Bilingual (Arabic/English)', '2+ years experience'],
      requirements_ar: ['شهادة في السياحة التراثية', 'ثنائي اللغة (عربي/إنجليزي)', '+2 سنوات خبرة']
    },
    {
      id: 'job-2',
      title: 'Sadu Weaving Instructor',
      title_ar: 'مدرب نسيج السدو',
      company: 'Sadu House',
      company_ar: 'بيت السدو',
      location: 'Kuwait City',
      location_ar: 'مدينة الكويت',
      type: 'Part-time',
      type_ar: 'دوام جزئي',
      salary: '400-600 KWD',
      posted: '1 week ago',
      posted_ar: 'منذ أسبوع',
      requirements: ['Expert in Sadu weaving', 'Teaching experience preferred', 'Passion for heritage'],
      requirements_ar: ['خبير في نسيج السدو', 'يفضل الخبرة في التدريس', 'شغف بالتراث']
    },
    {
      id: 'job-3',
      title: 'Museum Curator Assistant',
      title_ar: 'مساعد أمين متحف',
      company: 'Kuwait National Museum',
      company_ar: 'متحف الكويت الوطني',
      location: 'Kuwait City',
      location_ar: 'مدينة الكويت',
      type: 'Full-time',
      type_ar: 'دوام كامل',
      salary: '900-1400 KWD',
      posted: '3 days ago',
      posted_ar: 'منذ 3 أيام',
      requirements: ['Degree in History or Archaeology', 'Research skills', 'Attention to detail'],
      requirements_ar: ['شهادة في التاريخ أو الآثار', 'مهارات البحث', 'الاهتمام بالتفاصيل']
    },
    {
      id: 'job-4',
      title: 'Heritage Fashion Designer',
      title_ar: 'مصمم أزياء تراثية',
      company: 'Darwaza Fashion House',
      company_ar: 'دار دروازة للأزياء',
      location: 'Salmiya',
      location_ar: 'السالمية',
      type: 'Full-time',
      type_ar: 'دوام كامل',
      salary: '1000-1800 KWD',
      posted: '5 days ago',
      posted_ar: 'منذ 5 أيام',
      requirements: ['Fashion design degree', 'Portfolio with heritage themes', 'AI design tools knowledge'],
      requirements_ar: ['شهادة في تصميم الأزياء', 'معرض أعمال بمواضيع تراثية', 'معرفة بأدوات التصميم بالذكاء الاصطناعي']
    }
  ];

  // Community Stats
  const stats = [
    { label: isArabic ? 'أعضاء نشطين' : 'Active Members', value: '2,450+', icon: Users },
    { label: isArabic ? 'دورات مكتملة' : 'Courses Completed', value: '5,670+', icon: GraduationCap },
    { label: isArabic ? 'تصاميم منشورة' : 'Designs Shared', value: '1,200+', icon: Palette },
    { label: isArabic ? 'توظيفات' : 'Job Placements', value: '340+', icon: Briefcase }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SaduCard className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: themeColors.primary }} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </SaduCard>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`w-full grid grid-cols-3 mb-8 ${isHeritage ? 'bg-[#E8DCCA]' : ''}`}>
            <TabsTrigger value="courses" className="gap-2" data-testid="tab-courses">
              <GraduationCap className="w-4 h-4" />
              {isArabic ? 'الدورات' : 'Courses'}
            </TabsTrigger>
            <TabsTrigger value="design" className="gap-2" data-testid="tab-design">
              <Palette className="w-4 h-4" />
              {isArabic ? 'مختبر التصميم' : 'Design Lab'}
            </TabsTrigger>
            <TabsTrigger value="careers" className="gap-2" data-testid="tab-careers">
              <Briefcase className="w-4 h-4" />
              {isArabic ? 'الوظائف' : 'Careers'}
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCourse(course)}
                  className="cursor-pointer"
                >
                  <SaduCard className="overflow-hidden p-0 h-full">
                    <div className="aspect-video relative">
                      <img src={course.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      {course.certified && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {isArabic ? 'معتمد' : 'Certified'}
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg">
                          {isArabic ? course.title_ar : course.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {isArabic ? course.instructor_ar : course.instructor}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {isArabic ? course.duration_ar : course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.lessons} {isArabic ? 'درس' : 'lessons'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>
                      
                      {course.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{isArabic ? 'التقدم' : 'Progress'}</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold" style={{ color: themeColors.primary }}>{course.price}</span>
                        <Button
                          size="sm"
                          className={isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}
                          data-testid={`course-${course.id}-btn`}
                        >
                          {course.progress > 0 ? (isArabic ? 'متابعة' : 'Continue') : (isArabic ? 'ابدأ' : 'Start')}
                        </Button>
                      </div>
                    </div>
                  </SaduCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Design Lab Tab */}
          <TabsContent value="design">
            <div className="mb-8">
              <div className={`p-6 rounded-2xl mb-8 ${isHeritage ? 'bg-[#8D1C1C]/10' : 'bg-[#0D9488]/10'}`}>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: themeColors.primary }}>
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-start">
                    <h3 className={`text-xl font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
                      {isArabic ? 'مولد الأنماط بالذكاء الاصطناعي' : 'AI Pattern Generator'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isArabic
                        ? 'استخدم الذكاء الاصطناعي لدمج أنماط السدو التقليدية في تصاميمك العصرية.'
                        : 'Use AI to merge traditional Sadu patterns into your modern designs.'}
                    </p>
                    <Button className={isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'} data-testid="ai-generator-btn">
                      {isArabic ? 'جرب الآن' : 'Try Now'}
                      <Sparkles className="w-4 h-4 ms-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <h3 className={`text-xl font-bold mb-6 ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? 'معرض المجتمع' : 'Community Gallery'}
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {designProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <SaduCard className="overflow-hidden p-0">
                    <div className="aspect-square relative">
                      <img src={project.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold mb-1">{isArabic ? project.title_ar : project.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{isArabic ? project.author_ar : project.author}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {project.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {project.comments}
                        </span>
                      </div>
                    </div>
                  </SaduCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Careers Tab */}
          <TabsContent value="careers">
            <div className="space-y-4">
              {careers.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SaduCard>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: themeColors.primary + '20' }}
                          >
                            <Briefcase className="w-6 h-6" style={{ color: themeColors.primary }} />
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${isHeritage ? 'font-serif' : ''}`}>
                              {isArabic ? job.title_ar : job.title}
                            </h3>
                            <p className="text-muted-foreground">{isArabic ? job.company_ar : job.company}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-accent px-2 py-1 rounded-full">
                                {isArabic ? job.location_ar : job.location}
                              </span>
                              <span className="text-xs bg-accent px-2 py-1 rounded-full">
                                {isArabic ? job.type_ar : job.type}
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                {job.salary}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground">{isArabic ? job.posted_ar : job.posted}</span>
                        <Button className={isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'} data-testid={`apply-${job.id}`}>
                          {isArabic ? 'تقدم الآن' : 'Apply Now'}
                          <ChevronRight className={`w-4 h-4 ms-1 ${isRTL ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </SaduCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-16 p-8 rounded-2xl ${isHeritage ? 'bg-[#8D1C1C]/10' : 'bg-[#0D9488]/10'}`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-start">
              <Users className="w-12 h-12 mb-4" style={{ color: themeColors.primary }} />
              <h3 className={`text-2xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? 'انضم لمجتمع المبدعين' : 'Join the Creators Community'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isArabic
                  ? 'تواصل مع شباب يشاركونك الشغف بالتراث. شارك أعمالك واحصل على إلهام جديد.'
                  : 'Connect with youth who share your passion for heritage. Share your work and get inspired.'}
              </p>
              <Button
                size="lg"
                className={`h-12 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
                data-testid="join-community-btn"
              >
                {isArabic ? 'انضم الآن' : 'Join Now'}
                <ChevronRight className={`w-5 h-5 ms-2 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <div className="flex -space-x-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={`w-12 h-12 rounded-full border-2 ${darkMode ? 'border-[#0F172A]' : 'border-white'}`} style={{ backgroundColor: themeColors.primary }} />
              ))}
              <div className={`w-12 h-12 rounded-full border-2 ${darkMode ? 'border-[#0F172A] bg-[#0F172A]' : 'border-white bg-gray-100'} flex items-center justify-center text-sm font-medium`}>
                +500
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Course Detail Modal */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle className={`text-2xl ${isHeritage ? 'font-serif' : ''}`}>
                  {isArabic ? selectedCourse.title_ar : selectedCourse.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img src={selectedCourse.image} alt="" className="w-full h-full object-cover" />
                </div>
                
                <p className="text-muted-foreground">
                  {isArabic ? selectedCourse.description_ar : selectedCourse.description}
                </p>
                
                {selectedCourse.modules && (
                  <div>
                    <h4 className="font-bold mb-3">{isArabic ? 'المحتوى' : 'Modules'}</h4>
                    <div className="space-y-2">
                      {selectedCourse.modules.map((module, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${module.completed ? 'bg-green-50' : 'bg-accent'}`}>
                          {module.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className={module.completed ? '' : 'text-muted-foreground'}>
                            {isArabic ? module.title_ar : module.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button className={`w-full h-12 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}>
                  {selectedCourse.progress > 0 ? (isArabic ? 'متابعة الدورة' : 'Continue Course') : (isArabic ? 'ابدأ الدورة' : 'Start Course')}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YouthPage;
