import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Input } from '../components/ui/input';
import {
  Map,
  Compass,
  Camera,
  Utensils,
  Heart,
  Users,
  BookOpen,
  Search,
  ChevronRight,
  MapPin,
  Clock,
  Star
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const TouristsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';

  const guides = [
    {
      icon: Heart,
      title: isArabic ? 'الصنعة والآداب' : 'Etiquette & Customs',
      description: isArabic
        ? 'تعرف على الآداب الكويتية وكيف تتصرف باحترام في المجتمع.'
        : 'Learn about Kuwaiti etiquette and how to behave respectfully in society.',
      color: '#EC4899'
    },
    {
      icon: Utensils,
      title: isArabic ? 'المأكولات التقليدية' : 'Traditional Cuisine',
      description: isArabic
        ? 'اكتشف أشهى الأطباق الكويتية وأفضل المطاعم التقليدية.'
        : 'Discover the most delicious Kuwaiti dishes and best traditional restaurants.',
      color: '#F59E0B'
    },
    {
      icon: Camera,
      title: isArabic ? 'المعالم السياحية' : 'Tourist Attractions',
      description: isArabic
        ? 'دليلك الشامل للمواقع التاريخية والمعالم البارزة في الكويت.'
        : 'Your comprehensive guide to historical sites and landmarks in Kuwait.',
      color: '#3B82F6'
    },
    {
      icon: Users,
      title: isArabic ? 'الحياة الاجتماعية' : 'Social Life',
      description: isArabic
        ? 'فهم العادات الاجتماعية والدواوين والتجمعات العائلية.'
        : 'Understanding social customs, diwaniyas, and family gatherings.',
      color: '#10B981'
    }
  ];

  const attractions = [
    {
      name: isArabic ? 'أبراج الكويت' : 'Kuwait Towers',
      image: 'https://images.unsplash.com/photo-1571986204936-76077adb51f9?w=400&h=300&fit=crop',
      rating: 4.8,
      duration: isArabic ? '2-3 ساعات' : '2-3 hours'
    },
    {
      name: isArabic ? 'سوق المباركية' : 'Mubarakiya Souq',
      image: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=400&h=300&fit=crop',
      rating: 4.7,
      duration: isArabic ? '3-4 ساعات' : '3-4 hours'
    },
    {
      name: isArabic ? 'بيت ديكسون' : 'Dickson House',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop',
      rating: 4.5,
      duration: isArabic ? '1-2 ساعة' : '1-2 hours'
    }
  ];

  const phrases = [
    { ar: 'السلام عليكم', en: 'Peace be upon you', pronunciation: 'As-salamu alaykum' },
    { ar: 'شلونك؟', en: 'How are you? (Kuwaiti)', pronunciation: 'Shlonak?' },
    { ar: 'الحمد لله', en: 'Thank God', pronunciation: 'Alhamdulillah' },
    { ar: 'إن شاء الله', en: 'God willing', pronunciation: 'Inshallah' },
    { ar: 'يعطيك العافية', en: 'May God give you strength', pronunciation: 'Yaateek al-afya' }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-16`}
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
              className="ps-12 h-14 rounded-xl text-lg"
              data-testid="tourist-search"
            />
          </div>
        </div>

        {/* Guide Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <SaduCard className="h-full cursor-pointer">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: guide.color }}
                >
                  <guide.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
                  {guide.title}
                </h3>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </SaduCard>
            </motion.div>
          ))}
        </div>

        <SaduDivider className="mb-16" />

        {/* Top Attractions */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? 'أهم المعالم' : 'Top Attractions'}
            </h2>
            <Button variant="outline" className="gap-2" data-testid="view-all-attractions">
              {isArabic ? 'عرض الكل' : 'View All'}
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {attractions.map((attraction, index) => (
              <motion.div
                key={attraction.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <SaduCard className="overflow-hidden p-0">
                  <div className="aspect-video relative">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{attraction.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{attraction.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {attraction.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {isArabic ? 'الكويت' : 'Kuwait'}
                      </span>
                    </div>
                  </div>
                </SaduCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Useful Phrases */}
        <div className={`p-8 rounded-2xl ${isHeritage ? 'bg-[#E8DCCA]' : darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="w-8 h-8" style={{ color: themeColors.primary }} />
            <h2 className={`text-2xl font-bold ${isHeritage ? 'font-serif' : ''}`}>
              {isArabic ? 'عبارات مفيدة' : 'Useful Phrases'}
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phrases.map((phrase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}
              >
                <p className="text-xl font-bold mb-1" dir="rtl">{phrase.ar}</p>
                <p className="text-sm text-muted-foreground">{phrase.en}</p>
                <p className="text-xs text-muted-foreground italic mt-1">"{phrase.pronunciation}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristsPage;
