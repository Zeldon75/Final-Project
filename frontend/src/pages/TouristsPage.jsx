import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Heart, Camera, Users, MessageCircle, MapPin, Star, 
  Share2, Repeat2, TrendingUp, BookOpen, Map, Newspaper, ExternalLink 
} from 'lucide-react';

const TouristsPage = () => {
  const { isHeritage, darkMode } = useTheme();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [activeTab, setActiveTab] = useState('etiquette');

  // قاعدة بيانات شاملة (10 خيارات لكل قسم) مع الترجمة
  const content = {
    etiquette: [
      { ar: { title: "الديوانية", desc: "المجلس المخصص للرجال للتباحث في أمور الحياة، وهي ركيزة اجتماعية كويتية.", type: "عادات" }, en: { title: "Diwaniya", desc: "Social gathering place for men to discuss life affairs, a pillar of Kuwaiti society.", type: "Customs" }, icon: "🏠" },
      { ar: { title: "صب القهوة", desc: "تُمسك الدلة باليد اليسرى والفناجين باليمنى، ويُبدأ دائماً بالضيف الأكبر.", type: "بروتوكول" }, en: { title: "Serving Coffee", desc: "Hold Dallah in left hand and cups in right, starting with the eldest guest.", type: "Protocol" }, icon: "☕" },
      { ar: { title: "حق الجار", desc: "مبدأ كويتي يشدد على رعاية الجار ومشاركته الأفراح والأحزان كأنه فرد من العائلة.", type: "عادات" }, en: { title: "Neighbor's Rights", desc: "An authentic principle emphasizing the care for neighbors as family members.", type: "Customs" }, icon: "🏘️" },
      { ar: { title: "النقصة", desc: "عادة إرسال جزء من طعام البيت للجيران أو الأهل لتقوية الروابط.", type: "كلمات" }, en: { title: "Nuqsa", desc: "The tradition of sharing home-cooked food with neighbors to strengthen ties.", type: "Terms" }, icon: "🍲" },
      { ar: { title: "التوجيب", desc: "الالتزام بحضور المناسبات الاجتماعية للآخرين رداً للجميل ومشاركتهم.", type: "كلمات" }, en: { title: "Tawjeeb", desc: "Social obligation of attending events as a gesture of respect and solidarity.", type: "Terms" }, icon: "📜" },
      { ar: { title: "الغبقة", desc: "عشاء رمضاني يقام بين الفطور والسحور يجمع الأهل والأصدقاء.", type: "عادات" }, en: { title: "Ghabqa", desc: "A traditional Ramadan dinner held between Iftar and Suhoor.", type: "Customs" }, icon: "🌙" },
      { ar: { title: "رد التحية", desc: "المصافحة مع وضع اليد على الصدر تعبيراً عن التقدير الشديد.", type: "أقوال" }, en: { title: "Greeting", desc: "Handshake with hand on chest as a sign of deep respect.", type: "Sayings" }, icon: "🤝" },
      { ar: { title: "البخور والطيب", desc: "تقديم البخور للضيوف عند الرحيل هو لمسة كرم ختامية لا غنى عنها.", type: "عادات" }, en: { title: "Incense", desc: "Offering Bukhoor to guests before departure as a gesture of hospitality.", type: "Customs" }, icon: "💨" },
      { ar: { title: "حياك الله", desc: "كلمة الترحيب الأساسية وتعني أنك في بيتك وبين أهلك.", type: "أقوال" }, en: { title: "Hayak Allah", desc: "Traditional welcome meaning 'May God give you life' and 'Welcome home'.", type: "Sayings" }, icon: "✨" },
      { ar: { title: "احترام الكبير", desc: "في المجالس، لا يُبدأ بالحديث أو الأكل قبل كبار السن تقديراً لهم.", type: "معلومات" }, en: { title: "Respect Elders", desc: "Elders are given priority in speaking and dining as a sign of respect.", type: "Info" }, icon: "👵" }
    ],
    landmarks: [
      { ar: { name: "أبراج الكويت", desc: "رمز الكويت الأهم، توفر إطلالة بانورامية ساحرة.", review: "إطلالة لا تُنسى!" }, en: { name: "Kuwait Towers", desc: "The iconic symbol of Kuwait with panoramic views.", review: "An unforgettable view!" }, rating: 4.8, link: "https://goo.gl/maps/3fL6X", img: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=600" },
      { ar: { name: "سوق المباركية", desc: "سوق تراثي يفوح بعبق الماضي بمنتجات تقليدية.", review: "روح الكويت هنا." }, en: { name: "Souq Mubarakiya", desc: "Traditional market filled with history and authentic products.", review: "The soul of Kuwait." }, rating: 4.9, link: "https://goo.gl/maps/8Gf9", img: "https://images.unsplash.com/photo-1628151574041-94943f5509a9?q=80&w=600" },
      { ar: { name: "مركز جابر الثقافي", desc: "تحفة معمارية يلقب بدار الأوبرا الكويتية.", review: "تصميم هندسي مبهر." }, en: { name: "JACC", desc: "An architectural masterpiece also known as Kuwait Opera House.", review: "Stunning architecture." }, rating: 4.7, link: "https://goo.gl/maps/5Zq1", img: "https://images.unsplash.com/photo-1549413550-93237190cc1b?q=80&w=600" },
      { ar: { name: "المسجد الكبير", desc: "صرح إسلامي عظيم يتميز بنقوشه الأندلسية.", review: "جمال وهدوء." }, en: { name: "Grand Mosque", desc: "A magnificent Islamic landmark with Andalusian designs.", review: "Peace and beauty." }, rating: 4.8, link: "https://goo.gl/maps/4Wp3", img: "https://images.unsplash.com/photo-1564769625905-50e9ad63ee9c?q=80&w=600" },
      { ar: { name: "مجمع الأفنيوز", desc: "أكبر مركز تسوق في الكويت بتصاميم مذهلة.", review: "جنة التسوق." }, en: { name: "The Avenues", desc: "The largest shopping mall in Kuwait with unique zones.", review: "Shopping paradise." }, rating: 4.9, link: "https://goo.gl/maps/7Xy2", img: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600" },
      { ar: { name: "حديقة الشهيد", desc: "أكبر حديقة حضرية تضم متاحف ومساحات خضراء.", review: "أفضل مكان للمشي." }, en: { name: "Al Shaheed Park", desc: "The largest urban park with museums and greenery.", review: "Best place for walking." }, rating: 4.9, link: "https://goo.gl/maps/1Qp7", img: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?q=80&w=600" },
      { ar: { name: "برج الحمراء", desc: "أطول برج خرساني بتصميم لولبي فريد.", review: "منظر المدينة رائع." }, en: { name: "Al Hamra Tower", desc: "Tallest concrete skyscraper with a unique spiral design.", review: "Amazing city view." }, rating: 4.5, link: "https://goo.gl/maps/9Xp5", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600" },
      { ar: { name: "المركز العلمي", desc: "يضم الأكواريوم وقاعة الاستكشاف للعائلات.", review: "ممتع للأطفال." }, en: { name: "Scientific Center", desc: "Features an aquarium and discovery place for families.", review: "Great for kids." }, rating: 4.6, link: "https://goo.gl/maps/2Lp8", img: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=600" },
      { ar: { name: "جزيرة فيلكا", desc: "تمزج بين التاريخ القديم والهدوء البحري.", review: "رحلة تاريخية." }, en: { name: "Failaka Island", desc: "Blends ancient history with marine tranquility.", review: "A historical trip." }, rating: 4.2, link: "https://goo.gl/maps/6Op6", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600" },
      { ar: { name: "قرية كوت", desc: "إطلالات بحرية مع مطاعم حديثة وجلسات راقية.", review: "مكان هادئ وجميل." }, en: { name: "Al Kout", desc: "Marine views with modern restaurants and elegant seating.", review: "Quiet and beautiful." }, rating: 4.4, link: "https://goo.gl/maps/0Kp9", img: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=600" }
    ],
    social: [
      { user: "وزارة الإعلام", handle: "@KuwaitNews", ar: "رسمياً: إطلاق منصة 'دروازة' الرقمية لتعزيز السياحة الداخلية وإحياء التراث.", en: "Official: Launching 'Darwaza' platform to promote tourism and revive heritage.", likes: "24K", shares: "12K", time: "5m" },
      { user: "الأرصاد", handle: "@WeatherKW", ar: "أجواء مثالية للـ 'كشتة' هذا المساء.. درجة الحرارة المتوقعة 22 مئوية.", en: "Perfect weather for 'Kashta' tonight.. Expected temperature is 22°C.", likes: "18K", shares: "4K", time: "42m" },
      { user: "فعاليات الكويت", handle: "@KW_Events", ar: "ازدحام كبير في سوق المباركية الليلة تزامناً مع مهرجان التراث الشعبي.", en: "Big crowds at Mubarakiya tonight during the Folklore Festival.", likes: "15K", shares: "2K", time: "1h" }
    ]
  };

  // الأنماط (تراثي vs عصري)
  const s = isHeritage ? {
    container: darkMode ? "bg-[#2C1E12]" : "bg-[#F4ECE2]",
    card: darkMode ? "bg-[#3D2B1F] border-[#8B4513]/50" : "bg-[#FDF5E6] border-[#D2B48C]",
    accent: "text-[#8B4513]",
    button: "bg-[#8B4513] text-[#FDF5E6] rounded-none",
    tabActive: "bg-[#8B4513] text-white",
    font: "font-serif"
  } : {
    container: darkMode ? "bg-[#0F1419]" : "bg-[#F8F9FA]",
    card: darkMode ? "bg-[#16181C] border-gray-800" : "bg-white border-gray-100",
    accent: "text-[#1D9BF0]",
    button: "bg-[#1D9BF0] text-white rounded-2xl",
    tabActive: "bg-[#1D9BF0] text-white shadow-lg",
    font: "font-sans"
  };

  return (
    <div className={`min-h-screen pb-20 transition-all duration-500 ${s.container} ${s.font}`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <h1 className={`text-6xl font-black mb-4 ${s.accent}`}>
            {isArabic ? 'بوابة الكويت' : 'Kuwait Gateway'}
          </h1>
          <p className="opacity-60 text-xl">{isArabic ? 'استكشف المعالم والآداب والترند' : 'Explore Landmarks, Etiquette & Trends'}</p>
        </motion.div>

        {/* Navigation - التبويبات */}
        <div className={`flex justify-center gap-1 mb-16 p-2 rounded-3xl ${darkMode ? 'bg-black/20' : 'bg-gray-200/50'} sticky top-6 z-50 backdrop-blur-md`}>
          {[
            { id: 'etiquette', ar: 'الآداب', en: 'Etiquette', icon: <BookOpen size={20}/> },
            { id: 'landmarks', ar: 'المعالم', en: 'Landmarks', icon: <Map size={20}/> },
            { id: 'social', ar: 'الاجتماعية', en: 'Social', icon: <Newspaper size={20}/> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-10 py-4 transition-all duration-300 font-bold ${isHeritage ? 'rounded-none' : 'rounded-2xl'} ${
                activeTab === tab.id ? s.tabActive : 'opacity-40 hover:opacity-100'
              }`}
            >
              {tab.icon} {isArabic ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* محتوى الآداب */}
          {activeTab === 'etiquette' && (
            <motion.div key="et" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.etiquette.map((item, i) => (
                <div key={i} className={`${s.card} p-8 border-2 shadow-sm relative group`}>
                  <div className="flex gap-6 items-start">
                    <div className="text-5xl bg-gray-500/5 p-4 rounded-xl">{item.icon}</div>
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${s.accent}`}>{isArabic ? item.ar.type : item.en.type}</span>
                      <h3 className="text-2xl font-black mt-1 mb-3">{isArabic ? item.ar.title : item.en.title}</h3>
                      <p className="opacity-70 text-lg leading-relaxed">{isArabic ? item.ar.desc : item.en.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* محتوى المعالم */}
          {activeTab === 'landmarks' && (
            <motion.div key="lm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {content.landmarks.map((place, i) => (
                <div key={i} className={`${s.card} rounded-none border shadow-2xl flex flex-col overflow-hidden`}>
                  <div className="h-72 relative overflow-hidden">
                    <img src={place.img} alt="landmark" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                    <div className="absolute bottom-0 right-0 p-4 bg-white dark:bg-black font-black flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" fill="currentColor"/> {place.rating}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-3xl font-black mb-4">{isArabic ? place.ar.name : place.en.name}</h3>
                    <p className="opacity-70 text-lg mb-6 leading-relaxed">{isArabic ? place.ar.desc : place.en.desc}</p>
                    <div className="border-l-4 border-gray-400 pl-4 italic mb-8 opacity-60">"{isArabic ? place.ar.review : place.en.review}"</div>
                    <a href={place.link} target="_blank" rel="noreferrer" className={`flex items-center justify-center gap-3 py-4 font-bold transition-transform active:scale-95 ${s.button}`}>
                      <MapPin size={20} /> {isArabic ? 'خرائط جوجل' : 'Google Maps'} <ExternalLink size={16}/>
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* محتوى الاجتماعية (نمط X) */}
          {activeTab === 'social' && (
            <motion.div key="soc" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-px">
              {content.social.map((post, i) => (
                <div key={i} className={`${s.card} p-6 border-b hover:bg-gray-500/5 transition-all`}>
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 ${isHeritage ? 'rounded-none rotate-2' : 'rounded-full'} bg-gradient-to-br from-blue-400 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-black`}>{post.user[0]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-black">{post.user}</span>
                        <span className="opacity-40 text-sm">{post.handle} · {post.time}</span>
                      </div>
                      <p className="text-xl leading-relaxed mb-4">{isArabic ? post.ar : post.en}</p>
                      <div className="flex justify-between opacity-50 max-w-sm">
                        <button className="flex items-center gap-2"><MessageCircle size={18}/> 42</button>
                        <button className="flex items-center gap-2"><Repeat2 size={18}/> {post.shares}</button>
                        <button className="flex items-center gap-2 text-pink-500"><Heart size={18} fill="currentColor"/> {post.likes}</button>
                        <Share2 size={18}/>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TouristsPage;