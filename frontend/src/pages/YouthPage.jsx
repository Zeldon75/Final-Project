import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  GraduationCap, Palette, Video, Award, ArrowRight, Briefcase, Sparkles,
  Users, Clock, BookOpen, Play, Star, CheckCircle, Lock, ChevronRight,
  Zap, Target, TrendingUp, Heart, Share2, MessageSquare, UploadCloud, Plus, FileText, Trash2, ArrowLeft, Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// ==========================================
// 1. المكونات الفرعية لصفحة الشباب
// ==========================================

const CourseCard = ({ course, isArabic, isHeritage, themeColors, onSelect, isOwner, onDelete }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} onClick={() => onSelect(course)} className="cursor-pointer relative h-full">
      {isOwner && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(course.id); }} className="absolute top-3 left-3 z-20 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
          <Trash2 className="w-5 h-5" />
        </button>
      )}
      <SaduCard className="overflow-hidden p-0 h-full flex flex-col transition-all hover:shadow-xl">
        <div className="aspect-video relative">
          <img src={course.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          {course.certified && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <Award className="w-4 h-4" /> {isArabic ? 'معتمد' : 'Certified'}
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className={`text-white font-bold text-xl leading-tight mb-1 ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? course.title_ar : course.title}
            </h3>
            <p className="text-white/90 text-sm font-medium">{isArabic ? course.instructor_ar : course.instructor}</p>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-bold">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{isArabic ? course.duration_ar : course.duration}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.lessons} {isArabic ? 'درس' : 'lessons'}</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
              <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-current" />
              <span className="font-bold text-yellow-700 dark:text-yellow-400 text-sm">{course.rating || "New"}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="font-black text-xl" style={{ color: themeColors.primary }}>{course.price}</span>
            <Button size="sm" className={`font-bold h-10 px-6 text-white ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] rounded-none' : 'bg-blue-600 hover:bg-blue-700 rounded-xl'}`}>
              {isArabic ? 'التفاصيل' : 'Details'}
            </Button>
          </div>
        </div>
      </SaduCard>
    </motion.div>
  );
};

