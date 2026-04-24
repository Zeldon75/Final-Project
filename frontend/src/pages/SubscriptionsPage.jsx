import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { SaduDivider } from '../components/SaduPattern';
import { Switch } from '../components/ui/switch';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Check, Star, Crown, Gift, Users, Shield, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

// ==========================================
// قاعدة بيانات الاشتراكات المدمجة (تعمل بدون سيرفر)
// ==========================================
const subscriptionPlans = [
  {
    plan_id: 'free',
    name_ar: 'الأساسية',
    name: 'Basic',
    description_ar: 'اكتشف دروازة بميزات محدودة لبدء رحلتك الثقافية.',
    description: 'Discover Darwaza with limited features to start your journey.',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'KWD',
    features_ar: ['وصول للمقالات العامة', 'تصفح الخريطة الثقافية', 'حساب مستخدم واحد'],
    features: ['Access to public articles', 'Browse cultural map', 'Single user account'],
    icon: Gift
  },
  {
    plan_id: 'family',
    name_ar: 'العائلية',
    name: 'Family',
    description_ar: 'مثالية للعائلات لاستكشاف التراث معاً ومشاركة الشغف.',
    description: 'Perfect for families exploring heritage together.',
    price_monthly: 10,
    price_yearly: 96,
    currency: 'KWD',
    features_ar: ['حتى 5 مستخدمين', 'تتبع أنشطة الأطفال', 'محتوى مخصص للشباب', 'دعم فني عادي'],
    features: ['Up to 5 users', 'Track kids activities', 'Youth-tailored content', 'Standard support'],
    icon: Users
  },
  {
    plan_id: 'heritage',
    name_ar: 'تراث بلس',
    name: 'Heritage Plus',
    description_ar: 'تجربة تراثية كاملة مع تقنيات الواقع المعزز والدورات.',
    description: 'Full heritage experience with AR and courses.',
    price_monthly: 25,
    price_yearly: 240, 
    currency: 'KWD',
    features_ar: ['كل ميزات الخطة العائلية', 'تقنية الواقع المعزز (AR)', 'دورات تدريبية حصرية', 'شهادات معتمدة'],
    features: ['All Family features', 'Augmented Reality (AR)', 'Exclusive training courses', 'Certified certificates'],
    icon: Crown,
    isPopular: true
  },
  {
    plan_id: 'premium',
    name_ar: 'النخبة',
    name: 'Premium',
    description_ar: 'وصول كامل لجميع ميزات دروازة مع خدمات VIP الحصرية.',
    description: 'Full access to all Darwaza features with VIP services.',
    price_monthly: 55,
    price_yearly: 528, 
    currency: 'KWD',
    features_ar: ['كل ميزات تراث بلس', 'مرشد ذكاء اصطناعي خاص', 'دعوات لفعاليات VIP', 'أولوية الدعم الفني 24/7'],
    features: ['All Heritage Plus features', 'Personal AI guide', 'VIP event invitations', '24/7 Priority support'],
    icon: Star
  }
];

