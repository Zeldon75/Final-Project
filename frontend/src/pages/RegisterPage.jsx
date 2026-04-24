import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { 
  User, Mail, Phone, Lock, UserCircle, 
  Baby, Zap, Crown, Loader2, ArrowRight, ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { register } = useAuth(); // ✅ تم استدعاء دالة التسجيل الحقيقية من النظام
  const navigate = useNavigate();
  const isArabic = language === 'ar';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    gender: 'male',
    category: 'youth' // الافتراضي شباب
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ تسجيل المستخدم فعلياً في النظام وإرسال بياناته
      if (register) {
        await register({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`,
          username: formData.username,
          phone: formData.phone,
          gender: formData.gender,
          category: formData.category
        });
      }

      setSuccess(true);
      toast.success(isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
      
      // ✅ تحويل المستخدم لصفحة الحساب الشخصي مباشرة لأنه تم تسجيل دخوله
      setTimeout(() => {
        navigate('/profile');
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(isArabic ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred during registration');
      setLoading(false);
    }
  };

  // ==========================================
  // الأنماط الديناميكية للواجهات (عصري / تراثي)
  // ==========================================
  const pageBg = darkMode 
    ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') 
    : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]');

  const cardStyle = isHeritage
    ? (darkMode ? 'bg-[#2C1E12] border-[#8D1C1C]' : 'bg-[#FDF5E6] border-[#8D1C1C]')
    : (darkMode ? 'bg-[#1E293B]/80 backdrop-blur-2xl border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.15)]' : 'bg-white/90 backdrop-blur-2xl border-blue-200 shadow-2xl');

  const inputStyle = darkMode 
    ? (isHeritage ? 'bg-[#1A1A1A] border-[#8D1C1C]/50 text-white focus:border-[#D97706]' : 'bg-[#0F172A] border-slate-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500')
    : (isHeritage ? 'bg-white border-[#8D1C1C]/30 text-[#8D1C1C] focus:border-[#8D1C1C]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500');

  const labelStyle = darkMode ? 'text-gray-300' : (isHeritage ? 'text-[#8D1C1C] font-bold' : 'text-slate-700 font-bold');
  const accentText = isHeritage ? 'text-[#8D1C1C]' : 'text-blue-600 dark:text-blue-400';
  const btnStyle = isHeritage 
    ? 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white rounded-none shadow-[4px_4px_0px_0px_#D97706]' 
    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg';

  // كروت الفئات العمرية
  const categories = [
    { id: 'child', icon: Baby, label_ar: 'أطفال', label_en: 'Child', desc_ar: '7-14 سنة', desc_en: '7-14 yrs' },
    { id: 'youth', icon: Zap, label_ar: 'شباب', label_en: 'Youth', desc_ar: '15-40 سنة', desc_en: '15-40 yrs' },
    { id: 'senior', icon: Crown, label_ar: 'متقاعدين', label_en: 'Senior', desc_ar: '+40 سنة', desc_en: '40+ yrs' }
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-500 ${pageBg}`}>
      
      {/* خلفية زخرفية للعصري */}
      {!isHeritage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        </div>
      )}

      <div className="w-full max-w-3xl relative z-10">
        
        <Link to="/login" className={`inline-flex items-center gap-2 font-bold mb-6 hover:opacity-80 transition-opacity ${accentText}`}>
          {isArabic ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {isArabic ? 'العودة لتسجيل الدخول' : 'Back to Login'}
        </Link>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className={`p-8 md:p-10 border-2 ${isHeritage ? 'rounded-none' : 'rounded-[2.5rem]'} ${cardStyle}`} style={isHeritage ? { backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' } : {}}>
                
                <div className="text-center mb-10">
                  <div className={`w-20 h-20 mx-auto flex items-center justify-center mb-4 ${isHeritage ? 'bg-[#8D1C1C] rounded-none rotate-3' : 'bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg'}`}>
                    <span className="text-4xl font-bold text-white">د</span>
                  </div>
                  <h1 className={`text-3xl md:text-4xl font-black mb-2 ${accentText} ${isHeritage ? 'font-serif' : ''}`}>
                    {isArabic ? 'إنشاء حساب جديد' : 'Create New Account'}
                  </h1>
                  <p className="text-muted-foreground font-medium">
                    {isArabic ? 'انضم إلى بوابة دروازة التراثية وابدأ رحلتك.' : 'Join Darwaza Heritage Portal and start your journey.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* البيانات الشخصية */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className={labelStyle}>{isArabic ? 'الاسم الأول' : 'First Name'}</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder={isArabic ? 'أحمد' : 'Ahmed'} className={`h-14 ps-12 ${inputStyle} ${isHeritage ? 'rounded-none' : 'rounded-xl'}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className={labelStyle}>{isArabic ? 'اسم العائلة' : 'Last Name'}</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder={isArabic ? 'الكويتي' : 'Al-Kuwaiti'} className={`h-14 ps-12 ${inputStyle} ${isHeritage ? 'rounded-none' : 'rounded-xl'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className={labelStyle}>{isArabic ? 'اسم المستخدم' : 'Username'}</Label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input required name="username" value={formData.username} onChange={handleChange} placeholder="ahmed_kuw" dir="ltr" className={`h-14 ps-12 ${inputStyle} ${isHeritage ? 'rounded-none' : 'rounded-xl'}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className={labelStyle}>{isArabic ? 'رقم الهاتف' : 'Phone Number'}</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input required name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+965 00000000" dir="ltr" className={`h-14 ps-12 ${inputStyle} ${isHeritage ? 'rounded-none' : 'rounded-xl'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className={labelStyle}>{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="user@example.com" dir="ltr" className={`h-14 ps-12 ${inputStyle} ${isHeritage ? 'rounded-none' : 'rounded-xl'}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className={labelStyle}>{isArabic ? 'كلمة المرور' : 'Password'}</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input required name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" dir="ltr" className={`h-14 ps-12 ${inputStyle} ${isHeritage ? 'rounded-none' : 'rounded-xl'}`} />
                      </div>
                    </div>
                  </div>

                  {/* الجنس */}
                  <div className="space-y-3 pt-2">
                    <Label className={labelStyle}>{isArabic ? 'الجنس' : 'Gender'}</Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(val) => setFormData({ ...formData, gender: val })}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer font-bold">{isArabic ? 'ذكر' : 'Male'}</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer font-bold">{isArabic ? 'أنثى' : 'Female'}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <SaduDivider className="my-6 opacity-30" />

                  {/* الفئة العمرية (تصنيف المستخدم) */}
                  <div className="space-y-4">
                    <Label className={`text-lg block text-center mb-4 ${labelStyle}`}>
                      {isArabic ? 'اختر فئتك العمرية لتخصيص تجربتك' : 'Select your age category to personalize your experience'}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {categories.map((cat) => {
                        const isSelected = formData.category === cat.id;
                        return (
                          <div 
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`cursor-pointer border-2 transition-all p-4 flex flex-col items-center justify-center gap-2 text-center h-32 ${isHeritage ? 'rounded-none' : 'rounded-2xl'} ${
                              isSelected 
                                ? (isHeritage ? 'border-[#8D1C1C] bg-[#8D1C1C]/10' : 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]')
                                : (darkMode ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' : 'border-gray-200 bg-gray-50 hover:bg-gray-100')
                            }`}
                          >
                            <cat.icon className={`w-8 h-8 ${isSelected ? accentText : 'text-gray-400'}`} />
                            <div>
                              <h4 className={`font-bold ${isSelected ? accentText : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>
                                {isArabic ? cat.label_ar : cat.label_en}
                              </h4>
                              <p className="text-xs text-muted-foreground">{isArabic ? cat.desc_ar : cat.desc_en}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* زر الإرسال */}
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className={`w-full h-14 text-xl font-bold flex items-center justify-center ${btnStyle}`}
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isArabic ? 'إنشاء حساب' : 'Create Account')}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
                      {isArabic ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                      <Link to="/login" className={`font-bold mx-2 hover:underline ${accentText}`}>
                        {isArabic ? 'سجل دخولك هنا' : 'Login here'}
                      </Link>
                    </p>
                  </div>

                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20">
              <div className="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
              <h2 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? 'أهلاً بك في دروازة!' : 'Welcome to Darwaza!'}
              </h2>
              <p className="text-xl text-gray-500 mb-8">
                {isArabic ? 'تم إنشاء حسابك بنجاح. جاري تحويلك...' : 'Your account is active. Redirecting...'}
              </p>
              <Loader2 className={`w-8 h-8 animate-spin mx-auto ${accentText}`} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default RegisterPage;