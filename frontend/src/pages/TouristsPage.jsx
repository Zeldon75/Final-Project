import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Compass,
  Heart,
  Utensils,
  Camera,
  Users,
  Search,
  ChevronRight,
  MapPin,
  Clock,
  Star,
  Volume2,
  X,
  Check,
  Info,
  Shirt,
  Moon,
  Coffee
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CategoryCard = ({ category, isArabic, onClick, isActive }) => {
  const { isHeritage, darkMode } = useTheme();
  const icons = { heart: Heart, utensils: Utensils, camera: Camera, users: Users };
  const Icon = icons[category.icon] || Heart;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-4 ring-offset-2' : ''
      }`}
      style={{ ringColor: isActive ? category.color : 'transparent' }}
    >
      <SaduCard className={`h-full ${isActive ? 'border-2' : ''}`} style={{ borderColor: isActive ? category.color : 'transparent' }}>
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: category.color }}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className={`text-lg font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
          {isArabic ? category.title_ar : category.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {isArabic ? category.description_ar : category.description}
        </p>
      </SaduCard>
    </motion.div>
  );
};

const EtiquetteSection = ({ data, isArabic, isHeritage, themeColors }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const icons = { heart: Heart, users: Users, shirt: Shirt, moon: Moon };

  if (!data?.sections) return null;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {data.sections.map((section) => {
          const Icon = icons[section.icon] || Info;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedItem(section)}
              className="cursor-pointer"
            >
              <SaduCard className="h-full">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={section.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
                      {isArabic ? section.title_ar : section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {isArabic ? section.content_ar : section.content}
                    </p>
                  </div>
                </div>
              </SaduCard>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className={isHeritage ? 'font-serif' : ''}>
                  {isArabic ? selectedItem.title_ar : selectedItem.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img src={selectedItem.image} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-muted-foreground">
                  {isArabic ? selectedItem.content_ar : selectedItem.content}
                </p>
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    {isArabic ? 'نصائح مهمة' : 'Important Tips'}
                  </h4>
                  <ul className="space-y-2">
                    {(isArabic ? selectedItem.tips_ar : selectedItem.tips).map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-xs">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CuisineSection = ({ data, isArabic, isHeritage, themeColors }) => {
  const [selectedDish, setSelectedDish] = useState(null);

  if (!data?.dishes) return null;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.dishes.map((dish, index) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedDish(dish)}
            className="cursor-pointer"
          >
            <SaduCard className="overflow-hidden p-0 h-full">
              <div className="aspect-video relative">
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-lg">
                    {isArabic ? dish.name_ar : dish.name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {isArabic ? dish.description_ar : dish.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{isArabic ? dish.where_to_try_ar : dish.where_to_try}</span>
                </div>
              </div>
            </SaduCard>
          </motion.div>
        ))}
      </div>

      {/* Dish Detail Modal */}
      <Dialog open={!!selectedDish} onOpenChange={() => setSelectedDish(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDish && (
            <>
              <DialogHeader>
                <DialogTitle className={`text-2xl ${isHeritage ? 'font-serif' : ''}`}>
                  {isArabic ? selectedDish.name_ar : selectedDish.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img src={selectedDish.image} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-muted-foreground">
                  {isArabic ? selectedDish.description_ar : selectedDish.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isHeritage ? 'bg-[#E8DCCA]' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Utensils className="w-4 h-4" style={{ color: themeColors.primary }} />
                      {isArabic ? 'المكونات' : 'Ingredients'}
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {(isArabic ? selectedDish.ingredients_ar : selectedDish.ingredients).map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={`p-4 rounded-xl ${isHeritage ? 'bg-[#E8DCCA]' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: themeColors.primary }} />
                      {isArabic ? 'أين تجربه' : 'Where to Try'}
                    </h4>
                    <p className="text-sm">{isArabic ? selectedDish.where_to_try_ar : selectedDish.where_to_try}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LandmarksSection = ({ data, isArabic, isHeritage, themeColors }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  if (!data?.places) return null;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.places.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedPlace(place)}
            className="cursor-pointer"
          >
            <SaduCard className="overflow-hidden p-0 h-full">
              <div className="aspect-video relative">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{place.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className={`font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
                  {isArabic ? place.name_ar : place.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {isArabic ? place.duration_ar : place.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{place.entry_fee}</span>
                  </span>
                </div>
              </div>
            </SaduCard>
          </motion.div>
        ))}
      </div>

      {/* Place Detail Modal */}
      <Dialog open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPlace && (
            <>
              <DialogHeader>
                <DialogTitle className={`text-2xl ${isHeritage ? 'font-serif' : ''}`}>
                  {isArabic ? selectedPlace.name_ar : selectedPlace.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img src={selectedPlace.image} alt="" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-sm">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    {selectedPlace.rating} Rating
                  </div>
                  <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    <Clock className="w-4 h-4" />
                    {isArabic ? selectedPlace.duration_ar : selectedPlace.duration}
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm">
                    {selectedPlace.entry_fee}
                  </div>
                </div>
                
                <p className="text-muted-foreground">
                  {isArabic ? selectedPlace.description_ar : selectedPlace.description}
                </p>
                
                <div className={`p-4 rounded-xl ${isHeritage ? 'bg-[#E8DCCA]' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <h4 className="font-bold mb-2">{isArabic ? 'معلومات الزيارة' : 'Visit Info'}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'العنوان' : 'Address'}</p>
                      <p className="font-medium">{isArabic ? selectedPlace.address_ar : selectedPlace.address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'ساعات العمل' : 'Hours'}</p>
                      <p className="font-medium">{selectedPlace.hours}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-3">{isArabic ? 'أبرز المعالم' : 'Highlights'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(isArabic ? selectedPlace.highlights_ar : selectedPlace.highlights).map((h, i) => (
                      <span key={i} className="px-3 py-1 bg-accent rounded-full text-sm">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SocialLifeSection = ({ data, isArabic, isHeritage, themeColors }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (!data?.topics) return null;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {data.topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedTopic(topic)}
            className="cursor-pointer"
          >
            <SaduCard className="overflow-hidden p-0 h-full">
              <div className="aspect-[2/1] relative">
                <img src={topic.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {isArabic ? topic.title_ar : topic.title}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {isArabic ? topic.description_ar : topic.description}
                </p>
              </div>
            </SaduCard>
          </motion.div>
        ))}
      </div>

      {/* Topic Detail Modal */}
      <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTopic && (
            <>
              <DialogHeader>
                <DialogTitle className={`text-2xl ${isHeritage ? 'font-serif' : ''}`}>
                  {isArabic ? selectedTopic.title_ar : selectedTopic.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img src={selectedTopic.image} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-muted-foreground">
                  {isArabic ? selectedTopic.description_ar : selectedTopic.description}
                </p>
                
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" style={{ color: themeColors.primary }} />
                    {isArabic ? 'حقائق مهمة' : 'Key Facts'}
                  </h4>
                  <ul className="space-y-2">
                    {(isArabic ? selectedTopic.facts_ar : selectedTopic.facts).map((fact, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span 
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs"
                          style={{ backgroundColor: themeColors.primary }}
                        >
                          {i + 1}
                        </span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PhrasesSection = ({ phrases, isArabic, isHeritage, themeColors }) => {
  if (!phrases?.length) return null;

  return (
    <div className={`p-6 rounded-2xl ${isHeritage ? 'bg-[#E8DCCA]' : 'bg-gray-100 dark:bg-gray-800'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: themeColors.primary }}
        >
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
            {isArabic ? 'عبارات مفيدة' : 'Useful Phrases'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isArabic ? 'تعلم بعض العبارات الكويتية الأساسية' : 'Learn some basic Kuwaiti phrases'}
          </p>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {phrases.map((phrase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`p-4 rounded-xl ${isHeritage ? 'bg-[#FDF6E3]' : 'bg-white dark:bg-gray-900'}`}
          >
            <p className="text-xl font-bold mb-1" dir="rtl">{phrase.ar}</p>
            <p className="text-sm font-medium">{phrase.en}</p>
            <p className="text-xs text-muted-foreground italic mt-1">"{phrase.pronunciation}"</p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              {phrase.context}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TouristsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('etiquette');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/content/tourists-guide`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching tourist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'etiquette', icon: 'heart', title: isArabic ? 'الصنعة والآداب' : 'Etiquette & Customs', title_ar: 'الصنعة والآداب', description: isArabic ? 'تعرف على الآداب الكويتية' : 'Learn about Kuwaiti etiquette', description_ar: 'تعرف على الآداب الكويتية', color: '#EC4899' },
    { id: 'cuisine', icon: 'utensils', title: isArabic ? 'المأكولات التقليدية' : 'Traditional Cuisine', title_ar: 'المأكولات التقليدية', description: isArabic ? 'اكتشف الأطباق الكويتية' : 'Discover Kuwaiti dishes', description_ar: 'اكتشف الأطباق الكويتية', color: '#F59E0B' },
    { id: 'landmarks', icon: 'camera', title: isArabic ? 'المعالم السياحية' : 'Tourist Attractions', title_ar: 'المعالم السياحية', description: isArabic ? 'دليل المواقع التاريخية' : 'Guide to historical sites', description_ar: 'دليل المواقع التاريخية', color: '#3B82F6' },
    { id: 'social', icon: 'users', title: isArabic ? 'الحياة الاجتماعية' : 'Social Life', title_ar: 'الحياة الاجتماعية', description: isArabic ? 'فهم العادات الاجتماعية' : 'Understanding social customs', description_ar: 'فهم العادات الاجتماعية', color: '#10B981' }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#0D9488]'}`}>
            <Compass className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {isArabic ? 'دليل السياح والمقيمين' : 'Tourist & Expat Guide'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'دليلك الشامل لاكتشاف الكويت. تعرف على الثقافة والعادات والأماكن المميزة.'
              : 'Your complete guide to discovering Kuwait. Learn about culture, customs, and amazing places.'}
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={isArabic ? 'ابحث عن الأماكن والمعلومات...' : 'Search for places and information...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-12 h-14 rounded-xl text-lg"
              data-testid="tourist-search"
            />
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryCard
                category={category}
                isArabic={isArabic}
                onClick={() => setActiveTab(category.id)}
                isActive={activeTab === category.id}
              />
            </motion.div>
          ))}
        </div>

        <SaduDivider className="mb-12" />

        {/* Content Tabs */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`w-full grid grid-cols-4 mb-8 ${isHeritage ? 'bg-[#E8DCCA]' : ''}`}>
              <TabsTrigger value="etiquette" data-testid="tab-etiquette">
                <Heart className="w-4 h-4 me-2" />
                <span className="hidden sm:inline">{isArabic ? 'الآداب' : 'Etiquette'}</span>
              </TabsTrigger>
              <TabsTrigger value="cuisine" data-testid="tab-cuisine">
                <Utensils className="w-4 h-4 me-2" />
                <span className="hidden sm:inline">{isArabic ? 'المأكولات' : 'Cuisine'}</span>
              </TabsTrigger>
              <TabsTrigger value="landmarks" data-testid="tab-landmarks">
                <Camera className="w-4 h-4 me-2" />
                <span className="hidden sm:inline">{isArabic ? 'المعالم' : 'Landmarks'}</span>
              </TabsTrigger>
              <TabsTrigger value="social" data-testid="tab-social">
                <Users className="w-4 h-4 me-2" />
                <span className="hidden sm:inline">{isArabic ? 'الاجتماعية' : 'Social'}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="etiquette">
              <EtiquetteSection data={data?.etiquette} isArabic={isArabic} isHeritage={isHeritage} themeColors={themeColors} />
            </TabsContent>

            <TabsContent value="cuisine">
              <CuisineSection data={data?.cuisine} isArabic={isArabic} isHeritage={isHeritage} themeColors={themeColors} />
            </TabsContent>

            <TabsContent value="landmarks">
              <LandmarksSection data={data?.landmarks} isArabic={isArabic} isHeritage={isHeritage} themeColors={themeColors} />
            </TabsContent>

            <TabsContent value="social">
              <SocialLifeSection data={data?.social_life} isArabic={isArabic} isHeritage={isHeritage} themeColors={themeColors} />
            </TabsContent>
          </Tabs>
        )}

        {/* Useful Phrases Section */}
        <div className="mt-12">
          <PhrasesSection phrases={data?.phrases} isArabic={isArabic} isHeritage={isHeritage} themeColors={themeColors} />
        </div>
      </div>
    </div>
  );
};

export default TouristsPage;