const DesignCard = ({ project, isArabic, isOwner, onDelete }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className="relative h-full">
      {isOwner && (
        <button onClick={onDelete} className="absolute top-3 left-3 z-20 w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      <SaduCard className="overflow-hidden p-0 h-full flex flex-col border-2 transition-all hover:shadow-lg">
        <div className="aspect-square relative">
          <img src={project.image || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600"} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-slate-800">
          <div>
            <h4 className="font-bold mb-1 text-lg leading-tight">{isArabic ? project.title_ar : project.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">{isArabic ? project.author_ar : project.author}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-3">
            <span className="flex items-center gap-1.5 hover:text-red-500 cursor-pointer transition-colors"><Heart className="w-5 h-5" /><span className="font-bold">{project.likes}</span></span>
            <span className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition-colors"><MessageSquare className="w-5 h-5" /><span className="font-bold">{project.comments}</span></span>
          </div>
        </div>
      </SaduCard>
    </motion.div>
  );
};

// ==========================================
// 2. واجهة مجتمع المبدعين (Darwaza X - تويتر دروازة)
// ==========================================
const DarwazaXCommunity = ({ isArabic, isHeritage, darkMode, onClose }) => {
  const { user } = useAuth();
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  
  const [posts, setPosts] = useState([
    { id: 1, author: "سالم المري", handle: "@SalemAlMarri", avatar: "https://i.pravatar.cc/150?u=salem", time: "2h", content: "توني خلصت دورة #الخط_العربي في دروازة! صراحة الأستاذ خالد ما قصر، وهذا تطبيقي لليوم. فخور جداً بالتراث! ✍️📜", image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600", likes: 145, comments: 23 },
    { id: 2, author: "Aisha Al-Sabah", handle: "@AishaDesign", avatar: "https://i.pravatar.cc/150?u=aisha", time: "5h", content: "Just uploaded my new Sadu-inspired jacket to the Design Lab! Let me know what you guys think. #KuwaitHeritage #Fashion 🧥✨", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600", likes: 320, comments: 56 },
    { id: 3, author: "عبدالله العنزي", handle: "@AbuFahad", avatar: "https://i.pravatar.cc/150?u=abdullah", time: "1d", content: "قسم المتقاعدين فكرة جبارة! اليوم حضرت (مجلس حكايات) عن الغوص في السبعينات، سوالف الكبار كلها حكم ودروس. شكراً دروازة 🙏🇰🇼", likes: 890, comments: 112 },
    { id: 4, author: "Mona Khalid", handle: "@MonaK_Mom", avatar: "https://i.pravatar.cc/150?u=mona", time: "2d", content: "بنتي اليوم جربت ركن الأطفال في دروازة ولعبت مع الجدة لولوة الافتراضية. ما تتخيلون شكثر مستانسة وعرفت معلومات عن الكويت القديمة! 👧💖", likes: 432, comments: 45 }
  ]);

  const handlePostSubmit = () => {
    if (!newPostText.trim() && !newPostImage) return;
    const post = {
      id: Date.now(),
      author: user?.name || (isArabic ? "مستخدم دروازة" : "Darwaza User"),
      handle: `@${user?.name?.replace(/\s/g, '') || "user"}${Math.floor(Math.random()*1000)}`,
      avatar: "https://i.pravatar.cc/150?u=newuser",
      time: isArabic ? "الآن" : "Just now",
      content: newPostText,
      image: newPostImage,
      likes: 0,
      comments: 0
    };
    setPosts([post, ...posts]);
    setNewPostText("");
    setNewPostImage(null);
    toast.success(isArabic ? 'تم النشر بنجاح!' : 'Posted successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setNewPostImage(URL.createObjectURL(file));
  };

  const bgStyle = darkMode ? 'bg-[#000000]' : 'bg-[#F7F9F9]';
  const borderStyle = darkMode ? 'border-gray-800' : 'border-gray-200';
  const cardStyle = darkMode ? 'bg-[#000000] hover:bg-[#080808]' : 'bg-white hover:bg-gray-50';
  const textStyle = darkMode ? 'text-white' : 'text-gray-900';
  const primaryColor = isHeritage ? '#8D1C1C' : '#1D9BF0'; // Twitter Blue or Sadu Red

  return (
    <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className={`fixed inset-0 z-[100] flex justify-center overflow-y-auto ${bgStyle} font-sans`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`fixed top-0 w-full max-w-2xl flex items-center justify-between p-4 backdrop-blur-md bg-opacity-80 z-10 border-b ${borderStyle} ${bgStyle}`}>
        <Button variant="ghost" onClick={onClose} className="rounded-full w-10 h-10 p-0"><ArrowLeft className={`w-5 h-5 ${textStyle} ${!isArabic ? 'rotate-180' : ''}`} /></Button>
        <h2 className={`text-xl font-bold ${textStyle}`}>{isArabic ? 'مجتمع المبدعين' : 'Darwaza X'}</h2>
        <Sparkles className="w-6 h-6" style={{ color: primaryColor }} />
      </div>

      <div className={`w-full max-w-2xl mt-16 border-x min-h-screen ${borderStyle}`}>
        {/* Create Post Area */}
        <div className={`p-4 border-b ${borderStyle} flex gap-4 ${cardStyle}`}>
          <img src="https://i.pravatar.cc/150?u=newuser" alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-1">
            <textarea 
              value={newPostText} onChange={(e) => setNewPostText(e.target.value)}
              placeholder={isArabic ? "ماذا يحدث في دروازة؟" : "What is happening in Darwaza?"}
              className={`w-full bg-transparent resize-none outline-none text-xl mb-2 ${textStyle}`} rows="3"
            />
            {newPostImage && (
              <div className="relative mb-3">
                <img src={newPostImage} alt="Upload" className="w-full rounded-2xl border border-gray-700" />
                <button onClick={() => setNewPostImage(null)} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"><X className="w-5 h-5" /></button>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
              <label className="cursor-pointer p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <ImageIcon className="w-5 h-5" style={{ color: primaryColor }} />
              </label>
              <Button onClick={handlePostSubmit} className={`rounded-full px-6 font-bold text-white`} style={{ backgroundColor: primaryColor }}>
                {isArabic ? 'انشر' : 'Post'}
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline (Posts) */}
        <div>
          {posts.map(post => (
            <div key={post.id} className={`p-4 border-b ${borderStyle} flex gap-4 transition-colors ${cardStyle}`}>
              <img src={post.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold ${textStyle}`}>{post.author}</span>
                  <span className="text-gray-500 text-sm">{post.handle} · {post.time}</span>
                </div>
                <p className={`text-[15px] mb-3 leading-normal ${textStyle}`}>{post.content}</p>
                {post.image && <img src={post.image} alt="Post" className="w-full rounded-2xl border border-gray-700 mb-3" />}
                <div className="flex items-center justify-between text-gray-500 max-w-md pe-10">
                  <span className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors"><MessageSquare className="w-5 h-5" /> {post.comments}</span>
                  <span className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors"><Share2 className="w-5 h-5" /> 12</span>
                  <span className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors"><Heart className="w-5 h-5" /> {post.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 3. المكون الرئيسي (YouthPage)
// ==========================================
const YouthPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const isArabic = language === 'ar';
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // حالات المجتمع والوظائف
  const [showXCommunity, setShowXCommunity] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // حالات النوافذ الجديدة (إنشاء دورة وتصميم)
  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
  const [createDesignModalOpen, setCreateDesignModalOpen] = useState(false);
  const [courseFileName, setCourseFileName] = useState("");
  const [designImagePreview, setDesignImagePreview] = useState(null);

  // الداتا مع ربط الهوية للحذف
  const [courses, setCourses] = useState([
    { id: 'c-1', title: 'Sadu Weaving Fundamentals', title_ar: 'أساسيات نسيج السدو', instructor: 'Fatima Al-Sabah', instructor_ar: 'فاطمة الصباح', duration: '8 weeks', duration_ar: '8 أسابيع', lessons: 24, rating: 4.9, price: '45 KWD', certified: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', host_id: 'system', description: 'Learn the ancient art of Sadu weaving from master craftswomen.', description_ar: 'تعلم فن نسيج السدو القديم من الحرفيات المتمرسات.' },
    { id: 'c-2', title: 'Traditional Dhow Building', title_ar: 'بناء المراكب الشراعية', instructor: 'Mohammed Al-Rashid', instructor_ar: 'محمد الرشيد', duration: '12 weeks', duration_ar: '12 أسبوع', lessons: 36, rating: 4.8, price: '120 KWD', certified: true, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', host_id: 'system', description: 'Master the craft of building traditional Kuwaiti dhows.', description_ar: 'أتقن حرفة بناء المراكب الشراعية الكويتية التقليدية.' }
  ]);

  const [designProjects, setDesignProjects] = useState([
    { id: 'p-1', title: 'Modern Sadu Jacket', title_ar: 'جاكيت سدو عصري', author: 'Sara Al-Hajri', author_ar: 'سارة الهاجري', likes: 234, comments: 45, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', host_id: 'system' },
    { id: 'p-2', title: 'Heritage Phone Case', title_ar: 'غطاء هاتف تراثي', author: 'Noor Al-Salem', author_ar: 'نور السالم', likes: 189, comments: 32, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', host_id: 'system' }
  ]);

  const careers = [
    { id: 'j-1', title: 'Heritage Tour Guide', title_ar: 'مرشد سياحي تراثي', company: 'Kuwait Tourism Authority', company_ar: 'هيئة السياحة الكويتية', location: 'Kuwait City', location_ar: 'مدينة الكويت', type: 'Full-time', type_ar: 'دوام كامل', salary: '800-1200 KWD', posted: '2 days ago', posted_ar: 'منذ يومين' }
  ];

  const stats = [
    { label: isArabic ? 'أعضاء نشطين' : 'Active Members', value: '2,450+', icon: Users },
    { label: isArabic ? 'دورات مكتملة' : 'Courses Completed', value: '5,670+', icon: GraduationCap },
    { label: isArabic ? 'تصاميم منشورة' : 'Designs Shared', value: '1,200+', icon: Palette },
    { label: isArabic ? 'توظيفات' : 'Job Placements', value: '340+', icon: Briefcase }
  ];

  // --- دوال الحذف والرفع والنشر ---
  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
    toast.success(isArabic ? 'تم حذف الدورة بنجاح' : 'Course deleted successfully');
  };

  const handleDeleteDesign = (id) => {
    setDesignProjects(designProjects.filter(p => p.id !== id));
    toast.success(isArabic ? 'تم حذف التصميم بنجاح' : 'Design deleted successfully');
  };

  const handleFileUpload = (e, setFileName) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleImageUpload = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // توجيه لصفحة الدفع لإنشاء دورة (20 د.ك)
  const handleCreateCourseSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error(isArabic ? 'يرجى تسجيل الدخول' : 'Please login first'); return; }
    
    // حفظ بيانات الدورة مؤقتاً (محاكاة)
    const formData = new FormData(e.target);
    const newCourse = {
      id: `c-${Date.now()}`,
      title: formData.get('title'),
      title_ar: formData.get('title'),
      instructor: user?.name || "Expert",
      instructor_ar: user?.name || "الخبير",
      duration: formData.get('duration'),
      duration_ar: formData.get('duration'),
      lessons: 10,
      rating: "New",
      price: formData.get('price') + ' KWD',
      certified: true,
      image: "https://images.unsplash.com/photo-1571986204936-76077adb51f9?w=600",
      host_id: user?.id || "user-new",
      description: formData.get('description'),
      description_ar: formData.get('description')
    };
    
    setCreateCourseModalOpen(false);
    toast.info(isArabic ? 'جاري تحويلك لصفحة الدفع (رسوم الإنشاء 20 د.ك)' : 'Redirecting to payment (20 KWD Creation Fee)');
    
    // بعد الدفع الوهمي، تضاف الدورة
    setTimeout(() => {
      setCourses([newCourse, ...courses]);
      toast.success(isArabic ? 'تم دفع الرسوم وإنشاء الدورة بنجاح!' : 'Fee paid and course created successfully!');
    }, 2000);
  };

  // توجيه لصفحة الدفع لإنشاء تصميم (20 د.ك)
  const handleCreateDesignSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error(isArabic ? 'يرجى تسجيل الدخول' : 'Please login first'); return; }
    
    const formData = new FormData(e.target);
    const newDesign = {
      id: `p-${Date.now()}`,
      title: formData.get('title'),
      title_ar: formData.get('title'),
      author: user?.name || "Designer",
      author_ar: user?.name || "المصمم",
      likes: 0,
      comments: 0,
      image: designImagePreview || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      host_id: user?.id || "user-new"
    };

    setCreateDesignModalOpen(false);
    setDesignImagePreview(null);
    toast.info(isArabic ? 'جاري تحويلك لصفحة الدفع (رسوم الإضافة 20 د.ك)' : 'Redirecting to payment (20 KWD Addition Fee)');
    
    setTimeout(() => {
      setDesignProjects([newDesign, ...designProjects]);
      toast.success(isArabic ? 'تم دفع الرسوم وإضافة تصميمك بنجاح!' : 'Fee paid and design added successfully!');
    }, 2000);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplyModalOpen(false);
    setTimeout(() => setSuccessModalOpen(true), 300);
  };

  // التنسيقات
  const tabsListBg = darkMode ? (isHeritage ? 'bg-[#2A2A2A]' : 'bg-[#1E293B]') : (isHeritage ? 'bg-[#E8DCCA]' : 'bg-gray-200/60');
  const tabTriggerStyle = `gap-2 rounded-xl transition-all duration-300 mx-1 py-2 font-bold data-[state=active]:text-white shadow-sm ` + 
    (isHeritage ? "data-[state=active]:bg-[#8D1C1C]" : (darkMode ? "data-[state=active]:bg-[#3B82F6] data-[state=active]:shadow-[0_0_15px_rgba(59,130,246,0.6)]" : "data-[state=active]:bg-[#1D4ED8]"));

  const modalBg = darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-white');
  const inputStyle = darkMode ? (isHeritage ? 'bg-[#2A2A2A] border-gray-600 text-white focus:border-[#D97706]' : 'bg-[#1E293B] border-blue-900/50 text-white focus:border-blue-500 rounded-xl') : (isHeritage ? 'bg-white border-[#8D1C1C]/30 text-[#8D1C1C] focus:border-[#8D1C1C]' : 'bg-gray-50 border-blue-200 text-gray-900 focus:border-blue-500 rounded-xl');
  const labelStyle = darkMode ? 'text-gray-300' : (isHeritage ? 'text-[#8D1C1C] font-bold' : 'text-gray-700 font-semibold');

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      
      {/* فتح مجتمع دروازة (Darwaza X) كشاشة كاملة عند الطلب */}
      <AnimatePresence>
        {showXCommunity && <DarwazaXCommunity isArabic={isArabic} isHeritage={isHeritage} darkMode={darkMode} onClose={() => setShowXCommunity(false)} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-md ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'}`}>
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {isArabic ? 'تمكين الشباب' : 'Youth Empowerment'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic ? 'حوّل شغفك بالتراث إلى مهنة. تعلم، صمم، وابدأ مسيرتك المهنية.' : 'Transform your passion for heritage into a career. Learn, design, and start.'}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <SaduCard className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: themeColors.primary }} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </SaduCard>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`w-full grid grid-cols-3 mb-10 p-1.5 rounded-2xl shadow-sm border border-black/5 ${tabsListBg}`}>
            <TabsTrigger value="courses" className={tabTriggerStyle}><GraduationCap className="w-5 h-5" />{isArabic ? 'الدورات' : 'Courses'}</TabsTrigger>
            <TabsTrigger value="design" className={tabTriggerStyle}><Palette className="w-5 h-5" />{isArabic ? 'مختبر التصميم' : 'Design Lab'}</TabsTrigger>
            <TabsTrigger value="careers" className={tabTriggerStyle}><Briefcase className="w-5 h-5" />{isArabic ? 'الوظائف' : 'Careers'}</TabsTrigger>
          </TabsList>

          {/* 1. الدورات */}
          <TabsContent value="courses">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>{isArabic ? 'الدورات التدريبية' : 'Training Courses'}</h2>
              <Button onClick={() => setCreateCourseModalOpen(true)} className={`gap-2 text-white font-bold h-10 px-6 ${isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-gradient-to-r from-blue-600 to-purple-600 rounded-full'}`}>
                <Plus className="w-5 h-5" /> {isArabic ? 'إنشاء دورة (20 د.ك)' : 'Create Course (20 KWD)'}
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} isArabic={isArabic} isHeritage={isHeritage} themeColors={themeColors} onSelect={setSelectedCourse} isOwner={course.host_id === (user?.id || "user-new")} onDelete={handleDeleteCourse} />
              ))}
            </div>
          </TabsContent>

          {/* 2. مختبر التصميم */}
          <TabsContent value="design">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>{isArabic ? 'معرض أعمال المجتمع' : 'Community Gallery'}</h3>
              <Button onClick={() => setCreateDesignModalOpen(true)} variant="outline" className={`font-bold h-10 px-6 ${isHeritage ? 'text-[#8D1C1C] border-[#8D1C1C] rounded-none' : 'text-blue-600 border-blue-600 rounded-full'}`}>
                <Plus className="w-4 h-4 me-2" /> {isArabic ? 'إضافة تصميم (20 د.ك)' : 'Add Design (20 KWD)'}
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {designProjects.map(project => (
                <DesignCard key={project.id} project={project} isArabic={isArabic} isOwner={project.host_id === (user?.id || "user-new")} onDelete={() => handleDeleteDesign(project.id)} />
              ))}
            </div>
          </TabsContent>

          {/* 3. الوظائف */}
          <TabsContent value="careers">
            <div className="space-y-4">
              {careers.map(job => (
                <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <SaduCard className="hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden bg-blue-100">
                            <Briefcase className="w-7 h-7 text-blue-600 relative z-10" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-1">{isArabic ? job.title_ar : job.title}</h3>
                            <p className="text-muted-foreground font-medium">{isArabic ? job.company_ar : job.company}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-gray-100 text-gray-700">{isArabic ? job.location_ar : job.location}</span>
                              <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-gray-100 text-gray-700">{isArabic ? job.type_ar : job.type}</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-md font-bold">{job.salary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 justify-center">
                        <span className="text-xs font-semibold text-muted-foreground bg-black/5 px-2 py-1 rounded-md">{isArabic ? job.posted_ar : job.posted}</span>
                        <Button onClick={() => handleApplyClick(job)} className="font-bold px-6 h-11 text-white bg-[#1D4ED8] hover:bg-[#1E3A8A] rounded-xl shadow-md">
                          {isArabic ? 'تقدم الآن' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                  </SaduCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* مجتمع المبدعين (CTA لفتح شاشة منصة X) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`mt-16 p-8 rounded-3xl shadow-sm border border-black/5 ${isHeritage ? 'bg-[#8D1C1C]/5' : 'bg-[#1D4ED8]/5'}`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-start">
              <Users className="w-12 h-12 mb-4 mx-auto md:mx-0" style={{ color: themeColors.primary }} />
              <h3 className={`text-3xl font-bold mb-4 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>{isArabic ? 'انضم لمجتمع المبدعين (Darwaza X)' : 'Join Darwaza X Community'}</h3>
              <p className="text-muted-foreground font-medium mb-6 text-lg max-w-xl mx-auto md:mx-0">
                {isArabic ? 'منصة اجتماعية كاملة! تواصل، غرد، وشارك شغفك بالتراث مع الآلاف من شباب دروازة.' : 'A full social platform! Connect, post, and share your heritage passion with thousands.'}
              </p>
              <Button onClick={() => setShowXCommunity(true)} size="lg" className={`h-14 px-8 font-bold text-lg text-white ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] rounded-xl shadow-[4px_4px_0px_0px_#D97706]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70] rounded-2xl shadow-lg'}`}>
                {isArabic ? 'افتح مجتمع المبدعين' : 'Open Creators Community'}
                <ChevronRight className={`w-5 h-5 ms-2 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* النوافذ المنبثقة للإنشاء والدفع */}
      {/* ========================================================= */}

      {/* نافذة إنشاء دورة (دفع 20 د.ك) */}
      <Dialog open={createCourseModalOpen} onOpenChange={setCreateCourseModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-xl text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className={`text-3xl font-black ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'إنشاء دورة تدريبية' : 'Create a Training Course'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCourseSubmit} className="space-y-4 px-6 pb-6 mt-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-xl border border-yellow-300 flex items-center justify-between mb-4">
               <div>
                 <p className="font-bold text-yellow-800 dark:text-yellow-500">{isArabic ? 'رسوم إنشاء الدورة' : 'Course Creation Fee'}</p>
                 <p className="text-sm text-yellow-700 dark:text-yellow-600">{isArabic ? 'تدفع لمرة واحدة للمراجعة والاستضافة' : 'One-time fee for review and hosting'}</p>
               </div>
               <span className="text-2xl font-black text-yellow-800 dark:text-yellow-500">20 د.ك</span>
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'اسم الدورة' : 'Course Name'}</label>
              <Input name="title" required type="text" placeholder={isArabic ? 'مثال: تصميم الأزياء التراثية' : 'e.g., Heritage Fashion Design'} className={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm ${labelStyle}`}>{isArabic ? 'مدة الدورة' : 'Duration'}</label>
                <Input name="duration" required type="text" placeholder={isArabic ? 'مثال: 4 أسابيع' : 'e.g., 4 Weeks'} className={inputStyle} />
              </div>
              <div className="space-y-2">
                <label className={`text-sm ${labelStyle}`}>{isArabic ? 'سعر اشتراك الدورة للمتدرب' : 'Course Price'}</label>
                <Input name="price" required type="number" placeholder="45" className={inputStyle} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'رقم الهاتف للتنسيق' : 'Phone Number'}</label>
              <Input required type="tel" placeholder="+965 00000000" className={inputStyle} dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'شهادة الخبرة (PDF/صورة)' : 'Experience Certificate'}</label>
              <label className="w-full h-16 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors relative overflow-hidden" style={{ borderColor: themeColors.primary }}>
                <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileUpload(e, setCourseFileName)} required />
                <FileText className={`w-6 h-6 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-bold ${labelStyle}`}>{courseFileName ? courseFileName : (isArabic ? 'اختر الملف' : 'Select File')}</span>
              </label>
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'وصف الدورة' : 'Description'}</label>
              <textarea name="description" required rows="2" className={`w-full p-3 resize-none focus:outline-none ${inputStyle}`} />
            </div>
            <Button type="submit" className={`w-full font-bold h-14 mt-4 text-xl text-white ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] rounded-none' : 'bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl'}`}>
              <Lock className="w-5 h-5 ml-2" /> {isArabic ? 'انتقل للدفع (20 د.ك)' : 'Proceed to Pay (20 KWD)'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة إضافة تصميم (دفع 20 د.ك) */}
      <Dialog open={createDesignModalOpen} onOpenChange={setCreateDesignModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-xl text-right border-0 overflow-hidden ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className={`text-3xl font-black ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'إضافة تصميم للمختبر' : 'Add Design to Lab'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateDesignSubmit} className="space-y-4 px-6 pb-6 mt-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-xl border border-yellow-300 flex items-center justify-between mb-4">
               <div>
                 <p className="font-bold text-yellow-800 dark:text-yellow-500">{isArabic ? 'رسوم عرض التصميم' : 'Design Display Fee'}</p>
               </div>
               <span className="text-2xl font-black text-yellow-800 dark:text-yellow-500">20 د.ك</span>
            </div>
            
            <label className="w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors relative overflow-hidden" style={{ borderColor: themeColors.primary }}>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setDesignImagePreview)} required />
              {designImagePreview ? (
                <img src={designImagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <><UploadCloud className="w-8 h-8 mb-2 text-gray-400" /><span className={`text-sm font-bold ${labelStyle}`}>{isArabic ? 'إرفاق صورة التصميم' : 'Upload Design Image'}</span></>
              )}
            </label>

            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'اسم التصميم' : 'Design Name'}</label>
              <Input name="title" required type="text" placeholder={isArabic ? 'مثال: حذاء رياضي بنقش كويتي' : 'e.g., Kuwaiti Pattern Sneakers'} className={inputStyle} />
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'رقم الهاتف للتواصل' : 'Phone Number'}</label>
              <Input required type="tel" placeholder="+965 00000000" className={inputStyle} dir="ltr" />
            </div>
            
            <Button type="submit" className={`w-full font-bold h-14 mt-4 text-xl text-white ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] rounded-none' : 'bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl'}`}>
              <Lock className="w-5 h-5 ml-2" /> {isArabic ? 'انتقل للدفع (20 د.ك)' : 'Proceed to Pay (20 KWD)'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* نوافذ التقديم للوظائف */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-md text-right border-0 ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className={`text-2xl font-bold ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>{isArabic ? 'تقديم طلب توظيف' : 'Submit Application'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplySubmit} className="space-y-4 px-6 pb-6 mt-4">
            <div className="space-y-2"><label className={labelStyle}>{isArabic ? 'الاسم' : 'Name'}</label><Input required className={inputStyle} /></div>
            <div className="space-y-2"><label className={labelStyle}>{isArabic ? 'الهاتف' : 'Phone'}</label><Input required type="tel" className={inputStyle} /></div>
            <div className="space-y-2 pt-2">
              <label className={`text-sm ${labelStyle}`}>{isArabic ? 'السيرة الذاتية (CV)' : 'Upload CV'}</label>
              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer ${darkMode ? 'border-gray-600 bg-black/20' : 'border-gray-300 bg-gray-50/50'}`}>
                <UploadCloud className="w-6 h-6 text-blue-500 mb-2" />
                <p className="text-sm font-medium">{isArabic ? 'رفع الملف (PDF)' : 'Upload (PDF)'}</p>
                <input type="file" className="hidden" accept=".pdf" required />
              </label>
            </div>
            <Button type="submit" className={`w-full font-bold h-12 mt-6 text-white ${isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-blue-600 rounded-xl'}`}>{isArabic ? 'إرسال' : 'Submit'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent aria-describedby={undefined} className={`max-w-xs text-center border-0 ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold">{isArabic ? 'تم تقديم الطلب بنجاح' : 'Application Submitted!'}</h2>
            <Button onClick={() => setSuccessModalOpen(false)} className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold">{isArabic ? 'إغلاق' : 'Close'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل الدورة (عرض فقط) */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent aria-describedby={undefined} className={`max-w-xl text-right border-0 ${modalBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
          {selectedCourse && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{isArabic ? selectedCourse.title_ar : selectedCourse.title}</h2>
              <img src={selectedCourse.image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{isArabic ? selectedCourse.description_ar : selectedCourse.description}</p>
              <Button className={`w-full font-bold h-12 text-white ${isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-blue-600 rounded-xl'}`}>{isArabic ? 'اشترك الآن' : 'Enroll Now'}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default YouthPage;