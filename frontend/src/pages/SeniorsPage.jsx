import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SaduCard } from '../components/SaduPattern';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import {
  ShoppingBag, Video, GraduationCap, Plus, Search,
  Users, Clock, Gem, Play, MessageSquare,
  Scissors, ChefHat, PenTool, Anchor, Hammer, Leaf, BookOpen, CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// --- مكونات فرعية (Sub-components) ---

const MarketplaceItem = ({ item, isArabic, onClick }) => {
  const { isHeritage, darkMode } = useTheme(); 
  const isModern = !isHeritage;
  const modernBorder = isModern ? 'border-2 border-[#1D4ED8] rounded-2xl overflow-hidden' : '';
  const modernDarkGlow = (isModern && darkMode) ? 'hover:shadow-[0_0_20px_rgba(29,78,216,0.8)]' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`group cursor-pointer transition-all duration-300 ${modernBorder} ${modernDarkGlow}`}
      onClick={onClick}
    >
      <SaduCard>
        <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-200 relative">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gem className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <h3 className={`font-bold bg-white text-[#8D1C1C] px-3 py-1.5 rounded-lg inline-block mb-2 shadow-sm border border-gray-100 ${isHeritage ? 'font-serif' : ''}`}>
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {item.description}
        </p>
        <div className="bg-white px-3 py-2 rounded-xl flex items-center justify-between mt-3 shadow-sm border border-gray-100">
          <span className={`text-lg font-bold ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#1D4ED8]'}`}>
            {item.price} د.ك
          </span>
          <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full font-medium border border-gray-200">
            {item.seller_name}
          </span>
        </div>
      </SaduCard>
    </motion.div>
  );
};

