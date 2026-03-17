import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import {
  ShoppingBag,
  Video,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  Crown,
  Gem,
  Palette,
  BookOpen
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const MarketplaceItem = ({ item, isArabic }) => {
  const { isHeritage, darkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <SaduCard>
        <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-200">
          {item.images?.[0] ? (
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gem className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <h3 className={`font-bold mb-1 ${isHeritage ? 'font-serif' : ''}`}>
          {isArabic ? item.title_ar : item.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {isArabic ? item.description_ar : item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-lg font-bold ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#0D9488]'}`}>
            {item.price} {item.currency}
          </span>
          {item.is_authenticated && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {isArabic ? 'موثق' : 'Verified'}
            </span>
          )}
        </div>
      </SaduCard>
    </motion.div>
  );
};

const CouncilCard = ({ council, isArabic }) => {
  const { isHeritage, darkMode } = useTheme();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'scheduled': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <SaduCard>
        <div className="flex items-start justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(council.status)}`}>
            {council.status === 'live' ? (isArabic ? 'مباشر' : 'Live') : (isArabic ? 'قادم' : 'Upcoming')}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{council.viewers?.length || 0}/{council.max_viewers}</span>
          </div>
        </div>
        <h3 className={`font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
          {isArabic ? council.title_ar : council.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {isArabic ? council.description_ar : council.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{new Date(council.scheduled_time).toLocaleDateString(isArabic ? 'ar-KW' : 'en-US')}</span>
        </div>
        <Button
          className={`w-full mt-4 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
          data-testid={`join-council-${council.council_id}`}
        >
          {council.status === 'live' ? (isArabic ? 'انضم الآن' : 'Join Now') : (isArabic ? 'تذكير' : 'Remind Me')}
        </Button>
      </SaduCard>
    </motion.div>
  );
};

const SeniorsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isArabic = language === 'ar';
  
  const [activeTab, setActiveTab] = useState('marketplace');
  const [items, setItems] = useState([]);
  const [councils, setCouncils] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, councilsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/api/marketplace/items`),
        axios.get(`${API_URL}/api/councils`),
        axios.get(`${API_URL}/api/content/categories`)
      ]);
      setItems(itemsRes.data.items || []);
      setCouncils(councilsRes.data.councils || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    antiques: Gem,
    crafts: Palette,
    clothing: Crown,
    jewelry: Crown,
    art: Palette,
    books: BookOpen
  };

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 ${isRTL ? 'text-right' : ''}`}
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {t('seniors')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isArabic
              ? 'شارك خبراتك، بيع تحفك الثمينة، واستضف مجالس الحكايات الحية.'
              : 'Share your expertise, sell your precious antiques, and host live tale councils.'}
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`w-full grid grid-cols-3 mb-8 ${isHeritage ? 'bg-[#E8DCCA]' : ''}`}>
            <TabsTrigger value="marketplace" className="gap-2" data-testid="tab-marketplace">
              <ShoppingBag className="w-4 h-4" />
              {t('marketplace')}
            </TabsTrigger>
            <TabsTrigger value="councils" className="gap-2" data-testid="tab-councils">
              <Video className="w-4 h-4" />
              {t('tale_councils')}
            </TabsTrigger>
            <TabsTrigger value="academy" className="gap-2" data-testid="tab-academy">
              <GraduationCap className="w-4 h-4" />
              {t('expertise_academy')}
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={isArabic ? 'ابحث عن التحف...' : 'Search antiques...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10"
                  data-testid="marketplace-search"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                {t('filter')}
              </Button>
              {isAuthenticated && (
                <Button
                  className={`gap-2 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
                  data-testid="sell-item-btn"
                >
                  <Plus className="w-4 h-4" />
                  {t('sell_item')}
                </Button>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map(cat => {
                const Icon = categoryIcons[cat.id] || Gem;
                return (
                  <Button key={cat.id} variant="outline" className="gap-2" data-testid={`category-${cat.id}`}>
                    <Icon className="w-4 h-4" />
                    {isArabic ? cat.name_ar : cat.name}
                  </Button>
                );
              })}
            </div>

            {/* Items Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.length > 0 ? (
                items.map(item => (
                  <MarketplaceItem key={item.item_id} item={item} isArabic={isArabic} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Gem className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isArabic ? 'لا توجد منتجات حالياً' : 'No items yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isArabic ? 'كن أول من يبيع تحفه!' : 'Be the first to sell your antiques!'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Councils Tab */}
          <TabsContent value="councils">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? 'مجالس الحكايات القادمة' : 'Upcoming Tale Councils'}
              </h2>
              {isAuthenticated && (
                <Button
                  className={`gap-2 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
                  data-testid="host-council-btn"
                >
                  <Plus className="w-4 h-4" />
                  {t('host_council')}
                </Button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {councils.length > 0 ? (
                councils.map(council => (
                  <CouncilCard key={council.council_id} council={council} isArabic={isArabic} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isArabic ? 'لا توجد مجالس قادمة' : 'No upcoming councils'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isArabic ? 'استضف أول مجلس حكايات!' : 'Host the first tale council!'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Academy Tab */}
          <TabsContent value="academy">
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto mb-4" style={{ color: themeColors.primary }} />
              <h2 className={`text-2xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? 'أكاديمية الخبرات' : 'Expertise Academy'}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {isArabic
                  ? 'قريباً: دورات احترافية في الحرف التقليدية مثل بناء السفن والنسيج والحدادة.'
                  : 'Coming soon: Professional courses in traditional crafts like dhow building, weaving, and blacksmithing.'}
              </p>
              <Button
                className={`${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
                data-testid="academy-notify-btn"
              >
                {isArabic ? 'أعلمني عند الإطلاق' : 'Notify Me When Available'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeniorsPage;
