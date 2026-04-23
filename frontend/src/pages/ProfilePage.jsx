import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  User, Camera, CreditCard, Receipt, HeadphonesIcon, 
  Save, CheckCircle2, Phone, Mail
} from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { isHeritage, darkMode } = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState('account');
  
  // 1. استدعاء البيانات المحفوظة من ذاكرة المتصفح (وإلا استخدام الافتراضية)
  const [savedData, setSavedData] = useState(() => {
    const localData = localStorage.getItem('darwaza_profile_data');
    return localData ? JSON.parse(localData) : {
      name: user?.name || (isArabic ? 'ناصر الخالدي' : 'Nasser Al-Khaldi'),
      email: user?.email || 'user@darwaza.com',
      phone: '+965 99000000'
    };
  });

  // 2. البيانات المؤقتة لنموذج التعديل
  const [formData, setFormData] = useState(savedData);

  // 3. استدعاء الصورة المحفوظة في ذاكرة المتصفح
  const [avatarPreview, setAvatarPreview] = useState(() => {
    return localStorage.getItem('darwaza_profile_avatar') || user?.picture || null;
  });

  // تحديث البيانات في ذاكرة المتصفح عند ضغط زر الحفظ
  const handleSave = () => {
    setSavedData({ ...formData });
    localStorage.setItem('darwaza_profile_data', JSON.stringify(formData));
    toast.success(isArabic ? 'تم حفظ التعديلات بنجاح!' : 'Changes saved successfully!');
  };

  // قراءة الصورة وتحويلها لـ Base64 لحفظها في الذاكرة الدائمة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatarPreview(base64String);
        localStorage.setItem('darwaza_profile_avatar', base64String);
        toast.success(isArabic ? 'تم حفظ الصورة بنجاح!' : 'Avatar saved successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // قاموس الترجمة
  const content = {
    tabs: [
      { id: 'account', ar: 'معلومات الحساب', en: 'Account Info', icon: <User size={20}/> },
      { id: 'avatar', ar: 'تغيير الصورة العرض', en: 'Change Avatar', icon: <Camera size={20}/> },
      { id: 'subscription', ar: 'نوع الاشتراك', en: 'Subscription', icon: <CreditCard size={20}/> },
      { id: 'transactions', ar: 'فهرس المعاملات', en: 'Transactions', icon: <Receipt size={20}/> },
      { id: 'support', ar: 'تواصل مع الخدمة', en: 'Support', icon: <HeadphonesIcon size={20}/> },
    ],
    account: {
      title: { ar: 'البيانات الشخصية', en: 'Personal Information' },
      name: { ar: 'الاسم الكامل', en: 'Full Name' },
      email: { ar: 'البريد الإلكتروني', en: 'Email Address' },
      phone: { ar: 'رقم الهاتف', en: 'Phone Number' },
      save: { ar: 'حفظ التعديلات', en: 'Save Changes' }
    },
    avatar: {
      title: { ar: 'صورة العرض', en: 'Profile Picture' },
      desc: { ar: 'اختر صورة تعبر عنك لملفك الشخصي', en: 'Choose an image that represents you' },
      upload: { ar: 'اضغط هنا لاختيار صورة', en: 'Click here to select image' }
    },
    subscription: {
      title: { ar: 'الباقة الحالية', en: 'Current Plan' },
      plan: { ar: 'باقة النخبة (Premium)', en: 'Premium Plan' },
      status: { ar: 'نشط', en: 'Active' },
    },
    transactions: {
      title: { ar: 'سجل العمليات', en: 'Transactions History' },
      table: [
        { id: '#1029', date: '2026-04-10', amount: '15 KD', status: { ar: 'مكتمل', en: 'Completed' } },
        { id: '#1015', date: '2026-03-10', amount: '15 KD', status: { ar: 'مكتمل', en: 'Completed' } },
      ]
    },
    support: {
      title: { ar: 'كيف يمكننا مساعدتك؟', en: 'How can we help you?' },
      message: { ar: 'اكتب رسالتك هنا...', en: 'Type your message here...' },
      send: { ar: 'إرسال الطلب', en: 'Send Request' }
    }
  };

  // الأنماط (فصل جذري بين التراثي والعصري والداكن والفاتح)
  const s = isHeritage ? {
    // 🐪 النمط التراثي (Heritage)
    bg: darkMode ? "bg-[#1A1A1A]" : "bg-[#F4ECE2]",
    card: darkMode ? "bg-[#2C1E12] border-[#8D1C1C]/50" : "bg-[#FDF5E6] border-[#8D1C1C]",
    accent: "text-[#8D1C1C]",
    btnActive: "bg-[#8D1C1C] text-white rounded-none border border-[#FDF5E6] relative overflow-hidden",
    btnHover: "hover:bg-[#6D1515]",
    input: darkMode ? "bg-[#1A1A1A] border-[#8D1C1C] text-[#FDF6E3] rounded-none" : "bg-[#F4ECE2] border-[#8D1C1C] rounded-none",
    font: "font-serif",
    corners: "rounded-none",
    pattern: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }
  } : {
    // 🚀 النمط العصري (Modern)
    bg: darkMode ? "bg-[#020617]" : "bg-[#F8FAFC]",
    card: darkMode ? "bg-[#0F172A]/80 backdrop-blur-2xl border-white/10" : "bg-white/90 backdrop-blur-2xl border-blue-100",
    accent: "text-blue-500",
    btnActive: darkMode 
      ? "bg-blue-600 text-white rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-blue-400/50" 
      : "bg-blue-600 text-white rounded-2xl shadow-[0_10px_25px_rgba(37,99,235,0.4)]",
    btnHover: "hover:bg-blue-700",
    input: darkMode ? "bg-[#1E293B] border-slate-700 text-white rounded-xl" : "bg-slate-50 border-slate-200 rounded-xl",
    font: "font-sans",
    corners: "rounded-3xl",
    pattern: {}
  };

  return (
    <div className={`min-h-screen py-12 ${s.bg} ${s.font} transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        
        {/* القائمة الجانبية (Sidebar) */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <div className={`${s.card} p-6 border-2 text-center shadow-lg ${s.corners} transition-all duration-300`}>
            <div className={`w-28 h-28 mx-auto rounded-full mb-4 flex items-center justify-center overflow-hidden border-4 ${isHeritage ? 'border-[#8D1C1C]' : 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User size={50} className={`${s.accent} opacity-50`} />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-1">{savedData.name}</h2>
            <p className="text-sm opacity-60">{savedData.email}</p>
          </div>

          <div className={`${s.card} p-4 border-2 shadow-lg flex flex-col gap-2 ${s.corners} transition-all duration-300`}>
            {content.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full p-4 font-bold transition-all ${
                  activeTab === tab.id ? s.btnActive : `hover:bg-gray-500/10 opacity-70 ${s.corners}`
                }`}
                style={activeTab === tab.id ? s.pattern : {}}
              >
                {tab.icon} {tab[language]}
              </button>
            ))}
          </div>
        </div>

        {/* منطقة المحتوى (Content Area) */}
        <div className={`w-full md:w-3/4 ${s.card} border-2 p-8 shadow-xl min-h-[500px] ${s.corners} transition-all duration-300`}>
          <AnimatePresence mode="wait">
            
            {/* 1. معلومات الحساب */}
            {activeTab === 'account' && (
              <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className={`text-3xl font-bold mb-8 flex items-center gap-3 ${s.accent}`}>
                  <User size={30} /> {content.account.title[language]}
                </h2>
                <div className="space-y-6 max-w-xl">
                  <div>
                    <Label className="mb-2 block text-lg">{content.account.name[language]}</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`h-14 text-lg ${s.input} transition-colors`} 
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-lg">{content.account.email[language]}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`h-14 text-lg ps-10 ${s.input} transition-colors`} 
                        type="email"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block text-lg">{content.account.phone[language]}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={`h-14 text-lg ps-10 text-left ${s.input} transition-colors`} dir="ltr"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSave} className={`h-14 px-8 text-lg mt-4 ${s.btnActive} ${s.btnHover}`} style={s.pattern}>
                    <Save className="mr-2" /> {content.account.save[language]}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 2. تغيير الصورة العرض */}
            {activeTab === 'avatar' && (
              <motion.div key="avatar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-10">
                <h2 className={`text-3xl font-bold mb-4 ${s.accent}`}>{content.avatar.title[language]}</h2>
                <p className="opacity-60 mb-10">{content.avatar.desc[language]}</p>
                
                <div className={`w-56 h-56 mx-auto rounded-full mb-8 border-4 border-dashed ${isHeritage ? 'border-[#8D1C1C]' : 'border-blue-400'} flex items-center justify-center relative group overflow-hidden bg-black/5`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={60} className="text-gray-400 group-hover:scale-110 transition-transform" />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold text-lg px-4 text-center">{content.avatar.upload[language]}</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                </div>
              </motion.div>
            )}

            {/* 3. نوع الاشتراك */}
            {activeTab === 'subscription' && (
              <motion.div key="sub" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className={`text-3xl font-bold mb-8 ${s.accent}`}>{content.subscription.title[language]}</h2>
                <div className={`p-8 border-2 flex items-center justify-between ${isHeritage ? 'bg-[#8D1C1C]/10 border-[#8D1C1C] rounded-none' : 'bg-blue-500/10 border-blue-500 rounded-3xl shadow-[0_0_20px_rgba(59,130,246,0.15)]'}`}>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{content.subscription.plan[language]}</h3>
                    <p className="flex items-center gap-2 text-green-500 font-bold text-lg"><CheckCircle2 size={20}/> {content.subscription.status[language]}</p>
                  </div>
                  <CreditCard size={70} className={s.accent} opacity={0.6} />
                </div>
              </motion.div>
            )}

            {/* 4. فهرس المعاملات */}
            {activeTab === 'transactions' && (
              <motion.div key="trans" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className={`text-3xl font-bold mb-8 ${s.accent}`}>{content.transactions.title[language]}</h2>
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full text-left border-collapse">
                    <thead className={darkMode ? 'bg-white/5' : 'bg-black/5'}>
                      <tr>
                        <th className="p-5 font-bold">ID</th>
                        <th className="p-5 font-bold">Date</th>
                        <th className="p-5 font-bold">Amount</th>
                        <th className="p-5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.transactions.table.map((row, i) => (
                        <tr key={i} className="border-t border-gray-200 dark:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="p-5 font-mono font-bold">{row.id}</td>
                          <td className="p-5">{row.date}</td>
                          <td className="p-5 font-bold">{row.amount}</td>
                          <td className="p-5 text-green-500 font-bold flex items-center gap-2"><CheckCircle2 size={16}/> {row.status[language]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 5. تواصل مع الخدمة */}
            {activeTab === 'support' && (
              <motion.div key="supp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className={`text-3xl font-bold mb-8 ${s.accent}`}>{content.support.title[language]}</h2>
                <div className="space-y-6 max-w-2xl">
                  <textarea 
                    className={`w-full h-48 p-5 text-lg resize-none focus:outline-none transition-all ${s.input}`}
                    placeholder={content.support.message[language]}
                  ></textarea>
                  <Button onClick={() => toast.success(isArabic ? 'تم الإرسال بنجاح!' : 'Sent successfully!')} className={`h-14 px-10 text-lg ${s.btnActive} ${s.btnHover}`} style={s.pattern}>
                    {content.support.send[language]}
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;