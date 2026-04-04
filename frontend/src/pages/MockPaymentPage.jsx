import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { SaduCard } from '../components/SaduPattern';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  Loader2, 
  ArrowLeft,
  Shield,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const MockPaymentPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isArabic = language === 'ar';

  const planId = searchParams.get('plan') || 'family';
  const billing = searchParams.get('billing') || 'monthly';
  const method = searchParams.get('method') || 'stripe';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const plans = {
    family: { name: 'Family', name_ar: 'العائلة', monthly: 10, yearly: 99 },
    heritage: { name: 'Heritage Plus', name_ar: 'التراث المميز', monthly: 25, yearly: 250 },
    premium: { name: 'Premium', name_ar: 'بريميوم', monthly: 55, yearly: 550 }
  };

  const selectedPlan = plans[planId] || plans.family;
  const amount = billing === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly;

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
    
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSuccess(true);
    
    toast.success(isArabic ? 'تم الدفع بنجاح!' : 'Payment successful!');
    
    // Redirect after success
    setTimeout(() => {
      navigate('/subscriptions?success=true');
    }, 3000);
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isArabic 
              ? `تم تفعيل اشتراكك في خطة ${selectedPlan.name_ar}`
              : `Your ${selectedPlan.name} subscription is now active`}
          </p>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'جاري التحويل...' : 'Redirecting...'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/subscriptions')}
          className="mb-8"
          data-testid="back-to-subscriptions"
        >
          <ArrowLeft className={`w-4 h-4 me-2 ${isRTL ? 'rotate-180' : ''}`} />
          {isArabic ? 'العودة للاشتراكات' : 'Back to Subscriptions'}
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            
            <SaduCard>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h3 className="font-bold text-lg">
                      {isArabic ? selectedPlan.name_ar : selectedPlan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {billing === 'yearly' 
                        ? (isArabic ? 'اشتراك سنوي' : 'Yearly subscription')
                        : (isArabic ? 'اشتراك شهري' : 'Monthly subscription')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#1D4ED8]'}`}>
                      {amount} KWD
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {billing === 'yearly' ? (isArabic ? '/سنة' : '/year') : (isArabic ? '/شهر' : '/month')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span>{amount} KWD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isArabic ? 'الضريبة' : 'Tax'}</span>
                    <span>0 KWD</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>{isArabic ? 'المجموع' : 'Total'}</span>
                    <span className={isHeritage ? 'text-[#8D1C1C]' : 'text-[#1D4ED8]'}>{amount} KWD</span>
                  </div>
                </div>
              </div>
            </SaduCard>

            {/* Security Notice */}
            <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <Shield className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">{isArabic ? 'دفع آمن' : 'Secure Payment'}</p>
                <p className="text-xs text-muted-foreground">
                  {isArabic 
                    ? 'هذه صفحة دفع تجريبية للعرض فقط. لا يتم معالجة أي مدفوعات حقيقية.'
                    : 'This is a test payment page for demonstration only. No real payments are processed.'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? 'معلومات الدفع' : 'Payment Information'}
            </h2>

            <SaduCard>
              {/* Payment Method */}
              <div className="mb-6">
                <Label className="mb-3 block">{isArabic ? 'طريقة الدفع' : 'Payment Method'}</Label>
                <RadioGroup value={method} className="flex gap-4">
                  <div className={`flex-1 p-4 rounded-lg border-2 cursor-pointer ${method === 'stripe' ? (isHeritage ? 'border-[#8D1C1C] bg-[#8D1C1C]/5' : 'border-[#1D4ED8] bg-[#1D4ED8]/5') : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="cursor-pointer flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Visa/MasterCard
                      </Label>
                    </div>
                  </div>
                  <div className={`flex-1 p-4 rounded-lg border-2 cursor-pointer ${method === 'knet' ? (isHeritage ? 'border-[#8D1C1C] bg-[#8D1C1C]/5' : 'border-[#1D4ED8] bg-[#1D4ED8]/5') : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="knet" id="knet" />
                      <Label htmlFor="knet" className="cursor-pointer font-bold text-blue-600">K-NET</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="card-number">{isArabic ? 'رقم البطاقة' : 'Card Number'}</Label>
                  <div className="relative mt-1">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="card-number"
                      placeholder="4242 4242 4242 4242"
                      value={cardData.number}
                      onChange={(e) => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                      maxLength={19}
                      className="ps-10"
                      data-testid="card-number-input"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isArabic ? 'استخدم: 4242 4242 4242 4242 للاختبار' : 'Use: 4242 4242 4242 4242 for testing'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="card-name">{isArabic ? 'اسم حامل البطاقة' : 'Cardholder Name'}</Label>
                  <Input
                    id="card-name"
                    placeholder={isArabic ? 'الاسم كما هو على البطاقة' : 'Name as on card'}
                    value={cardData.name}
                    onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                    data-testid="card-name-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card-expiry">{isArabic ? 'تاريخ الانتهاء' : 'Expiry Date'}</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="card-expiry"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                        maxLength={5}
                        className="ps-10"
                        data-testid="card-expiry-input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="card-cvv">CVV</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="card-cvv"
                        placeholder="123"
                        type="password"
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        maxLength={4}
                        className="ps-10"
                        data-testid="card-cvv-input"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 text-lg mt-6 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
                  data-testid="pay-now-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin me-2" />
                      {isArabic ? 'جاري المعالجة...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 me-2" />
                      {isArabic ? `ادفع ${amount} KWD` : `Pay ${amount} KWD`}
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-4">
                {isArabic 
                  ? 'بالضغط على "ادفع" فإنك توافق على شروط الخدمة وسياسة الخصوصية'
                  : 'By clicking "Pay" you agree to our Terms of Service and Privacy Policy'}
              </p>
            </SaduCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentPage;
