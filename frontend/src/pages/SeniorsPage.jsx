import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
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
  BookOpen,
  Upload,
  X,
  CalendarIcon,
  Loader2,
  Image as ImageIcon,
  Play,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const MarketplaceItem = ({ item, isArabic, onClick }) => {
  const { isHeritage, darkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
      onClick={onClick}
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
          <span className={`text-lg font-bold ${isHeritage ? 'text-[#8D1C1C]' : 'text-[#1D4ED8]'}`}>
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

const CouncilCard = ({ council, isArabic, onJoin, onStart, isHost }) => {
  const { isHeritage, darkMode } = useTheme();
  const { t } = useLanguage();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'ended': return 'bg-gray-500';
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
            {council.status === 'live' ? (isArabic ? 'مباشر' : 'Live') : 
             council.status === 'ended' ? (isArabic ? 'انتهى' : 'Ended') :
             (isArabic ? 'قادم' : 'Upcoming')}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{council.viewers?.length || 0}/{council.max_viewers}</span>
          </div>
        </div>
        <h3 className={`font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
          {isArabic ? council.title_ar : council.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {isArabic ? `المضيف: ${council.host_name || 'مجهول'}` : `Host: ${council.host_name || 'Anonymous'}`}
        </p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {isArabic ? council.description_ar : council.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>{new Date(council.scheduled_time).toLocaleDateString(isArabic ? 'ar-KW' : 'en-US', {
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}</span>
        </div>
        
        {isHost && council.status === 'scheduled' ? (
          <Button
            onClick={() => onStart(council.council_id)}
            className="w-full bg-red-500 hover:bg-red-600"
            data-testid={`start-council-${council.council_id}`}
          >
            <Play className="w-4 h-4 me-2" />
            {isArabic ? 'ابدأ البث' : 'Start Stream'}
          </Button>
        ) : council.status === 'live' ? (
          <Button
            onClick={() => onJoin(council.council_id)}
            className={`w-full ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
            data-testid={`join-council-${council.council_id}`}
          >
            <Video className="w-4 h-4 me-2" />
            {t('join_now')}
          </Button>
        ) : council.status === 'scheduled' ? (
          <Button
            onClick={() => onJoin(council.council_id)}
            variant="outline"
            className="w-full"
            data-testid={`remind-council-${council.council_id}`}
          >
            {t('remind_me')}
          </Button>
        ) : null}
      </SaduCard>
    </motion.div>
  );
};