const ProductDetailsModal = ({ item, open, onOpenChange, isArabic }) => {
  const { isHeritage, darkMode } = useTheme();
  if (!item) return null;

  const modalBg = darkMode ? 'bg-[#1A1A1A]' : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-gray-50');
  const boxBg = darkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-white border-gray-200';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-md text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center mb-2 mt-2">
            <span className={`inline-block px-6 py-2.5 rounded-xl shadow-md ${boxBg} text-xl font-bold ${isHeritage ? 'font-serif' : ''} text-[#8D1C1C]`}>
              {item.title}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 px-6 pb-6">
          <div className="aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-md bg-gray-100">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex justify-between items-center gap-3">
            <div className={`flex-1 ${boxBg} px-4 py-3 rounded-xl shadow-sm border flex flex-col justify-center items-center`}>
              <span className="text-xs text-muted-foreground mb-1 font-semibold">{isArabic ? 'السعر' : 'Price'}</span>
              <span className={`text-2xl font-bold ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#1D4ED8]'}`}>
                {item.price} د.ك
              </span>
            </div>
            
            <div className={`flex-1 ${boxBg} px-4 py-3 rounded-xl shadow-sm border flex flex-col justify-center items-center`}>
              <span className="text-xs text-muted-foreground mb-1 font-semibold">{isArabic ? 'سنة الصنع' : 'Year'}</span>
              <span className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {item.year}
              </span>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl shadow-md ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'}`}>
            <h4 className="font-bold mb-2 text-sm text-white/90">{isArabic ? 'وصف التحفة:' : 'Description:'}</h4>
            <p className="text-white leading-relaxed font-medium">
              {item.description}
            </p>
          </div>
          
          <Button 
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 transition-all duration-300 font-bold text-xl py-6 mt-2 shadow-md rounded-xl"
            onClick={() => toast.success(isArabic ? 'سيتم تحويلك للواتساب' : 'Redirecting to WhatsApp')}
          >
            <MessageSquare className="w-6 h-6" />
            {isArabic ? 'تواصل مع البائع' : 'Contact Seller'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CouncilCard = ({ council, isArabic, onJoin, onStart, isHost }) => {
  const { isHeritage, darkMode } = useTheme();
  const { t } = useLanguage();

  const modernContainer = darkMode 
    ? 'bg-[#0F172A] border-2 border-blue-900/50 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white' 
    : 'bg-white border-2 border-blue-100 hover:border-blue-500 hover:shadow-xl text-gray-900';
    
  const modernButton = darkMode
    ? 'bg-[#3B82F6] hover:bg-[#60A5FA] text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
    : 'bg-[#1D4ED8] hover:bg-[#1E3A8A] text-white shadow-md';

  const heritageButton = 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white shadow-[4px_4px_0px_0px_#D97706]';
  const heritageText = darkMode ? 'text-gray-100' : 'text-[#8D1C1C]';

  const innerContent = (
    <>
      <div className="flex items-start justify-between mb-5">
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-2 ${council.status === 'live' ? 'bg-red-600 animate-pulse' : (isHeritage ? 'bg-[#D97706]' : 'bg-blue-500')}`}>
          {council.status === 'live' && <span className="w-2 h-2 bg-white rounded-full"></span>}
          {council.status === 'live' ? (isArabic ? 'مباشر الآن' : 'Live Now') : (isArabic ? 'قادم' : 'Upcoming')}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${!isHeritage && darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
          <Users className="w-4 h-4" />
          <span>{council.viewers || 0}</span>
        </div>
      </div>
      
      <h3 className={`text-xl font-bold mb-3 line-clamp-1 ${isHeritage ? `font-serif ${heritageText}` : ''}`}>
        {isArabic ? council.title_ar : council.title}
      </h3>
      
      <div className={`flex items-center gap-2 text-sm mb-6 font-medium ${!isHeritage && darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
        <Clock className="w-4 h-4" />
        <span>{council.time}</span>
      </div>
      
      {isHost && council.status === 'scheduled' ? (
        <Button onClick={() => onStart(council.id)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl h-12">
          <Play className="w-5 h-5 me-2 fill-current" /> {isArabic ? 'ابدأ البث' : 'Start Stream'}
        </Button>
      ) : (
        <Button onClick={() => onJoin(council.id)} className={`w-full font-bold rounded-xl h-12 transition-all duration-300 ${isHeritage ? heritageButton : modernButton}`}>
          <Video className="w-5 h-5 me-2" /> {t('join_now')}
        </Button>
      )}
    </>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="h-full">
      {isHeritage ? (
        <SaduCard className="h-full flex flex-col justify-between">
          {innerContent}
        </SaduCard>
      ) : (
        <div className={`p-6 h-full rounded-3xl flex flex-col justify-between transition-all duration-500 ${modernContainer}`}>
          {innerContent}
        </div>
      )}
    </motion.div>
  );
};

const AcademyCard = ({ course, isArabic, onEnroll }) => {
  const { isHeritage, darkMode } = useTheme();

  const modernContainer = darkMode 
    ? 'bg-[#0F172A] border-2 border-blue-900/50 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white' 
    : 'bg-white border-2 border-blue-100 hover:border-blue-500 hover:shadow-xl text-gray-900';
    
  const modernButton = darkMode
    ? 'bg-[#3B82F6] hover:bg-[#60A5FA] text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
    : 'bg-[#1D4ED8] hover:bg-[#1E3A8A] text-white shadow-md';

  const heritageButton = 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white shadow-[4px_4px_0px_0px_#D97706]';
  const heritageText = darkMode ? 'text-gray-100' : 'text-[#8D1C1C]';

  const innerContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isHeritage ? 'bg-[#D97706] text-white' : 'bg-blue-100 text-blue-800'}`}>
          {isArabic ? course.category_ar : course.category}
        </span>
        <course.icon className={`w-8 h-8 opacity-80 ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#1D4ED8]'}`} />
      </div>
      
      <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${isHeritage ? `font-serif ${heritageText}` : ''}`}>
        {isArabic ? course.title_ar : course.title}
      </h3>
      
      <p className={`text-sm mb-4 font-semibold ${!isHeritage && darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
        {isArabic ? 'تقديم الخبرة:' : 'Expert:'} <span className={isHeritage ? 'text-[#D97706]' : 'text-[#1D4ED8]'}>{isArabic ? course.instructor_ar : course.instructor}</span>
      </p>
      
      <div className="flex items-center gap-4 text-sm mb-6 border-t border-gray-200/20 pt-4">
         <div className="flex items-center gap-1.5">
           <Clock className="w-4 h-4 opacity-70" />
           <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{isArabic ? course.duration_ar : course.duration}</span>
         </div>
         <div className="flex items-center gap-1.5">
           <GraduationCap className="w-4 h-4 opacity-70" />
           <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{isArabic ? course.level_ar : course.level}</span>
         </div>
      </div>
      
      {/* استدعاء دالة التسجيل عند الضغط */}
      <Button onClick={() => onEnroll(course)} className={`w-full font-bold rounded-xl h-12 transition-all duration-300 ${isHeritage ? heritageButton : modernButton}`}>
        <BookOpen className="w-5 h-5 me-2" /> {isArabic ? 'سجل في الدورة' : 'Enroll Now'}
      </Button>
    </>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="h-full">
      {isHeritage ? (
        <SaduCard className="h-full flex flex-col justify-between">
          {innerContent}
        </SaduCard>
      ) : (
        <div className={`p-6 h-full rounded-3xl flex flex-col justify-between transition-all duration-500 ${modernContainer}`}>
          {innerContent}
        </div>
      )}
    </motion.div>
  );
};

// --- المكون الرئيسي (Main Component) ---

const SeniorsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language, languages, setLanguage } = useLanguage();
  const { isAuthenticated, user, token } = useAuth();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState('marketplace');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [councilModalOpen, setCouncilModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // حالات أكاديمية الخبرات
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  
  const [items] = useState([
    { id: "fake-1", title: "ثوب الثريا - نسائي", description: 'ثوب نسائي وهو "دراعة" و تُصنع عليه قطع ذهبية تُسمى "نيرات" على شكل نجوم الثريا المتلألئة البراقة.', price: 50, year: "1970", image: "/thoubathuraya.png", category: "clothing", seller_name: "بوابة المتقاعدين" },
    { id: "fake-2", title: "بشت حساوي فاخر", description: 'بشت حساوي مشغول يدوياً بخيوط الزري الذهبية الأصلية، يتميز بدقة التطريز وفخامة القماش، مناسب للمناسبات الرسمية والأعياد.', price: 150, year: "1985", image: "/hasawi.jpg", category: "clothing", seller_name: "محل بومحمد للبشوت" },
    { id: "fake-3", title: "مبخر خشب صاج مطعم بالنحاس", description: 'مبخر كويتي قديم مصنوع من خشب الصاج المتين، مزين بمسامير ونقوش نحاسية دقيقة تعكس عبق الماضي.', price: 35, year: "1960", image: "/مبخر خشب.png", category: "home", seller_name: "سوق المباركية للتحف" },
    { id: "fake-4", title: "راديو خشب كلاسيكي", description: 'راديو ترانزستور خشبي قديم بحالة ممتازة، يعمل بشكل جيد ويضيف لمسة كلاسيكية رائعة لأي مجلس أو ديوانية.', price: 80, year: "1975", image: "/راديو خشب كلاسيكي.png", category: "electronics", seller_name: "أنتيكات الزمن الجميل" },
    { id: "fake-5", title: "دلة رسلان أصلية", description: 'دلة قهوة عربية من نوع "رسلان" مختومة، مصنوعة من النحاس الخالص، كانت تستخدم في دواوين الكويت القديمة وتعتبر رمزاً للكرم.', price: 120, year: "1950", image: "/دلة رسلان أصلية.jpg", category: "home", seller_name: "مجلس الأجداد" },
    { id: "fake-6", title: "صندوق مبيت كويتي", description: 'صندوق خشبي كبير كان يُستخدم قديماً لحفظ ملابس ومقتنيات العروس، مزين بزخارف هندسية رائعة ومسامير نحاسية لامعة.', price: 300, year: "1940", image: "/صندوق مبيت كويتي.jpg", category: "furniture", seller_name: "متحف الفريج" }
  ]);
  
  const [councils] = useState([
    { id: "c-1", title: "Tales of the Sea", title_ar: "حكايات البحر القديمة", status: "scheduled", time: "10:00 PM", viewers: 12, host_id: "user-123" },
    { id: "c-2", title: "Pearl Diving Days", title_ar: "أيام الغوص على اللؤلؤ", status: "live", time: "الآن", viewers: 156, host_id: "user-456" },
    { id: "c-3", title: "Art of Sadu", title_ar: "فن السدو وتاريخه", status: "scheduled", time: "غداً 8:00 PM", viewers: 45, host_id: "user-789" },
    { id: "c-4", title: "Old Kuwaiti Markets", title_ar: "ذكريات أسواق الكويت", status: "live", time: "الآن", viewers: 89, host_id: "user-101" },
    { id: "c-5", title: "Building the Boom Ship", title_ar: "صناعة السفن الخشبية (البوم)", status: "scheduled", time: "الخميس 9:00 PM", viewers: 30, host_id: "user-202" }
  ]);

  // إضافة حقل enrollees لتخزين عدد المسجلين الافتراضي
  const [academyCourses] = useState([
    { id: "a-1", title: "Traditional Sadu Weaving", title_ar: "أساسيات حياكة السدو التقليدية", instructor: "Om Mohammad", instructor_ar: "أم محمد المري", category: "Crafts", category_ar: "حرف يدوية", duration: "4 Weeks", duration_ar: "4 أسابيع", level: "Beginner", level_ar: "مبتدئ", enrollees: 34, icon: Scissors },
    { id: "a-2", title: "Authentic Kuwaiti Cooking", title_ar: "أسرار الطبخ الكويتي الأصيل (مجبوس ومطبق)", instructor: "Chef Abu Salem", instructor_ar: "الطباخ أبو سالم", category: "Culinary", category_ar: "فنون الطهي", duration: "2 Weeks", duration_ar: "أسبوعان", level: "All Levels", level_ar: "الجميع", enrollees: 128, icon: ChefHat },
    { id: "a-3", title: "Arabic Calligraphy & Poetry", title_ar: "الخط العربي الأصيل وأوزان الشعر النبطي", instructor: "Ustadh Khalid", instructor_ar: "الأستاذ خالد", category: "Arts", category_ar: "فنون وأدب", duration: "6 Weeks", duration_ar: "6 أسابيع", level: "Intermediate", level_ar: "متوسط", enrollees: 56, icon: PenTool },
    { id: "a-4", title: "Pearl Diving History & Tools", title_ar: "تاريخ الغوص على اللؤلؤ وأسرار النواخذة", instructor: "Nokhatha Abu Saad", instructor_ar: "النوخذة أبو سعد", category: "History", category_ar: "تاريخ وتراث", duration: "1 Week", duration_ar: "أسبوع واحد", level: "All Levels", level_ar: "الجميع", enrollees: 89, icon: Anchor },
    { id: "a-5", title: "Building Traditional Dhows", title_ar: "صناعة مجسمات السفن الخشبية (البوم الشراعي)", instructor: "Am Saleh", instructor_ar: "العم صالح القلاف", category: "Crafts", category_ar: "حرف يدوية", duration: "8 Weeks", duration_ar: "8 أسابيع", level: "Advanced", level_ar: "متقدم", enrollees: 21, icon: Hammer },
    { id: "a-6", title: "Agriculture & Desert Plants", title_ar: "الزراعة الموسمية والتعرف على نباتات الصحراء", instructor: "Abu Abdullah", instructor_ar: "المزارع أبو عبدالله", category: "Agriculture", category_ar: "زراعة وبيئة", duration: "3 Weeks", duration_ar: "3 أسابيع", level: "Beginner", level_ar: "مبتدئ", enrollees: 42, icon: Leaf }
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // دوال أكاديمية الخبرات
  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    // إغلاق نافذة التسجيل
    setEnrollModalOpen(false);
    
    // إنشاء رقم تسجيل عشوائي مكون من 4 أرقام
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setRegistrationNumber(`REG-${randomNum}`);
    
    // فتح نافذة النجاح بعد فترة قصيرة لتأثير بصري جميل
    setTimeout(() => {
      setSuccessModalOpen(true);
    }, 300);
  };

  const handleJoinCouncil = async (councilId) => {
    if (!isAuthenticated) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/councils/${councilId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(isArabic ? 'تم الانضمام للمجلس' : 'Joined successfully');
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ في الانضمام' : 'Error joining');
    }
  };

  const handleStartCouncil = async (councilId) => {
    try {
      await axios.post(`${API_URL}/api/councils/${councilId}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(isArabic ? 'بدأ البث المباشر!' : 'Stream started!');
      fetchData();
    } catch (error) {
      toast.error(isArabic ? 'فشل بدء البث' : 'Failed to start stream');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const getTabClasses = () => {
    const baseClass = "gap-2 transition-all duration-300";
    if (isHeritage) {
      return `${baseClass} data-[state=active]:bg-[#8D1C1C] data-[state=active]:text-white`;
    } else {
      if (darkMode) {
        return `${baseClass} data-[state=active]:bg-[#1D4ED8] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(29,78,216,0.8)]`;
      } else {
        return `${baseClass} data-[state=active]:bg-[#DC2626] data-[state=active]:text-white`;
      }
    }
  };

  const getLanguageSelectorColor = () => {
    if (isHeritage) {
      if (darkMode) return 'text-white hover:text-white/80';
      return 'text-[#8D1C1C] hover:text-[#8D1C1C]/80';
    } else {
      if (darkMode) return 'text-white hover:text-white/80';
      return 'text-[#1D4ED8] hover:text-[#1D4ED8]/80';
    }
  };

  const dynamicTabClass = getTabClasses();
  const languageColorClass = getLanguageSelectorColor();

  // --- ستايلات النوافذ الديناميكية ---
  const modalBg = darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-white');
  const inputStyle = darkMode 
    ? (isHeritage ? 'bg-[#2A2A2A] border-gray-600 text-white placeholder:text-gray-400 focus:border-[#D97706]' : 'bg-[#1E293B] border-blue-900/50 text-white placeholder:text-gray-400 focus:border-blue-500 shadow-inner rounded-xl')
    : (isHeritage ? 'bg-white border-[#8D1C1C]/30 text-[#8D1C1C] focus:border-[#8D1C1C]' : 'bg-gray-50 border-blue-200 text-gray-900 focus:border-blue-500 rounded-xl');
  const labelStyle = darkMode ? 'text-gray-300' : (isHeritage ? 'text-[#8D1C1C] font-bold' : 'text-gray-700 font-semibold');

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FDF6E3]'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        
        <div className={`absolute top-4 right-4 z-50 ${isRTL ? 'right-auto left-4' : 'right-4'}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 font-bold text-base transition-colors duration-300 ${languageColorClass}`}
              >
                <span className="text-xl">
                  {languages.find(l => l.code === language)?.flag === 'KW' ? '🇰🇼' : '🇬🇧'}
                </span>
                {languages.find(l => l.code === language)?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 mt-1" align={isRTL ? 'start' : 'end'}>
              {languages.map((lng) => (
                <DropdownMenuItem 
                  key={lng.code} 
                  onClick={() => setLanguage(lng.code)}
                  className={`gap-3 ${language === lng.code ? 'bg-gray-100 font-semibold' : ''}`}
                >
                  <span className="text-xl">{lng.flag === 'KW' ? '🇰🇼' : '🇬🇧'}</span>
                  <span className="text-sm">{lng.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-bold mb-4" style={{ color: themeColors.primary }}>{t('seniors')}</h1>
          <p className="text-lg text-muted-foreground">
            {isArabic ? 'شارك خبراتك، بيع تحفك الثمينة، واستضف مجالس الحكايات الحية.' : 'Share your expertise and host live councils.'}
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-8">
            <TabsTrigger value="marketplace" className={dynamicTabClass}>
              <ShoppingBag className="w-4 h-4" />{t('marketplace')}
            </TabsTrigger>
            <TabsTrigger value="councils" className={dynamicTabClass}>
              <Video className="w-4 h-4" />{t('tale_councils')}
            </TabsTrigger>
            <TabsTrigger value="academy" className={dynamicTabClass}>
              <GraduationCap className="w-4 h-4" />{t('expertise_academy')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                    placeholder={isArabic ? 'ابحث عن التحف...' : 'Search...'} 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="ps-10" 
                />
              </div>
              <Button onClick={() => setSellModalOpen(true)} className={`gap-2 text-white ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'}`}>
                <Plus className="w-4 h-4" /> {isArabic ? 'بيع تحفة' : 'Sell Item'}
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items
                .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(item => (
                <MarketplaceItem key={item.id} item={item} isArabic={isArabic} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="councils">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{isArabic ? 'مجالس الحكايات' : 'Tale Councils'}</h2>
                <Button onClick={() => setCouncilModalOpen(true)} className={`gap-2 text-white font-bold ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'}`}>
                  <Plus className="w-5 h-5" /> {isArabic ? 'استضافة مجلس' : 'Host Council'}
                </Button>
             </div>
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {councils.map(council => (
                    <CouncilCard 
                        key={council.id} 
                        council={council} 
                        isArabic={isArabic} 
                        onJoin={handleJoinCouncil}
                        onStart={handleStartCouncil}
                        isHost={user?.id === council.host_id}
                    />
                ))}
             </div>
          </TabsContent>

          <TabsContent value="academy">
             <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{isArabic ? 'أكاديمية الخبرات' : 'Expertise Academy'}</h2>
                  <p className="text-muted-foreground text-sm">
                    {isArabic ? 'تعلم مهارات تراثية وحرف يدوية مباشرة من أهل الخبرة والاختصاص.' : 'Learn traditional skills directly from experienced seniors.'}
                  </p>
                </div>
                <Button onClick={() => toast.success(isArabic ? 'سيتم فتح نافذة إضافة خبرة قريباً' : 'Coming soon')} className={`gap-2 text-white font-bold h-12 px-6 rounded-xl shadow-md ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#1E3A8A]'}`}>
                  <Plus className="w-5 h-5" /> {isArabic ? 'شارك خبرتك' : 'Share Expertise'}
                </Button>
             </div>
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {academyCourses.map(course => (
                    <AcademyCard 
                        key={course.id} 
                        course={course} 
                        isArabic={isArabic}
                        onEnroll={handleEnrollClick}
                    />
                ))}
             </div>
          </TabsContent>
        </Tabs>
      </div>

      <ProductDetailsModal 
        item={selectedItem} 
        open={detailsModalOpen} 
        onOpenChange={setDetailsModalOpen} 
        isArabic={isArabic} 
      />

      {/* --- 1. نافذة التسجيل في الدورة --- */}
      <Dialog open={enrollModalOpen} onOpenChange={setEnrollModalOpen}>
        <DialogContent className={`max-w-sm text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className={`text-2xl font-bold ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'تسجيل في الدورة' : 'Course Enrollment'}
            </DialogTitle>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isArabic ? selectedCourse?.title_ar : selectedCourse?.title}
            </p>
          </DialogHeader>
          
          <form onSubmit={handleEnrollSubmit} className="space-y-4 px-6 pb-6 mt-4">
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'الاسم الكامل' : 'Full Name'}</label>
              <Input required type="text" placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'} className={inputStyle} />
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'رقم الهاتف' : 'Phone Number'}</label>
              <Input required type="tel" placeholder={isArabic ? 'أدخل رقم الهاتف' : 'Enter your phone number'} className={inputStyle} />
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <Input required type="email" placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'} className={inputStyle} />
            </div>
            
            <Button 
              type="submit"
              className={`w-full font-bold h-12 mt-4 text-white transition-all duration-300 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] rounded-none shadow-[4px_4px_0px_0px_#D97706]' : 'bg-[#1D4ED8] hover:bg-[#1E3A8A] rounded-xl shadow-lg shadow-blue-500/30'}`}
            >
              {isArabic ? 'تأكيد التسجيل' : 'Confirm Enrollment'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- 2. نافذة نجاح التسجيل (النافذة الصغيرة) --- */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className={`max-w-xs text-center border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${isHeritage ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'}`}
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            
            <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif text-[#8D1C1C]' : (darkMode ? 'text-white' : 'text-gray-900')}`}>
              {isArabic ? 'تم التسجيل بنجاح!' : 'Enrollment Successful!'}
            </h2>
            
            <div className={`w-full p-4 rounded-xl mt-2 border ${darkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-sm text-muted-foreground mb-1">{isArabic ? 'رقم التسجيل الخاص بك:' : 'Your Registration Number:'}</p>
              <p className={`text-xl font-mono font-bold tracking-wider ${isHeritage ? 'text-[#D97706]' : 'text-[#3B82F6]'}`}>
                {registrationNumber}
              </p>
            </div>
            
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {isArabic ? 'أنت الآن جزء من' : 'You are now among'}{' '}
              <span className={`font-bold text-lg px-1 ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#1D4ED8]'}`}>
                {(selectedCourse?.enrollees || 0) + 1}
              </span> 
              {' '}{isArabic ? 'مسجلين في هذه الدورة.' : 'enrollees in this course.'}
            </p>

            <Button 
              onClick={() => setSuccessModalOpen(false)}
              className={`w-full mt-2 font-bold transition-all ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              {isArabic ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default SeniorsPage;