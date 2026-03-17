import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Switch } from '../components/ui/switch';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Check, Star, Zap, Crown, Gift, Users, Shield, CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PlanCard = ({ plan, isYearly, isArabic, isPopular, onSubscribe, loading, currentPlan }) => {
  const { isHeritage, darkMode } = useTheme();
  const price = isYearly ? plan.price_yearly : plan.price_monthly;
  const period = isYearly 
    ? (isArabic ? '/سنة' : '/year') 
    : (isArabic ? '/شهر' : '/month');

  const getIcon = () => {
    switch (plan.plan_id) {
      case 'free': return Gift;
      case 'family': return Users;
      case 'heritage': return Crown;
      case 'premium': return Star;
      default: return Star;
    }
  };

  const Icon = getIcon();
  const isCurrentPlan = currentPlan === plan.plan_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className={`relative ${isPopular ? 'z-10' : ''}`}
    >
      {isPopular && (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold text-white ${isHeritage ? 'bg-[#D97706]' : 'bg-[#F59E0B]'}`}>
          {isArabic ? 'الأكثر شعبية' : 'Most Popular'}
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
          {isArabic ? 'خطتك الحالية' : 'Current Plan'}
        </div>
      )}
      <SaduCard className={`h-full ${isPopular ? 'scale-105' : ''}`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
            plan.plan_id === 'free' 
              ? 'bg-gray-200' 
              : isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#0D9488]'
          }`}>
            <Icon className={`w-8 h-8 ${plan.plan_id === 'free' ? 'text-gray-600' : 'text-white'}`} />
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? plan.name_ar : plan.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isArabic ? plan.description_ar : plan.description}
          </p>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center">
            <span className={`text-4xl font-bold ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#0D9488]'}`}>
              {price === 0 ? (isArabic ? 'مجاني' : 'Free') : `${price}`}
            </span>
            {price > 0 && (
              <>
                <span className="text-lg text-muted-foreground ms-1">{plan.currency}</span>
                <span className="text-sm text-muted-foreground ms-1">{period}</span>
              </>
            )}
          </div>
          {isYearly && price > 0 && (
            <p className="text-sm text-green-600 mt-1">
              {isArabic ? 'وفر حتى 20%' : 'Save up to 20%'}
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-6">
          {(isArabic ? plan.features_ar : plan.features).map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#0D9488]'}`} />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSubscribe(plan.plan_id)}
          disabled={loading || plan.plan_id === 'free' || isCurrentPlan}
          className={`w-full h-12 ${
            plan.plan_id === 'free' || isCurrentPlan
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : isHeritage 
                ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' 
                : 'bg-[#0D9488] hover:bg-[#0B7A70]'
          }`}
          data-testid={`subscribe-${plan.plan_id}`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isCurrentPlan ? (
            isArabic ? 'الخطة الحالية' : 'Current Plan'
          ) : plan.plan_id === 'free' ? (
            isArabic ? 'الخطة الحالية' : 'Current Plan'
          ) : (
            isArabic ? 'اشترك الآن' : 'Subscribe Now'
          )}
        </Button>
      </SaduCard>
    </motion.div>
  );
};

const PaymentSuccess = ({ isArabic, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-md w-full mx-4 text-center">
      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
      <h2 className="text-2xl font-bold mb-2">{isArabic ? 'تم الدفع بنجاح!' : 'Payment Successful!'}</h2>
      <p className="text-muted-foreground mb-6">
        {isArabic 
          ? 'شكراً لاشتراكك في دروازة. يمكنك الآن الوصول لجميع الميزات.'
          : 'Thank you for subscribing to Darwaza. You can now access all features.'}
      </p>
      <Button onClick={onClose} className="w-full">{isArabic ? 'متابعة' : 'Continue'}</Button>
    </div>
  </motion.div>
);

const SubscriptionsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isArabic = language === 'ar';
  
  const [isYearly, setIsYearly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  // Check for payment return
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && isAuthenticated) {
      pollPaymentStatus(sessionId);
    }
  }, [searchParams, isAuthenticated]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subscriptions/plans`);
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    
    if (attempts >= maxAttempts) {
      toast.error(isArabic ? 'انتهت مهلة التحقق من الدفع' : 'Payment status check timed out');
      return;
    }

    setCheckingPayment(true);
    
    try {
      const response = await axios.get(`${API_URL}/api/payments/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.payment_status === 'paid') {
        setShowSuccess(true);
        setCheckingPayment(false);
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
      } else if (response.data.payment_status === 'expired') {
        toast.error(isArabic ? 'انتهت صلاحية جلسة الدفع' : 'Payment session expired');
        setCheckingPayment(false);
      } else {
        // Continue polling
        setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      setCheckingPayment(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      navigate('/login');
      return;
    }

    // Navigate to mock payment page
    navigate(`/payment?plan=${planId}&billing=${isYearly ? 'yearly' : 'monthly'}&method=${paymentMethod}`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      {checkingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p>{isArabic ? 'جاري التحقق من الدفع...' : 'Checking payment status...'}</p>
          </div>
        </div>
      )}
      
      {showSuccess && <PaymentSuccess isArabic={isArabic} onClose={() => setShowSuccess(false)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {t('choose_plan')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'اختر الخطة المناسبة لعائلتك واستمتع بتجربة تراثية فريدة.'
              : 'Choose the right plan for your family and enjoy a unique heritage experience.'}
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-medium ${!isYearly ? '' : 'text-muted-foreground'}`}>
            {t('monthly')}
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            data-testid="billing-toggle"
          />
          <span className={`text-sm font-medium ${isYearly ? '' : 'text-muted-foreground'}`}>
            {t('yearly')}
            <span className={`ms-2 px-2 py-0.5 rounded-full text-xs ${isHeritage ? 'bg-[#D97706]/20 text-[#D97706]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
              {isArabic ? 'وفر 20%' : 'Save 20%'}
            </span>
          </span>
        </div>

        {/* Payment Method Selection */}
        <div className="flex justify-center mb-12">
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
            <p className="text-sm font-medium mb-3 text-center">{isArabic ? 'طريقة الدفع' : 'Payment Method'}</p>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  <span>Visa/MasterCard</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="knet" id="knet" />
                <Label htmlFor="knet" className="flex items-center gap-2 cursor-pointer">
                  <span className="font-bold text-blue-600">K-NET</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.plan_id}
              plan={plan}
              isYearly={isYearly}
              isArabic={isArabic}
              isPopular={plan.plan_id === 'heritage'}
              onSubscribe={handleSubscribe}
              loading={loading}
              currentPlan={user?.subscription_plan}
            />
          ))}
        </div>

        <SaduDivider className="my-16" />

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl font-bold mb-8 text-center ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: isArabic ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?',
                a: isArabic ? 'نقبل بطاقات Visa وMasterCard عبر Stripe، وقريباً K-NET للمستخدمين في الكويت.' : 'We accept Visa and MasterCard via Stripe, and K-NET for Kuwait users coming soon.'
              },
              {
                q: isArabic ? 'هل يمكنني تغيير خطتي لاحقاً؟' : 'Can I change my plan later?',
                a: isArabic ? 'نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم احتساب الفرق بشكل تناسبي.' : 'Yes, you can upgrade or downgrade anytime. The difference will be prorated.'
              },
              {
                q: isArabic ? 'هل هناك فترة تجريبية مجانية؟' : 'Is there a free trial?',
                a: isArabic ? 'نعم، جميع الخطط المدفوعة تتضمن فترة تجريبية مجانية لمدة 7 أيام.' : 'Yes, all paid plans include a 7-day free trial.'
              }
            ].map((faq, index) => (
              <SaduCard key={index}>
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </SaduCard>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className={`mt-16 text-center p-8 rounded-2xl ${isHeritage ? 'bg-[#8D1C1C]/10' : 'bg-[#0D9488]/10'}`}>
          <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: themeColors.primary }} />
          <h3 className={`text-xl font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'للمؤسسات والشركات' : 'For Enterprises & Organizations'}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            {isArabic
              ? 'حلول مخصصة للمدارس والمتاحف والمؤسسات الثقافية. تواصل معنا للحصول على عرض سعر مخصص.'
              : 'Custom solutions for schools, museums, and cultural institutions. Contact us for a custom quote.'}
          </p>
          <Button
            variant="outline"
            className={`${isHeritage ? 'border-[#8D1C1C] text-[#8D1C1C]' : 'border-[#0D9488] text-[#0D9488]'}`}
            data-testid="enterprise-contact-btn"
          >
            {isArabic ? 'تواصل معنا' : 'Contact Sales'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
