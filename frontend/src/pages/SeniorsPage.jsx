import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Scissors, ChefHat, PenTool, Anchor, Hammer, Leaf, CheckCircle2,
  UploadCloud, Phone, FileText, DollarSign, Trash2, BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

// ==========================================
// 1. المكونات الفرعية
// ==========================================
const MarketplaceItem = ({ item, isArabic, onClick, isOwner, onDelete }) => {
  const { isHeritage, darkMode } = useTheme(); 
  const isModern = !isHeritage;
  const modernBorder = isModern ? 'border-2 border-[#1D4ED8] rounded-2xl overflow-hidden' : '';
  const modernDarkGlow = (isModern && darkMode) ? 'hover:shadow-[0_0_20px_rgba(29,78,216,0.8)]' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`group cursor-pointer transition-all duration-300 relative ${modernBorder} ${modernDarkGlow}`}
      onClick={onClick}
    >
      {isOwner && (
        <button 
          onClick={onDelete} 
          title={isArabic ? 'حذف التحفة' : 'Delete Item'}
          className="absolute top-3 left-3 z-20 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

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
      <DialogContent aria-describedby={undefined} className={`max-w-md text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center mb-2 mt-2">
            <span className={`inline-block px-6 py-2.5 rounded-xl shadow-md ${boxBg} text-xl font-bold ${isHeritage ? 'font-serif' : ''} text-[#8D1C1C]`}>
              {item.title}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 px-6 pb-6">
          <div className="aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-md bg-gray-100">
            <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover" />
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

const CouncilCard = ({ council, isArabic, onJoin, onStart, isHost, onDelete }) => {
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
    <div className="relative h-full flex flex-col justify-between">
      {isHost && (
        <button 
          onClick={onDelete} 
          title={isArabic ? 'إلغاء المجلس' : 'Delete Council'}
          className="absolute -top-2 -left-2 z-20 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      <div>
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
        
        {council.image && (
          <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
            <img src={council.image} alt={council.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <h3 className={`text-xl font-bold mb-3 line-clamp-1 ${isHeritage ? `font-serif ${heritageText}` : ''}`}>
          {isArabic ? council.title_ar : council.title}
        </h3>
        
        <div className={`flex items-center gap-2 text-sm mb-6 font-medium ${!isHeritage && darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
          <Clock className="w-4 h-4" />
          <span>{council.time}</span>
        </div>
      </div>
      
      {isHost && council.status === 'scheduled' ? (
        <Button onClick={() => onStart(council.id)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-12 mt-auto">
          <Play className="w-5 h-5 me-2 fill-current" /> {isArabic ? 'ابدأ البث' : 'Start Stream'}
        </Button>
      ) : (
        <Button onClick={() => onJoin(council.id)} className={`w-full font-bold rounded-xl h-12 mt-auto transition-all duration-300 ${isHeritage ? heritageButton : modernButton}`}>
          <Video className="w-5 h-5 me-2" /> {t('join_now')}
        </Button>
      )}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="h-full">
      {isHeritage ? (
        <SaduCard className="h-full">
          {innerContent}
        </SaduCard>
      ) : (
        <div className={`p-6 h-full rounded-3xl transition-all duration-500 ${modernContainer}`}>
          {innerContent}
        </div>
      )}
    </motion.div>
  );
};

const AcademyCard = ({ course, isArabic, onEnroll, isOwner, onDelete }) => {
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
    <div className="relative h-full flex flex-col justify-between">
      {/* زر الحذف البارز (يظهر للمدرب صاحب الدورة فقط) */}
      {isOwner && (
        <button 
          onClick={onDelete} 
          title={isArabic ? 'إلغاء الدورة' : 'Delete Course'}
          className="absolute -top-2 -left-2 z-20 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isHeritage ? 'bg-[#D97706] text-white' : 'bg-blue-100 text-blue-800'}`}>
            {isArabic ? course.category_ar : course.category}
          </span>
          {course.icon && <course.icon className={`w-8 h-8 opacity-80 ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#1D4ED8]'}`} />}
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
      </div>
      
      <Button onClick={() => onEnroll(course)} className={`w-full font-bold rounded-xl h-12 mt-auto transition-all duration-300 ${isHeritage ? heritageButton : modernButton}`}>
        <BookOpen className="w-5 h-5 me-2" /> {isArabic ? 'سجل في الدورة' : 'Enroll Now'}
      </Button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="h-full">
      {isHeritage ? (
        <SaduCard className="h-full">
          {innerContent}
        </SaduCard>
      ) : (
        <div className={`p-6 h-full rounded-3xl transition-all duration-500 ${modernContainer}`}>
          {innerContent}
        </div>
      )}
    </motion.div>
  );
};

// ==========================================
// 2. المكون الرئيسي (SeniorsPage)
// ==========================================
const SeniorsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language, languages, setLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState('marketplace');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // حالات النوافذ (Modals)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');

  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [councilModalOpen, setCouncilModalOpen] = useState(false);
  const [shareExpertiseModalOpen, setShareExpertiseModalOpen] = useState(false);

  // حالات رفع الصور والملفات
  const [sellImagePreview, setSellImagePreview] = useState(null);
  const [councilImagePreview, setCouncilImagePreview] = useState(null);
  const [courseFileName, setCourseFileName] = useState("");

  // الداتا القديمة مع إضافة معرفات لتحديد الصلاحيات
  const [items, setItems] = useState([
    { id: "fake-1", title: "ثوب الثريا - نسائي", description: 'ثوب نسائي وهو "دراعة" و تُصنع عليه قطع ذهبية تُسمى "نيرات" على شكل نجوم الثريا المتلألئة البراقة.', price: 50, year: "1970", image: "/thoubathuraya.png", category: "clothing", seller_name: "بوابة المتقاعدين", seller_id: "system" },
    { id: "fake-2", title: "بشت حساوي فاخر", description: 'بشت حساوي مشغول يدوياً بخيوط الزري الذهبية الأصلية، يتميز بدقة التطريز وفخامة القماش.', price: 150, year: "1985", image: "/hasawi.jpg", category: "clothing", seller_name: "محل بومحمد للبشوت", seller_id: "system" },
    { id: "fake-3", title: "مبخر خشب صاج مطعم بالنحاس", description: 'مبخر كويتي قديم مصنوع من خشب الصاج المتين، مزين بمسامير ونقوش نحاسية دقيقة.', price: 35, year: "1960", image: "/مبخر خشب.png", category: "home", seller_name: "سوق المباركية للتحف", seller_id: "system" },
    { id: "fake-4", title: "راديو خشب كلاسيكي", description: 'راديو ترانزستور خشبي قديم بحالة ممتازة يضيف لمسة كلاسيكية رائعة لأي مجلس.', price: 80, year: "1975", image: "/راديو خشب كلاسيكي.png", category: "electronics", seller_name: "أنتيكات الزمن الجميل", seller_id: "system" },
    { id: "fake-5", title: "دلة رسلان أصلية", description: 'دلة قهوة عربية من نوع "رسلان" مختومة، مصنوعة من النحاس الخالص.', price: 120, year: "1950", image: "/دلة رسلان أصلية.jpg", category: "home", seller_name: "مجلس الأجداد", seller_id: "system" },
    { id: "fake-6", title: "صندوق مبيت كويتي", description: 'صندوق خشبي كبير كان يُستخدم قديماً لحفظ ملابس العروس مزين بمسامير نحاسية.', price: 300, year: "1940", image: "/صندوق مبيت كويتي.jpg", category: "furniture", seller_name: "متحف الفريج", seller_id: "system" }
  ]);
  
  const [councils, setCouncils] = useState([
    { id: "c-1", title: "Tales of the Sea", title_ar: "حكايات البحر القديمة", status: "scheduled", time: "10:00 PM", viewers: 12, host_id: "system" },
    { id: "c-2", title: "Pearl Diving Days", title_ar: "أيام الغوص على اللؤلؤ", status: "live", time: "الآن", viewers: 156, host_id: "system" },
    { id: "c-3", title: "Art of Sadu", title_ar: "فن السدو وتاريخه", status: "scheduled", time: "غداً 8:00 PM", viewers: 45, host_id: "system" },
    { id: "c-4", title: "Old Kuwaiti Markets", title_ar: "ذكريات أسواق الكويت", status: "live", time: "الآن", viewers: 89, host_id: "system" },
    { id: "c-5", title: "Building the Boom Ship", title_ar: "صناعة السفن الخشبية (البوم)", status: "scheduled", time: "الخميس 9:00 PM", viewers: 30, host_id: "system" }
  ]);

  const [academyCourses, setAcademyCourses] = useState([
    { id: "a-1", title: "Traditional Sadu Weaving", title_ar: "أساسيات حياكة السدو التقليدية", instructor: "Om Mohammad", instructor_ar: "أم محمد المري", category: "Crafts", category_ar: "حرف يدوية", duration: "4 Weeks", duration_ar: "4 أسابيع", level: "Beginner", level_ar: "مبتدئ", enrollees: 34, icon: Scissors, host_id: "system" },
    { id: "a-2", title: "Authentic Kuwaiti Cooking", title_ar: "أسرار الطبخ الكويتي الأصيل", instructor: "Chef Abu Salem", instructor_ar: "الطباخ أبو سالم", category: "Culinary", category_ar: "فنون الطهي", duration: "2 Weeks", duration_ar: "أسبوعان", level: "All Levels", level_ar: "الجميع", enrollees: 128, icon: ChefHat, host_id: "system" },
    { id: "a-3", title: "Arabic Calligraphy & Poetry", title_ar: "الخط العربي الأصيل وأوزان الشعر", instructor: "Ustadh Khalid", instructor_ar: "الأستاذ خالد", category: "Arts", category_ar: "فنون وأدب", duration: "6 Weeks", duration_ar: "6 أسابيع", level: "Intermediate", level_ar: "متوسط", enrollees: 56, icon: PenTool, host_id: "system" },
    { id: "a-4", title: "Pearl Diving History & Tools", title_ar: "تاريخ الغوص على اللؤلؤ وأسراره", instructor: "Nokhatha Abu Saad", instructor_ar: "النوخذة أبو سعد", category: "History", category_ar: "تاريخ وتراث", duration: "1 Week", duration_ar: "أسبوع واحد", level: "All Levels", level_ar: "الجميع", enrollees: 89, icon: Anchor, host_id: "system" },
    { id: "a-5", title: "Building Traditional Dhows", title_ar: "صناعة مجسمات السفن الخشبية", instructor: "Am Saleh", instructor_ar: "العم صالح القلاف", category: "Crafts", category_ar: "حرف يدوية", duration: "8 Weeks", duration_ar: "8 أسابيع", level: "Advanced", level_ar: "متقدم", enrollees: 21, icon: Hammer, host_id: "system" },
    { id: "a-6", title: "Agriculture & Desert Plants", title_ar: "الزراعة الموسمية في الصحراء", instructor: "Abu Abdullah", instructor_ar: "المزارع أبو عبدالله", category: "Agriculture", category_ar: "زراعة وبيئة", duration: "3 Weeks", duration_ar: "3 أسابيع", level: "Beginner", level_ar: "مبتدئ", enrollees: 42, icon: Leaf, host_id: "system" }
  ]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // --- دوال الحذف (تعمل للمالك فقط) ---
  const handleDeleteItem = (e, id) => {
    e.stopPropagation(); 
    setItems(items.filter(item => item.id !== id));
    toast.success(isArabic ? 'تم حذف التحفة بنجاح' : 'Item deleted successfully');
  };

  const handleDeleteCouncil = (e, id) => {
    e.stopPropagation();
    setCouncils(councils.filter(c => c.id !== id));
    toast.success(isArabic ? 'تم إلغاء المجلس بنجاح' : 'Council cancelled successfully');
  };

  const handleDeleteCourse = (e, id) => {
    e.stopPropagation();
    setAcademyCourses(academyCourses.filter(c => c.id !== id));
    toast.success(isArabic ? 'تم إلغاء الدورة بنجاح' : 'Course cancelled successfully');
  };

  // --- دوال رفع الصور والملفات ---
  const handleImageUpload = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) { setPreview(URL.createObjectURL(file)); }
  };

  const handleCourseFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) { setCourseFileName(file.name); }
  };

  // --- دوال النشر ---
  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error(isArabic ? 'يرجى تسجيل الدخول' : 'Please login first'); return; }
    const formData = new FormData(e.target);
    const newItem = {
      id: `item-${Date.now()}`,
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      year: formData.get('year'),
      image: sellImagePreview || null,
      seller_name: user?.name || (isArabic ? 'بائع جديد' : 'New Seller'),
      seller_id: user?.id || "user-new" 
    };
    setItems([newItem, ...items]); 
    setSellModalOpen(false);
    setSellImagePreview(null);
    toast.success(isArabic ? 'تم نشر تحفتك بنجاح في السوق!' : 'Your item has been published successfully!');
  };

  const handleCouncilSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error(isArabic ? 'يرجى تسجيل الدخول' : 'Please login first'); return; }
    const formData = new FormData(e.target);
    const newCouncil = {
      id: `c-${Date.now()}`,
      title: formData.get('title'),
      title_ar: formData.get('title'),
      status: "scheduled",
      time: formData.get('time'),
      viewers: 0,
      host_id: user?.id || "user-new",
      image: councilImagePreview || null
    };
    setCouncils([newCouncil, ...councils]); 
    setCouncilModalOpen(false);
    setCouncilImagePreview(null);
    toast.success(isArabic ? 'تم جدولة مجلسك بنجاح!' : 'Your council has been scheduled successfully!');
  };

  const handleShareExpertiseSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error(isArabic ? 'يرجى تسجيل الدخول' : 'Please login first'); return; }
    const formData = new FormData(e.target);
    const newCourse = {
      id: `a-${Date.now()}`,
      title: formData.get('title'),
      title_ar: formData.get('title'),
      instructor: user?.name || (isArabic ? "خبير جديد" : "New Expert"),
      instructor_ar: user?.name || (isArabic ? "خبير جديد" : "New Expert"),
      category: "New",
      category_ar: "جديد",
      duration: formData.get('duration'),
      duration_ar: formData.get('duration'),
      level: "All Levels",
      level_ar: "الجميع",
      enrollees: 0,
      icon: BookOpen,
      host_id: user?.id || "user-new"
    };
    setAcademyCourses([newCourse, ...academyCourses]); 
    setShareExpertiseModalOpen(false);
    setCourseFileName("");
    toast.success(isArabic ? 'تمت إضافة دورتك بنجاح للأكاديمية!' : 'Your course has been added to the academy!');
  };

  const handleItemClick = (item) => { setSelectedItem(item); setDetailsModalOpen(true); };
  const handleEnrollClick = (course) => { setSelectedCourse(course); setEnrollModalOpen(true); };
  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    setEnrollModalOpen(false);
    setRegistrationNumber(`REG-${Math.floor(1000 + Math.random() * 9000)}`);
    setTimeout(() => setSuccessModalOpen(true), 300);
  };
  const handleJoinCouncil = (councilId) => toast.success(isArabic ? 'تم الانضمام للمجلس بنجاح!' : 'Joined council successfully!');
  const handleStartCouncil = (councilId) => toast.success(isArabic ? 'بدأ البث المباشر!' : 'Stream started!');

  // الأنماط الديناميكية
  const getTabClasses = () => {
    const baseClass = "gap-2 transition-all duration-300";
    if (isHeritage) return `${baseClass} data-[state=active]:bg-[#8D1C1C] data-[state=active]:text-white`;
    if (darkMode) return `${baseClass} data-[state=active]:bg-[#1D4ED8] data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(29,78,216,0.8)]`;
    return `${baseClass} data-[state=active]:bg-[#1D4ED8] data-[state=active]:text-white`;
  };

  const modalBg = darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-white');
  const inputStyle = darkMode 
    ? (isHeritage ? 'bg-[#2A2A2A] border-gray-600 text-white placeholder:text-gray-400 focus:border-[#D97706]' : 'bg-[#1E293B] border-blue-900/50 text-white placeholder:text-gray-400 focus:border-blue-500 shadow-inner rounded-xl')
    : (isHeritage ? 'bg-white border-[#8D1C1C]/30 text-[#8D1C1C] focus:border-[#8D1C1C]' : 'bg-gray-50 border-blue-200 text-gray-900 focus:border-blue-500 rounded-xl');
  const labelStyle = darkMode ? 'text-gray-300' : (isHeritage ? 'text-[#8D1C1C] font-bold' : 'text-gray-700 font-semibold');
  const modalBtnStyle = isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white rounded-none shadow-[4px_4px_0px_0px_#D97706]' : 'bg-[#1D4ED8] hover:bg-[#1E3A8A] text-white rounded-xl shadow-lg shadow-blue-500/30';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FDF6E3]'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        
        {/* Header & Translation */}
        <div className={`absolute top-4 right-4 z-50 ${isRTL ? 'right-auto left-4' : 'right-4'}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 font-bold text-base transition-colors duration-300">
                <span className="text-xl">{languages.find(l => l.code === language)?.flag === 'KW' ? '🇰🇼' : '🇬🇧'}</span>
                {languages.find(l => l.code === language)?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 mt-1" align={isRTL ? 'start' : 'end'}>
              {languages.map((lng) => (
                <DropdownMenuItem key={lng.code} onClick={() => setLanguage(lng.code)} className={`gap-3 ${language === lng.code ? 'bg-gray-100 font-semibold' : ''}`}>
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-8">
            <TabsTrigger value="marketplace" className={getTabClasses()}><ShoppingBag className="w-4 h-4" />{t('marketplace')}</TabsTrigger>
            <TabsTrigger value="councils" className={getTabClasses()}><Video className="w-4 h-4" />{t('tale_councils')}</TabsTrigger>
            <TabsTrigger value="academy" className={getTabClasses()}><GraduationCap className="w-4 h-4" />{t('expertise_academy')}</TabsTrigger>
          </TabsList>

          {/* 1. السوق */}
          <TabsContent value="marketplace">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder={isArabic ? 'ابحث عن التحف...' : 'Search...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ps-10" />
              </div>
              <Button onClick={() => setSellModalOpen(true)} className={`gap-2 text-white font-bold h-10 px-8 ${isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-[#1D4ED8] rounded-full shadow-lg hover:shadow-blue-500/50'}`}>
                <Plus className="w-5 h-5" /> {isArabic ? 'بيع تحفة' : 'Sell Item'}
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                <MarketplaceItem 
                  key={item.id} 
                  item={item} 
                  isArabic={isArabic} 
                  onClick={() => handleItemClick(item)} 
                  isOwner={item.seller_id === (user?.id || "user-new")} 
                  onDelete={(e) => handleDeleteItem(e, item.id)}
                />
              ))}
            </div>
          </TabsContent>

          {/* 2. المجالس */}
          <TabsContent value="councils">
             <div className="flex justify-between items-center mb-8">
                <h2 className={`text-3xl font-bold ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>{isArabic ? 'مجالس الحكايات' : 'Tale Councils'}</h2>
                <Button onClick={() => setCouncilModalOpen(true)} className={`gap-2 text-white font-bold h-10 px-8 ${isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-[#1D4ED8] rounded-full shadow-lg hover:shadow-blue-500/50'}`}>
                  <Video className="w-5 h-5" /> {isArabic ? 'استضافة مجلس' : 'Host Council'}
                </Button>
             </div>
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {councils.map(council => (
                    <CouncilCard 
                      key={council.id} 
                      council={council} 
                      isArabic={isArabic} 
                      onJoin={() => handleJoinCouncil(council.id)}
                      onStart={() => handleStartCouncil(council.id)}
                      isHost={council.host_id === (user?.id || "user-new")} 
                      onDelete={(e) => handleDeleteCouncil(e, council.id)}
                    />
                ))}
             </div>
          </TabsContent>

          {/* 3. الأكاديمية */}
          <TabsContent value="academy">
             <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className={`text-3xl font-bold mb-2 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>{isArabic ? 'أكاديمية الخبرات' : 'Expertise Academy'}</h2>
                  <p className="text-muted-foreground text-sm">{isArabic ? 'تعلم مهارات تراثية مباشرة من أهل الاختصاص.' : 'Learn traditional skills from experts.'}</p>
                </div>
                <Button onClick={() => setShareExpertiseModalOpen(true)} className={`gap-2 text-white font-bold h-12 px-6 ${isHeritage ? 'bg-[#D97706] rounded-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-indigo-500/50'}`}>
                  <GraduationCap className="w-5 h-5" /> {isArabic ? 'شارك خبرتك (إنشاء دورة)' : 'Share Expertise (Create Course)'}
                </Button>
             </div>
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {academyCourses.map(course => (
                    <AcademyCard 
                      key={course.id} 
                      course={course} 
                      isArabic={isArabic} 
                      onEnroll={() => handleEnrollClick(course)}
                      isOwner={course.host_id === (user?.id || "user-new")}
                      onDelete={(e) => handleDeleteCourse(e, course.id)}
                    />
                ))}
             </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ========================================================= */}
      {/* النوافذ المنبثقة للتفاصيل والتسجيل */}
      {/* ========================================================= */}
      
      <ProductDetailsModal item={selectedItem} open={detailsModalOpen} onOpenChange={setDetailsModalOpen} isArabic={isArabic} />

      <Dialog open={enrollModalOpen} onOpenChange={setEnrollModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-sm text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
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
            <Button type="submit" className={`w-full font-bold h-12 mt-4 text-white transition-all duration-300 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] rounded-none shadow-[4px_4px_0px_0px_#D97706]' : 'bg-[#1D4ED8] hover:bg-[#1E3A8A] rounded-xl shadow-lg shadow-blue-500/30'}`}>
              {isArabic ? 'تأكيد التسجيل' : 'Confirm Enrollment'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-xs text-center border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className={`w-16 h-16 rounded-full flex items-center justify-center ${isHeritage ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'}`}>
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif text-[#8D1C1C]' : (darkMode ? 'text-white' : 'text-gray-900')}`}>
              {isArabic ? 'تم التسجيل بنجاح!' : 'Enrollment Successful!'}
            </h2>
            <div className={`w-full p-4 rounded-xl mt-2 border ${darkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-sm text-muted-foreground mb-1">{isArabic ? 'رقم التسجيل الخاص بك:' : 'Your Registration Number:'}</p>
              <p className={`text-xl font-mono font-bold tracking-wider ${isHeritage ? 'text-[#D97706]' : 'text-[#3B82F6]'}`}>{registrationNumber}</p>
            </div>
            <Button onClick={() => setSuccessModalOpen(false)} className={`w-full mt-2 font-bold transition-all ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
              {isArabic ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* النوافذ المنبثقة للإضافة (تقبل الصور وتنشر فوراً) */}
      {/* ========================================================= */}

      {/* 1. نافذة بيع تحفة */}
      <Dialog open={sellModalOpen} onOpenChange={setSellModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-xl text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className={`text-3xl font-black ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'عرض تحفة للبيع' : 'List Item for Sale'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSellSubmit} className="space-y-5 px-6 pb-6 mt-4">
            <label className="w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative overflow-hidden" style={{ borderColor: themeColors.primary }}>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setSellImagePreview)} />
              {sellImagePreview ? (
                <img src={sellImagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className={`w-10 h-10 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-bold ${labelStyle}`}>{isArabic ? 'اضغط لإرفاق صورة التحفة' : 'Click to upload item image'}</span>
                </>
              )}
            </label>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'اسم التحفة' : 'Item Name'}</label>
              <Input name="title" required type="text" placeholder={isArabic ? 'مثال: دلة رسلان نحاسية' : 'e.g., Brass Dallah'} className={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm ${labelStyle}`}>{isArabic ? 'السعر (د.ك)' : 'Price (KWD)'}</label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input name="price" required type="number" placeholder="0.000" className={`pe-10 ${inputStyle}`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-sm ${labelStyle}`}>{isArabic ? 'سنة الصنع (تقريبياً)' : 'Year Made'}</label>
                <Input name="year" required type="text" placeholder="1970" className={inputStyle} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'وصف كامل للتحفة' : 'Full Description'}</label>
              <textarea name="description" required rows="3" placeholder={isArabic ? 'اكتب تفاصيل التحفة، حالتها، ومصدرها...' : 'Write details, condition, and origin...'} className={`w-full p-3 resize-none focus:outline-none ${inputStyle}`} />
            </div>
            <Button type="submit" className={`w-full font-bold h-14 mt-6 text-xl transition-all duration-300 ${modalBtnStyle}`}>
              {isArabic ? 'انشر التحفة' : 'Publish Item'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. نافذة استضافة مجلس */}
      <Dialog open={councilModalOpen} onOpenChange={setCouncilModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-xl text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className={`text-3xl font-black ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'استضافة مجلس حكايات' : 'Host a Tale Council'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCouncilSubmit} className="space-y-5 px-6 pb-6 mt-4">
            <label className="w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative overflow-hidden" style={{ borderColor: themeColors.primary }}>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setCouncilImagePreview)} />
              {councilImagePreview ? (
                <img src={councilImagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className={`w-10 h-10 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-bold ${labelStyle}`}>{isArabic ? 'إرفاق صورة لغلاف المجلس' : 'Upload Council Cover'}</span>
                </>
              )}
            </label>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'عنوان المجلس' : 'Council Title'}</label>
              <Input name="title" required type="text" placeholder={isArabic ? 'مثال: ذكريات الغوص في السبعينات' : 'e.g., Pearl Diving Memories'} className={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm ${labelStyle}`}>{isArabic ? 'تاريخ المجلس' : 'Date'}</label>
                <Input name="date" required type="date" className={inputStyle} />
              </div>
              <div className="space-y-2">
                <label className={`text-sm ${labelStyle}`}>{isArabic ? 'وقت البث' : 'Time'}</label>
                <Input name="time" required type="time" className={inputStyle} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'نبذة عن المجلس' : 'About this Council'}</label>
              <textarea required rows="2" placeholder={isArabic ? 'ماذا ستحكي للشباب اليوم؟' : 'What will you tell the youth today?'} className={`w-full p-3 resize-none focus:outline-none ${inputStyle}`} />
            </div>
            <Button type="submit" className={`w-full font-bold h-14 mt-6 text-xl transition-all duration-300 ${modalBtnStyle}`}>
              <Video className="w-6 h-6 ml-2" /> {isArabic ? 'جدولة المجلس' : 'Schedule Council'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. نافذة شارك خبرتك (إنشاء دورة) */}
      <Dialog open={shareExpertiseModalOpen} onOpenChange={setShareExpertiseModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-xl text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className={`text-3xl font-black ${isHeritage ? 'font-serif text-[#D97706]' : 'text-indigo-600'}`}>
              {isArabic ? 'إنشاء دورة لتبادل الخبرات' : 'Create an Expertise Course'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleShareExpertiseSubmit} className="space-y-5 px-6 pb-6 mt-4">
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'اسم الدورة' : 'Course Name'}</label>
              <Input name="title" required type="text" placeholder={isArabic ? 'مثال: أساسيات حياكة السدو' : 'e.g., Basics of Sadu Weaving'} className={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm ${labelStyle}`}>{isArabic ? 'مدة الدورة' : 'Duration'}</label>
                <Input name="duration" required type="text" placeholder={isArabic ? 'مثال: 4 أسابيع' : 'e.g., 4 Weeks'} className={inputStyle} />
              </div>
              <div className="space-y-2">
                <label className={`text-sm ${labelStyle}`}>{isArabic ? 'رقم الهاتف للتنسيق' : 'Phone Number'}</label>
                <Input required type="tel" placeholder="+965 00000000" className={inputStyle} dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'إرفاق شهادات خبرة (إن وجدت)' : 'Attach Experience Certificates'}</label>
              <label className="w-full h-16 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors relative overflow-hidden" style={{ borderColor: themeColors.primary }}>
                <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleCourseFileUpload} />
                <FileText className={`w-6 h-6 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-bold ${labelStyle}`}>
                  {courseFileName ? courseFileName : (isArabic ? 'اختر ملف PDF أو صور' : 'Select PDF or Images')}
                </span>
              </label>
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'وصف مبسط لما سيتعلمه الشباب' : 'Brief Description'}</label>
              <textarea required rows="2" className={`w-full p-3 resize-none focus:outline-none ${inputStyle}`} />
            </div>
            <Button type="submit" className={`w-full font-bold h-14 mt-6 text-xl transition-all duration-300 ${isHeritage ? 'bg-[#D97706] hover:bg-[#B45309] text-white rounded-none shadow-[4px_4px_0px_0px_#8D1C1C]' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg'}`}>
              <GraduationCap className="w-6 h-6 ml-2" /> {isArabic ? 'انشر الدورة' : 'Publish Course'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default SeniorsPage;