import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Check, Star, Zap, Crown, Gift, Users, Shield } from 'lucide-react';

const PlanCard = ({ plan, isYearly, isArabic, isPopular }) => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const price = isYearly ? plan.price_yearly : plan.price_monthly;
  const period = isYearly 
    ? (isArabic ? '/سنة' : '/year') 
    : (isArabic ? '/شهر' : '/month');

  const getIcon = () => {
    switch (plan.plan_id) {
      case 'free': return Gift;
      case 'family': return Users;
      case 'heritage': return Crown;
      default: return Star;
    }
  };

  const Icon = getIcon();

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
              {isArabic ? 'وفر 17%' : 'Save 17%'}
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
          className={`w-full h-12 ${
            plan.plan_id === 'free'
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : isHeritage 
                ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' 
                : 'bg-[#0D9488] hover:bg-[#0B7A70]'
          }`}
          data-testid={`subscribe-${plan.plan_id}`}
        >
          {plan.plan_id === 'free' 
            ? (isArabic ? 'الخطة الحالية' : 'Current Plan')
            : (isArabic ? 'اشترك الآن' : 'Subscribe Now')}
        </Button>
      </SaduCard>
    </motion.div>
  );
};

const SubscriptionsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      plan_id: 'free',
      name: 'Free',
      name_ar: 'مجاني',
      description: 'Basic access to Darwaza',
      description_ar: 'الوصول الأساسي إلى دروازة',
      price_monthly: 0,
      price_yearly: 0,
      currency: 'KWD',
      features: ['Browse marketplace', 'View live councils', 'Basic AI chat (limited)'],
      features_ar: ['تصفح السوق', 'مشاهدة المجالس الحية', 'محادثة الذكاء الاصطناعي (محدودة)']
    },
    {
      plan_id: 'family',
      name: 'Family',
      name_ar: 'العائلة',
      description: 'Perfect for families exploring heritage together',
      description_ar: 'مثالي للعائلات لاستكشاف التراث معًا',
      price_monthly: 9.99,
      price_yearly: 99.99,
      currency: 'KWD',
      features: ['Everything in Free', 'Unlimited AI chat', 'Kids Heritage Box', 'Live workshops access', 'Priority support'],
      features_ar: ['كل ما في المجاني', 'محادثة AI غير محدودة', 'صندوق التراث للأطفال', 'الوصول لورش العمل الحية', 'دعم أولوية']
    },
    {
      plan_id: 'heritage',
      name: 'Heritage Plus',
      name_ar: 'التراث المميز',
      description: 'Full access to all Darwaza features',
      description_ar: 'الوصول الكامل لجميع ميزات دروازة',
      price_monthly: 19.99,
      price_yearly: 199.99,
      currency: 'KWD',
      features: ['Everything in Family', 'AR experiences', 'Certified courses', 'Host live councils', 'Exclusive discounts', 'VIP events access'],
      features_ar: ['كل ما في العائلة', 'تجارب الواقع المعزز', 'دورات معتمدة', 'استضافة المجالس الحية', 'خصومات حصرية', 'الوصول لفعاليات VIP']
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <div className="flex items-center justify-center gap-4 mb-12">
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
              {isArabic ? 'وفر 17%' : 'Save 17%'}
            </span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.plan_id}
              plan={plan}
              isYearly={isYearly}
              isArabic={isArabic}
              isPopular={plan.plan_id === 'family'}
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
                q: isArabic ? 'هل يمكنني تغيير خطتي لاحقاً؟' : 'Can I change my plan later?',
                a: isArabic ? 'نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم احتساب الفرق بشكل تناسبي.' : 'Yes, you can upgrade or downgrade anytime. The difference will be prorated.'
              },
              {
                q: isArabic ? 'هل هناك فترة تجريبية مجانية؟' : 'Is there a free trial?',
                a: isArabic ? 'نعم، جميع الخطط المدفوعة تتضمن فترة تجريبية مجانية لمدة 7 أيام.' : 'Yes, all paid plans include a 7-day free trial.'
              },
              {
                q: isArabic ? 'كيف يمكنني إلغاء اشتراكي؟' : 'How can I cancel my subscription?',
                a: isArabic ? 'يمكنك إلغاء اشتراكك في أي وقت من إعدادات حسابك. لن يتم تحصيل أي رسوم إضافية.' : 'You can cancel your subscription anytime from your account settings. No additional charges will be made.'
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