// ==========================================
// تصميم كرت الاشتراك الفخم
// ==========================================
const PlanCard = ({ plan, isYearly, isArabic, onSubscribe, loading, currentPlan }) => {
  const { isHeritage, darkMode } = useTheme();
  const price = isYearly ? plan.price_yearly : plan.price_monthly;
  const period = isYearly ? (isArabic ? '/سنة' : '/year') : (isArabic ? '/شهر' : '/month');
  const isCurrentPlan = currentPlan === plan.plan_id;
  const Icon = plan.icon;

  const s = isHeritage ? {
    card: darkMode ? 'bg-[#2C1E12] border-2 border-[#8D1C1C] rounded-none' : 'bg-[#FDF5E6] border-2 border-[#8D1C1C] rounded-none',
    accentText: 'text-[#8D1C1C]',
    bgAccent: 'bg-[#8D1C1C]',
    btnReady: 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white rounded-none border border-[#FDF5E6] transition-colors',
    btnDisabled: 'bg-gray-700/50 text-gray-300 rounded-none cursor-not-allowed',
    badge: 'bg-[#D97706] text-white rounded-none border border-white/20',
    pattern: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }
  } : {
    card: darkMode ? 'bg-[#1E293B]/80 backdrop-blur-2xl border border-blue-500/30 rounded-3xl shadow-[0_0_25px_rgba(37,99,235,0.15)]' : 'bg-white/90 backdrop-blur-2xl border border-blue-200 rounded-3xl shadow-xl',
    accentText: 'text-blue-600 dark:text-blue-400',
    bgAccent: 'bg-blue-600',
    btnReady: 'bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:scale-105',
    btnDisabled: 'bg-gray-200 dark:bg-gray-800 text-gray-400 rounded-2xl cursor-not-allowed',
    badge: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg',
    pattern: {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className={`relative h-full flex flex-col ${plan.isPopular ? 'z-10 lg:scale-105' : ''}`}
    >
      {plan.isPopular && (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 text-sm font-bold shadow-lg z-20 ${s.badge}`}>
          {isArabic ? 'الأكثر شعبية' : 'Most Popular'}
        </div>
      )}
      
      {isCurrentPlan && (
        <div className={`absolute -top-4 right-4 px-4 py-1 text-xs font-bold text-white z-20 ${isHeritage ? 'bg-green-700 rounded-none' : 'bg-green-500 rounded-full'}`}>
          {isArabic ? 'خطتك الحالية' : 'Current Plan'}
        </div>
      )}

      <div className={`flex flex-col h-full p-8 transition-all duration-300 ${s.card}`} style={isHeritage ? s.pattern : {}}>
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto flex items-center justify-center mb-6 shadow-inner ${plan.plan_id === 'free' ? 'bg-gray-400' : s.bgAccent} ${isHeritage ? 'rounded-none' : 'rounded-3xl'}`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h3 className={`text-3xl font-bold mb-3 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? plan.name_ar : plan.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 min-h-[40px]">
            {isArabic ? plan.description_ar : plan.description}
          </p>
        </div>

        <div className="text-center mb-8 bg-black/5 dark:bg-white/5 py-6 rounded-xl">
          <div className="flex items-baseline justify-center">
            <span className={`text-5xl font-black ${s.accentText}`}>
              {price === 0 ? (isArabic ? 'مجاني' : 'Free') : `${price}`}
            </span>
            {price > 0 && (
              <>
                <span className="text-xl text-gray-500 dark:text-gray-400 ms-2 font-bold">{plan.currency}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ms-1">{period}</span>
              </>
            )}
          </div>
          {isYearly && price > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-bold bg-green-100 dark:bg-green-900/30 inline-block px-3 py-1 rounded-full">
              {isArabic ? 'وفر 20% مع السنوي' : 'Save 20% Annually'}
            </p>
          )}
        </div>

        <ul className="space-y-4 mb-8 flex-grow">
          {(isArabic ? plan.features_ar : plan.features).map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${s.accentText}`} strokeWidth={3} />
              <span className="text-base text-gray-800 dark:text-gray-200 font-medium">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSubscribe(plan.plan_id)}
          disabled={loading || plan.plan_id === 'free' || isCurrentPlan}
          className={`w-full h-14 text-lg font-bold mt-auto ${plan.plan_id === 'free' || isCurrentPlan ? s.btnDisabled : s.btnReady}`}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isCurrentPlan ? (
            isArabic ? 'الخطة الحالية' : 'Current Plan'
          ) : plan.plan_id === 'free' ? (
            isArabic ? 'مفعل افتراضياً' : 'Active by Default'
          ) : (
            isArabic ? 'اشترك الآن' : 'Subscribe Now'
          )}
        </Button>
      </div>
    </motion.div>
  );
};

// ==========================================
// رسالة النجاح
// ==========================================
const PaymentSuccess = ({ isArabic, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
  >
    <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl max-w-md w-full mx-4 text-center shadow-2xl border-2 border-green-500">
      <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-500" />
      <h2 className="text-3xl font-black mb-4">{isArabic ? 'تم الدفع بنجاح!' : 'Payment Successful!'}</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        {isArabic 
          ? 'شكراً لاشتراكك في بوابة دروازة التراثية. يمكنك الآن الوصول لجميع الميزات الفاخرة.'
          : 'Thank you for subscribing to Darwaza. You can now access all premium features.'}
      </p>
      <Button onClick={onClose} className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 rounded-2xl">{isArabic ? 'ابدأ الاستكشاف' : 'Start Exploring'}</Button>
    </div>
  </motion.div>
);

// ==========================================
// الصفحة الرئيسية للاشتراكات
// ==========================================
const SubscriptionsPage = () => {
  const { isHeritage, darkMode } = useTheme();
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isArabic = language === 'ar';
  
  const [isYearly, setIsYearly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // التحقق المحلي الوهمي لحالة الدفع (بدون سيرفر)
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && isAuthenticated) {
      setCheckingPayment(true);
      // محاكاة التحقق من السيرفر لمدة ثانيتين ثم إظهار النجاح
      setTimeout(() => {
        setShowSuccess(true);
        setCheckingPayment(false);
        window.history.replaceState({}, '', window.location.pathname);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isAuthenticated]);

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً للمتابعة' : 'Please login first to continue');
      navigate('/login');
      return;
    }
    setLoading(true);
    // محاكاة تحميل بسيطة قبل الانتقال
    setTimeout(() => {
      setLoading(false);
      navigate(`/payment?plan=${planId}&billing=${isYearly ? 'yearly' : 'monthly'}&method=${paymentMethod}`);
    }, 500);
  };

  const pageStyles = isHeritage ? {
    bg: darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FDF6E3]',
    text: 'text-[#8D1C1C]',
    controlsBg: darkMode ? 'bg-[#2C1E12] border border-[#8D1C1C]/30 rounded-none' : 'bg-[#F4ECE2] border border-[#8D1C1C]/30 rounded-none',
    faqCard: darkMode ? 'bg-[#2C1E12] border-[#8D1C1C] rounded-none' : 'bg-[#FDF5E6] border-[#8D1C1C] rounded-none'
  } : {
    bg: darkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]',
    text: 'text-blue-600',
    controlsBg: darkMode ? 'bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700 rounded-2xl' : 'bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm',
    faqCard: darkMode ? 'bg-[#1E293B] border-slate-700 rounded-2xl' : 'bg-white border-slate-200 rounded-2xl shadow-sm'
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${pageStyles.bg}`}>
      {checkingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl text-center shadow-2xl border border-blue-500/30">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-xl font-bold">{isArabic ? 'جاري التحقق من الدفع، لحظات من فضلك...' : 'Checking payment status, please wait...'}</p>
          </div>
        </div>
      )}
      
      {showSuccess && <PaymentSuccess isArabic={isArabic} onClose={() => setShowSuccess(false)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-black mb-6 ${pageStyles.text} ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'اختر خطتك' : 'Choose Your Plan'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {isArabic
              ? 'باقات مرنة تناسب جميع الأفراد والعائلات، لتعيشوا تجربة ثقافية وتراثية لا تُنسى عبر دروازة.'
              : 'Flexible plans to suit all individuals and families, to live an unforgettable cultural and heritage experience through Darwaza.'}
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto mb-16">
          <div className={`p-6 md:p-8 flex flex-col gap-8 ${pageStyles.controlsBg}`}>
            
            <div className="flex items-center justify-center gap-6">
              <span className={`text-lg font-bold ${!isYearly ? (darkMode ? 'text-white' : 'text-black') : 'text-gray-400'}`}>
                {t('monthly')}
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} className="scale-125 data-[state=checked]:bg-blue-600" />
              <span className={`text-lg font-bold flex items-center gap-2 ${isYearly ? (darkMode ? 'text-white' : 'text-black') : 'text-gray-400'}`}>
                {t('yearly')}
                <span className={`px-3 py-1 rounded-full text-xs font-black animate-pulse ${isHeritage ? 'bg-[#8D1C1C] text-white' : 'bg-green-500 text-white shadow-lg'}`}>
                  {isArabic ? 'وفر 20%' : 'Save 20%'}
                </span>
              </span>
            </div>

            <div>
              <p className="text-base font-bold mb-4 text-center opacity-80">{isArabic ? 'طريقة الدفع المفضلة' : 'Preferred Payment Method'}</p>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex justify-center gap-6">
                <Label htmlFor="stripe" className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-all ${paymentMethod === 'stripe' ? (isHeritage ? 'border-[#8D1C1C] bg-[#8D1C1C]/10' : 'border-blue-500 bg-blue-500/10 shadow-md') : 'border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-100'} ${isHeritage ? 'rounded-none' : 'rounded-xl'}`}>
                  <RadioGroupItem value="stripe" id="stripe" className="sr-only" />
                  <CreditCard className="w-6 h-6" />
                  <span className="font-bold text-lg">Visa/MasterCard</span>
                </Label>
                <Label htmlFor="knet" className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-all ${paymentMethod === 'knet' ? (isHeritage ? 'border-[#8D1C1C] bg-[#8D1C1C]/10' : 'border-blue-500 bg-blue-500/10 shadow-md') : 'border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-100'} ${isHeritage ? 'rounded-none' : 'rounded-xl'}`}>
                  <RadioGroupItem value="knet" id="knet" className="sr-only" />
                  <span className="font-black text-xl tracking-wider text-blue-700 dark:text-blue-400">K-NET</span>
                </Label>
              </RadioGroup>
            </div>
            
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch mb-20">
          {subscriptionPlans.map((plan, index) => (
            <motion.div key={plan.plan_id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="h-full">
              <PlanCard
                plan={plan}
                isYearly={isYearly}
                isArabic={isArabic}
                onSubscribe={handleSubscribe}
                loading={loading}
                currentPlan={user?.subscription_plan}
              />
            </motion.div>
          ))}
        </div>

        <SaduDivider className="my-16 opacity-50" />

        <div className="max-w-4xl mx-auto mb-20">
          <h2 className={`text-4xl font-black mb-10 text-center ${pageStyles.text} ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="grid gap-6">
            {[
              {
                q: isArabic ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?',
                a: isArabic ? 'نقبل الدفع الآمن عبر بطاقات الائتمان العالمية (Visa, MasterCard) بالإضافة إلى الدفع المحلي المباشر عبر شبكة كي-نت (K-NET) لعملائنا في الكويت.' : 'We accept secure payments via global credit cards (Visa, MasterCard) in addition to direct local payment via the K-NET network for our customers in Kuwait.'
              },
              {
                q: isArabic ? 'هل يمكنني الترقية لخطط أعلى لاحقاً؟' : 'Can I upgrade to higher plans later?',
                a: isArabic ? 'بكل تأكيد، يمكنك الترقية أو التخفيض في أي وقت من لوحة التحكم الخاصة بك. سيقوم النظام تلقائياً بحساب الفارق المادي بشكل عادل (تناسبي) للأيام المتبقية.' : 'Absolutely, you can upgrade or downgrade anytime from your dashboard. The system will automatically calculate the price difference fairly (prorated) for the remaining days.'
              },
              {
                q: isArabic ? 'هل هناك التزام بعقد طويل المدى؟' : 'Is there a long-term contract commitment?',
                a: isArabic ? 'لا يوجد أي التزام مخفي. يمكنك اختيار الدفع الشهري وإلغاء الاشتراك متى شئت بضغطة زر دون أي رسوم إضافية.' : 'There is no hidden commitment. You can choose monthly payment and cancel your subscription whenever you want with a click of a button without any additional fees.'
              }
            ].map((faq, index) => (
              <div key={index} className={`p-8 border-2 transition-all hover:scale-[1.01] ${pageStyles.faqCard}`}>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-blue-600'}`}>?</div>
                  {faq.q}
                </h3>
                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 ms-11">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`mt-10 text-center p-12 border-4 relative overflow-hidden ${isHeritage ? 'bg-[#8D1C1C]/5 border-[#8D1C1C] rounded-none' : 'bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-500 rounded-[3rem] shadow-2xl'}`}>
          {!isHeritage && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />}
          <div className="relative z-10">
            <Shield className={`w-20 h-20 mx-auto mb-6 ${isHeritage ? 'text-[#8D1C1C]' : 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]'}`} />
            <h3 className={`text-4xl font-black mb-4 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-white'}`}>
              {isArabic ? 'باقات المؤسسات والهيئات الثقافية' : 'Enterprise & Cultural Institutions Plans'}
            </h3>
            <p className={`text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${isHeritage ? 'text-gray-700 dark:text-gray-300' : 'text-blue-100'}`}>
              {isArabic
                ? 'هل تمثل مدرسة، جامعة، متحفاً أو جهة حكومية؟ نقدم لك حلولاً تقنية متكاملة، تراخيص جماعية بأسعار خاصة، وإدارة مخصصة للمحتوى تتناسب مع رؤيتكم لنشر التراث.'
                : 'Do you represent a school, university, museum, or government entity? We offer integrated technical solutions, bulk licenses at special rates, and custom content management.'}
            </p>
            <Button
              className={`h-16 px-12 text-xl font-bold border-2 ${isHeritage ? 'bg-transparent border-[#8D1C1C] text-[#8D1C1C] hover:bg-[#8D1C1C] hover:text-white rounded-none' : 'bg-white border-transparent text-blue-900 hover:bg-blue-50 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all'}`}
            >
              {isArabic ? 'تواصل مع المبيعات لطلب تسعيرة' : 'Contact Sales for a Quote'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionsPage;