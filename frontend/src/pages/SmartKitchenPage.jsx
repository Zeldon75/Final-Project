import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { 
  ChefHat, ArrowRight, ShoppingCart, Timer, Flame, Search, PlayCircle, ListChecks, Info, CheckCircle2
} from 'lucide-react';

// 📸 استيراد الصور الأصلية من مجلد assets مباشرة
import imgMachboos from '../assets/machboos.jpg';
import imgZubaidi from '../assets/zubaidi.jpg';
import imgHarees from '../assets/harees.jpg';
import imgQers from '../assets/qers.jpg';
import imgTashreeb from '../assets/tashreeb.jpg';
import imgMurabyan from '../assets/murabyan.jpg';

const SmartKitchenPage = () => {
  const { isHeritage, darkMode } = useTheme();
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // قاعدة البيانات مع الصور الجديدة وفيديوهات اليوتيوب
  const recipes = [
    {
      id: 'machboos-dijay',
      title: 'مجبوس دجاج كويتي',
      category: 'رئيسي',
      image: imgMachboos, 
      youtubeId: 'yIfiwiWzxl0',
      time: '90 دقيقة',
      difficulty: 'متوسط',
      localProducts: [
        { name: 'دجاج طازج', brand: 'دجاج نايف / المتحدة', icon: '🍗' },
        { name: 'أرز بسمتي', brand: 'مطاحن الدقيق والمخابز الكويتية', icon: '🍚' },
        { name: 'بهارات كويتية', brand: 'بهارات مجدي', icon: '🧂' }
      ],
      ingredients: [
        'دجاجة كاملة (مقطعة أنصاف ومغسولة بالخل)',
        '3 أكواب أرز بسمتي (منقوع ومغسول)',
        'بصل مفروم، ثوم، وزنجبيل مبشور',
        'بهارات صحيحة للسلق (هيل، مسمار، دارسين، ورق غار، لومي)',
        'بهارات مطحونة (كركم، فلفل أسود، كزبرة، بهار مشكل)',
        'منقوع الزعفران مع ماء الورد',
        'للحشو: بصل مفروم، نخي (حمص مجروش مسلوق)، كشمش (زبيب)'
      ],
      steps: [
        'اغسل الدجاجة جيداً واغليها في قدر مع ماء ساخن والبهارات الصحيحة وبصلة مقطعة لمدة 40 دقيقة لتتكون خلاصة المرق.',
        'ارفع الدجاج من المرق، ادهنه بمنقوع الزعفران بماء الورد ورشة هيل، وحمره في الفرن ليتخذ اللون الذهبي.',
        'لتجهيز الحشو: احمس البصل المفروم في مقلاة بدون زيت مع رشات ماء كلما التصق، حتى يذبل ويصبح لونه بنياً. أضف الزيت والنخي والكشمش والبهارات المطحونة.',
        'صفِّ مرق الدجاج من البهارات الصحيحة، وأضف إليه الأرز. اتركه على نار عالية حتى ينشف الماء وتظهر ثقوب على سطح الأرز.',
        'خفف النار جداً، غط القدر بإحكام واترك الأرز (يتسكر) لمدة 20 دقيقة.',
        'اسكب الأرز في طبق التقديم وزينه بالدجاج المحمر وحشو البصل. وبالعافية!'
      ]
    },
    {
      id: 'mutabbaq-zubaidi',
      title: 'مطبق زبيدي',
      category: 'بحري',
      image: imgZubaidi, 
      youtubeId: 'ZeJJJAaCRl0',
      time: '60 دقيقة',
      difficulty: 'متوسط',
      localProducts: [
        { name: 'سمك زبيدي', brand: 'سوق شرق للأسماك', icon: '🐟' },
        { name: 'أرز تموين', brand: 'مطاحن الدقيق الكويتية', icon: '🍚' },
        { name: 'لومي أسود', brand: 'بهارات مجدي', icon: '🍋' }
      ],
      ingredients: [
        'سمك زبيدي طازج منظف',
        'أرز بسمتي مغسول ومنقوع',
        'بصل مفروم ناعم',
        'ثوم وزنجبيل مهروس',
        'كزبرة طازجة مفرومة',
        'كركم، لومي أسود ناعم، ملح',
        'بهارات سمك مشكلة'
      ],
      steps: [
        'نظف سمك الزبيدي واعمل شقوقاً خفيفة على الجانبين. تبله من الداخل والخارج بالكركم، اللومي الأسود الناعم، الملح، الثوم، وبهارات السمك. اتركه لـ 30 دقيقة.',
        'سخن زيتاً غزيراً في مقلاة كبيرة، واقل السمك حتى يتحمر ويصبح مقرمشاً من الجانبين، ثم ارفعه.',
        'في قدر آخر، استخدم القليل من زيت قلى السمك لحمس البصل المفروم مع الثوم والزنجبيل.',
        'أضف الكزبرة الطازجة، حبات اللومي الصحاح، ثم أضف الماء المغلي والملح، والأرز.',
        'عندما يقل منسوب الماء في القدر، ضع سمك الزبيدي المقلي برفق فوق الأرز.',
        'غط القدر بإحكام واترك الأرز على نار هادئة جداً (يتسكر) لمدة 20 دقيقة. يقدم مع الدقوس الكويتي الحار والمعبوج.'
      ]
    },
    {
      id: 'harees',
      title: 'هريس كويتي أصيل',
      category: 'شعبي',
      image: imgHarees, 
      youtubeId: '7vVpZwj5tYg',
      time: '3 ساعات',
      difficulty: 'صعب',
      localProducts: [
        { name: 'حب الهريس', brand: 'مطاحن الدقيق', icon: '🌾' },
        { name: 'لحم بدون عظم', brand: 'الملاحم المحلية', icon: '🥩' },
        { name: 'سمن بلدي', brand: 'الشركة الكويتية للألبان', icon: '🧈' }
      ],
      ingredients: [
        'كيلو حب هريس كويتي (مغسول ومنقوع ليلة كاملة)',
        'كيلو لحم عجل أو غنم (هبرة خالية من العظم والدهن)',
        'ماء ساخن للسلق',
        'ملح (يُضاف في النهاية ويُضرب)',
        'للتقديم: سمن بلدي مذاب ودارسين (قرفة) مطحون'
      ],
      steps: [
        'في قدر كبير جداً، ضع قطع اللحم واغمرها بالماء الساخن. اغل اللحم وقم بإزالة الرغوة (الزفرة) كلما ظهرت حتى ينظف المرق تماماً.',
        'صف حب الهريس من ماء النقع وأضفه إلى قدر اللحم.',
        'اترك المزيج يغلي على نار هادئة جداً لعدة ساعات (2-3 ساعات) مع التقليب من حين لآخر لكي لا يلتصق بقاع القدر.',
        'بعد أن يذوب اللحم وتتفتح حبات الهريس تماماً، أضف الملح وارفع القدر عن النار.',
        'استخدم "المضرابة" الخشبية الكويتية التقليدية (أو خلاط كهربائي قوي) لضرب المزيج بقوة حتى تتداخل الألياف ويصبح الخليط ناعماً ومطاطياً.',
        'اسكب الهريس الساخن في أطباق تقديم، سو السطح، واعمل حفرة في المنتصف. صب السمن البلدي بسخاء وزينه بخطوط من الدارسين.'
      ]
    },
    {
      id: 'qers-oqaily',
      title: 'قرص عقيلي',
      category: 'حلويات',
      image: imgQers, 
      youtubeId: 'UjxijDxYUWk',
      time: '60 دقيقة',
      difficulty: 'سهل',
      localProducts: [
        { name: 'طحين أبيض', brand: 'مطاحن الدقيق', icon: '🌾' },
        { name: 'حليب', brand: 'KDD (كي دي دي)', icon: '🥛' },
        { name: 'زعفران أصلي', brand: 'الجمعيات التعاونية', icon: '🌸' }
      ],
      ingredients: [
        'كوب ونصف طحين أبيض منخول',
        '4 حبات بيض (بحرارة الغرفة)',
        'كوب سكر أبيض',
        'نصف كوب زيت',
        'ملعقة كبيرة هيل مطحون وفانيليا',
        'ملعقة كبيرة بيكنج باودر',
        'زعفران منقوع في ربع كوب ماء ورد وملعقتي حليب KDD',
        'سمسم محمص بكمية وفيرة لتبطين القالب'
      ],
      steps: [
        'انقع كمية جيدة من الزعفران في ماء الورد والحليب الساخن واتركه 15 دقيقة ليخرج لونه ورائحته.',
        'في وعاء الخلط، اخفق البيض مع السكر والفانيليا والهيل بسرعة عالية لمدة 5 دقائق حتى يصبح المزيج فاتحاً وكثيفاً.',
        'أضف الطحين والبيكنج باودر تدريجياً، ثم أضف الزيت وخليط الزعفران. قلب المزيج برفق بملعقة خشبية (سباتولا).',
        'دهن قالب الكيك (المفرغ من المنتصف) بالزيت أو الطحينة، ورشه بكثافة بالسمسم المحمص ليغطي كافة الجوانب.',
        'اسكب خليط الكيك في القالب واخبزه في فرن مسخن مسبقاً على حرارة 180 درجة لمدة 40 دقيقة.',
        'اتركه يبرد قليلاً ثم اقلبه. قدمه مع استكانة شاي مهيل كويتي!'
      ]
    },
    {
      id: 'tashreeb',
      title: 'تشريبة لحم',
      category: 'شعبي',
      image: imgTashreeb, 
      youtubeId: 'AOhiNeZ-CFk',
      time: '90 دقيقة',
      difficulty: 'متوسط',
      localProducts: [
        { name: 'خبز رقاق', brand: 'مطاحن الدقيق', icon: '🫓' },
        { name: 'لحم غنم بالعظم', brand: 'الملاحم المحلية', icon: '🥩' },
        { name: 'خضار مشكلة', brand: 'مزارع العبدلي', icon: '🥕' }
      ],
      ingredients: [
        'لحم غنم قطع متوسطة بالعظم',
        'خبز رقاق كويتي خفيف',
        'بصل مفروم وثوم مهروس',
        'معجون طماطم وحبتين طماطم معصورة',
        'بهارات مشكلة، لومي أسود جاف صحاح',
        'خضار (بطاطس، قرع، كوسا، جزر مقطعة قطعاً كبيرة)'
      ],
      steps: [
        'في قدر واسع، احمس قطع اللحم مع البصل المفروم والبهارات الكويتية لتغلق مسام اللحم.',
        'أضف الثوم المفروم، معجون الطماطم، والطماطم المعصورة، وقلب الخليط حتى يتسبك وتتصاعد الرائحة.',
        'أضف الماء المغلي حتى يغمر اللحم، وضع حبات اللومي الأسود (بعد ثقبها). اترك المرق يغلي لـ 45 دقيقة.',
        'أضف الخضار المقطعة قطعاً كبيرة مع الملح، واتركها تطبخ لـ 20 دقيقة إضافية حتى تنضج تماماً.',
        'في طبق عميق (بادية)، قم بتكسير خبز الرقاق.',
        'اسكب المرق الساخن جداً فوق الخبز ليذبل (التشريب)، ثم رتب قطع اللحم والخضار فوق الخبز وقدمه كطبق رئيسي.'
      ]
    },
    {
      id: 'murabyan',
      title: 'مربين (مجبوس ربيان)',
      category: 'بحري',
      image: imgMurabyan, 
      youtubeId: '5KScQY6Q_Mo',
      time: '50 دقيقة',
      difficulty: 'متوسط',
      localProducts: [
        { name: 'ربيان طازج', brand: 'سوق السمك - المباركية', icon: '🦐' },
        { name: 'كزبرة وشبنت', brand: 'مزارع الوفرة', icon: '🌿' },
        { name: 'معجون طماطم', brand: 'KDD (كي دي دي)', icon: '🍅' }
      ],
      ingredients: [
        'كيلو ربيان كويتي منظف ومقشر',
        '3 أكواب أرز بسمتي مغسول ومنقوع',
        'كمية وفيرة جداً من الكزبرة والشبنت الطازج المفروم',
        'بصل مفروم، ثوم، وزنجبيل',
        'معجون طماطم KDD وطماطم مبشورة',
        'بهارات مشكلة، كركم، ولومي أسود ناعم'
      ],
      steps: [
        'اسلق الربيان في ماء به قليل من الكركم والدارسين لمدة 3 دقائق فقط لإزالة الزفرة، ثم صفه من الماء واتركه جانباً.',
        'في قدر واسع، احمس البصل المفروم مع الثوم والزنجبيل، ثم أضف الربيان المسلوق وقلبه مع البهارات واللومي المطحون.',
        'أضف الكزبرة والشبنت الطازج (وهما السر في نكهة المربين الأصيلة)، ثم أضف معجون الطماطم والطماطم المبشورة وقلب المزيج حتى يتسبك.',
        'نصيحة: ارفع ثلث كمية الخلطة جانباً لتستخدمها كحشو يُزين به الطبق النهائي.',
        'أضف الماء المغلي إلى القدر، ثم أضف الأرز. اتركه يغلي حتى ينشف الماء.',
        'خفف النار واترك القدر يتسكر 20 دقيقة. قدم الأرز وزينه بخلطة الربيان الشهية التي رفعناها جانباً.'
      ]
    }
  ];

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-[#1A1A1A] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس الصفحة */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 relative">
          <Button onClick={() => navigate('/cooking')} variant="outline" className="absolute right-0 top-0 gap-2 border-pink-500 text-pink-500 hover:bg-pink-50">
            <ArrowRight size={20} /> العودة لركن الطبخ
          </Button>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-500 text-white mb-4 shadow-lg">
            <ChefHat size={40} />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>مطبخ دروازة الذكي</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            مكتبتك الشاملة للمطبخ الكويتي. اختر الطبخة، شاهد الشرح بالفيديو، واقرأ الخطوات والمقادير!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedRecipe ? (
            /* شاشة اختيار الأطباق */
            <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
              <div className="max-w-xl mx-auto mb-10 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ابحث عن أكلة كويتية..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className={`w-full pl-4 pr-12 py-4 rounded-full border-2 focus:outline-none focus:border-pink-500 ${darkMode ? 'bg-[#2A2A2A] border-gray-700 text-white' : 'bg-white border-gray-200'}`} 
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe) => (
                  <div 
                    key={recipe.id} 
                    onClick={() => setSelectedRecipe(recipe)} 
                    className={`cursor-pointer rounded-2xl overflow-hidden transition-all transform hover:-translate-y-2 hover:shadow-2xl flex flex-col group ${darkMode ? 'bg-[#2A2A2A]' : 'bg-white shadow-lg border border-gray-100'}`}
                  >
                    <div className="h-60 overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                      {/* صورة الغلاف الأصلية */}
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {/* أيقونة تشغيل الفيديو تظهر عند تمرير الماوس */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircle className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {recipe.category}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                        <h3 className={`text-2xl font-bold text-white ${isHeritage ? 'font-serif' : ''}`}>{recipe.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center text-sm font-medium border-t dark:border-gray-700">
                      <span className="flex items-center gap-1.5 text-pink-500"><Timer size={16}/> {recipe.time}</span>
                      <span className="flex items-center gap-1.5 text-orange-500"><Flame size={16}/> {recipe.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* شاشة عرض الطبخة المختارة (فيديو + مقادير + خطوات) */
            <motion.div key="recipe-details" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
              
              <Button onClick={() => setSelectedRecipe(null)} variant="ghost" className="mb-6 gap-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <ArrowRight size={20} /> العودة لقائمة الأطباق
              </Button>

              <div className={`rounded-3xl overflow-hidden ${darkMode ? 'bg-[#2A2A2A]' : 'bg-white shadow-2xl border border-gray-100'}`}>
                
                {/* 🎥 مشغل فيديو اليوتيوب الذي سيأخذ العرض بالكامل من الأعلى */}
                <div className="aspect-video w-full bg-black relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${selectedRecipe.youtubeId}?autoplay=1`} 
                    title={selectedRecipe.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>

                {/* 📝 تفاصيل الطبخة تحت الفيديو */}
                <div className="p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b dark:border-gray-700 pb-6">
                    <h2 className={`text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 ${isHeritage ? 'font-serif' : ''}`}>
                      {selectedRecipe.title}
                    </h2>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full font-medium"><Timer size={20}/> {selectedRecipe.time}</span>
                      <span className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full font-medium"><Flame size={20}/> {selectedRecipe.difficulty}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-10">
                    
                    {/* القسم الأيمن (المنتجات والمقادير) */}
                    <div className="md:col-span-1 space-y-8">
                      {/* المنتجات الكويتية */}
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                          <ShoppingCart className="text-pink-500" /> مقاضي من السوق:
                        </h3>
                        <ul className="space-y-3">
                          {selectedRecipe.localProducts.map((prod, idx) => (
                            <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30">
                              <span className="text-2xl">{prod.icon}</span>
                              <div>
                                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{prod.name}</p>
                                <p className="text-xs text-pink-600 dark:text-pink-400">{prod.brand}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* المقادير */}
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                          <Info className="text-pink-500" /> المقادير والمتطلبات:
                        </h3>
                        <ul className="space-y-3">
                          {selectedRecipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 font-medium">
                              <span className="text-pink-500 mt-1">•</span> {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* القسم الأيسر (خطوات التحضير بدون صور) */}
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold flex items-center gap-2 mb-6 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                        <ListChecks className="text-pink-500 w-8 h-8" /> خطوات التحضير التفصيلية:
                      </h3>
                      
                      <div className="bg-gray-50 dark:bg-[#1f1f1f] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <ul className="space-y-6">
                          {selectedRecipe.steps.map((step, index) => (
                            <li key={index} className="flex gap-4 items-start">
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                                {index + 1}
                              </span>
                              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 pt-1">
                                {step}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-8 text-center">
                        <Button onClick={() => setSelectedRecipe(null)} className="gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full shadow-lg">
                          <CheckCircle2 size={24} /> الطبخة جاهزة! عوافي
                        </Button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SmartKitchenPage;