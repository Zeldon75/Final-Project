import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { SaduCard } from '../components/SaduPattern';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  User, Camera, CreditCard, Receipt, HeadphonesIcon, LogOut, UploadCloud, Save, CheckCircle, XCircle, Crown, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { language } = useLanguage();
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const isArabic = language === 'ar';

  const [activeMenu, setActiveMenu] = useState('account');
  const [loading, setLoading] = useState(false);

  // حالات البيانات (نقوم بجلبها من المستخدم أو نعطيها قيماً افتراضية للجدد)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [subscription, setSubscription] = useState(user?.subscription || 'free'); // free, vip, cancelled
  const [transactions, setTransactions] = useState(user?.transactions || []); 
  const [supportMessage, setSupportMessage] = useState({ subject: '', details: '' });

  // تحديث الحقول فور تغير المستخدم أو تسجيل الدخول
  useEffect(() => {
    setProfileData({ name: user?.name || '', phone: user?.phone || '' });
    setAvatarPreview(user?.avatar || null);
    setSubscription(user?.subscription || 'free');
    setTransactions(user?.transactions || []);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success(isArabic ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
    navigate('/login');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      toast.error(isArabic ? 'الاسم لا يمكن أن يكون فارغاً' : 'Name cannot be empty');
      return;
    }
    
    setLoading(true);
    setTimeout(async () => {
      await updateProfile({ ...profileData, avatar: avatarPreview });
      setLoading(false);
      toast.success(isArabic ? 'تم حفظ التعديلات بنجاح!' : 'Profile updated successfully!');
    }, 800);
  };

  // 🚀 نقل المستخدم إلى صفحة الاشتراكات
  const handleUpgrade = () => {
    toast.info(isArabic ? 'جاري تحويلك لصفحة الاشتراكات...' : 'Redirecting to subscriptions page...');
    setTimeout(() => {
      navigate('/subscriptions');
    }, 500);
  };

  const handleCancelSub = async () => {
    await updateProfile({ subscription: 'cancelled' });
    setSubscription('cancelled');
    toast.success(isArabic ? 'تم إلغاء الاشتراك' : 'Subscription cancelled');
  };

  const handleSupportSubmit = () => {
    if (!supportMessage.subject || !supportMessage.details) {
      toast.error(isArabic ? 'يرجى تعبئة جميع الحقول' : 'Please fill all fields');
      return;
    }
    toast.success(isArabic ? 'تم إرسال رسالتك للدعم الفني وسنرد عليك قريباً!' : 'Message sent to support. We will reply soon!');
    setSupportMessage({ subject: '', details: '' }); 
  };

  const defaultAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&color=fff&size=150`;

  const pageBg = darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]');
  const cardStyle = isHeritage ? (darkMode ? 'bg-[#2C1E12] border-[#8D1C1C]' : 'bg-[#FDF5E6] border-[#8D1C1C]') : (darkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-blue-100 shadow-xl');
  const activeMenuBg = isHeritage ? 'bg-[#8D1C1C] text-white sadu-pattern' : 'bg-blue-600 text-white shadow-md';
  const inactiveMenuBg = darkMode ? 'hover:bg-white/5 text-gray-300 cursor-pointer' : 'hover:bg-black/5 text-gray-700 cursor-pointer';
  const inputStyle = darkMode ? 'bg-black/20 border-gray-600 text-white' : 'bg-white border-gray-300 text-black';

  const menuItems = [
    { id: 'account', label_ar: 'معلومات الحساب', label_en: 'Account Info', icon: User },
    { id: 'avatar', label_ar: 'تغيير الصورة العرض', label_en: 'Change Avatar', icon: Camera },
    { id: 'subscription', label_ar: 'نوع الاشتراك', label_en: 'Subscription', icon: CreditCard },
    { id: 'transactions', label_ar: 'فهرس المعاملات', label_en: 'Transactions', icon: Receipt },
    { id: 'support', label_ar: 'تواصل مع الخدمة', label_en: 'Support', icon: HeadphonesIcon },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'account':
        return (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h3 className={`text-2xl font-bold mb-6 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{isArabic ? 'الاسم الكامل' : 'Full Name'}</Label>
                <Input value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label>{isArabic ? 'رقم الهاتف' : 'Phone Number'}</Label>
                <Input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className={inputStyle} dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</Label>
                <Input value={user?.email || ''} disabled className={`${inputStyle} opacity-50 cursor-not-allowed`} />
              </div>
              <div className="space-y-2">
                <Label>{isArabic ? 'الفئة' : 'Category'}</Label>
                <Input value={user?.category === 'child' ? 'أطفال' : user?.category === 'senior' ? 'متقاعدين' : 'شباب'} disabled className={`${inputStyle} opacity-50 cursor-not-allowed font-bold`} />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={loading} className={`mt-6 w-full md:w-auto px-8 h-12 font-bold ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-blue-600'}`}>
              <Save className="w-5 h-5 me-2" /> {loading ? 'جاري الحفظ...' : (isArabic ? 'حفظ التعديلات' : 'Save Changes')}
            </Button>
          </div>
        );

      case 'avatar':
        return (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300 flex flex-col items-center">
            <h3 className={`text-2xl font-bold mb-4 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'تغيير صورة العرض' : 'Change Avatar'}
            </h3>
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 shadow-xl mb-4 relative group" style={{ borderColor: themeColors.primary }}>
              <img src={avatarPreview || defaultAvatar} alt="Preview" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white">
                <UploadCloud className="w-10 h-10 mb-2" />
                <span className="text-sm font-bold">{isArabic ? 'تغيير الصورة' : 'Upload New'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleSaveProfile} disabled={loading} className={`px-8 h-12 font-bold ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-blue-600'}`}>
                <Save className="w-5 h-5 me-2" /> {loading ? 'جاري الحفظ...' : (isArabic ? 'اعتماد الصورة' : 'Save Avatar')}
              </Button>
              {avatarPreview && (
                <Button onClick={() => setAvatarPreview(null)} variant="outline" className="px-8 h-12 font-bold text-red-500 border-red-500 hover:bg-red-50">
                  {isArabic ? 'إزالة' : 'Remove'}
                </Button>
              )}
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h3 className={`text-2xl font-bold mb-6 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'إدارة الاشتراك' : 'Manage Subscription'}
            </h3>
            
            {/* واجهة الباقة المجانية */}
            {subscription === 'free' && (
              <div className={`p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">Free Plan</span>
                  <h4 className="text-2xl font-black text-gray-700 dark:text-gray-300">Darwaza Basic</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {isArabic ? 'حسابك مجاني ومحدود الصلاحيات. قم بالترقية للاستمتاع بكل المزايا.' : 'Your account is free and has limited access. Upgrade to enjoy all features.'}
                  </p>
                </div>
                <ShieldCheck className="w-16 h-16 text-gray-400 opacity-50" />
              </div>
            )}

            {/* واجهة الباقة الـ VIP النشطة أو الملغاة */}
            {subscription !== 'free' && (
              <div className={`p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${subscription === 'vip' ? (darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200') : (darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200')}`}>
                <div>
                  <span className={`${subscription === 'vip' ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block`}>
                    {subscription === 'vip' ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'ملغى' : 'Cancelled')}
                  </span>
                  <h4 className={`text-2xl font-black ${subscription === 'vip' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    Darwaza VIP
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {subscription === 'vip' 
                      ? (isArabic ? 'أنت تستمتع بكافة مميزات بوابة دروازة بلا حدود.' : 'You are enjoying all Darwaza portal features without limits.')
                      : (isArabic ? 'اشتراكك متوقف. يرجى التجديد للاستمتاع بالمميزات.' : 'Your subscription is inactive. Please renew.')}
                  </p>
                </div>
                {subscription === 'vip' ? <CheckCircle className="w-16 h-16 text-green-500 opacity-50" /> : <XCircle className="w-16 h-16 text-red-500 opacity-50" />}
              </div>
            )}
            
            {/* أزرار الإجراءات */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {subscription === 'free' ? (
                <Button onClick={handleUpgrade} disabled={loading} className={`w-full font-bold h-12 text-lg shadow-lg text-white ${isHeritage ? 'bg-[#D97706] hover:bg-[#B45309]' : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'}`}>
                  <Crown className="w-6 h-6 me-2" />
                  {isArabic ? 'ترقية إلى VIP (10 د.ك)' : 'Upgrade to VIP (10 KWD)'}
                </Button>
              ) : subscription === 'vip' ? (
                <Button onClick={handleCancelSub} variant="outline" className="font-bold border-red-500 text-red-500 hover:bg-red-50">
                  {isArabic ? 'إلغاء الاشتراك' : 'Cancel Subscription'}
                </Button>
              ) : (
                <Button onClick={handleUpgrade} disabled={loading} className={`font-bold h-12 px-8 text-white ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-green-600 hover:bg-green-700'}`}>
                  {isArabic ? 'تجديد الباقة' : 'Renew Subscription'}
                </Button>
              )}
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h3 className={`text-2xl font-bold mb-6 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'سجل المعاملات المالي' : 'Financial Transactions'}
            </h3>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 font-bold text-lg">
                  {isArabic ? 'لا توجد معاملات مالية سابقة' : 'No transactions yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' : 'border-gray-200 bg-white hover:bg-gray-50'} transition-colors`}>
                    <div>
                      <h5 className="font-bold">{tx.title}</h5>
                      <p className="text-xs text-gray-500 mt-1 font-mono">ID: {tx.id} • {tx.date}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-black text-lg text-red-500" dir="ltr">-{tx.amount}</p>
                      <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded block text-center mt-1">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h3 className={`text-2xl font-bold mb-6 ${isHeritage ? 'font-serif text-[#8D1C1C]' : 'text-blue-600'}`}>
              {isArabic ? 'تواصل مع الدعم الفني' : 'Contact Support'}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{isArabic ? 'عنوان الرسالة' : 'Subject'}</Label>
                <Input 
                  value={supportMessage.subject} 
                  onChange={(e) => setSupportMessage({...supportMessage, subject: e.target.value})} 
                  placeholder={isArabic ? 'مثال: مشكلة في ترقية الباقة' : 'e.g., Issue with upgrade'} 
                  className={inputStyle} 
                />
              </div>
              <div className="space-y-2">
                <Label>{isArabic ? 'تفاصيل المشكلة' : 'Message Details'}</Label>
                <textarea 
                  value={supportMessage.details}
                  onChange={(e) => setSupportMessage({...supportMessage, details: e.target.value})}
                  rows="4" 
                  className={`w-full p-3 resize-none rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 border ${inputStyle}`} 
                  placeholder={isArabic ? 'اكتب تفاصيل مشكلتك هنا...' : 'Write your issue here...'} 
                />
              </div>
              <div className="pt-2">
                <Button onClick={handleSupportSubmit} className={`w-full md:w-auto px-8 h-12 font-bold text-white ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-blue-600'}`}>
                  {isArabic ? 'إرسال الرسالة للدعم' : 'Send to Support'}
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 transition-colors duration-500 ${pageBg}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        
        {/* الكرت العلوي المختصر للمستخدم */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <SaduCard className={`p-6 border-2 flex flex-col md:flex-row items-center text-center md:text-start gap-6 ${cardStyle} ${isHeritage ? 'rounded-none' : 'rounded-3xl'}`}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg flex-shrink-0" style={{ borderColor: themeColors.primary }}>
              <img src={user?.avatar || defaultAvatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'} ${isHeritage ? 'font-serif' : ''}`}>
                {user?.name || (isArabic ? 'مستخدم دروازة' : 'Darwaza User')}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${isHeritage ? 'bg-[#D97706]' : 'bg-blue-500'}`}>
                  {user?.category === 'child' ? (isArabic ? 'طفل' : 'Child') : user?.category === 'senior' ? (isArabic ? 'متقاعد' : 'Senior') : (isArabic ? 'شاب' : 'Youth')}
                </span>
                <span className="text-sm text-gray-500 font-mono">{user?.email}</span>
                <span className="text-sm text-gray-500 font-mono">| {user?.phone || '+965 ********'}</span>
              </div>
            </div>
          </SaduCard>
        </motion.div>

        {/* لوحة التحكم: تقسيم الشاشة */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <motion.div initial={{ opacity: 0, x: isArabic ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-4">
            <SaduCard className={`p-4 border-2 h-full ${cardStyle} ${isHeritage ? 'rounded-none' : 'rounded-3xl'}`}>
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`flex items-center justify-between w-full p-4 font-bold text-lg transition-all duration-300 ${isHeritage ? 'rounded-none' : 'rounded-xl'} ${activeMenu === item.id ? activeMenuBg : inactiveMenuBg}`}
                  >
                    <span className="flex items-center gap-3">
                      {isArabic ? item.label_ar : item.label_en}
                    </span>
                    <item.icon className="w-5 h-5 opacity-80" />
                  </div>
                ))}
                
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4 w-full" />
                
                <div onClick={handleLogout} className={`flex items-center justify-between w-full p-4 font-bold text-lg transition-all duration-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer ${isHeritage ? 'rounded-none' : 'rounded-xl'}`}>
                  <span>{isArabic ? 'تسجيل الخروج' : 'Logout'}</span>
                  <LogOut className="w-5 h-5" />
                </div>
              </div>
            </SaduCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: isArabic ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-8">
            <SaduCard className={`p-6 md:p-8 border-2 min-h-[500px] ${cardStyle} ${isHeritage ? 'rounded-none' : 'rounded-3xl'}`}>
              {renderContent()}
            </SaduCard>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;