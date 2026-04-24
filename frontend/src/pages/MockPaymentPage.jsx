import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { SaduCard } from '../components/SaduPattern';
import { 
  CreditCard, Lock, Calendar, User, ArrowRight, ArrowLeft, Loader2, ShieldCheck, CreditCard as CardIcon, CheckCircle 
} from 'lucide-react';
import { toast } from 'sonner';

const MockPaymentPage = () => {
  const { isHeritage, darkMode } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isArabic = language === 'ar';

  const planId = searchParams.get('plan') || 'family';
  const billing = searchParams.get('billing') || 'monthly';
  const initialMethod = searchParams.get('method') || 'stripe';

  const [paymentMethod, setPaymentMethod] = useState(initialMethod);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [price, setPrice] = useState(0);
  
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const plans = {
    family: { name: 'Family', name_ar: 'العائلية', monthly: 10, yearly: 96 },
    heritage: { name: 'Heritage Plus', name_ar: 'تراث بلس', monthly: 25, yearly: 240 },
    premium: { name: 'Premium', name_ar: 'النخبة', monthly: 55, yearly: 528 }
  };

  const selectedPlan = plans[planId] || plans.family;

  useEffect(() => {
    if (plans[planId]) {
      setPrice(plans[planId][billing === 'yearly' ? 'yearly' : 'monthly']);
    } else {
      setPrice(10);
    }
  }, [planId, billing]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please log in first');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isArabic]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'stripe' && (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv)) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
    
    toast.success(isArabic ? 'تم الدفع بنجاح!' : 'Payment successful!');
    
    setTimeout(() => {
      navigate('/subscriptions?session_id=mock_success_12345');
    }, 2000);
  };

  const s = isHeritage ? {
    bg: darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FDF6E3]',
    card: darkMode ? 'bg-[#2C1E12] border-[#8D1C1C]' : 'bg-[#FDF5E6] border-[#8D1C1C]',
    textAccent: 'text-[#8D1C1C]',
    btnReady: 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white rounded-none border border-[#FDF5E6]',
    input: darkMode ? 'bg-[#1A1A1A] border-[#8D1C1C] rounded-none text-white focus:ring-[#8D1C1C]' : 'bg-white border-[#8D1C1C] rounded-none focus:ring-[#8D1C1C]',
    radioActive: 'border-[#8D1C1C] bg-[#8D1C1C]/10 ring-1 ring-[#8D1C1C]',
    corners: 'rounded-none'
  } : {
    bg: darkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]',
    card: darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-blue-200',
    textAccent: 'text-blue-600 dark:text-blue-400',
    btnReady: 'bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all',
    input: darkMode ? 'bg-[#0F172A] border-slate-600 rounded-xl text-white focus:ring-blue-500' : 'bg-slate-50 border-slate-300 rounded-xl focus:ring-blue-500',
    radioActive: 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500',
    corners: 'rounded-3xl'
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${s.bg}`}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl border-2 border-green-500">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className={`text-4xl font-black mb-4 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {isArabic ? `تم تفعيل اشتراكك في خطة ${selectedPlan.name_ar}` : `Your ${selectedPlan.name} subscription is now active`}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{isArabic ? 'جاري التحويل...' : 'Redirecting...'}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center py-12 px-4 ${s.bg}`}>
      <div className="w-full max-w-5xl">
        
        <Button onClick={() => navigate('/subscriptions')} variant="ghost" className={`mb-6 gap-2 font-bold ${s.textAccent}`}>
          {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          {isArabic ? 'العودة للاشتراكات' : 'Back to Subscriptions'}
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* ملخص الطلب */}
          <motion.div initial={{ opacity: 0, x: isRTL ? 50 : -50 }} animate={{ opacity: 1, x: 0 }}>
            <SaduCard className={`p-8 border-2 shadow-xl h-full flex flex-col justify-between ${s.card} ${s.corners}`}>
              <div>
                <h2 className={`text-3xl font-black mb-8 border-b-2 pb-4 border-gray-200 dark:border-gray-700 ${isHeritage ? 'font-serif' : ''}`}>
                  {isArabic ? 'ملخص الطلب' : 'Order Summary'}
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                    <div>
                      <h3 className="font-bold text-2xl">{isArabic ? selectedPlan.name_ar : selectedPlan.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium mt-1">
                        {billing === 'yearly' ? (isArabic ? 'اشتراك سنوي (خصم 20%)' : 'Yearly plan (20% off)') : (isArabic ? 'اشتراك شهري' : 'Monthly plan')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-black ${s.textAccent}`}>{price}</span>
                      <span className="text-sm font-bold ms-1">KWD</span>
                    </div>
                  </div>
                  <ul className="space-y-3 px-2">
                    <li className="flex justify-between text-lg"><span className="text-muted-foreground">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span><span className="font-bold">{price} KWD</span></li>
                    <li className="flex justify-between text-lg"><span className="text-muted-foreground">{isArabic ? 'الضريبة (0%)' : 'Tax (0%)'}</span><span className="font-bold">0 KWD</span></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{isArabic ? 'المجموع الكلي' : 'Total Due'}</span>
                  <span className={`text-4xl font-black ${s.textAccent}`}>{price} KWD</span>
                </div>
                <div className={`mt-6 p-4 flex items-center gap-3 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} ${s.corners}`}>
                  <ShieldCheck className="w-8 h-8 text-green-500 shrink-0" />
                  <div>
                    <p className="font-bold">{isArabic ? 'دفع آمن 100%' : '100% Secure Payment'}</p>
                    <p className="text-xs text-muted-foreground">{isArabic ? 'هذه صفحة دفع تجريبية آمنة.' : 'This is a secure test payment page.'}</p>
                  </div>
                </div>
              </div>
            </SaduCard>
          </motion.div>

          {/* نموذج الدفع */}
          <motion.div initial={{ opacity: 0, x: isRTL ? -50 : 50 }} animate={{ opacity: 1, x: 0 }}>
            <SaduCard className={`p-8 border-2 shadow-xl ${s.card} ${s.corners}`}>
              <h2 className={`text-3xl font-black mb-8 border-b-2 pb-4 border-gray-200 dark:border-gray-700 ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? 'معلومات الدفع' : 'Payment Details'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* أزرار اختيار طريقة الدفع */}
                <div>
                  <Label className="text-lg font-bold mb-4 block">{isArabic ? 'اختر طريقة الدفع' : 'Select Payment Method'}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setPaymentMethod('stripe')}
                      className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-all ${isHeritage ? 'rounded-none' : 'rounded-xl'} ${paymentMethod === 'stripe' ? s.radioActive : 'border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-100'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'stripe' ? `border-current ${s.textAccent}` : 'border-gray-400'}`}>
                        {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                      </div>
                      <CardIcon className="w-6 h-6 shrink-0" />
                      <span className="font-bold text-sm md:text-base">Visa / Master</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('knet')}
                      className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-all ${isHeritage ? 'rounded-none' : 'rounded-xl'} ${paymentMethod === 'knet' ? s.radioActive : 'border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-100'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'knet' ? `border-current ${s.textAccent}` : 'border-gray-400'}`}>
                        {paymentMethod === 'knet' && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                      </div>
                      <span className="font-black text-lg md:text-xl tracking-wider text-blue-700 dark:text-blue-400">K-NET</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === 'stripe' ? (
                    <motion.div key="stripe-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-5 overflow-hidden">
                      <div>
                        <Label className="mb-2 block font-bold">{isArabic ? 'رقم البطاقة' : 'Card Number'}</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input 
                            type="text" placeholder="4242 4242 4242 4242" maxLength="19" required
                            value={cardData.number}
                            onChange={(e) => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                            className={`h-14 ps-12 text-lg tracking-widest font-mono ${s.input}`} dir="ltr"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2 block font-bold">{isArabic ? 'اسم حامل البطاقة' : 'Cardholder Name'}</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input 
                            type="text" placeholder={isArabic ? 'الاسم كما هو مطبوع' : 'Name as printed'} required
                            value={cardData.name}
                            onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                            className={`h-14 ps-12 text-base ${s.input}`} 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="mb-2 block font-bold">{isArabic ? 'الانتهاء' : 'Expiry'}</Label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input 
                              type="text" placeholder="MM/YY" maxLength="5" required
                              value={cardData.expiry}
                              onChange={(e) => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                              className={`h-14 ps-12 text-lg font-mono text-center ${s.input}`} dir="ltr"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block font-bold">CVV</Label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input 
                              type="password" placeholder="123" maxLength="4" required
                              value={cardData.cvv}
                              onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                              className={`h-14 ps-12 text-lg font-mono text-center ${s.input}`} dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="knet-message" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                      className={`p-8 mt-4 text-center border-2 border-dashed ${isHeritage ? 'bg-[#8D1C1C]/5 border-[#8D1C1C]/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'} ${s.corners}`}
                    >
                      <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl shadow-md flex items-center justify-center">
                        <span className="font-black text-2xl text-blue-700">K-NET</span>
                      </div>
                      <h3 className="font-bold text-xl mb-3">{isArabic ? 'بوابة الدفع الإلكتروني كي-نت' : 'K-NET E-Payment Gateway'}</h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        {isArabic ? 'عند الضغط على زر الدفع أدناه، سيتم تحويلك مباشرة وبشكل آمن إلى صفحة كي-نت الرسمية لإتمام العملية.' : 'Upon clicking pay, you will be securely redirected to the official K-NET page to complete the transaction.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-6">
                  <Button type="submit" disabled={loading} className={`w-full h-16 text-2xl font-black flex items-center justify-center gap-3 ${s.btnReady}`}>
                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Lock className="w-6 h-6" /> {isArabic ? `ادفع ${price} KWD` : `Pay ${price} KWD`}</>}
                  </Button>
                </div>
              </form>
            </SaduCard>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default MockPaymentPage;