// Sell Item Modal
const SellItemModal = ({ open, onOpenChange, onSuccess, categories, isArabic }) => {
  const { isHeritage } = useTheme();
  const { t } = useLanguage();
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    category: '',
    price: ''
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (images.length >= 5) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev.slice(0, 4), e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/marketplace/items`,
        {
          ...formData,
          price: parseFloat(formData.price),
          images
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(isArabic ? 'تم إضافة المنتج بنجاح' : 'Item added successfully');
      onSuccess();
      onOpenChange(false);
      setFormData({ title: '', title_ar: '', description: '', description_ar: '', category: '', price: '' });
      setImages([]);
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error(error.response?.data?.detail || (isArabic ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('sell_item')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label>{isArabic ? 'صور المنتج' : 'Product Images'}</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">{t('upload')}</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">{isArabic ? 'العنوان (إنجليزي)' : 'Title (English)'} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                data-testid="item-title-input"
              />
            </div>
            <div>
              <Label htmlFor="title_ar">{isArabic ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                dir="rtl"
                data-testid="item-title-ar-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">{isArabic ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                data-testid="item-description-input"
              />
            </div>
            <div>
              <Label htmlFor="description_ar">{isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                rows={3}
                dir="rtl"
                data-testid="item-description-ar-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('category')} *</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}>
                <SelectTrigger data-testid="item-category-select">
                  <SelectValue placeholder={isArabic ? 'اختر الفئة' : 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {isArabic ? cat.name_ar : cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">{t('price')} (KWD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                data-testid="item-price-input"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`flex-1 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
              data-testid="submit-item-btn"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Host Council Modal
const HostCouncilModal = ({ open, onOpenChange, onSuccess, isArabic }) => {
  const { isHeritage } = useTheme();
  const { t } = useLanguage();
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    duration_minutes: 60,
    max_viewers: 100
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !date) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/councils`,
        {
          ...formData,
          scheduled_time: date.toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(isArabic ? 'تم إنشاء المجلس بنجاح' : 'Council created successfully');
      onSuccess();
      onOpenChange(false);
      setFormData({ title: '', title_ar: '', description: '', description_ar: '', duration_minutes: 60, max_viewers: 100 });
      setDate(null);
    } catch (error) {
      console.error('Error creating council:', error);
      toast.error(error.response?.data?.detail || (isArabic ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('host_council')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="council-title">{isArabic ? 'عنوان المجلس (إنجليزي)' : 'Council Title (English)'} *</Label>
            <Input
              id="council-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              data-testid="council-title-input"
            />
          </div>
          
          <div>
            <Label htmlFor="council-title-ar">{isArabic ? 'عنوان المجلس (عربي)' : 'Council Title (Arabic)'}</Label>
            <Input
              id="council-title-ar"
              value={formData.title_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
              dir="rtl"
              data-testid="council-title-ar-input"
            />
          </div>

          <div>
            <Label>{isArabic ? 'الوصف' : 'Description'}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              data-testid="council-description-input"
            />
          </div>

          <div>
            <Label>{isArabic ? 'موعد البث' : 'Schedule Date & Time'} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start" data-testid="council-date-picker">
                  <CalendarIcon className="w-4 h-4 me-2" />
                  {date ? format(date, 'PPP p') : (isArabic ? 'اختر التاريخ والوقت' : 'Pick date and time')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                />
                <div className="p-3 border-t">
                  <Input
                    type="time"
                    onChange={(e) => {
                      if (date && e.target.value) {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(date);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setDate(newDate);
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{isArabic ? 'المدة (دقيقة)' : 'Duration (minutes)'}</Label>
              <Select
                value={String(formData.duration_minutes)}
                onValueChange={(val) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(val) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="90">90 min</SelectItem>
                  <SelectItem value="120">120 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isArabic ? 'الحد الأقصى للمشاهدين' : 'Max Viewers'}</Label>
              <Input
                type="number"
                min="10"
                max="1000"
                value={formData.max_viewers}
                onChange={(e) => setFormData(prev => ({ ...prev, max_viewers: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`flex-1 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
              data-testid="submit-council-btn"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SeniorsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, user, token } = useAuth();
  const isArabic = language === 'ar';
  
  const [activeTab, setActiveTab] = useState('marketplace');
 const [items, setItems] = useState([
    {
      id: "fake-1",
      title: "ثوب الثريا - نسائي",
      title_ar: "ثوب الثريا - نسائي",
      price: 50,
      description: "ثوب نسائي وهو دراعة وتُصنع عليه قطع ذهبية تُسمى نيرات على شكل نجوم الثريا المتلألئة البراقة. سنة الصنع: 1970",
      description_ar: 'ثوب نسائي وهو "دراعة" وتُصنع عليه قطع ذهبية تُسمى "نيرات" على شكل نجوم الثريا المتلألئة البراقة. سنة الصنع: 1970',
      images: ["/thoubathuraya.png"],
      seller_name: "بوابة المتقاعدين"
    }
  ]);

  // إيقاف دائرة التحميل لعرض الفستان فوراً
  useEffect(() => {
    setLoading(false);
  }, []);
    const handleJoinCouncil = async (councilId) => {
    if (!isAuthenticated) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/councils/${councilId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(isArabic ? 'تم الانضمام للمجلس' : 'Joined council successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || (isArabic ? 'حدث خطأ' : 'An error occurred'));
    }
  };

  const handleStartCouncil = async (councilId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/councils/${councilId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(isArabic ? 'بدأ البث المباشر!' : 'Stream started!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || (isArabic ? 'حدث خطأ' : 'An error occurred'));
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
                  onClick={() => setSellModalOpen(true)}
                  className={`gap-2 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
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
                items
                  .filter(item => 
                    !searchQuery || 
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.title_ar?.includes(searchQuery)
                  )
                  .map(item => (
                    <MarketplaceItem key={item.item_id} item={item} isArabic={isArabic} />
                  ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Gem className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isArabic ? 'لا توجد منتجات حالياً' : 'No items yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isArabic ? 'كن أول من يبيع تحفه!' : 'Be the first to sell your antiques!'}
                  </p>
                  {isAuthenticated && (
                    <Button onClick={() => setSellModalOpen(true)} data-testid="sell-first-item-btn">
                      {t('sell_item')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Councils Tab */}
          <TabsContent value="councils">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
                {isArabic ? 'مجالس الحكايات' : 'Tale Councils'}
              </h2>
              {isAuthenticated && (
                <Button
                  onClick={() => setCouncilModalOpen(true)}
                  className={`gap-2 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
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
                  <CouncilCard
                    key={council.council_id}
                    council={council}
                    isArabic={isArabic}
                    onJoin={handleJoinCouncil}
                    onStart={handleStartCouncil}
                    isHost={user?.user_id === council.host_id}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isArabic ? 'لا توجد مجالس قادمة' : 'No upcoming councils'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isArabic ? 'استضف أول مجلس حكايات!' : 'Host the first tale council!'}
                  </p>
                  {isAuthenticated && (
                    <Button onClick={() => setCouncilModalOpen(true)} data-testid="host-first-council-btn">
                      {t('host_council')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Academy Tab */}
          <TabsContent value="academy">
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto mb-4" style={{ color: themeColors.primary }} />
              <h2 className={`text-2xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`}>
                {t('expertise_academy')}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {isArabic
                  ? 'قريباً: دورات احترافية في الحرف التقليدية مثل بناء السفن والنسيج والحدادة.'
                  : 'Coming soon: Professional courses in traditional crafts like dhow building, weaving, and blacksmithing.'}
              </p>
              <Button
                className={`${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
                data-testid="academy-notify-btn"
              >
                {t('notify_me')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <SellItemModal
        open={sellModalOpen}
        onOpenChange={setSellModalOpen}
        onSuccess={fetchData}
        categories={categories}
        isArabic={isArabic}
      />
      
      <HostCouncilModal
        open={councilModalOpen}
        onOpenChange={setCouncilModalOpen}
        onSuccess={fetchData}
        isArabic={isArabic}
      />
    </div>
  );
};

export default SeniorsPage;
